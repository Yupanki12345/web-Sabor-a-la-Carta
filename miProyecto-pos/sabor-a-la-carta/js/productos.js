/**
 * GESTIÓN DE PRODUCTOS
 * Módulo para cargar, filtrar y gestionar productos
 */

// Datos inline para evitar restricciones CORS
const PRODUCTOS_DATA = {
  "categorias": [
    { "id": 1, "nombre": "Entradas", "icono": "🥘" },
    { "id": 2, "nombre": "Platos a la Carta", "icono": "🍽️" },
    { "id": 3, "nombre": "Broaster", "icono": "🍗" },
    { "id": 4, "nombre": "Parrillas", "icono": "🔥" },
    { "id": 5, "nombre": "Bebidas", "icono": "🥤" },
    { "id": 6, "nombre": "Postres", "icono": "🍰" }
  ],
  "productos": [
    { "id": 1, "nombre": "Tabla de Quesos", "descripcion": "Selección premium de quesos importados", "categoriaId": 1, "precio": 45.00, "imagen": "https://via.placeholder.com/300x200/DAA520/FFFFFF?text=Tabla+de+Quesos", "disponible": true },
    { "id": 2, "nombre": "Tabla de Embutidos", "descripcion": "Jamón ibérico, salami y más", "categoriaId": 1, "precio": 55.00, "imagen": "https://via.placeholder.com/300x200/DAA520/FFFFFF?text=Embutidos", "disponible": true },
    { "id": 3, "nombre": "Camarones a la Mantequilla", "descripcion": "Camarones frescos salteados en salsa de mantequilla", "categoriaId": 1, "precio": 38.00, "imagen": "https://via.placeholder.com/300x200/DAA520/FFFFFF?text=Camarones", "disponible": true },
    { "id": 4, "nombre": "Ceviche Mixto", "descripcion": "Pez espada, camarones y pulpo", "categoriaId": 1, "precio": 42.00, "imagen": "https://via.placeholder.com/300x200/DAA520/FFFFFF?text=Ceviche", "disponible": true },
    { "id": 5, "nombre": "Lomo a la Parrilla", "descripcion": "Corte de lomo de res premium, cocido a la parrilla", "categoriaId": 2, "precio": 68.00, "imagen": "https://via.placeholder.com/300x200/8B3A3A/FFFFFF?text=Lomo", "disponible": true },
    { "id": 6, "nombre": "Pez Espada a la Mantequilla", "descripcion": "Filete fresco de pez espada con salsa delicada", "categoriaId": 2, "precio": 58.00, "imagen": "https://via.placeholder.com/300x200/8B3A3A/FFFFFF?text=Pez+Espada", "disponible": true },
    { "id": 7, "nombre": "Pechuga Rellena", "descripcion": "Pechuga de pollo rellena de jamón y queso", "categoriaId": 2, "precio": 48.00, "imagen": "https://via.placeholder.com/300x200/8B3A3A/FFFFFF?text=Pechuga", "disponible": true },
    { "id": 8, "nombre": "Arroz Chaufa", "descripcion": "Arroz salteado con pollo, camarones y vegetales", "categoriaId": 2, "precio": 38.00, "imagen": "https://via.placeholder.com/300x200/8B3A3A/FFFFFF?text=Arroz+Chaufa", "disponible": true },
    { "id": 9, "nombre": "Broaster Completo", "descripcion": "Pollo broaster con papas y ensalada", "categoriaId": 3, "precio": 32.00, "imagen": "https://via.placeholder.com/300x200/D4AF37/FFFFFF?text=Broaster", "disponible": true },
    { "id": 10, "nombre": "Broaster en Promo", "descripcion": "1 libra de pollo broaster + papas", "categoriaId": 3, "precio": 28.00, "imagen": "https://via.placeholder.com/300x200/D4AF37/FFFFFF?text=Broaster+Promo", "disponible": true },
    { "id": 11, "nombre": "Tabla de Carnes", "descripcion": "Costillas, lomo, pollo y champiñones a la parrilla", "categoriaId": 4, "precio": 85.00, "imagen": "https://via.placeholder.com/300x200/CD5C5C/FFFFFF?text=Parrilla", "disponible": true },
    { "id": 12, "nombre": "Parrillada Mixta", "descripcion": "Para dos personas: carnes variadas y vegetales", "categoriaId": 4, "precio": 95.00, "imagen": "https://via.placeholder.com/300x200/CD5C5C/FFFFFF?text=Parrillada", "disponible": true },
    { "id": 13, "nombre": "Costillas a la BBQ", "descripcion": "Costillas tiernas con salsa BBQ especial", "categoriaId": 4, "precio": 65.00, "imagen": "https://via.placeholder.com/300x200/CD5C5C/FFFFFF?text=Costillas", "disponible": true },
    { "id": 14, "nombre": "Agua Mineral", "descripcion": "Botella de 500ml", "categoriaId": 5, "precio": 3.00, "imagen": "https://via.placeholder.com/300x200/87CEEB/FFFFFF?text=Agua", "disponible": true },
    { "id": 15, "nombre": "Gaseosa", "descripcion": "Coca-Cola, Fanta o Sprite - 355ml", "categoriaId": 5, "precio": 5.00, "imagen": "https://via.placeholder.com/300x200/87CEEB/FFFFFF?text=Gaseosa", "disponible": true },
    { "id": 16, "nombre": "Jugo Natural", "descripcion": "Naranja, papaya o piña - 350ml", "categoriaId": 5, "precio": 6.00, "imagen": "https://via.placeholder.com/300x200/87CEEB/FFFFFF?text=Jugo", "disponible": true },
    { "id": 17, "nombre": "Vino Tinto", "descripcion": "Vino tinto premium - copa", "categoriaId": 5, "precio": 15.00, "imagen": "https://via.placeholder.com/300x200/87CEEB/FFFFFF?text=Vino", "disponible": true },
    { "id": 18, "nombre": "Tiramisú", "descripcion": "Clásico italiano con café y mascarpone", "categoriaId": 6, "precio": 18.00, "imagen": "https://via.placeholder.com/300x200/D2B48C/FFFFFF?text=Tiramisu", "disponible": true },
    { "id": 19, "nombre": "Brownie de Chocolate", "descripcion": "Brownie casero con helado de vainilla", "categoriaId": 6, "precio": 14.00, "imagen": "https://via.placeholder.com/300x200/D2B48C/FFFFFF?text=Brownie", "disponible": true },
    { "id": 20, "nombre": "Cheesecake", "descripcion": "Cheesecake neoyorquino con frutos rojos", "categoriaId": 6, "precio": 16.00, "imagen": "https://via.placeholder.com/300x200/D2B48C/FFFFFF?text=Cheesecake", "disponible": true }
  ]
};

