# Guía de Desarrollo y Mantenimiento

## 📚 Arquitectura de la Aplicación

### Estructura de Módulos

```
┌─────────────────────────────────────┐
│      HTML (index.html, cocina.html) │
└────────────┬────────────────────────┘
             │
┌────────────┴────────────────────────┐
│       JavaScript Modules             │
├──────────────────────────────────────┤
│ main.js      → Orquestación principal│
│ cocina.js    → Panel de cocina       │
│ productos.js → Gestión de productos  │
│ carrito.js   → Carrito de compras    │
│ pedidos.js   → Gestión de pedidos    │
│ mesas.js     → Gestión de mesas      │
│ utils.js     → Funciones compartidas │
└──────────────┬───────────────────────┘
               │
┌──────────────┴───────────────────────┐
│            Data Layer                │
├──────────────────────────────────────┤
│ LocalStorage (Persistencia)          │
│ JSON Files   (Datos iniciales)       │
└──────────────────────────────────────┘
```

### Event-Driven Architecture

La aplicación usa un patrón de eventos personalizado:

```javascript
// Lanzar evento
const evento = new CustomEvent('nombreEvento', {
  detail: { datos: 'aqui' }
});
document.dispatchEvent(evento);

// Escuchar evento
document.addEventListener('nombreEvento', (e) => {
  const datos = e.detail;
});
```

**Eventos principales:**
- `categoriaSeleccionada` - Cuando se selecciona una categoría
- `productoAgregado` - Cuando se agrega un producto al carrito
- `verDetallesProducto` - Cuando se abre el modal de detalles

---

## 🔄 Flujo de Datos

### 1. Carga Inicial

```
App Start
  ↓
Cargar Managers (Productos, Carrito, Pedidos, Mesas)
  ↓
Cargar archivos JSON
  ↓
Renderizar UI
  ↓
Configurar Event Listeners
  ↓
App Ready
```

### 2. Agregar Producto

```
Usuario hace clic "Agregar"
  ↓
Evento 'productoAgregado'
  ↓
CarritoManager.agregarProducto()
  ↓
Guardar en LocalStorage
  ↓
Notificar cambios a listeners
  ↓
Actualizar UI del carrito
```

### 3. Crear Pedido

```
Usuario hace clic "Revisar Pedido"
  ↓
Seleccionar Mesa
  ↓
Mostrar Resumen
  ↓
Confirmar Pedido
  ↓
PedidosManager.crearPedido()
  ↓
Guardar en LocalStorage
  ↓
Mostrar Gateway de Pago
  ↓
Procesar Pago
  ↓
Cambiar estado a 'en_preparacion'
```

---

## 🛠️ Guía de Extensión

### Agregar una nueva Categoría

1. Editar `data/categorias.json`:
```json
{
  "id": 7,
  "nombre": "Bebidas Alcohólicas",
  "icono": "🍾"
}
```

2. Los productos nuevos se cargarán automáticamente

### Agregar un nuevo Método de Pago

1. Editar la función `crearModalPago()` en `pedidos.js`
2. Agregar nuevo botón de método
3. Actualizar lógica de procesamiento

### Crear un nuevo Manager

```javascript
// js/nuevoManager.js

class NuevoManager {
  constructor() {
    this.datos = [];
  }

  inicializar() {
    // Cargar datos
  }

  metodo() {
    // Implementar
  }
}

let nuevoManager;
```

### Agregar nuevas funciones Utils

```javascript
// En js/utils.js

function nuevaFuncion(parametros) {
  // Implementación
  return resultado;
}
```

---

## 🎨 Personalización de Estilos

### Variables CSS

En `css/styles.css`, modificar `:root`:

```css
:root {
  --color-mostaza: #DAA520;        /* Color primario */
  --color-rojo-oscuro: #8B3A3A;   /* Color secundario */
  --shadow-suave: 0 2px 8px rgba(0, 0, 0, 0.1);
  /* ... más variables */
}
```

### Cambiar Color Principal

1. Editar `--color-mostaza` en `css/styles.css`
2. Todos los elementos se actualizarán automáticamente

