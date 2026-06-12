/**
 * UTILIDADES GENERALES
 * Funciones compartidas para toda la aplicación
 */

// ========================================
// GESTIÓN DE DATOS EN LOCALSTORAGE
// ========================================

/**
 * Guarda datos en localStorage
 */
function guardarEnLocalStorage(clave, datos) {
  try {
    localStorage.setItem(clave, JSON.stringify(datos));
    return true;
  } catch (error) {
    console.error('Error al guardar en localStorage:', error);
    return false;
  }
}

/**
 * Obtiene datos de localStorage
 */
function obtenerDelLocalStorage(clave, valorPorDefecto = null) {
  try {
    const datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos) : valorPorDefecto;
  } catch (error) {
    console.error('Error al obtener de localStorage:', error);
    return valorPorDefecto;
  }
}

/**
 * Elimina datos de localStorage
 */
function eliminarDelLocalStorage(clave) {
  try {
    localStorage.removeItem(clave);
    return true;
  } catch (error) {
    console.error('Error al eliminar de localStorage:', error);
    return false;
  }
}

/**
 * Limpia todo el localStorage
 */
function limpiarLocalStorage() {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error al limpiar localStorage:', error);
    return false;
  }
}

// ========================================
// NOTIFICACIONES (TOAST)
// ========================================

/**
 * Muestra una notificación toast
 */
function mostrarToast(titulo, mensaje = '', tipo = 'info', duracion = 3000) {
  // Obtener o crear contenedor de toasts
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Crear el toast
  const toast = document.createElement('div');
  toast.className = `toast ${tipo} animate-slideInRight`;

  const iconos = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  };

  toast.innerHTML = `
    <div class="toast-icon">${iconos[tipo]}</div>
    <div class="toast-content">
      <p class="toast-titulo">${titulo}</p>
      ${mensaje ? `<p class="toast-mensaje">${mensaje}</p>` : ''}
    </div>
    <button class="toast-close">✕</button>
    <div class="toast-progress"></div>
  `;

  // Agregar al contenedor
  container.appendChild(toast);

  // Botón de cerrar
  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.remove();
  });

  // Auto-remover después de la duración
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, duracion);

  return toast;
}

// ========================================
// PETICIONES HTTP
// ========================================

/**
 * Realiza una petición GET
 */
async function fetchDatos(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener datos:', error);
    mostrarToast('Error', 'No se pudieron cargar los datos', 'error');
    return null;
  }
}

// ========================================
// FORMATEO DE DATOS
// ========================================

/**
 * Formatea un número como moneda
 */
function formatearMoneda(valor) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(valor);
}

/**
 * Formatea una fecha
 */
