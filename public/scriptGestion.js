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
      { nombre: "Porción de mollejita", precio: 13 },
      { nombre: "Porción de pancho", precio: 4 },
      { nombre: "1P. Anticucho", precio: 7 },
      { nombre: "Tajada de choclo", precio: 0.50 },
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
    ]
  },

  Platos_Comidas: {
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
    ]
  },

  Bebidas: {
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
    BEBIDAS_TIO: [
      { nombre: "1 Lt Chicha", precio: 7 },
      { nombre: "1/2 Lt Chicha", precio: 3.5 },
      { nombre: "Vaso de Chicha", precio: 1.5 },
      { nombre: "Café", precio: 2.5 },
      { nombre: "Té", precio: 2 },
      { nombre: "Anis", precio: 2 },
      { nombre: "Manzanilla", precio: 2 },
      { nombre: "Limonada", precio: 6 },
    ]
  },

  PARA_LLEVAR_M: {
    Platos_CHICOS: [
      { nombre: "LLEVAR - Porción de pancita", precio: 13 },
      { nombre: "LLEVAR - Porción de anticucho", precio: 13 },
      { nombre: "LLEVAR - Porción de rachi", precio: 15 },
      { nombre: "LLEVAR - Porción de mollejita", precio: 13 },
      { nombre: "LLEVAR - Porción de pancho", precio: 4 },
      { nombre: "LLEVAR - 1P. Anticucho", precio: 7 },
      { nombre: "LLEVAR - Tajada de choclo", precio: 0.50 },
      { nombre: "LLEVAR - Choclo entero", precio: 4 },
    ],
    Platos_CHICOS_CHOCLO: [
      { nombre: "LLEVAR - Porción de pancita + choclo", precio: 13.5 },
      { nombre: "LLEVAR - Porción de anticucho + choclo", precio: 13.5 },
      { nombre: "LLEVAR - Porción de rachi + choclo", precio: 15.5 },
      { nombre: "LLEVAR - Porción de mollejita + choclo", precio: 13.5 },
      { nombre: "LLEVAR - Porción de pancho + choclo", precio: 4.5 },
      { nombre: "LLEVAR - 1P.Anti + choclo", precio: 7.5 },
    ],
    Platos_MIXTOS: [
      { nombre: "LLEVAR - Pollo a la parrilla", precio: 15 },
      { nombre: "LLEVAR - rachi + Mollejita + choclo", precio: 20 },
      { nombre: "LLEVAR - pancita + Mollejita + choclo", precio: 17 },
      { nombre: "LLEVAR - pancita + rachi + choclo", precio: 17 },
      { nombre: "LLEVAR - 1P.Anti + Rachi + choclo", precio: 17 },
      { nombre: "LLEVAR - 1P.Anti +  Mollejita + choclo", precio: 17 },
      { nombre: "LLEVAR - 1P.Anti + Pancita + choclo", precio: 17 },
      { nombre: "LLEVAR - 1P.Anti + 2 panchos + Pancita + choclo", precio: 17 },
    ],
    Platos_Completos_1P: [
      { nombre: "LLEVAR - 1P.Anti + Pancita + Rachi + Mollejita + choclo", precio: 30 },
      { nombre: "LLEVAR - 1P.Anti + Rachi + Mollejita + choclo", precio: 23 },
      { nombre: "LLEVAR - 1P.Anti + Pancita + Mollejita + choclo", precio: 23 },
      { nombre: "LLEVAR - 1P.Anti + Pancita + Rachi + choclo", precio: 23 },
    ],
    Platos_Completos_2P: [
      { nombre: "LLEVAR - Pancita + Mollejita + Rachi + choclo", precio: 22 },
      { nombre: "LLEVAR - 2P.Anti + Mollejita + choclo", precio: 20 },
      { nombre: "LLEVAR - 2P.Anti + Rachi + choclo", precio: 20 },
      { nombre: "LLEVAR - 2P.Anti + Pancita + choclo", precio: 20 },
    ],
    Platos_Familares_2: [
      { nombre: "LLEVAR - 2P.Anti + P. + R. + M. + choclo + Gaseosa 1/2L", precio: 45 },
      { nombre: "LLEVAR - 3P.Anti + P. + R. + choclo + Gaseosa Personal", precio: 40 },
    ],
    Platos_Familares_4: [
      { nombre: "LLEVAR - 6P.Anti + P. + R. + M. + choclos + Gaseosa 1L", precio: 55 },
    ]
  },

  PARA_LLEVAR_TIO:{
    Platos_CARTA: [
      { nombre: "LLEVAR - LOMO DE CARNE", precio: 13 },
      { nombre: "LLEVAR - SALTADO DE POLLO", precio: 12 },
      { nombre: "LLEVAR - LOMO DE CARNE A LO POBRE", precio: 16 },
      { nombre: "LLEVAR - SALTADO DE POLLO A LO POBRE", precio: 16 },
      { nombre: "LLEVAR - BISTECK A LO POBRE", precio: 16 },
      { nombre: "LLEVAR - POLLO A LA PLANCHA A LO POBRE", precio: 16 },
      { nombre: "LLEVAR - POLLO A LA PLANCHA ", precio: 12 },
      { nombre: "LLEVAR - TALLARIN SALTADO DE CARNE", precio: 13 },
      { nombre: "LLEVAR - TALLARIN SALTADO DE POLLO", precio: 12 },
    ],
    Platos_POBRE: [
      { nombre: "LLEVAR - LOMO DE CARNE A LO POBRE (FRITO)", precio: 16 },
      { nombre: "LLEVAR - SALTADO DE POLLO A LO POBRE (INGLESA)", precio: 16 },
      { nombre: "LLEVAR - BISTECK A LO POBRE (FRITO)", precio: 16 },
      { nombre: "LLEVAR - BISTECK A LO POBRE (INGLESA)", precio: 16 },
      { nombre: "LLEVAR - POLLO A LA PLANCHA A LO POBRE (FRITO)", precio: 16 },
      { nombre: "LLEVAR - POLLO A LA PLANCHA A LO POBRE (INGLESA)", precio: 16 },
      { nombre: "LLEVAR - BROASTER POBRE (CON ARROZ) (INGLESA) ", precio: 14 },
      { nombre: "LLEVAR - BROASTER POBRE (CON ARROZ) (FRITO) ", precio: 14 },
      { nombre: "LLEVAR - BROASTER POBRE (PURA PAPA) (INGLESA)", precio: 14 },
      { nombre: "LLEVAR - BROASTER POBRE (PURA PAPA) (FRITO)", precio: 14 },
      { nombre: "LLEVAR - SALCHIPAPA MIXTA A LO POBRE (FRITO)", precio: 11 },
      { nombre: "LLEVAR - SALCHIPAPA MIXTA A LO POBRE (INGLESA)", precio: 11 },
  
    ],
    Platos_CHAUFA: [
      { nombre: "LLEVAR - CHAUFA DE POLLO", precio: 10 },
      { nombre: "LLEVAR - CHAUFA DE CARNE", precio: 11 },
      { nombre: "LLEVAR - CHAUFA DE CARNE Y POLLO", precio: 13 },
    ],
    Platos_SOPAS: [
      { nombre: "LLEVAR - MINUTA DE CARNE C/ LECHE", precio: 10 },
      { nombre: "LLEVAR - MINUTA DE POLLO C/LECHE", precio: 10 },
      { nombre: "LLEVAR - MINUTA DE CARNE Y POLLO C/LECHE", precio: 11 },
      { nombre: "LLEVAR - SUSTANCIA DE POLLO ", precio: 9.50 },
      { nombre: "LLEVAR - SUSTANCIA DE CARNE ", precio: 9.50 },
      { nombre: "LLEVAR - SUSTANCIA DE CARNE Y POLLO", precio: 10 },
      { nombre: "LLEVAR - DIETA", precio: 10 },
    ],
    Platos_BROASTER: [
      { nombre: "LLEVAR - ALITA + ARROZ + PAPA", precio: 9 },
      { nombre: "LLEVAR - ALITA + PAPA", precio: 9 },
      { nombre: "LLEVAR - PIERNA + ARROZ + PAPA", precio: 10 },
      { nombre: "LLEVAR - PIERNA + PAPA", precio: 10 },
      { nombre: "LLEVAR - ENTREPIERNA + ARROZ + PAPA", precio: 10 },
      { nombre: "LLEVAR - ENTREPIERNA + PAPA", precio: 10 },
      { nombre: "LLEVAR - PECHO + ARROZ + PAPA", precio: 10 },
      { nombre: "LLEVAR - PECHO + PAPA", precio: 10 },
      { nombre: "LLEVAR - ALITA + ARROZ + PAPA", precio: 10 },
      { nombre: "LLEVAR - CHICHARRON DE POLLO (PURA PAPA)", precio: 13 },
      { nombre: "LLEVAR - CHICHARRON DE POLLO (CON ARROZ)", precio: 13 },
      { nombre: "LLEVAR - MOSTRITO BROASTER", precio: 11 },
    ],
    Platos_SALCHIPAPAS: [
      { nombre: "LLEVAR - CLASICA", precio: 6.5 },
      { nombre: "LLEVAR - MIXTA", precio: 9 },
      { nombre: "LLEVAR - A LO POBRE", precio: 10 },
      { nombre: "LLEVAR - PORCION ARROZ", precio: 4 },
    ],
    BEBIDAS_TIO: [
      { nombre: "LLEVAR - 1 Lt Chicha", precio: 7 },
      { nombre: "LLEVAR - 1/2 Lt Chicha", precio: 3.5 },
      { nombre: "LLEVAR - Vaso de Chicha", precio: 1.5 },
    ]
  }
};

