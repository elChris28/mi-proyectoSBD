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
  Platos_CHICOS: [
    { nombre: "Porción de pancita", precio: 13 },
    { nombre: "Porción de anticucho", precio: 13 },
    { nombre: "Porción de rachi", precio: 15 },
    { nombre: "Porción de mollejita", precio: 13 },
    { nombre: "Porción de pancho", precio: 4 },
    { nombre: "1P.Anti", precio: 7 },
    { nombre: "tajada de choclo", precio: 0.50 },
    { nombre: "Choclo entero", precio: 4 },
  ],
  Platos_CHICOS_CHOCLO: [
    { nombre: "Porción de pancita + choclo", precio: 13.5 },
    { nombre: "Porción de anticucho + choclo", precio: 13.5 },
    { nombre: "Porción de rachi + choclo", precio: 15.5 },
    { nombre: "Porción de mollejita + choclo", precio: 13.5 },
    { nombre: "Porción de pancho + choclo", precio: 4.5 },
    { nombre: "1P.Anti + choclo", precio: 7.5 },
  ],
  Platos_MIXTOS: [
    { nombre: "Pollo a la parrilla", precio: 15 },
    { nombre: "rachi + Mollejita + choclo", precio: 20 },
    { nombre: "pancita + Mollejita + choclo", precio: 17 },
    { nombre: "pancita + rachi + choclo", precio: 17 },
    { nombre: "1P.Anti + Rachi + choclo", precio: 17 },
    { nombre: "1P.Anti +  Mollejita + choclo", precio: 17 },
    { nombre: "1P.Anti + Pancita + choclo", precio: 17 },
    { nombre: "1P.Anti + 2 panchos + Pancita + choclo", precio: 17 },
  ],
  Platos_Completos_1P: [
    { nombre: "1P.Anti + Pancita + Rachi + Mollejita + choclo", precio: 30 },
    { nombre: "1P.Anti + Rachi + Mollejita + choclo", precio: 23 },
    { nombre: "1P.Anti + Pancita + Mollejita + choclo", precio: 23 },
    { nombre: "1P.Anti + Pancita + Rachi + choclo", precio: 23 },
  ],
  Platos_Completos_2P: [
    { nombre: "Pancita + Mollejita + Rachi + choclo", precio: 22 },
    { nombre: "2P.Anti + Mollejita + choclo", precio: 20 },
    { nombre: "2P.Anti + Rachi + choclo", precio: 20 },
    { nombre: "2P.Anti + Pancita + choclo", precio: 20 },
  ],
  Platos_Familares_2: [
    { nombre: "2P.Anti + P. + R. + M. + choclo + Gaseosa 1/2L", precio: 45 },
    { nombre: "3P.Anti + P. + R. + choclo + Gaseosa Personal", precio: 40 },
  ],
  Platos_Familares_4: [
    { nombre: "6P.Anti + P. + R. + M. + choclos + Gaseosa 1L", precio: 55 },
  ],
  Platos_CARTA: [
    { nombre: "LOMO DE CARNE", precio: 13 },
    { nombre: "SALTADO DE POLLO", precio: 12 },
    { nombre: "LOMO DE CARNE A LO POBRE", precio: 16 },
    { nombre: "SALTADO DE POLLO A LO POBRE", precio: 16 },
    { nombre: "BISTECK A LO POBRE", precio: 16 },
    { nombre: "POLLO A LA PLANCHA A LO POBRE", precio: 16 },
    { nombre: "POLLO A LA PLANCHA ", precio: 12 },
    { nombre: "TALLARIN SALTADO DE CARNE", precio: 13 },
    { nombre: "TALLARIN SALTADO DE POLLO", precio: 12 },
  ],
  Platos_POBRE: [
    { nombre: "LOMO DE CARNE A LO POBRE (FRITO)", precio: 16 },
    { nombre: "SALTADO DE POLLO A LO POBRE (INGLESA)", precio: 16 },
    { nombre: "BISTECK A LO POBRE (FRITO)", precio: 16 },
    { nombre: "BISTECK A LO POBRE (INGLESA)", precio: 16 },
    { nombre: "POLLO A LA PLANCHA A LO POBRE (FRITO)", precio: 16 },
    { nombre: "POLLO A LA PLANCHA A LO POBRE (INGLESA)", precio: 16 },
    { nombre: "BROASTER POBRE (CON ARROZ) (INGLESA) ", precio: 14 },
    { nombre: "BROASTER POBRE (CON ARROZ) (FRITO) ", precio: 14 },
    { nombre: "BROASTER POBRE (PURA PAPA) (INGLESA)", precio: 14 },
    { nombre: "BROASTER POBRE (PURA PAPA) (FRITO)", precio: 14 },
    { nombre: "SALCHIPAPA MIXTA A LO POBRE (FRITO)", precio: 11 },
    { nombre: "SALCHIPAPA MIXTA A LO POBRE (INGLESA)", precio: 11 },

  ],
  Platos_CHAUFA: [
    { nombre: "CHAUFA DE POLLO", precio: 10 },
    { nombre: "CHAUFA DE CARNE", precio: 11 },
    { nombre: "CHAUFA DE CARNE Y POLLO", precio: 13 },
  ],
  Platos_SOPAS: [
    { nombre: "MINUTA DE CARNE C/ LECHE", precio: 10 },
    { nombre: "MINUTA DE POLLO C/LECHE", precio: 10 },
    { nombre: "MINUTA DE CARNE Y POLLO C/LECHE", precio: 11 },
    { nombre: "SUSTANCIA DE POLLO ", precio: 9.50 },
    { nombre: "SUSTANCIA DE CARNE ", precio: 9.50 },
    { nombre: "SUSTANCIA DE CARNE Y POLLO", precio: 10 },
    { nombre: "DIETA", precio: 10 },
  ],
  Platos_BROASTER: [
    { nombre: "ALITA + ARROZ + PAPA", precio: 9 },
    { nombre: "ALITA + PAPA", precio: 9 },
    { nombre: "PIERNA + ARROZ + PAPA", precio: 10 },
    { nombre: "PIERNA + PAPA", precio: 10 },
    { nombre: "ENTREPIERNA + ARROZ + PAPA", precio: 10 },
    { nombre: "ENTREPIERNA + PAPA", precio: 10 },
    { nombre: "PECHO + ARROZ + PAPA", precio: 10 },
    { nombre: "PECHO + PAPA", precio: 10 },
    { nombre: "ALITA + ARROZ + PAPA", precio: 10 },
    { nombre: "CHICHARRON DE POLLO (PURA PAPA)", precio: 13 },
    { nombre: "CHICHARRON DE POLLO (CON ARROZ)", precio: 13 },
    { nombre: "MOSTRITO BROASTER", precio: 11 },
  ],
  Platos_SALCHIPAPAS: [
    { nombre: "CLASICA", precio: 6.5 },
    { nombre: "MIXTA", precio: 9 },
    { nombre: "A LO POBRE", precio: 10 },
    { nombre: "PORCION ARROZ", precio: 4 },
  ],
  BEBIDAS_M: [
    { nombre: "personal Inka", precio: 2.5 },
    { nombre: "Personal coka kola", precio: 2.5 },
    { nombre: "Gordita", precio: 5 },
    { nombre: "Yumbo", precio: 5 },
    { nombre: "1LT INKA", precio: 7 },
    { nombre: "1LT Coka kola", precio: 7 },
    { nombre: "1 1/2 LT Inka", precio: 9 },
    { nombre: "1 1/2 LT Coka kola", precio: 9 },
  ],
  BEBIDAS_TIO :[
    { nombre: "1 Lt Chicha", precio: 7 },
    { nombre: "1/2 Lt Chicha", precio: 3.5 },
    { nombre: "Vaso de Chicha", precio: 1.5 },
    { nombre: "Café", precio: 2.5 },
    { nombre: "Té", precio: 2 },
    { nombre: "Anis", precio: 2 },
    { nombre: "Manzanilla", precio: 2 },
    { nombre: "Limonada", precio: 6 },

  ]
};