### Agregar nuevos estilos

```css
/* En css/responsive.css o archivo nuevo */

.mi-clase {
  background: var(--color-mostaza);
  border-radius: 8px;
  transition: var(--transition);
}

.mi-clase:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-media);
}
```

---

## 🐛 Debugging

### Modo Debug

Habilitar en la consola del navegador:
```javascript
window.DEBUG_MODE = true;
```

### Funciones de Debug

```javascript
debug('Mensaje', datos);          // Log personalizado
logError(error, 'Contexto');      // Log de errores
logWarning('Mensaje', datos);     // Log de advertencias
```

### Inspeccionar LocalStorage

En la consola:
```javascript
// Ver carrito
localStorage.getItem('carrito_app');

// Ver pedidos
localStorage.getItem('pedidos_app');

// Ver todo
console.table(localStorage);

// Limpiar todo
localStorage.clear();
```

### Ver Managers

```javascript
console.log(categoriaManager);    // Manager de productos
console.log(carritoManager);      // Manager del carrito
console.log(pedidosManager);      // Manager de pedidos
console.log(mesasManager);        // Manager de mesas
```

---

## 📊 Testing

### Pruebas Manuales

1. **Agregar producto**
   - Verificar que aparece en el carrito
   - Verificar que se calcula el total

2. **Crear pedido**
   - Seleccionar mesa
   - Completar pedido
   - Verificar en cocina.html

3. **Cambiar estado**
   - En cocina.html, cambiar estado a "Listo"
   - Verificar sincronización

4. **Responsive**
   - F12 → Redimensionar viewport
   - Probar en móvil, tablet, desktop

---

## 🚀 Deploy

### Requisitos
- Servidor web (Apache, Nginx, etc.)
- Soporte para CORS si hay backend
- HTTPS recomendado para pagos reales

### Pasos de Deploy

1. Compilar/Minimizar (opcional)
   ```bash
   # Minimizar CSS
   csso css/*.css -o css/styles.min.css
   
   # Minimizar JS
   uglify-js js/*.js -o js/main.min.js
   ```

2. Subir archivos
   ```bash
   scp -r ./* usuario@servidor:/var/www/html/
   ```

3. Configurar servidor web (nginx):
   ```nginx
   server {
     listen 80;
     server_name saboralacarta.com;
     root /var/www/html;
     index index.html;
     
     location / {
       try_files $uri $uri/ /index.html;
     }
   }
   ```

4. Verificar funcionamiento
   - Abrir en navegador
   - Probar todas las funcionalidades

---

## 📝 Convenciones de Código

### Naming

```javascript
// Variables y funciones: camelCase
let miVariable = 'valor';
function miFunction() {}

// Clases: PascalCase
class MiClase {}

// Constantes: UPPER_SNAKE_CASE
const MI_CONSTANTE = 100;

// Data attributes: snake-case
data-producto-id="123"
```

### Comentarios

```javascript
/**
 * Descripción de la función
 * @param {tipo} parametro - Descripción del parámetro
 * @returns {tipo} - Descripción del retorno
 */
function miFunction(parametro) {
  // Comentario en línea para lógica compleja
  return resultado;
}
```

### Estructura de Archivos

```javascript
/**
 * NOMBRE DEL MÓDULO
 * Descripción breve
 */

// ========================================
// SECCIÓN 1
// ========================================

class NombreClase {
  // Método 1
  // Método 2
}

// ========================================
// SECCIÓN 2
// ========================================

function funcion1() {}
function funcion2() {}

// Variable global
let variableGlobal;
```

---

## 🔐 Seguridad

### Consideraciones

- Los datos se guardan localmente (cliente)
- No hay validación de backend
- Usar HTTPS en producción
- No almacenar información sensible en LocalStorage

### Para Producción

1. Agregar autenticación
2. Validar datos en backend
3. Usar base de datos segura
4. Implementar logging
5. Monitorear errores

---

## 📞 Soporte y Contacto

Para preguntas sobre desarrollo, contacta al equipo técnico.

---

**Último actualizado:** 2024
**Mantener actualizado y comentado** 📝
