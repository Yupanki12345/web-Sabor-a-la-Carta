/**
 * PANEL DE COCINA
 * Vista para que los cocineros vean y gestionen los pedidos
 */

let pedidosManagerCocina;
let refreshInterval;

/**
 * Inicializa el panel de cocina
 */
async function inicializarPanelCocina() {
  try {
    mostrarToast('Cargando', 'Inicializando panel de cocina...', 'info');

    // Crear manager de pedidos
    pedidosManagerCocina = new PedidosManager();

    // Renderizar interfaz
    renderizarHeaderCocina();
    renderizarMainCocina();

    // Refrescar cada 3 segundos
    actualizarPedidosCocina();
    refreshInterval = setInterval(actualizarPedidosCocina, 3000);

    mostrarToast('Éxito', 'Panel de cocina listo', 'success', 2000);

  } catch (error) {
    logError(error, 'Error en inicializarPanelCocina');
    mostrarToast('Error', 'Error al inicializar el panel', 'error');
  }
}

/**
 * Renderiza el header del panel de cocina
 */
function renderizarHeaderCocina() {
  const header = document.querySelector('header') || crearElemento('header');
  
  header.innerHTML = `
    <div class="header-container">
      <div class="logo">
        🍳 Panel de <span>Cocina</span>
      </div>
      
      <div style="flex: 1; text-align: center;">
        <div style="font-size: 1.2rem; font-weight: 600; color: var(--color-negro);">
          Sabor a la Carta - Cocina
        </div>
      </div>

      <div class="header-actions">
        <div id="estadisticas-header" style="display: flex; gap: 1.5rem; align-items: center;"></div>
        <button class="icon-btn" id="btn-refrescar" title="Refrescar">🔄</button>
        <button class="icon-btn" id="btn-volver" title="Volver">←</button>
      </div>
    </div>
  `;

  if (!document.querySelector('header')) {
    document.body.insertBefore(header, document.body.firstChild);
  }

  // Eventos
  document.getElementById('btn-refrescar')?.addEventListener('click', () => {
    actualizarPedidosCocina();
    mostrarToast('Actualizado', 'Pedidos refrescados', 'info', 1000);
  });

  document.getElementById('btn-volver')?.addEventListener('click', () => {
    if (confirm('¿Deseas volver a la vista de mesero?')) {
      window.location.href = 'index.html';
    }
  });
}

/**
 * Renderiza la sección principal
 */
function renderizarMainCocina() {
  const main = document.querySelector('main') || crearElemento('main');
  
  main.innerHTML = `
    <div class="cocina-container">
      <h1>📋 Pedidos Pendientes</h1>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;" id="filtros-estado">
        <button class="btn btn-blanco" data-estado="pendiente" style="text-align: left; padding: 1rem;">
          <div style="font-size: 1.5rem;">⏳</div>
          <div style="font-weight: 600;">Pendientes</div>
          <div class="contador-estado" data-estado="pendiente">0</div>
        </button>
        <button class="btn btn-blanco" data-estado="en_preparacion" style="text-align: left; padding: 1rem;">
          <div style="font-size: 1.5rem;">🍳</div>
          <div style="font-weight: 600;">En Preparación</div>
          <div class="contador-estado" data-estado="en_preparacion">0</div>
        </button>
        <button class="btn btn-blanco" data-estado="listo" style="text-align: left; padding: 1rem;">
          <div style="font-size: 1.5rem;">✓</div>
          <div style="font-weight: 600;">Listo para Servir</div>
          <div class="contador-estado" data-estado="listo">0</div>
        </button>
      </div>

      <div id="pedidos-cocina" class="pedidos-cocina"></div>

      <div id="sin-pedidos" style="text-align: center; padding: 3rem; color: var(--color-gris);">
        <div style="font-size: 3rem; margin-bottom: 1rem;">😌</div>
        <p>No hay pedidos en este momento</p>
      </div>
    </div>
  `;

  if (!document.querySelector('main')) {
    document.body.appendChild(main);
  }

  // Eventos de filtros
  document.querySelectorAll('#filtros-estado .btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const estado = btn.getAttribute('data-estado');
      const container = document.getElementById('pedidos-cocina');
      const pedidos = pedidosManagerCocina.obtenerPorEstado(estado);
      
      container.innerHTML = '';
      if (pedidos.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: var(--color-gris); padding: 2rem;">No hay pedidos en estado: ${estado}</p>`;
      } else {
        pedidos.forEach((pedido, index) => {
          const card = renderizarPedidoCocina(pedido);
          card.style.animationDelay = `${index * 50}ms`;
          container.appendChild(card);
          configurarEventosPedidoCocina(card, pedido);
        });
      }
    });
  });
}

/**
 * Configura eventos para los pedidos en cocina
 */
function configurarEventosPedidoCocina(card, pedido) {
  const btnPreparar = card.querySelector('[data-estado="en_preparacion"]');
  const btnListo = card.querySelector('[data-estado="listo"]');

  if (btnPreparar) {
    btnPreparar.addEventListener('click', () => {
      pedidosManagerCocina.actualizarEstado(pedido.id, 'en_preparacion');
      actualizarPedidosCocina();
      mostrarToast('Actualizado', `Mesa ${pedido.numeroMesa} - En preparación`, 'info', 1500);
    });
  }

  if (btnListo) {
    btnListo.addEventListener('click', () => {
      pedidosManagerCocina.actualizarEstado(pedido.id, 'listo');
      actualizarPedidosCocina();
      
      // Reproducir sonido de notificación (simulado)
      reproducirSonidoNotificacion();
      mostrarToast('Éxito', `Mesa ${pedido.numeroMesa} - Listo para servir`, 'success', 2000);
    });
  }
}