let mesas = []; // Recibido desde el servidor
let ventas = []; // Recibido desde el servidor
let totalVentas = 0; // Calculado dinámicamente

let categoriaSeleccionada = null; // Para rastrear la categoría actual

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

  // Renderizar la lista de platos con botones individuales
  platosList.innerHTML = mesa.platos
    .map(
      (plato, index) => `
        <li>
          ${plato.nombre} - $${plato.precio}
          <button class="btn enviar-plato" onclick="enviarPlatoACocina(${mesa.id}, ${index})">
            Enviar
          </button>
          <button class="btn eliminar" onclick="eliminarPlato(${mesa.id}, ${index})">
            X
          </button>
        </li>
      `
    )
    .join("");

  // Botón separado para enviar todos los platos uno por uno
  platosList.innerHTML += `
    <div class="contenedor-boton">
      <button class="btn enviar-todos" onclick="enviarTodosLosPlatosACocina(${mesa.id})">
        Enviar todos a cocina
      </button>
    </div>
  `;

  // Mostrar el total de los platos de la mesa
  const totalPlatos = mesa.platos.reduce((acc, plato) => acc + plato.precio, 0);
  platosList.innerHTML += `<li><strong>Total: $${totalPlatos}</strong></li>`;

  // Renderizar el menú (categorías o platos)
  renderizarMenu(mesa);

  // Configurar botones de estado y confirmación de pago
  btnOcupado.onclick = () => cambiarEstadoMesa(mesa, "Ocupado");
  btnDisponible.onclick = () => cambiarEstadoMesa(mesa, "Disponible");
  btnConfirmarPago.onclick = () => confirmarPago(mesa);
}

