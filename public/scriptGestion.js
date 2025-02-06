// Conexión con el servidor
const socket = io();

// Selección de elementos del DOM
const mesasContainer = document.getElementById("mesas-container");
const menuContainer = document.getElementById("menu-container");
const mesaIdElement = document.getElementById("mesa-id");
const platosList = document.getElementById("platos-list");
const menuList = document.getElementById("menu-list");
const btnCerrarMenu = document.getElementById("cerrar-menu");
const btnOcupado = document.getElementById("btn-ocupado");
const btnDisponible = document.getElementById("btn-disponible");
const btnConfirmarPago = document.getElementById("confirmar-pago");
const ventasContainer = document.getElementById("ventas-container");
const ventasList = document.getElementById("ventas-list");
const totalVentasAmount = document.getElementById("total-ventas-amount");
const btnLimpiarHistorial = document.getElementById("limpiar-historial");
const btnLogout = document.getElementById("logout-button");

// Datos iniciales
const platosMenu = {
  Platos_Anticucheria: {
    Platos_CHICOS: [
      { nombre: "Porción de pancita", precio: 13 },
      { nombre: "Porción de anticucho", precio: 13 },
      { nombre: "Porción de rachi", precio: 15 },
    ],
    Platos_CHICOS_CHOCLO: [
      { nombre: "Porción de pancita + choclo", precio: 13.5 },
      { nombre: "Porción de anticucho + choclo", precio: 13.5 },
      { nombre: "Porción de rachi + choclo", precio: 15.5 },
    ],
    Platos_MIXTOS: [
      { nombre: "Pollo a la parrilla", precio: 15 },
      { nombre: "rachi + Mollejita + choclo", precio: 20 },
    ],
  },

  Platos_Comidas: {
    Platos_CARTA: [
      { nombre: "LOMO DE CARNE", precio: 13 },
      { nombre: "SALTADO DE POLLO", precio: 12 },
    ],
    Platos_CHAUFA: [
      { nombre: "CHAUFA DE POLLO", precio: 10 },
      { nombre: "CHAUFA DE CARNE", precio: 11 },
    ],
    Platos_BROASTER: [
      { nombre: "ALITA + ARROZ + PAPA", precio: 9 },
      { nombre: "ALITA + PAPA", precio: 9 },
    ],
  },

  Bebidas: {
    BEBIDAS_M: [
      { nombre: "personal Inka", precio: 2.5 },
      { nombre: "Personal coka kola", precio: 2.5 },
    ],
    BEBIDAS_TIO: [
      { nombre: "1 Lt Chicha", precio: 7 },
      { nombre: "1/2 Lt Chicha", precio: 3.5 },
    ],
  }
};

let mesas = []; // Recibido desde el servidor
let ventas = []; // Recibido desde el servidor
let totalVentas = 0; // Calculado dinámicamente

let categoriaSeleccionada = null; // Para rastrear la categoría actual
let subcategoriaSeleccionada = null; // Para rastrear la subcategoría actual

// Escuchar el historial de ventas sincronizado
socket.on("historialVentas", (data) => {
  ventas = data; // Actualizar el historial de ventas
  actualizarHistorialVentas(); // Renderizar el historial en la interfaz
  actualizarTotalVentas(); // Actualizar el total acumulado
});

// Escuchar el estado inicial de las mesas desde el servidor
socket.on("estadoMesas", (data) => {
  mesas = data; // Actualizar el estado local de las mesas
  renderizarMesas(); // Renderizar mesas con el nuevo estado
});

// Actualizar el total de ventas en pantalla
function actualizarTotalVentas() {
  // Recalcular el total sumando los totales del historial de ventas
  totalVentas = ventas.reduce((acc, venta) => acc + venta.total, 0);
  totalVentasAmount.textContent = `$${totalVentas}`; // Mostrar el total acumulado
}

// Cambiar el estado de una mesa y notificar al servidor
function cambiarEstadoMesa(mesa, estado) {
  mesa.estado = estado; // Actualizar el estado local
  socket.emit("cambiarEstadoMesa", { id: mesa.id, estado }); // Notificar al servidor
}

