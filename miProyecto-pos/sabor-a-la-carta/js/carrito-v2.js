/**
 * GESTIÓN DEL CARRITO
 */

class CarritoManager {
  constructor(storageKey = 'carrito_app') {
    this.items = [];
    this.storageKey = storageKey;
    this.listeners = [];
    this.cargarDelStorage();
  }

  cargarDelStorage() {
    try {
      const datos = obtenerDelLocalStorage(this.storageKey, []);
      this.items = datos;
    } catch (error) {
      console.error('Error cargando carrito del storage:', error);
      this.items = [];
    }
  }

  guardarEnStorage() {
    try {
      guardarEnLocalStorage(this.storageKey, this.items);
      this.notificarCambios();
    } catch (error) {
      console.error('Error guardando carrito en storage:', error);
    }
  }

  agregarProducto(producto, cantidad = 1) {
    const itemExistente = this.items.find(item => item.id === producto.id);
    if (itemExistente) {
      itemExistente.cantidad += cantidad;
      itemExistente.subtotal = itemExistente.cantidad * itemExistente.precio;
    } else {
      this.items.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen || '',
        cantidad: cantidad,
        subtotal: producto.precio * cantidad
      });
    }
    this.guardarEnStorage();
    return true;
  }

  eliminarProducto(productoId) {
    const index = this.items.findIndex(item => item.id === productoId);
    if (index !== -1) {
      this.items.splice(index, 1);
      this.guardarEnStorage();
      return true;
    }
    return false;
  }

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

  obtenerItem(productoId) {
    return this.items.find(item => item.id === productoId);
  }

  obtenerItems() {
    return [...this.items];
  }

  calcularSubtotal() {
    return this.items.reduce((total, item) => total + item.subtotal, 0);
  }

  calcularImpuesto() {
    return this.calcularSubtotal() * 0.18;
  }

  calcularTotal() {
    return this.calcularSubtotal() + this.calcularImpuesto();
  }

  obtenerCantidadTotal() {
    return this.items.reduce((total, item) => total + item.cantidad, 0);
  }

  estaVacio() {
    return this.items.length === 0;
  }

  vaciar() {
    this.items = [];
    this.guardarEnStorage();
  }

  onCambio(callback) {
    this.listeners.push(callback);
  }

  notificarCambios() {
    this.listeners.forEach(callback => {
      try {
        callback(this);
      } catch (error) {
        console.error('Error en listener del carrito:', error);
      }
    });
  }
}
