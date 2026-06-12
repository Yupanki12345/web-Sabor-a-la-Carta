/**
 * GESTIÓN DE PEDIDOS
 * Módulo para manejar pedidos y su estado
 */

class PedidosManager {
  constructor(storageKey = 'pedidos_app') {
    this.pedidos = [];
    this.storageKey = storageKey;
    this.cargarDelStorage();
  }

  /**
   * Carga los pedidos desde localStorage
   */
  cargarDelStorage() {
    const datos = obtenerDelLocalStorage(this.storageKey, []);
    this.pedidos = datos;
  }

  /**
   * Guarda los pedidos en localStorage
   */
  guardarEnStorage() {
    guardarEnLocalStorage(this.storageKey, this.pedidos);
  }

  /**
   * Crea un nuevo pedido
   */
  crearPedido(mesaId, items, total, subtotal, impuesto) {
    const pedido = {
      id: Date.now().toString(),
      mesaId: mesaId,
      numeroMesa: mesaId,
      items: JSON.parse(JSON.stringify(items)),
      subtotal: subtotal,
      impuesto: impuesto,
      total: total,
      estado: 'pendiente', // pendiente, en_preparacion, listo, entregado
      fechaCreacion: new Date().toISOString(),
      fechaEntrega: null,
      mesero: 'Sistema',
      notas: ''
    };

    this.pedidos.push(pedido);
    this.guardarEnStorage();
    return pedido;
  }

  /**
   * Obtiene un pedido por ID
   */
  obtenerPedido(id) {
    return this.pedidos.find(p => p.id === id);
  }

  /**
   * Obtiene todos los pedidos
   */
  obtenerTodos() {
    return [...this.pedidos];
  }

  /**
   * Obtiene pedidos por estado
   */
  obtenerPorEstado(estado) {
    return this.pedidos.filter(p => p.estado === estado);
  }

  /**
   * Obtiene pedidos de una mesa
   */
  obtenerPorMesa(mesaId) {
    return this.pedidos.filter(p => p.mesaId === mesaId);
  }

  /**
   * Obtiene pedidos activos (no entregados)
   */
  obtenerActivos() {
    return this.pedidos.filter(p => p.estado !== 'entregado');
  }

  /**
   * Obtiene pedidos recientes
   */
  obtenerRecientes(cantidad = 10) {
    return this.pedidos
      .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
      .slice(0, cantidad);
  }

  /**
   * Actualiza el estado de un pedido
   */
  actualizarEstado(pedidoId, nuevoEstado) {
    const pedido = this.obtenerPedido(pedidoId);
    if (pedido) {
      const estadosValidos = ['pendiente', 'en_preparacion', 'listo', 'entregado'];
      if (estadosValidos.includes(nuevoEstado)) {
        pedido.estado = nuevoEstado;
        if (nuevoEstado === 'entregado') {
          pedido.fechaEntrega = new Date().toISOString();
        }
        this.guardarEnStorage();
        return true;
      }
    }
    return false;
  }

  /**
   * Agrega notas a un pedido
   */
  agregarNotas(pedidoId, notas) {
    const pedido = this.obtenerPedido(pedidoId);
    if (pedido) {
      pedido.notas = notas;
      this.guardarEnStorage();
      return true;
    }
    return false;
  }

  /**
   * Calcula estadísticas
   */
  calcularEstadisticas() {
    const total = this.pedidos.length;
    const entregados = this.pedidos.filter(p => p.estado === 'entregado').length;
    const activos = this.pedidos.filter(p => p.estado !== 'entregado').length;
    const ingresoTotal = this.pedidos
      .filter(p => p.estado === 'entregado')
      .reduce((sum, p) => sum + p.total, 0);

    return {
      total,
      entregados,
      activos,
      ingresoTotal,
      promedioPorPedido: entregados > 0 ? ingresoTotal / entregados : 0
    };
  }

  /**
   * Elimina un pedido (solo para desarrollo)
   */
  eliminar(pedidoId) {
    const index = this.pedidos.findIndex(p => p.id === pedidoId);
    if (index !== -1) {
      this.pedidos.splice(index, 1);
      this.guardarEnStorage();
      return true;
    }
    return false;
  }

  /**
   * Limpia todos los pedidos (solo para desarrollo)
   */
  limpiar() {
    this.pedidos = [];
    this.guardarEnStorage();
  }
}

/**
 * Renderiza un pedido para la vista de cocina
 */
