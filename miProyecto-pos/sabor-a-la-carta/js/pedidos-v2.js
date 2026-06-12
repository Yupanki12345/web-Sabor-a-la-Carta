/**
 * GESTIÓN DE PEDIDOS
 */

class PedidosManager {
  constructor(storageKey = "pedidos_app") {
    this.pedidos = [];
    this.storageKey = storageKey;
    this.cargarDelStorage();
  }

  cargarDelStorage() {
    try {
      const datos = obtenerDelLocalStorage(this.storageKey, []);
      this.pedidos = datos;
    } catch (error) {
      console.error("Error cargando pedidos del storage:", error);
      this.pedidos = [];
    }
  }

  guardarEnStorage() {
    try {
      guardarEnLocalStorage(this.storageKey, this.pedidos);
    } catch (error) {
      console.error("Error guardando pedidos en storage:", error);
    }
  }

  crearPedido(
    mesaId,
    items,
    total,
    subtotal,
    impuesto,
    metodoPago = "efectivo",
    pagoTarjeta = null,
  ) {
    const pedido = {
      id: Date.now().toString(),
      mesaId: mesaId,
      numeroMesa: mesaId,
      items: JSON.parse(JSON.stringify(items)),
      subtotal: subtotal,
      impuesto: impuesto,
      total: total,
      metodoPago: metodoPago,
      pagoTarjeta: pagoTarjeta,
      estado: "pendiente",
      fechaCreacion: new Date().toISOString(),
      fechaEntrega: null,
      mesero: "Sistema",
      notas: "",
    };
    this.pedidos.push(pedido);
    this.guardarEnStorage();
    return pedido;
  }

  obtenerPedido(id) {
    return this.pedidos.find((p) => p.id === id);
  }

  obtenerTodos() {
    return [...this.pedidos];
  }

  obtenerPorEstado(estado) {
    return this.pedidos.filter((p) => p.estado === estado);
  }

  obtenerActivos() {
    return this.pedidos.filter((p) => p.estado !== "entregado");
  }

  actualizarEstado(pedidoId, nuevoEstado) {
    const pedido = this.obtenerPedido(pedidoId);
    if (pedido) {
      pedido.estado = nuevoEstado;
      if (nuevoEstado === "entregado") {
        pedido.fechaEntrega = new Date().toISOString();
      }
      this.guardarEnStorage();
      return true;
    }
    return false;
  }

  calcularEstadisticas() {
    const total = this.pedidos.length;
    const entregados = this.pedidos.filter(
      (p) => p.estado === "entregado",
    ).length;
    const activos = this.pedidos.filter((p) => p.estado !== "entregado").length;
    const ingresoTotal = this.pedidos
      .filter((p) => p.estado === "entregado")
      .reduce((sum, p) => sum + p.total, 0);
    return { total, entregados, activos, ingresoTotal };
  }
}
