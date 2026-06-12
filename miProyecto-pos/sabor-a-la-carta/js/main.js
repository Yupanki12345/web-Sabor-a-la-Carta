/**
 * APLICACIÓN PRINCIPAL - SISTEMA POS MESERO
 * "Sabor a la Carta"
 */

// ========================================
// CONFIGURACIÓN GLOBAL
// ========================================

const APP_VERSION = '1.0.0';
const APP_NAME = 'Sabor a la Carta - Sistema POS';

let categoriaManager;
let carritoManager;
let pedidosManager;
let mesasManager;

// ========================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ========================================

async function inicializarApp() {
  try {
    mostrarToast('Cargando', 'Inicializando la aplicación...', 'info');

    // Crear managers
    categoriaManager = new ProductosManager();
    carritoManager = new CarritoManager();
    pedidosManager = new PedidosManager();
    mesasManager = new MesasManager();

    // Inicializar datos
    await categoriaManager.inicializar();
    await mesasManager.inicializar();

    // Renderizar interfaz
    renderizarHeader();
    renderizarHero();
    renderizarMain();
    renderizarFooter();

    // Configurar event listeners
    configurarEventListeners();

    // Renderizar categorías y productos
    renderizarCategorias(categoriaManager, 'menu-lateral');
    categoriaManager.filtrarPorCategoria(1);
    renderizarProductos(categoriaManager.productosFiltrados, 'productos-grid');
    renderizarCarrito(carritoManager, 'carrito-panel');

    // Actualizar carrito al cambiar
    carritoManager.onCambio(() => {
      renderizarCarrito(carritoManager, 'carrito-panel');
    });

    mostrarToast('Éxito', 'Aplicación cargada correctamente', 'success', 2000);

  } catch (error) {
    logError(error, 'Error en inicializarApp');
    mostrarToast('Error', 'Error al inicializar la aplicación', 'error');
  }
}

// ========================================
// RENDERIZACIÓN DE COMPONENTES
// ========================================

/**
 * Renderiza el header
 */
function renderizarHeader() {
  const header = document.querySelector('header') || crearElemento('header');
  
  header.innerHTML = `
    <div class="header-container">
      <div class="logo">
        🍽️ <span>Sabor</span> a la Carta
      </div>
      
      <nav id="nav-principal">
        <a href="#inicio" class="nav-link active">Inicio</a>
        <a href="#menu" class="nav-link">Menú</a>
        <a href="#reservaciones" class="nav-link">Reservaciones</a>
        <a href="#carta" class="nav-link">Platos a la Carta</a>
        <a href="#promociones" class="nav-link">Promociones</a>
        <a href="#ubicacion" class="nav-link">Ubicación</a>
        <a href="#galeria" class="nav-link">Galería</a>
      </nav>

      <div class="header-actions">
        <button class="icon-btn" title="Favoritos">❤️</button>
        <div class="icon-btn-container">
          <button class="icon-btn" title="Carrito" id="btn-carrito-header">🛒</button>
          <div class="badge" style="display: none;">0</div>
        </div>
        <button class="icon-btn" title="Usuario">👤</button>
        <button class="mobile-menu-btn" id="menu-btn">☰</button>
      </div>
    </div>
  `;

  if (!document.querySelector('header')) {
    document.body.insertBefore(header, document.body.firstChild);
  }
}

/**
 * Renderiza el hero section
 */