let mesas = []; // Recibido desde el servidor
let ventas = []; // Recibido desde el servidor
let totalVentas = 0; // Calculado dinámicamente

let categoriaSeleccionada = null; // Para rastrear la categoría actual
let subcategoriaSeleccionada = null; // Para rastrear la subcategoría actual
let platosAcumuladosPorSubcategoria = {};

let platosVendidos = {};

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
          Método de Pago: <strong>${venta.metodoPago}</strong><br>
          <div class="botones-container">
            <button class="btn eliminar" onclick="eliminarVenta(${index})">Eliminar</button>
            <button class="btn imprimir" onclick="imprimirVenta(${index})">Imprimir</button>
          </div>
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

  let pedidosAgrupados = []; // 📌 Para almacenar todos los platos en un solo documento de impresión

  mesa.platos.forEach((plato) => {
    const categoriaInfo = encontrarCategoriaYSubcategoria(plato.nombre);

    if (!categoriaInfo) {
      console.error(`Error: No se encontró una categoría válida para el plato "${plato.nombre}"`);
      return;
    }

    const { categoria, subcategoria } = categoriaInfo;

    // Guardar en un array todos los platos para imprimir juntos
    pedidosAgrupados.push({
      nombre: plato.nombre,
      cantidad: plato.cantidad,
      categoria,
      subcategoria
    });

    // Enviar cada pedido al servidor según su categoría/subcategoría
    socket.emit("enviarPedido", {
      mesaId: mesa.id,
      categorias: [categoria, subcategoria],
      platos: [{ nombre: plato.nombre, cantidad: plato.cantidad }],
    });
  });

  // 📌 Imprimir todos los platos en un solo documento después de enviarlos a cocina
  imprimirPedidoCocinero(mesa.id, pedidosAgrupados);

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

  // Enviar el plato al servidor para su preparación en cocina
  socket.emit("enviarPedido", {
    mesaId: mesa.id,
    categorias: [categoriaInfo.categoria, categoriaInfo.subcategoria], 
    platos: [{ nombre: plato.nombre, cantidad: plato.cantidad }],
  });

  // 📌 Llamar a la función para imprimir solo este plato
  imprimirPedidoPlato(mesa.id, plato, categoriaInfo);

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



