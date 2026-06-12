/**
 * GESTIÓN DE PRODUCTOS
 * Módulo para cargar, filtrar y gestionar productos
 */

// Datos inline para evitar restricciones CORS
const PRODUCTOS_DATA = {
  categorias: [
    { id: 1, nombre: "Entradas", icono: "🥘" },
    { id: 2, nombre: "Platos a la Carta", icono: "🍽️" },
    { id: 3, nombre: "Broaster", icono: "🍗" },
    { id: 4, nombre: "Parrillas", icono: "🔥" },
    { id: 5, nombre: "Bebidas", icono: "🥤" },
    { id: 6, nombre: "Postres", icono: "🍰" },
  ],
  productos: [
    {
      id: 1,
      nombre: "Tabla de Quesos",
      descripcion: "Selección premium de quesos importados",
      categoriaId: 1,
      precio: 45.0,
      imagen:
        "https://recetasdecocina.elmundo.es/wp-content/uploads/2024/12/tabla-de-quesos-1024x683.jpg",
      disponible: true,
    },
    {
      id: 2,
      nombre: "Tabla de Embutidos",
      descripcion: "Jamón ibérico, salami y más",
      categoriaId: 1,
      precio: 55.0,
      imagen:
        "https://torredenunez.com/wp-content/uploads/2024/07/tabla-de-embutidos-destacada.webp",
      disponible: true,
    },
    {
      id: 3,
      nombre: "Camarones a la Mantequilla",
      descripcion: "Camarones frescos salteados en salsa de mantequilla",
      categoriaId: 1,
      precio: 38.0,
      imagen:
        "https://tiaclara.com/wp-content/uploads/2025/09/garlic-butter-shrimp-CG12400.jpg",
      disponible: true,
    },
    {
      id: 4,
      nombre: "Ceviche Mixto",
      descripcion: "Pez espada, camarones y pulpo",
      categoriaId: 1,
      precio: 42.0,
      imagen: "https://tofuu.getjusto.com/orioneat-local/resized2/6pQhY7N88yMDAEKun-x-2400.webp",
      disponible: true,
    },
    {
      id: 5,
      nombre: "Lomo a la Parrilla",
      descripcion: "Corte de lomo de res premium, cocido a la parrilla",
      categoriaId: 2,
      precio: 68.0,
      imagen: "https://perfect-choice.cl/wp-content/uploads/2023/03/Lomo-vetado-con-ajos-asados-a-la-parrilla_1400x.progressive_11zon.jpg",
      disponible: true,
    },
    {
      id: 6,
      nombre: "Pez Espada a la Mantequilla",
      descripcion: "Filete fresco de pez espada con salsa delicada",
      categoriaId: 2,
      precio: 58.0,
      imagen:
        "https://preview.redd.it/easy-lemon-butter-swordfish-15-minutes-to-prepare-and-it-v0-o2l0jexrm5p51.jpg?width=640&crop=smart&auto=webp&s=ae611aac2909f234612995ed654d6c8e8c319da2",
      disponible: true,
    },
    {
      id: 7,
      nombre: "Pechuga Rellena",
      descripcion: "Pechuga de pollo rellena de jamón y queso",
      categoriaId: 2,
      precio: 48.0,
      imagen: "https://www.annarecetasfaciles.com/files/cordon-bleub.jpg",
      disponible: true,
    },
    {
      id: 8,
      nombre: "Arroz Chaufa",
      descripcion: "Arroz salteado con pollo, camarones y vegetales",
      categoriaId: 2,
      precio: 38.0,
      imagen:
        "https://www.annarecetasfaciles.com/files/arroz-chaufa-1-scaled.jpg",
      disponible: true,
    },
    {
      id: 9,
      nombre: "Broaster Completo",
      descripcion: "Pollo broaster con papas y ensalada",
      categoriaId: 3,
      precio: 32.0,
      imagen: "https://i.ytimg.com/vi/Jp74MpQ20f0/maxresdefault.jpg",
      disponible: true,
    },
    {
      id: 10,
      nombre: "Broaster en Promo",
      descripcion: "1 libra de pollo broaster + papas",
      categoriaId: 3,
      precio: 28.0,
      imagen:
        "https://pepestubroaster.com/wp-content/uploads/14-piezas-de-pollo.jpg"
    },
    {
      id: 11,
      nombre: "Tabla de Carnes",
      descripcion: "Costillas, lomo, pollo y champiñones a la parrilla",
      categoriaId: 4,
      precio: 85.0,
      imagen: "https://www.cocinavital.mx/wp-content/uploads/2021/12/tablas-de-carnes-frias-y-quesos.jpg",
      disponible: true,
    },
    {
      id: 12,
      nombre: "Parrillada Mixta",
      descripcion: "Para dos personas: carnes variadas y vegetales",
      categoriaId: 4,
      precio: 95.0,
      imagen:
        "https://okrecetas.com/recetas-de-carnes/img600/parrillada-mixta.jpg",
      disponible: true,
    },
    {
      id: 13,
      nombre: "Costillas a la BBQ",
      descripcion: "Costillas tiernas con salsa BBQ especial",
      categoriaId: 4,
      precio: 65.0,
      imagen:
        "https://cdn7.kiwilimon.com/recetaimagen/24882/960x640/20566.jpg.jpg",
      disponible: true,
    },
    {
      id: 14,
      nombre: "Agua Mineral",
      descripcion: "Botella de 500ml",
      categoriaId: 5,
      precio: 3.0,
      imagen: "https://peru21.pe/sites/default/efsfiles/2026-02/1008567.jpg",
      disponible: true,
    },
    {
      id: 15,
      nombre: "Gaseosa",
      descripcion: "Coca-Cola, Fanta o Sprite - 355ml",
      categoriaId: 5,
      precio: 5.0,
      imagen: "https://hablacausa.com.pe/wp-content/uploads/2025/03/Gaseosas-personales.jpg",
      disponible: true,
    },
    {
      id: 16,
      nombre: "Jugo Natural",
      descripcion: "Naranja, papaya o piña - 350ml",
      categoriaId: 5,
      precio: 6.0,
      imagen: "https://i.blogs.es/a3ae58/jugos-naturales-con-licuadora-1-/650_1200.jpg",
      disponible: true,
    },
    {
      id: 17,
      nombre: "Vino Tinto",
      descripcion: "Vino tinto premium - copa",
      categoriaId: 5,
      precio: 15.0,
      imagen: "https://virtute.pe/wp-content/uploads/2023/09/vino-italiano-tinto-rosso-di-montalcino-doc-verbena.png",
      disponible: true,
    },
    {
      id: 18,
      nombre: "Tiramisú",
      descripcion: "Clásico italiano con café y mascarpone",
      categoriaId: 6,
      precio: 18.0,
      imagen: "https://cdn.blog.paulinacocina.net/wp-content/uploads/2020/01/receta-de-tiramisu-facil-y-economico-1740483918.jpg",
      disponible: true,
    },
    {
      id: 19,
      nombre: "Brownie de Chocolate",
      descripcion: "Brownie casero con helado de vainilla",
      categoriaId: 6,
      precio: 14.0,
      imagen: "https://cocina-casera.com/wp-content/uploads/2015/04/brownie_chocolate_receta.jpg",
      disponible: true,
    },
    {
      id: 20,
      nombre: "Cheesecake",
      descripcion: "Cheesecake neoyorquino con frutos rojos",
      categoriaId: 6,
      precio: 16.0,
      imagen:
        "https://comedera.com/wp-content/uploads/sites/9/2026/04/Cheesecake-de-maracuya.webp",
      disponible: true,
    },
  ],
};