function renderizarHero() {
  const hero = crearElemento('div', { class: 'hero' });
  
  hero.innerHTML = `
    <div class="hero-content">
      <h1>Bienvenido a Sabor a la Carta</h1>
      <p>Disfruta de la mejor experiencia gastronómica con nuestros platos seleccionados</p>
      <div class="hero-cta">
        <button class="btn btn-rojo btn-grande" id="btn-ver-menu">Ver Menú Completo</button>
        <button class="btn btn-blanco btn-grande" id="btn-reservar">Hacer Reservación</button>
      </div>
    </div>
  `;

  const main = document.querySelector('main') || crearElemento('main');
  main.insertBefore(hero, main.firstChild);

  if (!document.querySelector('main')) {
    document.body.appendChild(main);
  }

  // Agregar eventos
  document.getElementById('btn-ver-menu').addEventListener('click', () => {
    document.querySelector('.main-container').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('btn-reservar').addEventListener('click', () => {
    mostrarToast('Reservación', 'Contacta con nosotros para reservar', 'info');
  });
}

/**
 * Renderiza la sección principal
 */
function renderizarMain() {
  const main = document.querySelector('main') || crearElemento('main');
  
  const mainContainer = crearElemento('div', { class: 'main-container', id: 'main-content' });
  
  mainContainer.innerHTML = `
    <aside class="menu-lateral" id="menu-lateral"></aside>
    
    <section class="productos-container" id="productos-section">
      <div class="productos-header">
        <h2 id="titulo-categoria">
          <span class="icono-categoria">🥘</span>
          <span>Menú</span>
        </h2>
      </div>
      <div class="productos-grid" id="productos-grid"></div>
    </section>
    
    <aside class="carrito-panel" id="carrito-panel">
      <div class="carrito-header">
        <h3><span class="icono-carrito">🛒</span> Mi Pedido</h3>
      </div>
      <div class="carrito-items"></div>
      <div class="carrito-resumen"></div>
      <div class="carrito-botones">
        <button class="btn btn-revisar" id="btn-revisar-pedido">Revisar Pedido</button>
        <button class="btn btn-limpiar" id="btn-limpiar-carrito">Vaciar Carrito</button>
      </div>
    </aside>
  `;

  main.appendChild(mainContainer);
}

/**
 * Renderiza el footer
 */
function renderizarFooter() {
  const footer = crearElemento('footer');
  
  footer.innerHTML = `
    <div class="footer-container">
      <div class="footer-section">
        <h3>Sabor a la Carta</h3>
        <p>Restaurante especializado en gastronomía peruana con los mejores ingredientes y preparación artesanal.</p>
        <div class="footer-social">
          <a href="#" title="Facebook">f</a>
          <a href="#" title="Instagram">📷</a>
          <a href="#" title="WhatsApp">💬</a>
        </div>
      </div>

      <div class="footer-section">
        <h3>Horarios</h3>
        <ul>
          <li>Lunes - Viernes: 11:00 AM - 10:00 PM</li>
          <li>Sábado: 12:00 PM - 11:00 PM</li>
          <li>Domingo: 12:00 PM - 10:00 PM</li>
          <li>Feriados: Consultar disponibilidad</li>
        </ul>
      </div>

      <div class="footer-section">
        <h3>Contacto</h3>
        <ul>
          <li><a href="tel:+51987654321">📞 +51 987 654 321</a></li>
          <li><a href="mailto:info@saboralacarta.com">📧 info@saboralacarta.com</a></li>
          <li>📍 Av. Gourmet 123, Lima, Perú</li>
        </ul>
      </div>

      <div class="footer-section">
        <h3>Seguros de Pago</h3>
        <ul>
          <li>💳 Tarjeta de Crédito/Débito</li>
          <li>💵 Efectivo</li>
          <li>📱 Yape / Plin</li>
          <li>🏦 Transferencia Bancaria</li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2024 Sabor a la Carta. Todos los derechos reservados. | v${APP_VERSION}</p>
    </div>
  `;

  document.body.appendChild(footer);
}

// ========================================
// CONFIGURACIÓN DE EVENT LISTENERS
// ========================================

function configurarEventListeners() {
  // Categoría seleccionada
  document.addEventListener('categoriaSeleccionada', (e) => {
    const categoriaId = e.detail.categoriaId;
    const categoria = categoriaManager.obtenerCategoria(categoriaId);
    
    categoriaManager.filtrarPorCategoria(categoriaId);
    renderizarProductos(categoriaManager.productosFiltrados, 'productos-grid');

    // Actualizar título
    const titulo = document.querySelector('#titulo-categoria');
    if (titulo) {
      titulo.innerHTML = `
        <span class="icono-categoria">${categoria.icono}</span>
        <span>${categoria.nombre}</span>
      `;
    }
  });

  // Producto agregado
  document.addEventListener('productoAgregado', (e) => {
    const { producto, cantidad } = e.detail;
    carritoManager.agregarProducto(producto, cantidad);
  });

  // Ver detalles del producto
  document.addEventListener('verDetallesProducto', (e) => {
    const { producto } = e.detail;
    const modalContent = crearModalDetalleProducto(producto, (prod, cantidad) => {
      carritoManager.agregarProducto(prod, cantidad);
    });
    abrirModal(modalContent, `${producto.nombre}`);
  });

  // Botón revisar pedido
  document.getElementById('btn-revisar-pedido')?.addEventListener('click', () => {
    if (carritoManager.estaVacio()) {
      mostrarToast('Carrito Vacío', 'Agrega productos antes de hacer pedido', 'warning');
      return;
    }
    mostrarModalRevisionPedido();
  });

  // Botón limpiar carrito
  document.getElementById('btn-limpiar-carrito')?.addEventListener('click', () => {
    if (!carritoManager.estaVacio()) {
      if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
        carritoManager.vaciar();
        renderizarCarrito(carritoManager, 'carrito-panel');
        mostrarToast('Vaciado', 'El carrito ha sido vaciado', 'info');
      }
    }
  });

  // Menú móvil
  const menuBtn = document.getElementById('menu-btn');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const nav = document.getElementById('nav-principal');
      nav.classList.toggle('mobile-open');
    });
  }

  // Botón carrito header
  document.getElementById('btn-carrito-header')?.addEventListener('click', () => {
    const carritoPanel = document.getElementById('carrito-panel');
    carritoPanel?.classList.toggle('mobile-open');
  });
}

// ========================================
// MODAL DE REVISIÓN DE PEDIDO
// ========================================

