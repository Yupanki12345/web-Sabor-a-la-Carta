/**
 * GESTIÓN DE MESAS
 */

const MESAS_DATA = {
  "mesas": [
    { "numero": 1, "asientos": 2, "ubicacion": "Entrada" },
    { "numero": 2, "asientos": 4, "ubicacion": "Centro" },
    { "numero": 3, "asientos": 6, "ubicacion": "Centro" },
    { "numero": 4, "asientos": 4, "ubicacion": "Ventana" },
    { "numero": 5, "asientos": 2, "ubicacion": "Barra" },
    { "numero": 6, "asientos": 4, "ubicacion": "Terraza" },
    { "numero": 7, "asientos": 6, "ubicacion": "Terraza" },
    { "numero": 8, "asientos": 4, "ubicacion": "Patio" }
  ]
};

class MesasManager {
  constructor() {
    this.mesas = MESAS_DATA.mesas.map(mesa => ({
      ...mesa,
      estado: 'disponible',
      pedidoActual: null
    }));
    this.mesaSeleccionada = null;
  }

  async inicializar() {
    return true;
  }

  obtenerMesa(numero) {
    return this.mesas.find(m => m.numero === numero);
  }

  obtenerTodas() {
    return [...this.mesas];
  }

  obtenerDisponibles() {
    return this.mesas.filter(m => m.estado === 'disponible');
  }

  seleccionarMesa(numero) {
    const mesa = this.obtenerMesa(numero);
    if (mesa && mesa.estado === 'disponible') {
      this.mesaSeleccionada = mesa;
      mesa.estado = 'ocupada';
      return true;
    }
    return false;
  }

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

  obtenerSeleccionada() {
    return this.mesaSeleccionada;
  }

  contarDisponibles() {
    return this.obtenerDisponibles().length;
  }

  getTasaOcupacion() {
    const ocupadas = this.mesas.filter(m => m.estado === 'ocupada').length;
    return Math.round((ocupadas / this.mesas.length) * 100);
  }
}