/**
 * Actualiza la vista de pedidos
 */
function actualizarPedidosCocina() {
  const pedidosActivos = pedidosManagerCocina.obtenerActivos();
  const container = document.getElementById('pedidos-cocina');
  const sinPedidos = document.getElementById('sin-pedidos');

  // Actualizar contadores
  const estadosCount = {
    'pendiente': pedidosManagerCocina.obtenerPorEstado('pendiente').length,
    'en_preparacion': pedidosManagerCocina.obtenerPorEstado('en_preparacion').length,
    'listo': pedidosManagerCocina.obtenerPorEstado('listo').length
  };

  Object.entries(estadosCount).forEach(([estado, count]) => {
    const contador = document.querySelector(`.contador-estado[data-estado="${estado}"]`);
    if (contador) {
      contador.textContent = count;
    }
  });

  // Mostrar/ocultar sección sin pedidos
  if (pedidosActivos.length === 0) {
    if (container) container.style.display = 'none';
    if (sinPedidos) sinPedidos.style.display = 'block';
  } else {
    if (container) container.style.display = 'grid';
    if (sinPedidos) sinPedidos.style.display = 'none';

    // Renderizar pedidos por estado
    container.innerHTML = '';
    
    // Primero: Pendientes
    pedidosManagerCocina.obtenerPorEstado('pendiente').forEach((pedido, index) => {
      const card = renderizarPedidoCocina(pedido);
      card.style.animationDelay = `${index * 50}ms`;
      container.appendChild(card);
      configurarEventosPedidoCocina(card, pedido);
    });

    // Segundo: En preparación
    pedidosManagerCocina.obtenerPorEstado('en_preparacion').forEach((pedido, index) => {
      const card = renderizarPedidoCocina(pedido);
      card.style.animationDelay = `${(pedidosManagerCocina.obtenerPorEstado('pendiente').length + index) * 50}ms`;
      container.appendChild(card);
      configurarEventosPedidoCocina(card, pedido);
    });

    // Tercero: Listos
    pedidosManagerCocina.obtenerPorEstado('listo').forEach((pedido, index) => {
      const card = renderizarPedidoCocina(pedido);
      const offset = pedidosManagerCocina.obtenerPorEstado('pendiente').length + 
                     pedidosManagerCocina.obtenerPorEstado('en_preparacion').length;
      card.style.animationDelay = `${(offset + index) * 50}ms`;
      container.appendChild(card);
      configurarEventosPedidoCocina(card, pedido);
    });
  }

  // Actualizar header con estadísticas
  actualizarEstadisticasHeader();
}

/**
 * Actualiza las estadísticas en el header
 */
function actualizarEstadisticasHeader() {
  const header = document.getElementById('estadisticas-header');
  if (!header) return;

  const stats = pedidosManagerCocina.calcularEstadisticas();
  
  header.innerHTML = `
    <div style="text-align: center; padding: 0 1rem;">
      <div style="font-size: 1rem; font-weight: 700; color: var(--color-rojo-oscuro);">${stats.activos}</div>
      <div style="font-size: 0.75rem; color: var(--color-gris);">Activos</div>
    </div>
  `;
}

/**
 * Simula un sonido de notificación
 */
function reproducirSonidoNotificacion() {
  // Usar Web Audio API para crear un sonido simple
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.log('No se pudo reproducir sonido');
  }
}

// ========================================
// ESTILOS ADICIONALES PARA COCINA
// ========================================

const estilosCocina = `
.cocina-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.pedidos-cocina {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.pedido-card {
  background: var(--color-blanco);
  border-radius: 12px;
  box-shadow: var(--shadow-media);
  overflow: hidden;
  border-top: 4px solid var(--color-mostaza);
  animation: slideInLeft 0.3s ease-out;
}

.pedido-card.preparacion {
  border-top-color: var(--color-naranja);
}

.pedido-card.listo {
  border-top-color: var(--color-verde);
  box-shadow: 0 0 20px rgba(39, 174, 96, 0.2);
}

.pedido-header {
  background: linear-gradient(135deg, rgba(218, 165, 32, 0.1), rgba(139, 58, 58, 0.1));
  padding: 1.5rem;
  border-bottom: 2px solid var(--color-gris-claro);
}

.pedido-mesa {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-rojo-oscuro);
  margin-bottom: 0.5rem;
}

.pedido-items {
  padding: 1.5rem;
  max-height: 300px;
  overflow-y: auto;
}

.pedido-footer {
  padding: 1.5rem;
  border-top: 2px solid var(--color-gris-claro);
  display: flex;
  gap: 0.75rem;
}

.pedido-footer .btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: var(--transition);
}

.estado-btn {
  background-color: var(--color-mostaza);
  color: var(--color-negro);
}

.estado-btn:hover {
  background-color: var(--color-mostaza-dark);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .pedidos-cocina {
    grid-template-columns: 1fr;
  }
}
`;

// ========================================
// INICIALIZACIÓN AL CARGAR
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Agregar estilos
  const style = document.createElement('style');
  style.textContent = estilosCocina;
  document.head.appendChild(style);

  // Inicializar
  inicializarPanelCocina();
});

// Limpiar interval al descargar
window.addEventListener('beforeunload', () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