class ProductosManager {
  constructor() {
    this.productos = [];
    this.categorias = [];
    this.productosFiltrados = [];
    this.categoriaActiva = null;
  }

  async inicializar() {
    try {
      this.productos = PRODUCTOS_DATA.productos || [];
      this.categorias = PRODUCTOS_DATA.categorias || [];
      return true;
    } catch (error) {
      console.error("Error inicializando ProductosManager:", error);
      return false;
    }
  }

  obtenerProducto(id) {
    return this.productos.find((p) => p.id === id);
  }

  obtenerTodos() {
    return [...this.productos];
  }

  obtenerCategorias() {
    return [...this.categorias];
  }

  filtrarPorCategoria(categoriaId) {
    this.categoriaActiva = categoriaId;
    this.productosFiltrados = this.productos.filter(
      (p) => p.categoriaId === categoriaId,
    );
    return this.productosFiltrados;
  }

  obtenerCategoria(id) {
    return this.categorias.find((c) => c.id === id);
  }

  obtenerNombreCategoria(categoriaId) {
    const categoria = this.obtenerCategoria(categoriaId);
    return categoria ? categoria.nombre : "Desconocida";
  }

  obtenerIconoCategoria(categoriaId) {
    const categoria = this.obtenerCategoria(categoriaId);
    return categoria ? categoria.icono : "";
  }

  obtenerDisponibles() {
    return this.productos.filter((p) => p.disponible);
  }
}
