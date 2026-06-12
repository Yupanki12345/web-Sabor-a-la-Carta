# 🍽️ Sabor a la Carta - Sistema POS Restaurante

**Versión:** 1.0.0  
**Autor:** Sistema Profesional de Restaurante  
**Licencia:** MIT

---

## 📋 Descripción

Aplicación web moderna y profesional para gestión de pedidos en restaurantes. Sistema completo de POS (Point of Sale) que incluye vista del mesero, panel de cocina y gestión de pedidos, desarrollada con HTML5, CSS3, Bootstrap 5 y JavaScript Vanilla puro.

**No requiere backend ni base de datos** - Todo funciona con LocalStorage para persistencia de datos.

---

## ✨ Características Principales

### 👨‍💼 Vista del Mesero (index.html)
- ✅ Header elegante con navegación profesional
- ✅ Hero section con call-to-action
- ✅ Menú lateral con categorías de productos
- ✅ Grid de productos con imágenes y detalles
- ✅ Carrito de compras en tiempo real
- ✅ Selección de mesas
- ✅ Revisión de pedidos
- ✅ Gateway de pago integrado
- ✅ Notificaciones toast elegantes
- ✅ Modales interactivos

### 🍳 Panel de Cocina (cocina.html)
- ✅ Vista en tiempo real de pedidos
- ✅ Filtrado por estados (Pendiente, En Preparación, Listo)
- ✅ Actualización automática cada 3 segundos
- ✅ Transición de estados con un clic
- ✅ Notificaciones sonoras
- ✅ Estadísticas en vivo
- ✅ Diseño optimizado para tablets

### 📊 Gestión General
- ✅ LocalStorage para persistencia
- ✅ Carrito de compras sincronizado
- ✅ Gestión de mesas (8 mesas configurables)
- ✅ Estados de pedidos: Pendiente → En Prep. → Listo → Entregado
- ✅ Cálculo automático de IGV (18%)
- ✅ Métodos de pago: Efectivo, Yape, Plin, Tarjeta

---

## 🚀 Cómo Usar

### Instalación

1. **Descargar/Clonar el proyecto**
   ```bash
   git clone <url-del-repo>
   cd sabor-a-la-carta
   ```

2. **Abrir en el navegador**
   - Simplemente abre `index.html` en tu navegador
   - O usar un servidor local: `python -m http.server` (en la carpeta raíz)
   - Acceder a `http://localhost:8000`

### Flujo de Uso

#### Como Mesero:

1. **Selecciona una mesa** desde el modal que aparece al hacer clic en "Revisar Pedido"
2. **Agrega productos** haciendo clic en "Agregar" en las tarjetas de productos
3. **Revisa el carrito** en el panel derecho
4. **Confirma el pedido** y selecciona método de pago
5. El pedido se envía automáticamente a la cocina

#### Como Cocinero:

1. Accede a `cocina.html` desde otra pestaña/dispositivo
2. Verás todos los pedidos pendientes
3. Haz clic en "Preparar" cuando empieces a cocinar
4. Haz clic en "Marcar Listo" cuando el plato esté listo
5. Los cambios se sincronizan en tiempo real

---

## 📁 Estructura del Proyecto

```
sabor-a-la-carta/
├── index.html                 # Página principal del mesero
├── cocina.html                # Panel de cocina
├── README.md                  # Este archivo
├── css/
│   ├── styles.css             # Estilos globales y variables
│   ├── header.css             # Estilos del header
│   ├── hero.css               # Estilos del hero section
│   ├── menu.css               # Estilos del menú lateral
│   ├── productos.css          # Estilos de tarjetas de productos
│   ├── carrito.css            # Estilos del carrito
│   ├── notifications.css      # Estilos de toasts y modales
│   └── responsive.css         # Estilos responsive y layout
├── js/
│   ├── utils.js               # Funciones utilitarias compartidas
│   ├── productos.js           # Gestión de productos
│   ├── carrito.js             # Gestión del carrito
│   ├── pedidos.js             # Gestión de pedidos
│   ├── mesas.js               # Gestión de mesas
│   ├── main.js                # Archivo principal del mesero
│   └── cocina.js              # Archivo del panel de cocina
├── data/
│   ├── productos.json         # Base de datos de productos
│   ├── categorias.json        # Categorías disponibles
│   └── pedidos.json           # Datos iniciales de mesas
└── img/                       # Carpeta para imágenes
```

---

## 🎨 Paleta de Colores

