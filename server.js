const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Puerto en el que correrá el servidor
const PORT = 3000;

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));


// Estado inicial de las mesas
let mesas = Array(14).fill().map((_, i) => ({
  id: i + 1,
  estado: "Disponible", // "Disponible" o "Ocupado"
  platos: [], // Platos asignados a la mesa
}));

let ventas = []; // Lista inicial de ventas

// Manejo de WebSocket
io.on("connection", (socket) => {
  console.log("Cliente conectado");

  // Enviar el estado inicial de las mesas al cliente recién conectado
  socket.emit("estadoMesas", mesas);

  //Enviar historial de ventas al cliente recién conectado:
  socket.emit("historialVentas", ventas);

  // Escuchar cambios de estado de una mesa
  socket.on("cambiarEstadoMesa", (data) => {
    const { id, estado } = data;
    const mesa = mesas.find((m) => m.id === id);
    if (mesa) {
      mesa.estado = estado;

      // Notificar a todos los clientes conectados sobre el cambio
      io.emit("estadoMesas", mesas);
    }
  });

  // Escuchar la actualización de una mesa (platos asignados y estado)
  socket.on("actualizarMesa", (mesaActualizada) => {
    const mesa = mesas.find((m) => m.id === mesaActualizada.id);
    if (mesa) {
      mesa.platos = mesaActualizada.platos;
      mesa.estado = mesaActualizada.estado;

      // Notificar a todos los clientes conectados sobre el cambio
      io.emit("estadoMesas", mesas);
    }
  });

  // Escuchar la limpieza del historial de ventas
  socket.on("limpiarHistorialVentas", () => {
    ventas = []; // Vaciar el historial de ventas en el servidor
    io.emit("historialVentas", ventas); // Notificar a todos los clientes conectados
  });


  socket.on("eliminarVenta", (index) => {
    ventas.splice(index, 1); // Eliminar la venta por su índice
    io.emit("historialVentas", ventas); // Notificar a todos los clientes
  });


    // Escuchar la confirmación de pago
  socket.on("confirmarPago", (data) => {
    const { mesaId, total, platos } = data;

    // Agregar la venta con detalles adicionales
    const nuevaVenta = {
      mesaId,
      total,
      fecha: new Date().toLocaleString(), // Fecha y hora en formato legible
      platos,
    };
  
    ventas.push(nuevaVenta);
    
      // Emitir el historial actualizado a todos los clientes
      io.emit("historialVentas", ventas);
    
      // Actualizar el estado de la mesa en el servidor
      const mesa = mesas.find((m) => m.id === mesaId);
      if (mesa) {
        mesa.platos = []; // Limpiar los platos de la mesa
        mesa.estado = "Disponible"; // Cambiar el estado a "Disponible"
    
        // Emitir el estado actualizado de las mesas
        io.emit("estadoMesas", mesas);
      }
    });

  // Escuchar desconexión del cliente
  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Accesible en la red: http://${getLocalIPAddress()}:${PORT}`);
});

// Función para obtener la IP local
function getLocalIPAddress() {
  const { networkInterfaces } = require("os");
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address; // Retorna la IP local
      }
    }
  }
}

let pedidosCocina = [];  // Lista de pedidos pendientes
let pedidosListos = [];  // Lista de pedidos completados

io.on("connection", (socket) => {
  console.log("Cliente conectado");

  // Enviar pedidos actuales y completados al cliente recién conectado
  socket.emit("pedidosCocina", pedidosCocina);
  socket.emit("pedidosListos", pedidosListos);

  // Recibir nuevos pedidos
  socket.on("enviarPedido", (pedido) => {
    pedidosCocina.push(pedido);
    io.emit("pedidosCocina", pedidosCocina);
  });

  // Marcar pedido como listo
  socket.on("pedidoListo", (index) => {
    const pedidoCompletado = pedidosCocina.splice(index, 1)[0];
    pedidosListos.push(pedidoCompletado);
    
    io.emit("pedidosCocina", pedidosCocina);
    io.emit("pedidosListos", pedidosListos);
  });

  // Eliminar un pedido listo individualmente
  socket.on("eliminarPedidoListo", (index) => {
    pedidosListos.splice(index, 1);
    io.emit("pedidosListos", pedidosListos);
  });

  // Eliminar todos los pedidos listos
  socket.on("eliminarTodosPedidosListos", () => {
    pedidosListos = [];
    io.emit("pedidosListos", pedidosListos);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