// Renderizar las mesas
function renderizarMesas() {
  mesasContainer.innerHTML = "";
  mesas.forEach((mesa) => {
    const mesaDiv = document.createElement("div");
    mesaDiv.classList.add("mesa", mesa.estado.toLowerCase());
    mesaDiv.textContent = `Mesa ${mesa.id} - ${mesa.estado}`;
    mesaDiv.addEventListener("click", () => gestionarMesa(mesa));
    mesasContainer.appendChild(mesaDiv);
  });
}

// Gestionar una mesa
function gestionarMesa(mesa) {
  menuContainer.classList.remove("hidden");
  mesaIdElement.textContent = mesa.id;

  // Renderizar la lista de platos con botones de cantidad y envío
  platosList.innerHTML = mesa.platos
    .map(
      (plato, index) => `
        <li class="plato-item">
        <span class="plato-nombre">${plato.nombre}</span>
        <span class="plato-precio">$${plato.precio} x ${plato.cantidad}</span>
        <div class="cantidad-container">
          <button class="btn-cantidad" onclick="aumentarCantidad(${mesa.id}, ${index})">+</button>
          <button class="btn-cantidad" onclick="disminuirCantidad(${mesa.id}, ${index})">-</button>
        </div>
        <button class="btn-enviar" onclick="enviarPlatoACocina(${mesa.id}, ${index})">Enviar</button>
        <button class="btn eliminar" onclick="eliminarPlato(${mesa.id}, ${index})">X</button>
      </li>
      `
    )
    .join("");

  // Botón para enviar todos los platos a cocina
  platosList.innerHTML += `
    <div class="contenedor-boton">
      <button class="btn enviar-todos" onclick="enviarTodosLosPlatosACocina(${mesa.id})">
        Enviar todos a cocina
      </button>
    </div>
  `;

  // Mostrar el total de los platos de la mesa
  const totalPlatos = mesa.platos.reduce((acc, plato) => acc + plato.precio * plato.cantidad, 0);
  platosList.innerHTML += `<li><strong>Total: $${totalPlatos}</strong></li>`;

  renderizarMenu(mesa);

  // Configurar botones de estado y confirmación de pago
  btnOcupado.onclick = () => cambiarEstadoMesa(mesa, "Ocupado");
  btnDisponible.onclick = () => cambiarEstadoMesa(mesa, "Disponible");
  btnConfirmarPago.onclick = () => confirmarPago(mesa);
}

// Agregar plato a una mesa
function agregarPlato(mesaId, platoNombre, platoPrecio) {
  const mesa = mesas.find((m) => m.id === mesaId);
  
  // Buscar si el plato ya está en la mesa
  let platoExistente = mesa.platos.find((p) => p.nombre === platoNombre);
  
  if (platoExistente) {
    // Si ya existe, aumentar la cantidad
    platoExistente.cantidad += 1;
  } else {
    // Si no existe, agregarlo con cantidad 1
    mesa.platos.push({ nombre: platoNombre, precio: platoPrecio, cantidad: 1 });
  }

  mesa.estado = "Ocupado"; // Marcar la mesa como ocupada si se agrega un plato
  socket.emit("actualizarMesa", mesa); // Sincronizar con el servidor
  gestionarMesa(mesa); // Volver a renderizar la mesa con la lista de platos actualizada
}


function aumentarCantidad(mesaId, platoIndex) {
  const mesa = mesas.find((m) => m.id === mesaId);
  mesa.platos[platoIndex].cantidad += 1;

  socket.emit("actualizarMesa", mesa);
  gestionarMesa(mesa);
}

function disminuirCantidad(mesaId, platoIndex) {
  const mesa = mesas.find((m) => m.id === mesaId);
  if (mesa.platos[platoIndex].cantidad > 1) {
    mesa.platos[platoIndex].cantidad -= 1;
  } else {
    // Si la cantidad llega a 1 y se presiona "-", se elimina el plato
    mesa.platos.splice(platoIndex, 1);
  }

  // Si ya no hay platos, cambiar estado a "Disponible"
  if (mesa.platos.length === 0) {
    mesa.estado = "Disponible";
  }

  socket.emit("actualizarMesa", mesa);
  gestionarMesa(mesa);
}


