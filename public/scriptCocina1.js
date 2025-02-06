const socket = io();

// Enviar el rol del cocinero al servidor
socket.emit("rolCocinero", "cocinero_1");

const pedidosContainer = document.getElementById("pedidos-container");
const pedidosListosContainer = document.getElementById("pedidos-listos-container");


socket.on("pedidosCocina", (pedidos) => {
  renderizarPedidos(pedidos);
});

socket.on("pedidosListos", (pedidosListos) => {
  renderizarPedidosListos(pedidosListos);
});

function renderizarPedidos(pedidos) {
  pedidosContainer.innerHTML = pedidos.length === 0 
    ? "<p>No hay pedidos pendientes.</p>" 
    : pedidos
        .map(pedido => `
          <div class="pedido">
            <strong>Mesa ${pedido.mesaId}</strong>
            <p>${pedido.platos.map(plato => `${plato.nombre} x${plato.cantidad}`).join(", ")}</p>
            <button class="btn-listo" onclick="marcarComoListo('${pedido.id}', 'cocinero_1')">Listo</button>
          </div>
        `)
        .join("");
}

function renderizarPedidosListos(pedidos) {
  pedidosListosContainer.innerHTML = pedidos.length === 0 
    ? "<p>No hay pedidos listos.</p>" 
    : pedidos
        .map(
          (pedido, index) => `
            <div class="pedido listo">
              <strong>Mesa ${pedido.mesaId}</strong>
              <p>${pedido.platos.map(plato => `${plato.nombre} x${plato.cantidad}`).join(", ")}</p>
              <button class="btn-eliminar" onclick="eliminarPedidoListo(${index}, 'cocinero_1')">Eliminar</button>
            </div>
          `
        )
        .join("");

  if (pedidos.length > 0) {
    pedidosListosContainer.innerHTML += `
      <button class="btn-eliminar-todos" onclick="limpiarTodosLosPedidosListos('cocinero_1')">Limpiar todos</button>
    `;
  }
}

function marcarComoListo(pedidoId, cocinero) {
  socket.emit("pedidoListo", { pedidoId, cocinero });
}

function eliminarPedidoListo(index, cocinero) {
  socket.emit("eliminarPedidoListo", { index, cocinero });
}

function limpiarTodosLosPedidosListos(cocinero) {
  if (confirm("¿Estás seguro de limpiar todos los pedidos completados?")) {
    socket.emit("eliminarTodosPedidosListos", cocinero);
  }
}


// Cerrar sesión
document.getElementById("logout-button").addEventListener("click", () => {
  localStorage.removeItem("userRole");
  window.location.href = "index.html";
});