function imprimirVenta(index) {
  const venta = ventas[index];

  // Detectar si el usuario está en un móvil
  const esMovil = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Contenido de la boleta con botón de impresión en móviles
  const contenido = `
    <html>
      <head>
        <title>Boleta de Venta - Mesa ${venta.mesaId}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background: #f8f8f8; }
          .boleta { max-width: 500px; margin: auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1); }
          .boleta-header { text-align: center; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; }
          .boleta-header h1 { margin: 0; font-size: 22px; color: #333; }
          .boleta-header img { max-width: 100px; float: right; }
          .boleta-info { margin-top: 15px; font-size: 14px; }
          .boleta-info div { margin: 5px 0; }
          .boleta-table { width: 100%; margin-top: 15px; border-collapse: collapse; }
          .boleta-table th, .boleta-table td { border: 1px solid #ddd; padding: 8px; text-align: center; }
          .boleta-table th { background: #4CAF50; color: white; }
          .boleta-total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 10px; }
          .boleta-footer { text-align: center; margin-top: 20px; font-size: 12px; color: #555; }
          .btn-imprimir { 
            display: ${esMovil ? "block" : "none"}; 
            margin: 20px auto; 
            padding: 10px 20px; 
            background: #4CAF50; 
            color: white; 
            border: none; 
            border-radius: 5px; 
            cursor: pointer; 
            font-size: 16px; 
          }
        </style>
      </head>
      <body>
        <div class="boleta">
          <div class="boleta-header">
            <img src="URL_DEL_LOGO" alt="Logo">
            <h1>Anticucheria Mechita</h1>
            <p>R.U.C. 10007456085</p>
            <p>Tel: 980XXXXXX</p>
            <p>Dir. [Dirección Aquí]</p>
            <p><strong>BOLETA DE VENTA</strong></p>
          </div>
          <div class="boleta-info">
            <div><strong>Mesa:</strong> ${venta.mesaId}</div>
            <div><strong>Fecha y Hora:</strong> ${venta.fecha}</div>
            <div><strong>Método de Pago:</strong> ${venta.metodoPago}</div>
          </div>
          <table class="boleta-table">
            <thead>
              <tr>
                <th>Cantidad</th>
                <th>Descripción</th>
                <th>Importe (S/)</th>
              </tr>
            </thead>
            <tbody>
              ${venta.platos.map(plato => {
                const detalles = plato.split(" x"); // Separar nombre y cantidad
                const nombre = detalles[0];
                const cantidad = detalles[1].split(" - ")[0]; 
                const precio = detalles[1].split(" - $")[1];
                return `<tr>
                          <td>${cantidad}</td>
                          <td>${nombre}</td>
                          <td>S/ ${precio}</td>
                        </tr>`;
              }).join("")}
            </tbody>
          </table>
          <div class="boleta-total">TOTAL: S/ ${venta.total.toFixed(2)}</div>
          <div class="boleta-footer">¡Gracias por su compra!</div>
          <button class="btn-imprimir" onclick="window.print()">Imprimir</button>
        </div>
      </body>
    </html>
  `;

  // Abrir una ventana nueva para imprimir
  const ventanaImpresion = window.open("", "", "width=600,height=600");
  ventanaImpresion.document.write(contenido);
  ventanaImpresion.document.close();
  ventanaImpresion.focus();

  // Si no es móvil, imprimir automáticamente
  if (!esMovil) {
    ventanaImpresion.print();
  }
}