// Confirmar pago de una mesa con selección de método de pago
function confirmarPago(mesa) {
  if (mesa.platos.length === 0) {
    alert("No hay platos para cobrar.");
    return;
  }

  // Mostrar opciones de método de pago
  const metodoPago = prompt("Seleccione el método de pago: \n1. Efectivo\n2. Tarjeta\n3. Yape\n4. Plin");

  let metodoSeleccionado = "";
  switch (metodoPago) {
    case "1":
      metodoSeleccionado = "Efectivo";
      break;
    case "2":
      metodoSeleccionado = "Tarjeta";
      break;
    case "3":
      metodoSeleccionado = "Yape";
      break;
    case "4":
      metodoSeleccionado = "Plin";
      break;
    default:
      alert("Método de pago no válido. Intente nuevamente.");
      return;
  }

  // Calcular el total sumando los precios de los platos
  const total = mesa.platos.reduce((acc, plato) => acc + (plato.precio * plato.cantidad), 0);

  // Enviar los detalles de la venta al servidor
  socket.emit("confirmarPago", {
    mesaId: mesa.id,
    total,
    metodoPago: metodoSeleccionado, // Enviar el método de pago seleccionado
    platos: mesa.platos.map((plato) => `${plato.nombre} x${plato.cantidad} - $${plato.precio}`), // Lista de platos consumidos
  });

  // Vaciar la lista de platos de la mesa
  mesa.platos = [];
  mesa.estado = "Disponible"; // Cambiar el estado de la mesa a "Disponible"

  // Actualizar el total acumulado localmente
  totalVentas += total;
  actualizarTotalVentas(); // Mostrar el nuevo total acumulado en la interfaz

  // Actualizar visualmente las mesas
  renderizarMesas();
  menuContainer.classList.add("hidden"); // Cerrar el menú de gestión
}

// Actualizar historial de ventas
function actualizarHistorialVentas() {
  ventasList.innerHTML = ventas
    .map(
      (venta, index) => `
        <li>
          <strong>Mesa ${venta.mesaId}</strong><br>
          <em>${venta.fecha}</em><br>
          Platos: ${venta.platos.join(", ")}<br>
          Total: <strong>$${venta.total}</strong><br>
          Método de Pago: <strong>${venta.metodoPago}</strong>
          <button class="btn eliminar" onclick="eliminarVenta(${index})">Eliminar</button>
        </li>
      `
    )
    .join("");
}

//ELIMINAR PLATOS
function eliminarPlato(mesaId, platoIndex) {
  const mesa = mesas.find((m) => m.id === mesaId);
  mesa.platos.splice(platoIndex, 1); // Eliminar el plato en la posición especificada

  // Si no quedan platos, marcar la mesa como Disponible
  if (mesa.platos.length === 0) {
    mesa.estado = "Disponible";
  }

  // Sincronizar con el servidor y actualizar la interfaz
  socket.emit("actualizarMesa", mesa); // Notificar al servidor
  gestionarMesa(mesa); // Actualizar la vista de la mesa
  renderizarMesas(); // Actualizar el estado general de las mesas
}



function renderizarMenu(mesa) {
  if (categoriaSeleccionada === null) {
    // Mostrar categorías principales
    menuList.innerHTML = Object.keys(platosMenu)
      .map(
        (categoria) => `
          <button class="btn" onclick="seleccionarCategoria('${categoria}', ${mesa.id})">
            ${categoria}
          </button>`
      )
      .join("");
  } else if (subcategoriaSeleccionada === null) {
    // Mostrar subcategorías dentro de la categoría seleccionada
    menuList.innerHTML = `
      <button class="btn retroceder" onclick="volverACategorias(${mesa.id})">← Retroceder</button>
      ${Object.keys(platosMenu[categoriaSeleccionada])
        .map(
          (subcategoria) => `
            <button class="btn" onclick="seleccionarSubcategoria('${subcategoria}', ${mesa.id})">
              ${subcategoria}
            </button>`
        )
        .join("")}
    `;
  } else {
    // Mostrar los platos dentro de la subcategoría seleccionada
    menuList.innerHTML = `
      <button class="btn retroceder" onclick="volverASubcategorias(${mesa.id})">← Retroceder</button>
      ${platosMenu[categoriaSeleccionada][subcategoriaSeleccionada]
        .map(
          (plato) => `
            <button class="btn" onclick="agregarPlato(${mesa.id}, '${plato.nombre}', ${plato.precio})">
              ${plato.nombre} - $${plato.precio}
            </button>`
        )
        .join("")}
    `;
  }
}