class ProductosManager {
  constructor() {
    this.productos = [];
    this.categorias = [];
    this.productosFiltrados = [];
    this.categoriaActiva = null;
  }

  /**
   * Carga todos los datos necesarios
   */
  async inicializar() {
    try {
      // Usar datos inline
      this.productos = PRODUCTOS_DATA.productos || [];
      this.categorias = PRODUCTOS_DATA.categorias || [];

      if (this.productos.length === 0 || this.categorias.length === 0) {
        mostrarToast('Advertencia', 'No se pudieron cargar todos los datos', 'warning');
      }

      return true;
    } catch (error) {
      logError(error, 'Error inicializando ProductosManager');
      mostrarToast('Error', 'Error al cargar productos', 'error');
      return false;
    }
  }

  /**
   * Obtiene un producto por ID
   */
  obtenerProducto(id) {
    return this.productos.find(p => p.id === id);
  }

  /**
   * Obtiene todos los productos de una categoría
   */
  obtenerPorCategoria(categoriaId) {
    return this.productos.filter(p => p.categoriaId === categoriaId);
  }

  /**
   * Filtra productos por categoría
   */
  filtrarPorCategoria(categoriaId) {
    this.categoriaActiva = categoriaId;
    this.productosFiltrados = this.obtenerPorCategoria(categoriaId);
    return this.productosFiltrados;
  }

