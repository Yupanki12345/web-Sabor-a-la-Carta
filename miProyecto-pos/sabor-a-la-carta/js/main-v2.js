/**
 * INICIALIZACIÓN PRINCIPAL
 */

async function inicializarApp() {
  try {
    console.log("Iniciando aplicación...");

    // Crear managers
    window.categoriaManager = new ProductosManager();
    window.carritoManager = new CarritoManager();
    window.pedidosManager = new PedidosManager();
    window.mesasManager = new MesasManager();

    // Inicializar datos
    await window.categoriaManager.inicializar();
    await window.mesasManager.inicializar();

    console.log("Managers inicializados correctamente");

    // Renderizar interfaz completa
    renderizarInterfazCompleta();

    console.log("Aplicación iniciada correctamente");
  } catch (error) {
    console.error("Error iniciando aplicación:", error);
    mostrarToast("Error", "Error al iniciar la aplicación", "error");
  }
}

function renderizarInterfazCompleta() {
  // Limpiar el body
  document.body.innerHTML = "";

  const { categoriaManager, carritoManager, mesasManager } = window;

  // Crear header
  const header = document.createElement("header");
  header.style.cssText = `
    background: white;
    padding: 1rem 2rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;
  header.innerHTML = `
    <div style="font-size: 1.5rem; font-weight: 700;">
      🍽️ <span style="color: #DAA520;">Sabor</span> a la Carta
    </div>
    <div style="flex: 1; text-align: center; margin: 0 2rem;">
      <h2 style="margin: 0; font-size: 1.2rem;">Sistema de Gestión de Restaurante</h2>
    </div>
    <div style="display: flex; align-items: center; gap: 1rem;">
      <button id="btnCarrito" style="
        background: #DAA520;
        color: white;
        border: none;
        padding: 0.5rem 1.5rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
      ">
        🛒 Carrito (<span id="cantCarrito">0</span>)
      </button>
    </div>
  `;
  document.body.appendChild(header);

  // Crear main content
  const main = document.createElement("main");
  main.style.cssText = `
    display: flex;
    gap: 2rem;
    padding: 2rem;
    background: #F5F1E8;
    flex: 1;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  `;

  // Sidebar de categorías
  const sidebar = document.createElement("aside");
  sidebar.style.cssText = `
    width: 220px;
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    height: fit-content;
  `;

  let categoriaHTML =
    '<h3 style="margin: 0 0 1rem 0; color: #8B3A3A;">CATEGORÍAS</h3>';
  categoriaHTML +=
    '<button class="cat-btn" data-cat="all" style="width: 100%; padding: 0.7rem; margin: 0.5rem 0; background: #DAA520; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">📋 Todos</button>';

  categoriaManager.obtenerCategorias().forEach((cat) => {
    categoriaHTML += `
      <button class="cat-btn" data-cat="${cat.id}" style="
        width: 100%;
        padding: 0.7rem;
        margin: 0.5rem 0;
        background: white;
        color: #333;
        border: 2px solid #DAA520;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s;
      ">
        ${cat.icono} ${cat.nombre}
      </button>
    `;
  });

  sidebar.innerHTML = categoriaHTML;
  main.appendChild(sidebar);

  // Área principal
  const contentArea = document.createElement("div");
  contentArea.style.cssText = `
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  `;

  // Grid de productos
  const productosGrid = document.createElement("div");
  productosGrid.id = "productosGrid";
  productosGrid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  `;

  // Renderizar todos los productos inicialmente
  const productos = categoriaManager.obtenerTodos();
  productos.forEach((producto) => {
    const card = crearProductoCard(producto);
    productosGrid.appendChild(card);
  });

  contentArea.appendChild(productosGrid);
  main.appendChild(contentArea);

  document.body.appendChild(main);

  // Crear footer
  const footer = document.createElement("footer");
  footer.style.cssText = `
    background: #8B3A3A;
    color: white;
    text-align: center;
    padding: 2rem;
    margin-top: auto;
  `;
  footer.innerHTML = `
    <p style="margin: 0;">© 2024 Sabor a la Carta - Sistema de Gestión de Restaurante</p>
    <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; opacity: 0.9;">Desarrollado con JavaScript Vanilla y LocalStorage</p>
  `;
  document.body.appendChild(footer);

  // Ajustar estilos del body
  document.body.style.cssText = `
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #F5F1E8;
  `;

  // Event listeners para categorías
  document.querySelectorAll(".cat-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".cat-btn").forEach((b) => {
        b.style.background = b === btn ? "#DAA520" : "white";
        b.style.color = b === btn ? "white" : "#333";
      });

      const catId = parseInt(btn.dataset.cat);
      let productosAMostrar;

      if (catId === "all" || isNaN(catId)) {
        productosAMostrar = categoriaManager.obtenerTodos();
      } else {
        productosAMostrar = categoriaManager.filtrarPorCategoria(catId);
      }

      // Actualizar grid
      productosGrid.innerHTML = "";
      productosAMostrar.forEach((producto) => {
        const card = crearProductoCard(producto);
        productosGrid.appendChild(card);
      });
    });
  });

  // Event listener para botón del carrito
  document
    .getElementById("btnCarrito")
    .addEventListener("click", mostrarModalCarrito);

  // Actualizar contador del carrito
  document.getElementById("cantCarrito").textContent =
    carritoManager.obtenerItems().length;
}