function mostrarModalRevisionPedido() {
  const contenedor = crearElemento('div');

  // Paso 1: Seleccionar Mesa
  if (!mesasManager.obtenerSeleccionada()) {
    const { elemento: modalMesa, obtenerMesa } = crearModalSeleccionarMesa(mesasManager);
    
    const btnConfirmarMesa = crearElemento('button', {
      class: 'btn btn-mostaza btn-grande',
      style: 'width: 100%; margin-top: 1.5rem;'
    }, 'Confirmar Mesa');

    btnConfirmarMesa.addEventListener('click', () => {
      const mesa = obtenerMesa();
      if (!mesa) {
        mostrarToast('Error', 'Por favor selecciona una mesa', 'error');
        return;
      }

      mesasManager.seleccionarMesa(mesa.numero);
      cerrarModal();
      mostrarModalRevisionPedido();
    });

    modalMesa.appendChild(btnConfirmarMesa);
    abrirModal(modalMesa, 'Seleccionar Mesa');
    return;
  }

  // Paso 2: Confirmar Pedido
  const mesa = mesasManager.obtenerSeleccionada();
  const subtotal = carritoManager.calcularSubtotal();
  const impuesto = carritoManager.calcularImpuesto();
  const total = carritoManager.calcularTotal();

  contenedor.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <h3 style="margin-top: 0; color: var(--color-rojo-oscuro);">Mesa: ${mesa.numero}</h3>
      <p style="color: var(--color-gris);">Asientos: ${mesa.asientos}</p>
    </div>

    <div id="resumen-pedido">
      ${crearResumenCarritoHTML(carritoManager)}
    </div>

    <div class="form-group">
      <label>Notas especiales</label>
      <textarea id="notas-pedido" placeholder="Agregar notas al pedido (alergias, preferencias, etc.)"></textarea>
    </div>
  `;

  const btnConfirmar = crearElemento('button', {
    class: 'btn btn-mostaza btn-grande',
    style: 'width: 100%; margin-top: 1rem;'
  }, 'Confirmar Pedido');

  const btnCambiarMesa = crearElemento('button', {
    class: 'btn btn-blanco btn-grande',
    style: 'width: 100%; margin-top: 0.5rem;'
  }, 'Cambiar Mesa');

  btnConfirmar.addEventListener('click', () => {
    const notas = document.getElementById('notas-pedido').value;
    const items = carritoManager.obtenerItems();
    
    // Crear pedido
    const pedido = pedidosManager.crearPedido(
      mesa.numero,
      items,
      total,
      subtotal,
      impuesto
    );

    if (notas) {
      pedidosManager.agregarNotas(pedido.id, notas);
    }

    mesasManager.asignarPedido(mesa.numero, pedido.id);

    // Limpiar
    carritoManager.vaciar();
    renderizarCarrito(carritoManager, 'carrito-panel');
    mesasManager.mesaSeleccionada = null;

    cerrarModal();
    mostrarToast('Éxito', `Pedido confirmado para mesa ${mesa.numero}`, 'success');
    mostrarModalPagoPedido(pedido);
  });

  btnCambiarMesa.addEventListener('click', () => {
    mesasManager.mesaSeleccionada = null;
    cerrarModal();
    mostrarModalRevisionPedido();
  });

  const footer = crearElemento('div', { style: 'margin-top: 1.5rem;' });
  footer.appendChild(btnConfirmar);
  footer.appendChild(btnCambiarMesa);
  contenedor.appendChild(footer);

  abrirModal(contenedor, 'Revisión de Pedido');
}

// ========================================
// MODAL DE PAGO
// ========================================

function mostrarModalPagoPedido(pedido) {
  const { elemento: modalPago, obtenerDatos } = crearModalPago(pedido, () => {});

  const btnConfirmarPago = crearElemento('button', {
    class: 'btn btn-mostaza btn-grande',
    style: 'width: 100%; margin-top: 1.5rem;'
  }, 'Procesar Pago');

  btnConfirmarPago.addEventListener('click', () => {
    const datos = obtenerDatos();
    if (!datos.metodo) {
      mostrarToast('Error', 'Por favor selecciona un método de pago', 'error');
      return;
    }

    // Actualizar estado del pedido
    pedidosManager.actualizarEstado(pedido.id, 'en_preparacion');

    cerrarModal();
    mostrarToast('Éxito', `Pago procesado por ${datos.metodo}`, 'success');
    mostrarToast('Información', `Pedido #${pedido.id.slice(-6)} enviado a cocina`, 'info');

    // Liberar mesa después de 5 segundos
    setTimeout(() => {
      mesasManager.liberarMesa(pedido.numeroMesa);
    }, 5000);
  });

  modalPago.appendChild(btnConfirmarPago);
  abrirModal(modalPago, 'Método de Pago');
}

// ========================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ========================================

// Ejecutar cuando el DOM esté listo
function ejecutarAplicacion() {
  inicializarApp();
}

// Intentar múltiples formas de ejecutar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ejecutarAplicacion);
} else {
  // El DOM ya está cargado
  ejecutarAplicacion();
}

// Manejar cambios en la pestaña
window.addEventListener('beforeunload', () => {
  // Guardar estado antes de cerrar
  guardarEnLocalStorage('app_state', {
    timestamp: new Date().toISOString(),
    mesaSeleccionada: mesasManager?.obtenerSeleccionada()
  });
});