  /**
   * Busca productos por nombre o descripción
   */
  buscar(termino) {
    const busqueda = termino.toLowerCase();
    return this.productos.filter(p =>
      p.nombre.toLowerCase().includes(busqueda) ||
      p.descripcion.toLowerCase().includes(busqueda)
    );
  }

  /**
   * Obtiene una categoría por ID
   */
  obtenerCategoria(id) {
    return this.categorias.find(c => c.id === id);
  }

  /**
   * Obtiene el nombre de una categoría
   */
  obtenerNombreCategoria(categoriaId) {
    const categoria = this.obtenerCategoria(categoriaId);
    return categoria ? categoria.nombre : 'Desconocida';
  }

  /**
   * Obtiene todos los productos disponibles
   */
  obtenerDisponibles() {
    return this.productos.filter(p => p.disponible);
  }

  /**
   * Obtiene los primeros N productos
   */
  obtenerPrimeros(cantidad = 5) {
    return this.productos.slice(0, cantidad);
  }

  /**
   * Cuenta productos por categoría
   */
  contarPorCategoria(categoriaId) {
    return this.productos.filter(p => p.categoriaId === categoriaId).length;
  }

  /**
   * Obtiene el precio más bajo
   */
  obtenerPrecioMinimo() {
    return Math.min(...this.productos.map(p => p.precio));
  }

  /**
   * Obtiene el precio más alto
   */
  obtenerPrecioMaximo() {
    return Math.max(...this.productos.map(p => p.precio));
  }
}

/**
 * Renderiza el menú de categorías
 */
function renderizarCategorias(productos, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  contenedor.innerHTML = '';

  productos.categorias.forEach(categoria => {
    const elemento = crearElemento('div', {
      class: 'categoria-item',
      'data-categoria-id': categoria.id
    }, `
      <span class="icono">${categoria.icono}</span>
      <span>${categoria.nombre}</span>
    `);

    // Primer categoría por defecto
    if (categoria.id === 1) {
      elemento.classList.add('active');
    }

    elemento.addEventListener('click', () => {
      document.querySelectorAll('.categoria-item').forEach(el => {
        el.classList.remove('active');
      });
      elemento.classList.add('active');
      
      // Dispara evento personalizado
      const evento = new CustomEvent('categoriaSeleccionada', {
        detail: { categoriaId: categoria.id }
      });
      document.dispatchEvent(evento);
    });

    contenedor.appendChild(elemento);
  });
}

/**
 * Renderiza tarjetas de productos
 */
function renderizarProductos(productosArray, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  // Limpiar y agregar animación
  contenedor.innerHTML = '';
  contenedor.classList.add('animate-fadeIn');

  if (productosArray.length === 0) {
    contenedor.innerHTML = '<p class="text-center text-gris">No hay productos en esta categoría</p>';
    return;
  }

  productosArray.forEach((producto, index) => {
    const card = crearProductoCard(producto);
    card.style.animationDelay = `${index * 50}ms`;
    contenedor.appendChild(card);
  });
}

/**
 * Crea una tarjeta de producto
 */