function crearProductoCard(producto) {
  const card = document.createElement("div");
  card.style.cssText = `
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;
    display: flex;
    flex-direction: column;
  `;

  card.onmouseover = () => {
    card.style.transform = "translateY(-5px)";
    card.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)";
  };

  card.onmouseout = () => {
    card.style.transform = "translateY(0)";
    card.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
  };

  card.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.onerror=null; this.src='data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect width=%22300%22 height=%22200%22 fill=%22%23f0f0f0%22/%3E%3Ctext x=%22150%22 y=%22105%22 font-size=%2220%22 text-anchor=%22middle%22 fill=%22%23888888%22%3EImagen%20no%20disponible%3C/text%3E%3C/svg%3E'" style="width: 100%; height: 180px; object-fit: cover; background: #f0f0f0;">
    <div style="padding: 1rem; display: flex; flex-direction: column; gap: 0.8rem; flex: 1;">
      <h4 style="margin: 0; color: #8B3A3A; font-size: 1rem;">${producto.nombre}</h4>
      <p style="margin: 0; color: #999; font-size: 0.85rem; line-height: 1.4;">${producto.descripcion}</p>
      <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: 700; color: #DAA520; font-size: 1.2rem;">S/. ${producto.precio.toFixed(2)}</span>
        <button class="btn-agregar" data-id="${producto.id}" style="
          background: #DAA520;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.85rem;
        ">+ Agregar</button>
      </div>
    </div>
  `;

  const btn = card.querySelector(".btn-agregar");
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const productoId = parseInt(btn.dataset.id);
    const prod = window.categoriaManager.obtenerProducto(productoId);

    if (prod) {
      window.carritoManager.agregarProducto(prod, 1);
      document.getElementById("cantCarrito").textContent =
        window.carritoManager.obtenerItems().length;

      // Mostrar feedback
      const originalText = btn.textContent;
      btn.textContent = "✓ Agregado";
      btn.style.background = "#27AE60";
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "#DAA520";
      }, 1500);
    }
  });

  return card;
}

function mostrarModalCarrito() {
  const { carritoManager } = window;

  const modal = document.createElement("div");
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;

  const items = carritoManager.obtenerItems();
  let itemsHTML = "";

  items.forEach((item) => {
    itemsHTML += `
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #eee;
      ">
        <div style="flex: 1;">
          <p style="margin: 0; font-weight: 600; color: #333;">${item.nombre}</p>
          <p style="margin: 0.3rem 0 0 0; color: #999; font-size: 0.9rem;">Cantidad: ${item.cantidad} x S/. ${item.precio.toFixed(2)}</p>
        </div>
        <p style="margin: 0; font-weight: 700; color: #DAA520;">S/. ${item.subtotal.toFixed(2)}</p>
      </div>
    `;
  });

  const subtotal = carritoManager.calcularSubtotal();
  const impuesto = carritoManager.calcularImpuesto();
  const total = carritoManager.calcularTotal();

  const content = document.createElement("div");
  content.style.cssText = `
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  `;

  content.innerHTML = `
    <div style="padding: 2rem; border-bottom: 2px solid #DAA520;">
      <h2 style="margin: 0; color: #8B3A3A;">🛒 Tu Carrito</h2>
    </div>

    <div style="padding: 1rem; max-height: 400px; overflow-y: auto;">
      ${itemsHTML || '<p style="text-align: center; padding: 2rem; color: #999;">El carrito está vacío</p>'}
    </div>

    <div style="background: #F5F1E8; padding: 1.5rem; border-top: 2px solid #eee;">
      <div style="display: flex; justify-content: space-between; margin: 0.5rem 0;">
        <span>Subtotal:</span>
        <span style="font-weight: 600;">S/. ${subtotal.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 0.5rem 0; color: #DAA520;">
        <span>IGV (18%):</span>
        <span style="font-weight: 600;">S/. ${impuesto.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 1rem 0; font-size: 1.2rem; font-weight: 700; color: #8B3A3A;">
        <span>Total:</span>
        <span>S/. ${total.toFixed(2)}</span>
      </div>

      <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
        <button id="btnCerrar" style="
          flex: 1;
          padding: 0.8rem;
          background: #999;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        ">Cerrar</button>
        <button id="btnPagar" style="
          flex: 1;
          padding: 0.8rem;
          background: #DAA520;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        ">💳 Proceder al Pago</button>
      </div>
    </div>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);

  document.getElementById("btnCerrar").addEventListener("click", () => {
    modal.remove();
  });

  document.getElementById("btnPagar").addEventListener("click", () => {
    modal.remove();
    mostrarModalSeleccionarMesa();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarApp);
} else {
  inicializarApp();
}

// ===== FUNCIONES DEL FLUJO DE PAGO =====

function mostrarModalSeleccionarMesa() {
  const { mesasManager, carritoManager } = window;

  const modal = document.createElement("div");
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;

  const mesasDisponibles = mesasManager.obtenerDisponibles();

  let mesasHTML = "";
  mesasDisponibles.forEach((mesa) => {
    mesasHTML += `
      <button class="btn-mesa" data-mesa="${mesa.numero}" style="
        padding: 1.5rem;
        background: white;
        border: 2px solid #DAA520;
        border-radius: 8px;
        cursor: pointer;
        text-align: center;
        transition: all 0.3s;
        font-weight: 600;
        color: #8B3A3A;
      ">
        📍 Mesa ${mesa.numero}
        <div style="font-size: 0.85rem; color: #999; margin-top: 0.5rem;">
          ${mesa.asientos} asientos
        </div>
      </button>
    `;
  });

  const content = document.createElement("div");
  content.style.cssText = `
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    padding: 2rem;
  `;

  content.innerHTML = `
    <h2 style="margin: 0 0 1rem 0; color: #8B3A3A;">📍 Seleccionar Mesa</h2>
    <p style="color: #999; margin: 0 0 1.5rem 0;">Elige una mesa disponible para este pedido</p>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
      ${mesasHTML}
    </div>

    <div style="display: flex; gap: 1rem;">
      <button id="btnCancelarMesa" style="
        flex: 1;
        padding: 0.8rem;
        background: #999;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
      ">Cancelar</button>
    </div>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);

  // Event listeners para botones de mesas
  document.querySelectorAll(".btn-mesa").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mesaId = parseInt(btn.dataset.mesa);

      // Guardar referencia para el pago, pero no ocupar la mesa hasta que el pago sea confirmado
      window.mesaSeleccionadaId = mesaId;

      modal.remove();
      mostrarModalMetodoPago();
    });

    btn.addEventListener("mouseover", () => {
      btn.style.background = "#DAA520";
      btn.style.color = "white";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.background = "white";
      btn.style.color = "#8B3A3A";
    });
  });

  document.getElementById("btnCancelarMesa").addEventListener("click", () => {
    window.mesaSeleccionadaId = null;
    modal.remove();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

function mostrarModalMetodoPago() {
  const { carritoManager } = window;

  const modal = document.createElement("div");
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;

  const metodosPago = [
    { id: "efectivo", nombre: "Efectivo", icono: "💵" },
    { id: "yape", nombre: "Yape", icono: "📱" },
    { id: "plin", nombre: "Plin", icono: "📱" },
    { id: "tarjeta", nombre: "Tarjeta", icono: "💳" },
  ];

  let metodosHTML = "";
  metodosPago.forEach((metodo) => {
    metodosHTML += `
      <button class="btn-metodo" data-metodo="${metodo.id}" style="
        padding: 1.5rem;
        background: white;
        border: 2px solid #DAA520;
        border-radius: 8px;
        cursor: pointer;
        text-align: center;
        transition: all 0.3s;
        font-weight: 600;
        color: #8B3A3A;
      ">
        ${metodo.icono} ${metodo.nombre}
      </button>
    `;
  });

  const subtotal = carritoManager.calcularSubtotal();
  const impuesto = carritoManager.calcularImpuesto();
  const total = carritoManager.calcularTotal();

  const content = document.createElement("div");
  content.style.cssText = `
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    padding: 2rem;
  `;

  content.innerHTML = `
    <h2 style="margin: 0 0 1rem 0; color: #8B3A3A;">💳 Método de Pago</h2>
    <p style="color: #999; margin: 0 0 1.5rem 0;">Selecciona cómo deseas pagar</p>

    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem;">
      ${metodosHTML}
    </div>

    <div style="background: #F5F1E8; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
      <div style="display: flex; justify-content: space-between; margin: 0.5rem 0;">
        <span>Subtotal:</span>
        <span style="font-weight: 600;">S/. ${subtotal.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 0.5rem 0; color: #DAA520;">
        <span>IGV (18%):</span>
        <span style="font-weight: 600;">S/. ${impuesto.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 0.5rem 0; font-size: 1.1rem; font-weight: 700; color: #8B3A3A;">
        <span>Total:</span>
        <span>S/. ${total.toFixed(2)}</span>
      </div>
    </div>

    <div style="display: flex; gap: 1rem;">
      <button id="btnCancelarPago" style="
        flex: 1;
        padding: 0.8rem;
        background: #999;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
      ">Cancelar</button>
    </div>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);

  // Event listeners para métodos de pago
  document.querySelectorAll(".btn-metodo").forEach((btn) => {
    btn.addEventListener("click", () => {
      const metodoPago = btn.dataset.metodo;

      modal.remove();
      if (metodoPago === "tarjeta") {
        mostrarModalPagoTarjeta();
      } else {
        procesarPago(metodoPago);
      }
    });

    btn.addEventListener("mouseover", () => {
      btn.style.background = "#DAA520";
      btn.style.color = "white";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.background = "white";
      btn.style.color = "#8B3A3A";
    });
  });

  document.getElementById("btnCancelarPago").addEventListener("click", () => {
    window.mesaSeleccionadaId = null;
    modal.remove();
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      window.mesaSeleccionadaId = null;
      modal.remove();
    }
  });
}

function procesarPago(metodoPago, tarjetaInfo = null) {
  const { carritoManager, pedidosManager, mesasManager } = window;

  const items = carritoManager.obtenerItems();
  const subtotal = carritoManager.calcularSubtotal();
  const impuesto = carritoManager.calcularImpuesto();
  const total = carritoManager.calcularTotal();
  const mesaId = window.mesaSeleccionadaId;

  if (items.length === 0) {
    mostrarToast("Error", "El carrito está vacío", "error");
    return;
  }

  if (!mesaId) {
    mostrarToast("Error", "Debes seleccionar una mesa", "error");
    return;
  }

  if (metodoPago === "tarjeta" && !tarjetaInfo) {
    mostrarToast(
      "Error",
      "Completa los datos de tarjeta antes de pagar",
      "error",
    );
    return;
  }

  // Crear pedido
  const pedido = pedidosManager.crearPedido(
    mesaId,
    items,
    total,
    subtotal,
    impuesto,
    metodoPago,
    metodoPago === "tarjeta"
      ? { tarjetaUltimos4: tarjetaInfo.numero.slice(-4) }
      : null,
  );

  // Marcar mesa como ocupada solo después de confirmar el pago
  mesasManager.seleccionarMesa(mesaId);

  // Vaciar carrito
  carritoManager.vaciar();

  // Actualizar contador
  document.getElementById("cantCarrito").textContent = "0";

  // Limpiar selección de mesa para el siguiente pedido
  window.mesaSeleccionadaId = null;

  // Mostrar modal de confirmación
  mostrarModalConfirmacionPago(pedido, metodoPago, mesaId);
}

function mostrarModalPagoTarjeta() {
  const modal = document.createElement("div");
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;

  const content = document.createElement("div");
  content.style.cssText = `
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    padding: 2rem;
  `;

  content.innerHTML = `
    <h2 style="margin: 0 0 1rem 0; color: #8B3A3A;">💳 Pago con Tarjeta</h2>
    <p style="color: #999; margin: 0 0 1.5rem 0;">Completa los datos de tu tarjeta para procesar el pago.</p>
    <div style="display: grid; gap: 1rem; margin-bottom: 1rem;">
      <input id="inputTitular" type="text" placeholder="Nombre en la tarjeta" style="padding: 0.9rem; border: 1px solid #ddd; border-radius: 8px; width: 100%;" />
      <input id="inputNumeroTarjeta" type="text" inputmode="numeric" maxlength="19" placeholder="Número de tarjeta (16 dígitos)" style="padding: 0.9rem; border: 1px solid #ddd; border-radius: 8px; width: 100%;" />
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <input id="inputVencimiento" type="text" maxlength="5" placeholder="MM/AA" style="padding: 0.9rem; border: 1px solid #ddd; border-radius: 8px; width: 100%;" />
        <input id="inputCVV" type="password" maxlength="3" placeholder="CVV" style="padding: 0.9rem; border: 1px solid #ddd; border-radius: 8px; width: 100%;" />
      </div>
    </div>
    <div style="display: flex; gap: 1rem;">
      <button id="btnCancelarTarjeta" style="
        flex: 1;
        padding: 0.8rem;
        background: #999;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
      ">Cancelar</button>
      <button id="btnPagarTarjeta" style="
        flex: 1;
        padding: 0.8rem;
        background: #DAA520;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
      ">Pagar</button>
    </div>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);

  document
    .getElementById("btnCancelarTarjeta")
    .addEventListener("click", () => {
      window.mesaSeleccionadaId = null;
      modal.remove();
    });

  document.getElementById("btnPagarTarjeta").addEventListener("click", () => {
    const titular = document.getElementById("inputTitular").value.trim();
    const numero = document
      .getElementById("inputNumeroTarjeta")
      .value.replace(/\s+/g, "");
    const vencimiento = document
      .getElementById("inputVencimiento")
      .value.trim();
    const cvv = document.getElementById("inputCVV").value.trim();

    const numeroValido = /^\d{16}$/.test(numero);
    const vencimientoValido = /^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(vencimiento);
    const cvvValido = /^\d{3}$/.test(cvv);

    if (!titular || !numeroValido || !vencimientoValido || !cvvValido) {
      mostrarToast(
        "Error",
        "Completa los datos de tarjeta correctamente",
        "error",
      );
      return;
    }

    modal.remove();
    procesarPago("tarjeta", { titular, numero, vencimiento, cvv });
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      window.mesaSeleccionadaId = null;
      modal.remove();
    }
  });
}

function mostrarModalConfirmacionPago(pedido, metodoPago, mesaId) {
  const modal = document.createElement("div");
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;

  const methodLabel = {
    efectivo: "Efectivo 💵",
    yape: "Yape 📱",
    plin: "Plin 📱",
    tarjeta: "Tarjeta 💳",
  };

  const itemsHTML = pedido.items
    .map(
      (item) => `
      <div style="display: flex; justify-content: space-between; margin: 0.5rem 0;">
        <span>${item.cantidad} x ${item.nombre}</span>
        <span>S/. ${item.subtotal.toFixed(2)}</span>
      </div>
    `,
    )
    .join("");

  const content = document.createElement("div");
  content.style.cssText = `
    background: white;
    border-radius: 16px;
    width: 90%;
    max-width: 520px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    padding: 1.5rem;
    text-align: left;
  `;

  content.innerHTML = `
    <div style="text-align: center; margin-bottom: 1rem;">
      <div style="font-size: 2.5rem;">🧾</div>
      <h2 style="margin: 0.5rem 0 0 0; color: #8B3A3A;">Boleta de Pago</h2>
    </div>

    <div style="background: #F5F1E8; padding: 1rem; border-radius: 12px; margin-bottom: 1rem;">
      <p style="margin: 0.4rem 0;"><strong>ID Pedido:</strong> ${pedido.id}</p>
      <p style="margin: 0.4rem 0;"><strong>Mesa:</strong> Mesa #${mesaId}</p>
      <p style="margin: 0.4rem 0;"><strong>Fecha:</strong> ${new Date(pedido.fechaCreacion).toLocaleString("es-PE")}</p>
      <p style="margin: 0.4rem 0;"><strong>Método:</strong> ${methodLabel[metodoPago]}</p>
      ${metodoPago === "tarjeta" && pedido.pagoTarjeta ? `<p style="margin: 0.4rem 0;"><strong>Tarjeta:</strong> **** **** **** ${pedido.pagoTarjeta.tarjetaUltimos4}</p>` : ""}
    </div>

    <div style="border-top: 2px dashed #DAA520; border-bottom: 2px dashed #DAA520; padding: 1rem 0; margin-bottom: 1rem;">
      ${itemsHTML}
    </div>

    <div style="background: #F5F1E8; padding: 1rem; border-radius: 12px; margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span>Subtotal</span><span>S/. ${pedido.subtotal.toFixed(2)}</span></div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span>IGV (18%)</span><span>S/. ${pedido.impuesto.toFixed(2)}</span></div>
      <div style="display: flex; justify-content: space-between; font-weight: 700; color: #8B3A3A;"><span>Total</span><span>S/. ${pedido.total.toFixed(2)}</span></div>
    </div>

    <p style="color: #999; font-size: 0.95rem; margin: 0 0 1rem 0;">
      Esta boleta es comprobante de pago. El pedido se ha registrado correctamente y se encuentra en preparación.
    </p>

    <div style="display: flex; gap: 1rem; margin-top: 1rem;">
      <button id="btnVolverCarrito" style="
        flex: 1;
        padding: 0.8rem;
        background: #DAA520;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
      ">Volver al Menú</button>
      <button id="btnVerPedidos" style="
        flex: 1;
        padding: 0.8rem;
        background: #8B3A3A;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
      ">Ver Pedidos</button>
    </div>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);

  document.getElementById("btnVolverCarrito").addEventListener("click", () => {
    modal.remove();
  });

  document.getElementById("btnVerPedidos").addEventListener("click", () => {
    modal.remove();
    mostrarModalPedidos();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      // No permitir cerrar haciendo click afuera
    }
  });
}

