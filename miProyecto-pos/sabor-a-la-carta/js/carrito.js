/**
 * GESTIÓN DEL CARRITO
 * Módulo para manejar el carrito de compras
 */

class CarritoManager {
  constructor(storageKey = 'carrito_app') {
    this.items = [];
    this.storageKey = storageKey;
    this.listeners = [];
    this.cargarDelStorage();
  }

  /**
   * Carga el carrito desde localStorage
   */
  cargarDelStorage() {
    const datos = obtenerDelLocalStorage(this.storageKey, []);
    this.items = datos;
  }

  /**
   * Guarda el carrito en localStorage
   */
  guardarEnStorage() {
    guardarEnLocalStorage(this.storageKey, this.items);
    this.notificarCambios();
  }

  /**
   * Agrega un producto al carrito
   */
  agregarProducto(producto, cantidad = 1) {
    if (!producto || cantidad < 1) {
      logWarning('Intento de agregar producto inválido');
      return false;
    }

    // Buscar si el producto ya existe
    const itemExistente = this.items.find(item => item.id === producto.id);

    if (itemExistente) {
      itemExistente.cantidad += cantidad;
      itemExistente.subtotal = itemExistente.cantidad * itemExistente.precio;
    } else {
      this.items.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: cantidad,
        subtotal: producto.precio * cantidad
      });
    }

    this.guardarEnStorage();
    return true;
  }

  /**
   * Elimina un producto del carrito
   */
  eliminarProducto(productoId) {
    const index = this.items.findIndex(item => item.id === productoId);
    if (index !== -1) {
      this.items.splice(index, 1);
      this.guardarEnStorage();
      return true;
    }
    return false;
  }

  /**
   * Actualiza la cantidad de un producto
   */
  actualizarCantidad(productoId, cantidad) {
    const item = this.items.find(item => item.id === productoId);
    if (item) {
      if (cantidad <= 0) {
        this.eliminarProducto(productoId);
      } else {
        item.cantidad = cantidad;
        item.subtotal = item.cantidad * item.precio;
        this.guardarEnStorage();
      }
      return true;
    }
    return false;
  }

  /**
   * Obtiene un item del carrito
   */
  obtenerItem(productoId) {
    return this.items.find(item => item.id === productoId);
  }

  /**
   * Obtiene todos los items
   */
  obtenerItems() {
    return [...this.items];
  }

  /**
   * Calcula el subtotal
   */
  calcularSubtotal() {
    return this.items.reduce((total, item) => total + item.subtotal, 0);
  }

  /**
   * Calcula impuesto (IGV 18%)
   */
  calcularImpuesto() {
    return this.calcularSubtotal() * 0.18;
  }

  /**
   * Calcula el total
   */
  calcularTotal() {
    return this.calcularSubtotal() + this.calcularImpuesto();
  }

  /**
   * Obtiene la cantidad total de items
   */
  obtenerCantidadTotal() {
    return this.items.reduce((total, item) => total + item.cantidad, 0);
  }

  /**
   * Verifica si el carrito está vacío
   */
  estaVacio() {
    return this.items.length === 0;
  }

  /**
   * Vacía el carrito
   */
  vaciar() {
    this.items = [];
    this.guardarEnStorage();
  }

  /**
   * Registra un listener para cambios
   */
  onCambio(callback) {
    this.listeners.push(callback);
  }

  /**
   * Notifica a todos los listeners sobre cambios
   */
  notificarCambios() {
    this.listeners.forEach(callback => {
      try {
        callback(this);
      } catch (error) {
        logError(error, 'Error en listener del carrito');
      }
    });
  }
}

/**
 * Renderiza el carrito
 */
function renderizarCarrito(carrito, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  const items = carrito.obtenerItems();

  // Limpiar contenedor
  const itemsContainer = contenedor.querySelector('.carrito-items');
  if (itemsContainer) {
    itemsContainer.innerHTML = '';

    if (items.length === 0) {
      itemsContainer.innerHTML = '🛒 Carrito vacío';
      itemsContainer.classList.add('vacio');
    } else {
      itemsContainer.classList.remove('vacio');
      items.forEach((item, index) => {
        const itemElement = crearCarritoItem(item, carrito);
        itemElement.style.animationDelay = `${index * 50}ms`;
        itemsContainer.appendChild(itemElement);
      });
    }
  }

  // Actualizar resumen
  actualizarResumenCarrito(carrito, contenedorId);
}

/**
 * Crea un elemento de item en el carrito
 */