function seleccionarCategoria(categoria, mesaId) {
  categoriaSeleccionada = categoria;
  renderizarMenu(mesas.find((m) => m.id === mesaId));
}

function seleccionarSubcategoria(subcategoria, mesaId) {
  subcategoriaSeleccionada = subcategoria;
  renderizarMenu(mesas.find((m) => m.id === mesaId));
}

function volverACategorias(mesaId) {
  categoriaSeleccionada = null;
  subcategoriaSeleccionada = null;
  renderizarMenu(mesas.find((m) => m.id === mesaId));
}

function volverASubcategorias(mesaId) {
  subcategoriaSeleccionada = null;
  renderizarMenu(mesas.find((m) => m.id === mesaId));
}


function eliminarVenta(index) {
  if (confirm("¿Estás seguro de eliminar esta venta?")) {
    socket.emit("eliminarVenta", index); // Notificar al servidor para eliminar la venta
  }
}


function enviarTodosLosPlatosACocina(mesaId) {
  const mesa = mesas.find((m) => m.id === mesaId);

  if (!mesa || mesa.platos.length === 0) {
    alert("No hay platos para enviar a la cocina.");
    return;
  }

  mesa.platos.forEach((plato) => {
    // Obtener la categoría y subcategoría correctas
    const categoriaInfo = encontrarCategoriaYSubcategoria(plato.nombre);

    if (!categoriaInfo) {
      console.error(`Error: No se encontró una categoría válida para el plato "${plato.nombre}"`);
      return;
    }

    // Enviar cada plato con su cantidad
    socket.emit("enviarPedido", {
      mesaId: mesa.id,
      categorias: [categoriaInfo.categoria, categoriaInfo.subcategoria],
      platos: [{ nombre: plato.nombre, cantidad: plato.cantidad }],
    });

    console.log(`Plato "${plato.nombre}" x${plato.cantidad} de la mesa ${mesa.id} enviado a cocina.`);
  });

  alert(`Todos los platos de la mesa ${mesa.id} han sido enviados a la cocina.`);
}



function enviarPlatoACocina(mesaId, platoIndex) {
  const mesa = mesas.find((m) => m.id === mesaId);
  const plato = mesa.platos[platoIndex];

  if (!plato) {
    alert("Error: el plato no existe.");
    return;
  }

  // Obtener la categoría y subcategoría correctas
  const categoriaInfo = encontrarCategoriaYSubcategoria(plato.nombre);

  if (!categoriaInfo) {
    alert("Debe seleccionar una categoría válida.");
    return;
  }

  socket.emit("enviarPedido", {
    mesaId: mesa.id,
    categorias: [categoriaInfo.categoria, categoriaInfo.subcategoria], // Ahora enviamos la categoría correcta
    platos: [{ nombre: plato.nombre, cantidad: plato.cantidad }],
  });

  alert(`El plato "${plato.nombre}" x${plato.cantidad} de la mesa ${mesa.id} ha sido enviado a cocina.`);
}


function encontrarCategoriaYSubcategoria(platoNombre) {
  for (const categoria in platosMenu) {
    for (const subcategoria in platosMenu[categoria]) {
      if (platosMenu[categoria][subcategoria].some((p) => p.nombre === platoNombre)) {
        return { categoria, subcategoria };
      }
    }
  }
  return null;
}


// Limpiar historial de ventas
btnLimpiarHistorial.addEventListener("click", () => {
  if (confirm("¿Estás seguro de limpiar todo el historial de ventas?")) {
    socket.emit("limpiarHistorialVentas"); // Notificar al servidor para limpiar el historial
    actualizarTotalVentas(); // Actualizar el total a $0 en la interfaz
  }
});

// Cerrar menú
btnCerrarMenu.addEventListener("click", () => {
  menuContainer.classList.add("hidden");
});

// Cerrar sesión
btnLogout.addEventListener("click", () => {
  localStorage.removeItem("userRole");
  window.location.href = "index.html";
});

// Inicializar
renderizarMesas();
actualizarHistorialVentas();
