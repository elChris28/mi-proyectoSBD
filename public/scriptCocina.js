const socket = io();
const pedidosContainer = document.getElementById("pedidos-container");
const pedidosListosContainer = document.getElementById("pedidos-listos-container");

// Escuchar los pedidos enviados desde las mesas
socket.on("pedidosCocina", (pedidos) => {
  renderizarPedidos(pedidos);
});

// Escuchar los pedidos listos
socket.on("pedidosListos", (pedidosListos) => {
  renderizarPedidosListos(pedidosListos);
});

// Renderizar los pedidos pendientes
function renderizarPedidos(pedidos) {
  pedidosContainer.innerHTML = pedidos.length === 0 
    ? "<p>No hay pedidos pendientes.</p>" 
    : pedidos
        .map(
          (pedido, index) => `
            <div class="pedido">
              <strong>Mesa ${pedido.mesaId}</strong>
              <p>${pedido.platos.join(", ")}</p>
              <button class="btn-listo" onclick="marcarComoListo(${index})">Listo</button>
            </div>
          `
        )
        .join("");
}

// Renderizar los pedidos completados
function renderizarPedidosListos(pedidosListos) {
  pedidosListosContainer.innerHTML = pedidosListos.length === 0 
    ? "<p>No hay pedidos listos.</p>" 
    : pedidosListos
        .map(
          (pedido, index) => `
            <div class="pedido listo">
              <strong>Mesa ${pedido.mesaId}</strong>
              <p>${pedido.platos.join(", ")}</p>
              <button class="btn-eliminar" onclick="eliminarPedidoListo(${index})">Eliminar</button>
            </div>
          `
        )
        .join("");

  if (pedidosListos.length > 0) {
    pedidosListosContainer.innerHTML += `
      <button class="btn-eliminar-todos" onclick="eliminarTodosPedidosListos()">Eliminar Todos</button>
    `;
  }
}

// Marcar un pedido como listo y enviarlo a la lista de completados
function marcarComoListo(index) {
  socket.emit("pedidoListo", index);
}

// Eliminar un pedido completado
function eliminarPedidoListo(index) {
  socket.emit("eliminarPedidoListo", index);
}

// Eliminar todos los pedidos completados
function eliminarTodosPedidosListos() {
  if (confirm("¿Estás seguro de eliminar todos los pedidos completados?")) {
    socket.emit("eliminarTodosPedidosListos");
  }
}

// Cerrar sesión
document.getElementById("logout-button").addEventListener("click", () => {
  localStorage.removeItem("userRole");
  window.location.href = "index.html";
});
