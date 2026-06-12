/**
 * GESTIÓN DE MESAS
 * Módulo para manejar mesas y su estado
 */

const MESAS_DATA = {
  "mesas": [
    { "id": 1, "numero": 1, "asientos": 2, "estado": "disponible" },
    { "id": 2, "numero": 2, "asientos": 2, "estado": "disponible" },
    { "id": 3, "numero": 3, "asientos": 4, "estado": "disponible" },
    { "id": 4, "numero": 4, "asientos": 4, "estado": "disponible" },
    { "id": 5, "numero": 5, "asientos": 6, "estado": "disponible" },
    { "id": 6, "numero": 6, "asientos": 2, "estado": "disponible" },
    { "id": 7, "numero": 7, "asientos": 4, "estado": "disponible" },
    { "id": 8, "numero": 8, "asientos": 4, "estado": "disponible" }
  ]
};

class MesasManager {
  constructor() {
    this.mesas = [];
    this.mesaSeleccionada = null;
  }

  /**
   * Inicializa las mesas desde los datos
   */
  async inicializar() {
    try {
      if (MESAS_DATA && MESAS_DATA.mesas) {
        this.mesas = MESAS_DATA.mesas.map(mesa => ({
          ...mesa,
          estado: 'disponible',
          pedidoActual: null
        }));
        return true;
      }
      return false;
    } catch (error) {
      logError(error, 'Error inicializando MesasManager');
      return false;
    }
  }

  /**
   * Obtiene una mesa por número
   */
  obtenerMesa(numero) {
    return this.mesas.find(m => m.numero === numero);
  }

  /**
   * Obtiene todas las mesas
   */
  obtenerTodas() {
    return [...this.mesas];
  }

  /**
   * Obtiene mesas disponibles
   */
  obtenerDisponibles() {
    return this.mesas.filter(m => m.estado === 'disponible');
  }

  /**
   * Obtiene mesas ocupadas
   */
  obtenerOcupadas() {
    return this.mesas.filter(m => m.estado === 'ocupada');
  }

  /**
   * Selecciona una mesa
   */
  seleccionarMesa(numero) {
    const mesa = this.obtenerMesa(numero);
    if (mesa && mesa.estado === 'disponible') {
      this.mesaSeleccionada = mesa;
      mesa.estado = 'ocupada';
      return true;
    }
    return false;
  }

  /**
   * Libera una mesa
   */
  liberarMesa(numero) {
    const mesa = this.obtenerMesa(numero);
    if (mesa) {
      mesa.estado = 'disponible';
      mesa.pedidoActual = null;
      if (this.mesaSeleccionada && this.mesaSeleccionada.numero === numero) {
        this.mesaSeleccionada = null;
      }
      return true;
    }
    return false;
  }

  /**
   * Asigna un pedido a una mesa
   */
  asignarPedido(numeroMesa, pedidoId) {
    const mesa = this.obtenerMesa(numeroMesa);
    if (mesa) {
      mesa.pedidoActual = pedidoId;
      return true;
    }
    return false;
  }

  /**
   * Obtiene mesa seleccionada
   */
  obtenerSeleccionada() {
    return this.mesaSeleccionada;
  }

  /**
   * Cuenta mesas disponibles
   */
  contarDisponibles() {
    return this.obtenerDisponibles().length;
  }

  /**
   * Obtiene la tasa de ocupación
   */
  getTasaOcupacion() {
    const ocupadas = this.obtenerOcupadas().length;
    return Math.round((ocupadas / this.mesas.length) * 100);
  }
}

/**
 * Renderiza el grid de mesas para seleccionar
 */