function renderizarPedidoCocina(pedido) {
  const card = crearElemento('div', {
    class: `pedido-card ${pedido.estado === 'en_preparacion' ? 'preparacion' : pedido.estado === 'listo' ? 'listo' : ''}`,
    'data-pedido-id': pedido.id
  });

  const badge = {
    'pendiente': '⏳ Pendiente',
    'en_preparacion': '🍳 En Preparación',
    'listo': '✓ Listo',
    'entregado': '✓✓ Entregado'
  };

  let itemsHTML = '';
  pedido.items.forEach(item => {
    itemsHTML += `
      <div class="pedido-item">
        <div class="pedido-item-nombre">${item.nombre}</div>
        <div class="pedido-item-cantidad">Cantidad: ${item.cantidad}</div>
      </div>
    `;
  });

  card.innerHTML = `
    <div class="pedido-header">
      <div class="pedido-mesa">Mesa ${pedido.numeroMesa}</div>
      <div class="pedido-hora">${formatearHora(pedido.fechaCreacion)}</div>
    </div>
    <div class="pedido-items">
      ${itemsHTML}
    </div>
    <div class="pedido-footer">
      <button class="btn btn-blanco btn-pequeño estado-btn" data-estado="en_preparacion">
        Preparar
      </button>
      <button class="btn btn-mostaza btn-pequeño estado-btn" data-estado="listo">
        Marcar Listo
      </button>
    </div>
  `;

  return card;
}

/**
 * Renderiza un pedido para la vista del mesero
 */
function renderizarPedidoMesero(pedido) {
  const card = crearElemento('div', {
    class: 'card pedido-mesero-card',
    'data-pedido-id': pedido.id
  });

  const badge = {
    'pendiente': { clase: 'badge badge-warning', texto: '⏳ Pendiente' },
    'en_preparacion': { clase: 'badge badge-info', texto: '🍳 En Prep.' },
    'listo': { clase: 'badge badge-success', texto: '✓ Listo' },
    'entregado': { clase: 'badge badge-secondary', texto: '✓✓ Entregado' }
  };

  card.innerHTML = `
    <div class="p-3">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <h4 style="margin: 0; color: var(--color-rojo-oscuro);">Mesa ${pedido.numeroMesa}</h4>
        <span class="estado-badge" style="background-color: ${
          pedido.estado === 'pendiente' ? 'var(--color-mostaza)' :
          pedido.estado === 'en_preparacion' ? 'var(--color-naranja)' :
          pedido.estado === 'listo' ? 'var(--color-verde)' :
          'var(--color-gris)'
        }">${badge[pedido.estado].texto}</span>
      </div>
      <p style="margin: 0.5rem 0; font-size: 0.85rem; color: var(--color-gris);">
        ${formatearFechaHora(pedido.fechaCreacion)}
      </p>
      <p style="margin: 0.5rem 0; font-weight: 600;">Total: ${formatearMoneda(pedido.total)}</p>
    </div>
  `;

  return card;
}

/**
 * Crea un modal de confirmación de pago
 */
function crearModalPago(pedido, onConfirmar) {
  const contenedor = crearElemento('div', { class: 'pago-modal' });

  contenedor.innerHTML = `
    <div class="pago-resumen">
      <h3 style="margin: 0 0 1.5rem 0;">Resumen del Pago</h3>
      <div style="margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span>Mesa:</span>
          <strong>${pedido.numeroMesa}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span>Subtotal:</span>
          <strong>${formatearMoneda(pedido.subtotal)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
          <span>IGV (18%):</span>
          <strong>${formatearMoneda(pedido.impuesto)}</strong>
        </div>
        <div style="border-top: 2px solid var(--color-gris-claro); padding-top: 0.75rem; display: flex; justify-content: space-between;">
          <strong>Total:</strong>
          <strong style="color: var(--color-rojo-oscuro); font-size: 1.2rem;">${formatearMoneda(pedido.total)}</strong>
        </div>
      </div>
    </div>

    <div class="form-group">
      <label>Método de Pago</label>
      <div class="metodos-pago" style="grid-template-columns: repeat(2, 1fr);">
        <div class="metodo-pago" data-metodo="efectivo">
          <div class="metodo-icono">💵</div>
          <div class="metodo-nombre">Efectivo</div>
        </div>
        <div class="metodo-pago" data-metodo="yape">
          <div class="metodo-icono">📱</div>
          <div class="metodo-nombre">Yape</div>
        </div>
        <div class="metodo-pago" data-metodo="plin">
          <div class="metodo-icono">📲</div>
          <div class="metodo-nombre">Plin</div>
        </div>
        <div class="metodo-pago" data-metodo="tarjeta">
          <div class="metodo-icono">💳</div>
          <div class="metodo-nombre">Tarjeta</div>
        </div>
      </div>
    </div>

    <div class="form-group">
      <label>Notas (opcional)</label>
      <textarea id="notasPago" placeholder="Agregar notas del pago..."></textarea>
    </div>
  `;

  let metodoSeleccionado = null;

  // Eventos de métodos de pago
  const metodos = contenedor.querySelectorAll('.metodo-pago');
  metodos.forEach(metodo => {
    metodo.addEventListener('click', () => {
      metodos.forEach(m => m.classList.remove('selected'));
      metodo.classList.add('selected');
      metodoSeleccionado = metodo.getAttribute('data-metodo');
    });
  });

  return { elemento: contenedor, obtenerDatos: () => ({
    metodo: metodoSeleccionado,
    notas: contenedor.querySelector('#notasPago').value
  })};
}

// Variable global para el manager de pedidos
let pedidosManager;
