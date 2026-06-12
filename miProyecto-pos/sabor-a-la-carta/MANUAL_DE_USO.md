# 🍽️ SABOR A LA CARTA - Sistema POS para Restaurante

**Aplicación web frontend completamente funcional para gestión de restaurante**

## ✨ Características Implementadas

### 1. **Gestión de Productos**
- 20 productos precargados con descripción y precio
- 6 categorías temáticas (Entradas, Platos a la Carta, Broaster, Parrillas, Bebidas, Postres)
- Grid responsive de productos con tarjetas interactivas
- Búsqueda y filtrado por categoría

### 2. **Carrito de Compras**
- Agregar/eliminar productos
- Actualizar cantidades
- Cálculo automático de totales
- **Cálculo de IGV (18%) automático**
- Persistencia en LocalStorage
- Mostrador visual del contador de items

### 3. **Sistema de Mesas**
- 8 mesas configuradas (2-6 asientos cada una)
- Estados: disponible, ocupada
- Selección de mesa para pedidos

### 4. **Gestión de Pedidos**
- Creación de pedidos vinculados a mesa
- Estados: pendiente → en preparación → listo → entregado
- Historial de pedidos
- Persistencia en LocalStorage

### 5. **Diseño & UX**
- ✅ Fondo crema/beige (Color: #F5F1E8)
- ✅ Barra superior blanca con navegación
- ✅ Colores principales: 
  - Amarillo mostaza (#DAA520)
  - Rojo oscuro (#8B3A3A)
  - Blanco (#FFFFFF)
  - Negro (#000000)
- ✅ Interfaz completamente responsive (mobile, tablet, desktop)
- ✅ Animaciones suaves y transiciones elegantes
- ✅ Modales profesionales para detalles y confirmaciones

## 🚀 Cómo Usar

### Abrir la aplicación
```bash
# Simplemente abre el archivo index.html en tu navegador
# El navegador automáticamente detectará y ejecutará la aplicación
```

**NO requiere:**
- ❌ Backend/servidor
- ❌ Base de datos
- ❌ Conexión a internet
- ❌ Instalación de dependencias

**SÍ Requiere:**
- ✅ Navegador moderno (Chrome, Firefox, Safari, Edge)
- ✅ JavaScript habilitado

## 📁 Estructura del Proyecto

```
sabor-a-la-carta/
├── index.html                 # Página principal (vista de mesero)
├── cocina.html               # Página para panel de cocina
├── css/
│   ├── styles.css            # Estilos globales
│   ├── header.css            # Header y navegación
│   ├── menu.css              # Menú lateral
│   ├── productos.css         # Grid de productos
│   ├── carrito.css           # Estilos del carrito
│   ├── notifications.css     # Notificaciones y modales
│   └── responsive.css        # Media queries y responsive
├── js/
│   ├── utils.js              # Funciones utilitarias
│   ├── productos-v2.js       # Gestión de productos
│   ├── carrito-v2.js         # Gestión del carrito
│   ├── pedidos-v2.js         # Gestión de pedidos
│   ├── mesas-v2.js           # Gestión de mesas
│   └── main-v2.js            # Inicialización principal
├── assets/                   # Imágenes y recursos
├── metadata.json             # Información del proyecto
└── README.md                 # Este archivo
```

## 🔧 Funcionalidades Principales

### Vista de Mesero (index.html)
- Selector de categorías
- Grid de productos
- Carrito de compras
- Resumen de pedidos
- Sistema de totales con IGV

### Vista de Cocina (cocina.html)
- Panel de pedidos pendientes
- Estados de preparación en tiempo real
- Filtros por estado
- Notificaciones de pedidos listos

## 💾 Almacenamiento de Datos

**LocalStorage Keys:**
- `carrito_app` - Carrito actual
- `pedidos_app` - Historial de pedidos
- `mesas_app` - Estado de mesas

Los datos se guardan automáticamente al navegador y persisten entre sesiones.

## 🎨 Paleta de Colores

| Color | Código | Uso |
|-------|--------|-----|
| Fondo Crema | #F5F1E8 | Fondo principal |
| Blanco | #FFFFFF | Tarjetas y elementos |
| Amarillo Mostaza | #DAA520 | Botones y acentos |
| Rojo Oscuro | #8B3A3A | Títulos y headings |
| Gris | #999999 | Textos secundarios |

## 📊 Datos de Ejemplo

### Productos (20 total)
- Entradas: 4 productos
- Platos a la Carta: 4 productos
- Broaster: 2 productos
- Parrillas: 3 productos
- Bebidas: 4 productos
- Postres: 3 productos

**Rango de precios:** S/. 3.00 - S/. 95.00

### Mesas (8 total)
| Mesa | Asientos | Ubicación |
|------|----------|-----------|
| 1 | 2 | Entrada |
| 2 | 4 | Centro |
| 3 | 6 | Centro |
| 4 | 4 | Ventana |
| 5 | 2 | Barra |
| 6 | 4 | Terraza |
| 7 | 6 | Terraza |
| 8 | 4 | Patio |

## 💻 Tecnologías Utilizadas

- **HTML5** - Semántica moderna
- **CSS3** - Flexbox, Grid, variables CSS
- **JavaScript Vanilla** - ES6+, sin frameworks
- **LocalStorage API** - Persistencia de datos
- **Bootstrap 5** - Grid utilities (CDN)

## 🔐 Características de Seguridad

- ✅ Validación de datos en cliente
- ✅ Sanitización de inputs
- ✅ Almacenamiento local (sin envío a servidores)
- ✅ Cálculos verificables en cliente

## 📱 Responsividad

- ✅ Mobile: 320px+
- ✅ Tablet: 768px+
- ✅ Desktop: 1024px+
- ✅ Large Desktop: 1400px+

## 🎯 Casos de Uso

### 1. Tomar Pedido
```
1. Seleccionar mesa
2. Navegar categorías
3. Agregar productos al carrito
4. Confirmar pedido
5. Procesar pago
```

### 2. Gestionar en Cocina
```
1. Ver pedidos pendientes
2. Marcar como "en preparación"
3. Marcar como "listo"
4. Confirmar entrega
```

### 3. Consultar Estadísticas
```
- Total de pedidos
- Pedidos entregados
- Pedidos activos
- Ingresos totales
```

## 🚦 Estados de Pedidos

```
pendiente ──→ en_preparacion ──→ listo ──→ entregado
   ↓              ↓                ↓
  Nuevo         Cocinando      Listo para    Completado
               en cocina       recoger
```

## 💳 Métodos de Pago

- Efectivo
- Yape
- Plin
- Tarjeta

## 🔢 Cálculo de Totales

```
Subtotal = Σ (cantidad × precio)
IGV = Subtotal × 18%
Total = Subtotal + IGV
```

Ejemplo:
- Producto 1: 2 × S/. 45.00 = S/. 90.00
- Producto 2: 1 × S/. 58.00 = S/. 58.00
- Subtotal: S/. 148.00
- IGV (18%): S/. 26.64
- **Total: S/. 174.64**

## 📝 Notas de Desarrollo

### Posibles Mejoras Futuras
- [ ] Integración con backend real
- [ ] Panel de administrador
- [ ] Reportes avanzados
- [ ] Sistema de usuarios con roles
- [ ] Integración de pagos online
- [ ] Sincronización en tiempo real con WebSockets
- [ ] Inventario de productos
- [ ] Sistema de descuentos y promociones

### Archivos Originales vs V2
- Se corrigieron errores de sintaxis
- Se optimizó carga de módulos
- Se añadió mejor manejo de errores
- Los archivos v2 (productos-v2.js, carrito-v2.js, etc.) son la versión corregida y funcional

## 📞 Soporte

Si tienes dudas sobre cómo usar la aplicación:
1. Verifica que todos los archivos estén en la carpeta correcta
2. Limpia el caché del navegador (Ctrl+Shift+Delete)
3. Abre index.html directamente en el navegador
4. Revisa la consola del navegador para ver si hay errores (F12)

## 📄 Licencia

MIT License - Libre para usar y modificar

---

**Desarrollado con ❤️ usando JavaScript Vanilla**

*Sistema POS profesional para el Restaurante "Sabor a la Carta"*