function renderizarSelectorMesas(mesas, contenedorId, onSeleccionar) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  contenedor.innerHTML = '';

  const todasLasMesas = mesas.obtenerTodas();

  todasLasMesas.forEach(mesa => {
    const card = crearElemento('div', {
      class: `mesa-card ${mesa.estado === 'disponible' ? '' : 'ocupada'}`,
      'data-mesa-numero': mesa.numero
    }, `
      <div class="mesa-numero">${mesa.numero}</div>
      <div class="mesa-asientos">${mesa.asientos} asientos</div>
    `);

    if (mesa.estado === 'disponible') {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        document.querySelectorAll('.mesa-card').forEach(c => {
          c.classList.remove('selected');
        });
        card.classList.add('selected');
        if (onSeleccionar) {
          onSeleccionar(mesa);
        }
      });
    } else {
      card.style.opacity = '0.5';
      card.style.cursor = 'not-allowed';
    }

    contenedor.appendChild(card);
  });
}

/**
 * Crea un modal para seleccionar mesa
 */
function crearModalSeleccionarMesa(mesasManager) {
  const contenedor = crearElemento('div', { class: 'selector-mesas' });

  let mesaSeleccionada = null;

  contenedor.innerHTML = `
    <div>
      <h3 style="margin-top: 0;">Selecciona una Mesa</h3>
      <p style="color: var(--color-gris);">Mesas disponibles: ${mesasManager.contarDisponibles()} / ${mesasManager.obtenerTodas().length}</p>
      <div class="mesas-grid" id="mesasGrid"></div>
    </div>
  `;

  const todasLasMesas = mesasManager.obtenerTodas();

  const grid = contenedor.querySelector('#mesasGrid');
  todasLasMesas.forEach(mesa => {
    const card = crearElemento('div', {
      class: `mesa-card ${mesa.estado === 'disponible' ? '' : 'ocupada'}`,
      'data-mesa-numero': mesa.numero
    }, `
      <div class="mesa-numero">${mesa.numero}</div>
      <div class="mesa-asientos">${mesa.asientos} asientos</div>
      <div style="font-size: 0.8rem; margin-top: 0.25rem; color: var(--color-gris);">
        ${mesa.estado === 'disponible' ? 'Disponible' : 'Ocupada'}
      </div>
    `);

    if (mesa.estado === 'disponible') {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        document.querySelectorAll('#mesasGrid .mesa-card').forEach(c => {
          c.classList.remove('selected');
        });
        card.classList.add('selected');
        mesaSeleccionada = mesa;
      });
    } else {
      card.style.opacity = '0.5';
      card.style.cursor = 'not-allowed';
    }

    grid.appendChild(card);
  });

  return { elemento: contenedor, obtenerMesa: () => mesaSeleccionada };
}

/**
 * Renderiza el estado actual de las mesas
 */
function renderizarEstadoMesas(mesas) {
  const total = mesas.obtenerTodas().length;
  const disponibles = mesas.contarDisponibles();
  const ocupadas = total - disponibles;
  const tasaOcupacion = mesas.getTasaOcupacion();

  return `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
      <div style="background: var(--color-crema); padding: 1rem; border-radius: 8px; text-align: center;">
        <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-mostaza);">${total}</div>
        <div style="font-size: 0.85rem; color: var(--color-gris);">Total de Mesas</div>
      </div>
      <div style="background: var(--color-crema); padding: 1rem; border-radius: 8px; text-align: center;">
        <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-verde);">${disponibles}</div>
        <div style="font-size: 0.85rem; color: var(--color-gris);">Disponibles</div>
      </div>
      <div style="background: var(--color-crema); padding: 1rem; border-radius: 8px; text-align: center;">
        <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-rojo-oscuro);">${ocupadas}</div>
        <div style="font-size: 0.85rem; color: var(--color-gris);">Ocupadas</div>
      </div>
      <div style="background: var(--color-crema); padding: 1rem; border-radius: 8px; text-align: center;">
        <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-naranja);">${tasaOcupacion}%</div>
        <div style="font-size: 0.85rem; color: var(--color-gris);">Ocupación</div>
      </div>
    </div>
  `;
}

// Variable global para el manager de mesas
let mesasManager;