| Color | Valor | Uso |
|-------|-------|-----|
| **Mostaza** | #DAA520 | Primario, botones, highlights |
| **Rojo Oscuro** | #8B3A3A | Secundario, precios, importancia |
| **Crema** | #F5F1E8 | Fondo principal |
| **Blanco** | #FFFFFF | Cards, fondos claros |
| **Negro** | #1A1A1A | Texto principal |
| **Gris** | #999999 | Texto secundario |
| **Verde** | #27AE60 | Éxito, confirmaciones |
| **Naranja** | #E67E22 | Advertencias, procesos |

---

## 🔧 Configuración

### Modificar Productos

Edita `data/productos.json` para agregar o modificar productos:

```json
{
  "id": 1,
  "nombre": "Nombre del Plato",
  "descripcion": "Descripción breve",
  "categoriaId": 1,
  "precio": 45.00,
  "imagen": "URL de la imagen",
  "disponible": true
}
```

### Modificar Categorías

Edita `data/categorias.json`:

```json
{
  "id": 1,
  "nombre": "Nombre Categoría",
  "icono": "🥘"
}
```

### Modificar Mesas

Edita `data/pedidos.json` en la sección `mesas`:

```json
{
  "id": 1,
  "numero": 1,
  "asientos": 2,
  "estado": "disponible"
}
```

---

## 💾 LocalStorage

La aplicación utiliza LocalStorage para guardar:

- `carrito_app` - Items del carrito actual
- `pedidos_app` - Todos los pedidos realizados
- `app_state` - Estado general de la aplicación

Para limpiar datos (console):
```javascript
localStorage.clear();
```

---

## 📱 Responsive Design

✅ Totalmente responsivo para:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Laptops (1024px+)
- 🖥️ Desktops (1400px+)

---

## 🎯 Métodos de Pago

La aplicación simula los siguientes métodos de pago:

- 💵 **Efectivo**
- 📱 **Yape** (Billetera digital peruana)
- 📲 **Plin** (Billetera digital peruana)
- 💳 **Tarjeta de Crédito/Débito**

---

## ⚙️ Funciones JavaScript Principales

### Utils
- `fetchDatos(url)` - Obtiene datos JSON
- `guardarEnLocalStorage(key, data)` - Guarda datos
- `mostrarToast(titulo, mensaje, tipo)` - Notificaciones
- `crearElemento(tag, atributos, contenido)` - Crea elementos DOM

### ProductosManager
- `inicializar()` - Carga productos y categorías
- `filtrarPorCategoria(id)` - Filtra por categoría
- `obtenerProducto(id)` - Obtiene un producto

### CarritoManager
- `agregarProducto(producto, cantidad)` - Agrega al carrito
- `calcularTotal()` - Calcula el total
- `vaciar()` - Vacía el carrito

### PedidosManager
- `crearPedido(mesa, items, total)` - Crea un pedido
- `actualizarEstado(id, estado)` - Cambia estado
- `obtenerActivos()` - Pedidos no entregados

### MesasManager
- `seleccionarMesa(numero)` - Selecciona una mesa
- `liberarMesa(numero)` - Libera una mesa
- `obtenerDisponibles()` - Mesas disponibles

---

## 🐛 Solución de Problemas

### "Los productos no cargan"
- Verificar que los archivos JSON están en `data/`
- Abrir con un servidor local, no con `file://`

### "El carrito no guarda datos"
- Verificar que LocalStorage está habilitado
- Limpiar caché del navegador

### "Los estilos no se aplican"
- Verificar que los archivos CSS están en `css/`
- Recargar la página con Ctrl+Shift+R

---

## 📝 Notas de Desarrollo

- Código **100% Vanilla JavaScript** (sin librerías externas)
- Bootstrap 5 solo para grid y utilidades
- Modular y fácil de extender
- Comentarios en código para facilitar mantenimiento
- Funciones reutilizables y bien organizadas

---

## 🚀 Posibles Mejoras Futuras

- [ ] Integración con backend real (Node.js, Python)
- [ ] Base de datos persistente (MongoDB, PostgreSQL)
- [ ] Autenticación de usuarios
- [ ] Sistema de reportes y estadísticas
- [ ] Impresión de tickets
- [ ] Integración con pasarelas de pago reales
- [ ] App móvil nativa
- [ ] Sistema de inventario
- [ ] Multi-idioma

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Siéntete libre de usarlo, modificarlo y distribuirlo.

---

## 👨‍💻 Soporte

Para reportar bugs o sugerir mejoras, contacta al equipo de desarrollo.

---

## 🙏 Agradecimientos

Desarrollado con ❤️ como un sistema profesional de gestión de restaurantes.

**¡Disfruta tu experiencia gastronómica con Sabor a la Carta!** 🍽️✨