function formatearFecha(fecha) {
  if (typeof fecha === 'string') {
    fecha = new Date(fecha);
  }
  return fecha.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formatea una hora
 */
function formatearHora(fecha) {
  if (typeof fecha === 'string') {
    fecha = new Date(fecha);
  }
  return fecha.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Formatea fecha y hora juntas
 */
function formatearFechaHora(fecha) {
  if (typeof fecha === 'string') {
    fecha = new Date(fecha);
  }
  return `${formatearFecha(fecha)} ${formatearHora(fecha)}`;
}

// ========================================
// MANIPULACIÓN DEL DOM
// ========================================

/**
 * Crea un elemento HTML con atributos
 */
function crearElemento(tag, atributos = {}, contenido = '') {
  const elemento = document.createElement(tag);
  
  Object.entries(atributos).forEach(([clave, valor]) => {
    if (clave === 'class') {
      elemento.className = valor;
    } else if (clave === 'style') {
      elemento.setAttribute('style', valor);
    } else if (clave.startsWith('data-')) {
      elemento.setAttribute(clave, valor);
    } else {
      elemento[clave] = valor;
    }
  });

  if (contenido) {
    if (typeof contenido === 'string') {
      elemento.innerHTML = contenido;
    } else if (contenido instanceof HTMLElement) {
      elemento.appendChild(contenido);
    } else if (Array.isArray(contenido)) {
      contenido.forEach(item => {
        if (item instanceof HTMLElement) {
          elemento.appendChild(item);
        } else if (typeof item === 'string') {
          elemento.innerHTML += item;
        }
      });
    }
  }

  return elemento;
}

/**
 * Muestra un elemento
 */
function mostrarElemento(selector) {
  const elemento = typeof selector === 'string' 
    ? document.querySelector(selector) 
    : selector;
  
  if (elemento) {
    elemento.style.display = '';
    elemento.classList.remove('hidden');
  }
}

/**
 * Oculta un elemento
 */
function ocultarElemento(selector) {
  const elemento = typeof selector === 'string' 
    ? document.querySelector(selector) 
    : selector;
  
  if (elemento) {
    elemento.classList.add('hidden');
  }
}

/**
 * Alterna la visibilidad de un elemento
 */
function alternarElemento(selector) {
  const elemento = typeof selector === 'string' 
    ? document.querySelector(selector) 
    : selector;
  
  if (elemento) {
    if (elemento.classList.contains('hidden')) {
      mostrarElemento(elemento);
    } else {
      ocultarElemento(elemento);
    }
  }
}

// ========================================
// MANEJO DE MODALES
// ========================================

/**
 * Abre un modal
 */
function abrirModal(contenido, titulo = '') {
  let modal = document.querySelector('.modal-overlay');
  
  if (!modal) {
    modal = crearElemento('div', { class: 'modal-overlay' });
    document.body.appendChild(modal);
  }

  const modalContent = crearElemento('div', { class: 'modal' });

  if (titulo) {
    const header = crearElemento('div', { class: 'modal-header' });
    const h2 = crearElemento('h2', {}, titulo);
    const closeBtn = crearElemento('button', { class: 'modal-close' }, '×');
    
    closeBtn.addEventListener('click', () => cerrarModal());
    header.appendChild(h2);
    header.appendChild(closeBtn);
    modalContent.appendChild(header);
  }

  const body = crearElemento('div', { class: 'modal-body' });
  if (typeof contenido === 'string') {
    body.innerHTML = contenido;
  } else {
    body.appendChild(contenido);
  }
  modalContent.appendChild(body);

  modal.innerHTML = '';
  modal.appendChild(modalContent);
  modal.classList.remove('hidden');

  // Cerrar al hacer clic fuera del modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      cerrarModal();
    }
  });
}

/**
 * Cierra el modal
 */
function cerrarModal() {
  const modal = document.querySelector('.modal-overlay');
  if (modal) {
    modal.classList.add('hidden');
  }
}

// ========================================
// VALIDACIONES
// ========================================

/**
 * Valida que un email sea válido
 */
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida que un teléfono sea válido (Perú)
 */
function validarTelefono(telefono) {
  const regex = /^9\d{8}$/;
  return regex.test(telefono.replace(/\s/g, ''));
}

/**
 * Valida que un campo no esté vacío
 */
function validarCampoRequerido(valor) {
  return valor && valor.trim() !== '';
}

// ========================================
// ANIMACIONES
// ========================================

/**
 * Agrega una clase de animación y la remueve después
 */
function animar(elemento, clase, duracion = 300) {
  return new Promise((resolve) => {
    elemento.classList.add(clase);
    setTimeout(() => {
      elemento.classList.remove(clase);
      resolve();
    }, duracion);
  });
}

/**
 * Habilita o deshabilita un botón
 */
function habilitarBoton(selector, habilitar = true) {
  const boton = typeof selector === 'string' 
    ? document.querySelector(selector) 
    : selector;
  
  if (boton) {
    boton.disabled = !habilitar;
    if (habilitar) {
      boton.style.opacity = '1';
      boton.style.cursor = 'pointer';
    } else {
      boton.style.opacity = '0.6';
      boton.style.cursor = 'not-allowed';
    }
  }
}

// ========================================
// DEBUGGING
// ========================================

/**
 * Registra información en la consola (solo en desarrollo)
 */
function debug(mensaje, datos = null) {
  if (process.env.NODE_ENV !== 'production' || window.DEBUG_MODE) {
    console.log(`[DEBUG] ${mensaje}`, datos || '');
  }
}

/**
 * Registra un error
 */
function logError(error, contexto = '') {
  console.error(`[ERROR] ${contexto}`, error);
}

/**
 * Registra una advertencia
 */
function logWarning(mensaje, datos = null) {
  console.warn(`[WARNING] ${mensaje}`, datos || '');
}