function crearCarritoItem(item, carrito) {
  const element = crearElemento('div', { class: 'carrito-item animate-slideInRight' }, `
    <div class="carrito-item-imagen">
      <img src="${item.imagen}" alt="${item.nombre}">
    </div>
    <div class="carrito-item-info">
      <div class="carrito-item-nombre">${item.nombre}</div>
      <div class="carrito-item-precio">${formatearMoneda(item.precio)}</div>
      <div class="carrito-item-acciones">
        <div class="cantidad-control">
          <button type="button" class="btn-cantidad-menos">−</button>
          <input type="number" class="cantidad-input" value="${item.cantidad}" min="1" readonly>
          <button type="button" class="btn-cantidad-mas">+</button>
        </div>
        <button type="button" class="btn-eliminar" title="Eliminar">✕</button>
      </div>
    </div>
  `);

  // Eventos
  const btnMenos = element.querySelector('.btn-cantidad-menos');
  const btnMas = element.querySelector('.btn-cantidad-mas');
  const btnEliminar = element.querySelector('.btn-eliminar');

  btnMenos.addEventListener('click', () => {
    const nuevaCantidad = item.cantidad - 1;
    if (nuevaCantidad > 0) {
      carrito.actualizarCantidad(item.id, nuevaCantidad);
      renderizarCarrito(carrito, 'carrito-panel');
    }
  });

  btnMas.addEventListener('click', () => {
    carrito.actualizarCantidad(item.id, item.cantidad + 1);
    renderizarCarrito(carrito, 'carrito-panel');
  });

  btnEliminar.addEventListener('click', () => {
    carrito.eliminarProducto(item.id);
    renderizarCarrito(carrito, 'carrito-panel');
    mostrarToast('Eliminado', `${item.nombre} removido del carrito`, 'info', 1500);
  });

  return element;
}

/**
 * Actualiza el resumen del carrito
 */
function actualizarResumenCarrito(carrito, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  const subtotal = carrito.calcularSubtotal();
  const impuesto = carrito.calcularImpuesto();
  const total = carrito.calcularTotal();

  const resumen = contenedor.querySelector('.carrito-resumen');
  if (resumen) {
    resumen.innerHTML = `
      <div class="resumen-fila">
        <span class="resumen-label">Subtotal:</span>
        <span class="resumen-valor">${formatearMoneda(subtotal)}</span>
      </div>
      <div class="resumen-fila">
        <span class="resumen-label">IGV (18%):</span>
        <span class="resumen-valor">${formatearMoneda(impuesto)}</span>
      </div>
      <div class="resumen-fila total">
        <span class="resumen-label">Total:</span>
        <span class="resumen-valor">${formatearMoneda(total)}</span>
      </div>
    `;
  }

  // Actualizar estado del botón
  const btnRevisar = contenedor.querySelector('.btn-revisar');
  if (btnRevisar) {
    habilitarBoton(btnRevisar, !carrito.estaVacio());
  }

  // Actualizar badge del carrito en el header
  const badge = document.querySelector('.badge');
  if (badge) {
    const cantidad = carrito.obtenerCantidadTotal();
    if (cantidad > 0) {
      badge.textContent = cantidad;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }
}

/**
 * Crea un resumen de carrito para mostrar en modales o confirmación
 */
function crearResumenCarritoHTML(carrito) {
  const items = carrito.obtenerItems();
  const subtotal = carrito.calcularSubtotal();
  const impuesto = carrito.calcularImpuesto();
  const total = carrito.calcularTotal();

  let html = `
    <div class="carrito-resumen-completo">
      <h3>Resumen del Pedido</h3>
      <div style="max-height: 300px; overflow-y: auto; margin: 1rem 0;">
  `;

  items.forEach(item => {
    html += `
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--color-gris-claro);">
        <div>
          <strong>${item.nombre}</strong><br>
          <span style="color: var(--color-gris); font-size: 0.85rem;">Cantidad: ${item.cantidad}</span>
        </div>
        <div style="text-align: right;">
          <div>${formatearMoneda(item.precio)}</div>
          <strong>${formatearMoneda(item.subtotal)}</strong>
        </div>
      </div>
    `;
  });

  html += `
      </div>
      <div style="background: var(--color-crema); padding: 1rem; border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span>Subtotal:</span>
          <strong>${formatearMoneda(subtotal)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span>IGV (18%):</span>
          <strong>${formatearMoneda(impuesto)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; border-top: 2px solid var(--color-gris-claro); padding-top: 0.75rem; margin-top: 0.75rem;">
          <strong>Total:</strong>
          <strong style="color: var(--color-rojo-oscuro); font-size: 1.2rem;">${formatearMoneda(total)}</strong>
        </div>
      </div>
    </div>
  `;

  return html;
}

// Variable global para el manager del carrito
let carritoManager;