function mostrarModalPedidos() {
  const { pedidosManager } = window;

  const modal = document.createElement("div");
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;

  const pedidos = pedidosManager.obtenerTodos();
  const stats = pedidosManager.calcularEstadisticas();

  const methodLabel = {
    efectivo: "Efectivo 💵",
    yape: "Yape 📱",
    plin: "Plin 📱",
    tarjeta: "Tarjeta 💳",
  };

  let pedidosHTML = "";
  pedidos.reverse().forEach((pedido) => {
    const estadoColor = {
      pendiente: "#FF9800",
      en_preparacion: "#2196F3",
      listo: "#4CAF50",
      entregado: "#9E9E9E",
    };

    const fechaCreacion = new Date(pedido.fechaCreacion).toLocaleTimeString(
      "es-ES",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      },
    );

    pedidosHTML += `
      <div style="
        padding: 1rem;
        border: 2px solid #DAA520;
        border-radius: 8px;
        margin-bottom: 0.5rem;
        background: white;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <strong style="color: #8B3A3A;">Mesa #${pedido.numeroMesa}</strong>
          <span style="
            background: ${estadoColor[pedido.estado] || "#999"};
            color: white;
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
          ">${pedido.estado.toUpperCase()}</span>
        </div>
        <p style="margin: 0.3rem 0; font-size: 0.9rem; color: #999;">
          Pedido ID: ${pedido.id} | ${fechaCreacion}
        </p>
        <p style="margin: 0.3rem 0; font-size: 0.9rem;">
          ${pedido.items.length} item(s) - <strong style="color: #DAA520;">S/. ${pedido.total.toFixed(2)}</strong>
        </p>
        <p style="margin: 0.3rem 0; font-size: 0.9rem; color: #8B3A3A;">
          Método: ${pedido.metodoPago ? methodLabel[pedido.metodoPago] : "N/A"}
        </p>
      </div>
    `;
  });

  const content = document.createElement("div");
  content.style.cssText = `
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    padding: 2rem;
  `;

  content.innerHTML = `
    <h2 style="margin: 0 0 1rem 0; color: #8B3A3A;">📋 Mis Pedidos</h2>
    
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
      <div style="background: #F5F1E8; padding: 1rem; border-radius: 8px; text-align: center;">
        <p style="margin: 0; font-size: 1.5rem; font-weight: 700; color: #8B3A3A;">${stats.total}</p>
        <p style="margin: 0.3rem 0 0 0; color: #999; font-size: 0.9rem;">Total Pedidos</p>
      </div>
      <div style="background: #F5F1E8; padding: 1rem; border-radius: 8px; text-align: center;">
        <p style="margin: 0; font-size: 1.5rem; font-weight: 700; color: #2196F3;">${stats.activos}</p>
        <p style="margin: 0.3rem 0 0 0; color: #999; font-size: 0.9rem;">Activos</p>
      </div>
      <div style="background: #F5F1E8; padding: 1rem; border-radius: 8px; text-align: center;">
        <p style="margin: 0; font-size: 1.5rem; font-weight: 700; color: #4CAF50;">${stats.entregados}</p>
        <p style="margin: 0.3rem 0 0 0; color: #999; font-size: 0.9rem;">Entregados</p>
      </div>
    </div>

    <div style="max-height: 400px; overflow-y: auto; margin-bottom: 1.5rem;">
      ${pedidosHTML || '<p style="text-align: center; padding: 2rem; color: #999;">No hay pedidos aún</p>'}
    </div>

    <button id="btnCerrarPedidos" style="
      width: 100%;
      padding: 0.8rem;
      background: #DAA520;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    ">Cerrar</button>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);

  document.getElementById("btnCerrarPedidos").addEventListener("click", () => {
    modal.remove();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// ===== FIN DEL FLUJO DE PAGO =====