function crearProductoCard(producto) {
  const card = crearElemento('div', {
    class: `producto-card ${!producto.disponible ? 'no-disponible' : ''}`,
    'data-producto-id': producto.id
  });

  card.innerHTML = `
    <div class="producto-imagen">
      <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
      ${producto.disponible ? `<span class="producto-badge">Disponible</span>` : '<span class="producto-badge">Agotado</span>'}
    </div>
    <div class="producto-info">
      <h4 class="producto-titulo">${producto.nombre}</h4>
      <p class="producto-descripcion">${producto.descripcion}</p>
      <div class="producto-precio">${formatearMoneda(producto.precio)}</div>
      <div class="producto-acciones">
        <button class="btn btn-agregar btn-pequeño" ${!producto.disponible ? 'disabled' : ''}>
          Agregar
        </button>
        <button class="btn btn-detalles btn-pequeño">
          Detalles
        </button>
      </div>
    </div>
  `;

  // Eventos
  const btnAgregar = card.querySelector('.btn-agregar');
  const btnDetalles = card.querySelector('.btn-detalles');

  btnAgregar.addEventListener('click', () => {
    if (producto.disponible) {
      const evento = new CustomEvent('productoAgregado', {
        detail: { producto, cantidad: 1 }
      });
      document.dispatchEvent(evento);
      mostrarToast('Éxito', `${producto.nombre} agregado al carrito`, 'success', 2000);
    }
  });

  btnDetalles.addEventListener('click', () => {
    const evento = new CustomEvent('verDetallesProducto', {
      detail: { producto }
    });
    document.dispatchEvent(evento);
  });

  return card;
}

/**
 * Crea un modal de detalles de producto
 */
function crearModalDetalleProducto(producto, onAgregar) {
  const contenedor = crearElemento('div', { class: 'detalle-modal' });

  const html = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
      <div class="detalle-imagen">
        <img src="${producto.imagen}" alt="${producto.nombre}">
      </div>
      <div class="detalle-info">
        <h2 style="color: var(--color-rojo-oscuro); margin-top: 0;">${producto.nombre}</h2>
        <p class="detalle-descripcion">${producto.descripcion}</p>
        <div class="detalle-precio">${formatearMoneda(producto.precio)}</div>
        
        <div class="form-group">
          <label>Cantidad</label>
          <div class="detalle-cantidad">
            <button type="button" id="btnMenos">−</button>
            <input type="number" id="cantidad" value="1" min="1" readonly>
            <button type="button" id="btnMas">+</button>
          </div>
        </div>

        <div style="margin-top: 1.5rem;">
          <button type="button" class="btn btn-mostaza btn-grande" id="btnAgregarAlCarrito" style="width: 100%;">
            Agregar al Carrito
          </button>
        </div>

        <div style="margin-top: 1rem; padding: 1rem; background: var(--color-crema); border-radius: 8px;">
          <p style="margin: 0; font-size: 0.9rem; color: var(--color-gris);">
            <strong>Disponibilidad:</strong> ${producto.disponible ? 'En stock' : 'Agotado'}
          </p>
          <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: var(--color-gris);">
            <strong>Categoría:</strong> ${categoriaManager.obtenerNombreCategoria(producto.categoriaId)}
          </p>
        </div>
      </div>
    </div>
  `;

  contenedor.innerHTML = html;

  // Eventos de cantidad
  const cantidadInput = contenedor.querySelector('#cantidad');
  const btnMenos = contenedor.querySelector('#btnMenos');
  const btnMas = contenedor.querySelector('#btnMas');
  const btnAgregar = contenedor.querySelector('#btnAgregarAlCarrito');

  btnMenos.addEventListener('click', () => {
    let cantidad = parseInt(cantidadInput.value);
    if (cantidad > 1) {
      cantidadInput.value = cantidad - 1;
    }
  });

  btnMas.addEventListener('click', () => {
    let cantidad = parseInt(cantidadInput.value);
    cantidadInput.value = cantidad + 1;
  });

  btnAgregar.addEventListener('click', () => {
    const cantidad = parseInt(cantidadInput.value);
    if (onAgregar) {
      onAgregar(producto, cantidad);
    }
    cerrarModal();
    mostrarToast('Éxito', `${cantidad} x ${producto.nombre} agregado al carrito`, 'success', 2000);
  });

  return contenedor;
}

// Variable global para el manager de productos
let categoriaManager;