// Agregar plato a una mesa
function agregarPlato(mesaId, platoNombre, platoPrecio) {
  const mesa = mesas.find((m) => m.id === mesaId);
  mesa.platos.push({ nombre: platoNombre, precio: platoPrecio }); // Agregar plato con precio
  mesa.estado = "Ocupado"; // Cambiar automáticamente el estado a Ocupado
  socket.emit("actualizarMesa", mesa); // Notificar al servidor sobre el cambio
  gestionarMesa(mesa);
}

// Confirmar pago de una mesa
function confirmarPago(mesa) {
  if (mesa.platos.length === 0) {
    alert("No hay platos para cobrar.");
    return;
  }

  // Calcular el total sumando los precios de los platos
  const total = mesa.platos.reduce((acc, plato) => acc + plato.precio, 0);

  // Enviar los detalles de la venta al servidor
  socket.emit("confirmarPago", {
    mesaId: mesa.id,
    total,
    platos: mesa.platos.map((plato) => `${plato.nombre} - $${plato.precio}`), // Lista de platos consumidos
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
          Total: <strong>$${venta.total}</strong>
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
    // Mostrar categorías
    menuList.innerHTML = Object.keys(platosMenu)
      .map(
        (categoria) =>
          `<button class="btn" onclick="seleccionarCategoria('${categoria}', ${mesa.id})">
            ${categoria}
          </button>`
      )
      .join("");
  } else {
    // Mostrar platos dentro de la categoría seleccionada
    menuList.innerHTML = `
      <button class="btn retroceder" onclick="volverACategorias(${mesa.id})">← RETROCEDER</button>
      ${platosMenu[categoriaSeleccionada]
        .map(
          (plato) =>
            `<button class="btn" onclick="agregarPlato(${mesa.id}, '${plato.nombre}', ${plato.precio})">
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

function volverACategorias(mesaId) {
  categoriaSeleccionada = null;
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

  // Enviar cada plato individualmente
  mesa.platos.forEach((plato) => {
    // Identificar la categoría del plato
    let categoriaAsignada = null;

    for (const categoria in platosMenu) {
      if (platosMenu[categoria].some((p) => p.nombre === plato.nombre)) {
        categoriaAsignada = categoria;
        break;
      }
    }

    if (!categoriaAsignada) {
      console.error(`El plato "${plato.nombre}" no pertenece a una categoría válida.`);
      return;
    }

    // Enviar el pedido del plato individualmente
    socket.emit("enviarPedido", {
      mesaId: mesa.id,
      categorias: [categoriaAsignada],
      platos: [plato.nombre],
    });

    console.log(`Plato "${plato.nombre}" de la mesa ${mesa.id} enviado a cocina.`);
  });

  alert(`Todos los platos de la mesa ${mesa.id} han sido enviados a la cocina uno por uno.`);
}



function enviarPlatoACocina(mesaId, platoIndex) {
  const mesa = mesas.find((m) => m.id === mesaId);
  const plato = mesa.platos[platoIndex];

  if (!plato) {
    alert("Error: el plato no existe.");
    return;
  }

  // Buscar la categoría del plato
  let categoriaSeleccionada = null;

  for (const categoria in platosMenu) {
    if (platosMenu[categoria].some((p) => p.nombre === plato.nombre)) {
      categoriaSeleccionada = categoria;
      break;
    }
  }

  if (!categoriaSeleccionada) {
    alert("Debe seleccionar una categoría válida.");
    return;
  }

  socket.emit("enviarPedido", {
    mesaId: mesa.id,
    categorias: [categoriaSeleccionada], // Enviar una sola categoría
    platos: [plato.nombre],  // Solo enviar este plato
  });

  alert(`El plato "${plato.nombre}" de la mesa ${mesa.id} ha sido enviado a cocina.`);
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
