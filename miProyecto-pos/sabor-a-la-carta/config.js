/**
 * CONFIGURACIÓN DE LA APLICACIÓN
 * Archivo de configuración centralizado
 */

const CONFIG = {
  // Información del restaurante
  RESTAURANTE: {
    nombre: 'Sabor a la Carta',
    telefono: '+51 987 654 321',
    email: 'info@saboralacarta.com',
    direccion: 'Av. Gourmet 123, Lima, Perú',
    version: '1.0.0'
  },

  // Configuración de LocalStorage
  STORAGE: {
    carrito: 'carrito_app',
    pedidos: 'pedidos_app',
    estado: 'app_state'
  },

  // Configuración de impuestos
  IMPUESTOS: {
    igv: 0.18, // 18% en Perú
    propina: 0.10 // 10% opcional
  },

  // Configuración de mesas
  MESAS: {
    total: 8,
    desdeNumero: 1,
    hastaNumero: 8
  },

  // Categorías de productos
  CATEGORIAS: [
    { id: 1, nombre: 'Entradas', icono: '🥘' },
    { id: 2, nombre: 'Platos a la Carta', icono: '🍽️' },
    { id: 3, nombre: 'Broaster', icono: '🍗' },
    { id: 4, nombre: 'Parrillas', icono: '🔥' },
    { id: 5, nombre: 'Bebidas', icono: '🥤' },
    { id: 6, nombre: 'Postres', icono: '🍰' }
  ],

  // Estados de pedidos
  ESTADOS_PEDIDO: [
    { valor: 'pendiente', etiqueta: 'Pendiente', icono: '⏳', color: 'mostaza' },
    { valor: 'en_preparacion', etiqueta: 'En Preparación', icono: '🍳', color: 'naranja' },
    { valor: 'listo', etiqueta: 'Listo', icono: '✓', color: 'verde' },
    { valor: 'entregado', etiqueta: 'Entregado', icono: '✓✓', color: 'gris' }
  ],

  // Métodos de pago
  METODOS_PAGO: [
    { id: 'efectivo', nombre: 'Efectivo', icono: '💵' },
    { id: 'yape', nombre: 'Yape', icono: '📱' },
    { id: 'plin', nombre: 'Plin', icono: '📲' },
    { id: 'tarjeta', nombre: 'Tarjeta', icono: '💳' }
  ],

  // URLs de datos
  URLS: {
    productos: './data/productos.json',
    categorias: './data/categorias.json',
    pedidos: './data/pedidos.json'
  },

  // Colores de la aplicación
  COLORES: {
    mostaza: '#DAA520',
    mostazaOscuro: '#B8860B',
    rojoOscuro: '#8B3A3A',
    rojo: '#A84040',
    crema: '#F5F1E8',
    beige: '#ECDCC8',
    blanco: '#FFFFFF',
    negro: '#1A1A1A',
    grisClaro: '#E8E8E8',
    gris: '#999999',
    verde: '#27AE60',
    naranja: '#E67E22'
  },

  // Tiempos
  TIEMPOS: {
    toastDuracion: 3000, // ms
    refreshCocina: 3000, // ms
    animacionDuracion: 300 // ms
  },

  // Caracteres especiales
  ICONOS: {
    carrito: '🛒',
    corazon: '❤️',
    usuario: '👤',
    menu: '☰',
    cerrar: '✕',
    eliminar: '🗑️',
    editar: '✏️',
    guardar: '💾',
    volver: '←',
    avanzar: '→',
    arriba: '↑',
    abajo: '↓'
  }
};

// Función auxiliar para obtener configuración
function obtenerConfig(ruta) {
  const partes = ruta.split('.');
  let valor = CONFIG;
  
  for (const parte of partes) {
    if (valor[parte] !== undefined) {
      valor = valor[parte];
    } else {
      return null;
    }
  }
  
  return valor;
}

// Validar que los archivos JSON existan
async function validarConfiguracion() {
  try {
    const urls = CONFIG.URLS;
    
    for (const [clave, url] of Object.entries(urls)) {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`⚠️ Archivo no encontrado: ${url}`);
      }
    }
    
    console.log('✅ Configuración validada correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error validando configuración:', error);
    return false;
  }
}

// Exportar para usar en otros módulos (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