function imprimirPedidoCocinero(mesaId, pedidos) {
  const contenido = `
    <html>
      <head>
        <title>Pedido a Cocina - Mesa ${mesaId}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1, h2 { text-align: center; margin-bottom: 10px; }
          .detalle { font-size: 16px; margin-bottom: 10px; }
          .detalle span { font-weight: bold; }
          ul { padding: 0; list-style: none; }
          li { font-size: 14px; padding: 5px 0; }
          hr { margin: 15px 0; }
        </style>
      </head>
      <body>
        <h1>Pedido a Cocina</h1>
        <hr>
        <div class="detalle"><span>Mesa:</span> ${mesaId}</div>
        <div class="detalle"><span>Hora del Pedido:</span> ${new Date().toLocaleTimeString()}</div>
        <hr>
        <h2>Platos Solicitados</h2>
        <ul>
          ${pedidos.map(plato => `<li><strong>${plato.nombre}</strong> x${plato.cantidad} (${plato.categoria} - ${plato.subcategoria})</li>`).join("")}
        </ul>
        <hr>
        <p style="text-align: center;">¡Preparar con rapidez!</p>
      </body>
    </html>
  `;

  // 📌 Abrir una ventana emergente con todos los pedidos de la mesa
  const ventanaImpresion = window.open("", "", "width=600,height=600");
  ventanaImpresion.document.write(contenido);
  ventanaImpresion.document.close();
  ventanaImpresion.focus();
  ventanaImpresion.print();
}


function imprimirPedidoPlato(mesaId, plato, categoriaInfo) {
  const logoURL = "URL_DEL_LOGO_AQUÍ"; // 🔹 Reemplaza con la URL de tu logo o una imagen local

  const contenido = `
    <html>
      <head>
        <title>Pedido a Cocina - Mesa ${mesaId}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 400px;
            margin: auto;
            border: 2px solid #333;
            border-radius: 10px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 2px solid #333;
          }
          .logo {
            width: 60px;
            height: 60px;
            object-fit: contain;
          }
          .detalle {
            font-size: 16px;
            margin-bottom: 5px;
          }
          .detalle span {
            font-weight: bold;
            color: #333;
          }
          .platos-container {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background: #f9f9f9;
            margin-bottom: 10px;
          }
          .plato-item {
            font-size: 14px;
            padding: 5px 0;
            border-bottom: 1px solid #ddd;
          }
          .plato-item:last-child {
            border-bottom: none;
          }
          .footer {
            text-align: center;
            font-size: 14px;
            margin-top: 15px;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Pedido a Cocina</h1>
          <img src="${logoURL}" alt="Logo Restaurante" class="logo">
        </div>

        <div class="detalle"><span>Mesa:</span> ${mesaId}</div>
        <div class="detalle"><span>Hora del Pedido:</span> ${new Date().toLocaleTimeString()}</div>

        <div class="platos-container">
          <h2>Plato Solicitado</h2>
          <div class="plato-item">
            <strong>${plato.nombre}</strong> x${plato.cantidad}  
            <br><small>(${categoriaInfo.categoria} - ${categoriaInfo.subcategoria})</small>
          </div>
        </div>

        <div class="footer">¡Preparar con rapidez!</div>
      </body>
    </html>
  `;

  // 📌 Abrir una ventana emergente con la información del plato para imprimir
  const ventanaImpresion = window.open("", "", "width=400,height=600");
  ventanaImpresion.document.write(contenido);
  ventanaImpresion.document.close();
  ventanaImpresion.focus();
  ventanaImpresion.print();
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
inicializarPlatosVendidos();