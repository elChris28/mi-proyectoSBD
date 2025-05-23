const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const moment = require("moment-timezone");


app.use(express.json()); // Asegúrate de poder leer JSON en el body

// Puerto en el que correrá el servidor
const PORT = 3000;

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));


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
      const { mesaId, total, metodoPago, platos } = data;
    
      // Agregar la venta con detalles adicionales
      const nuevaVenta = {
        mesaId,
        total,
        metodoPago,  // Guardar el método de pago
        fecha: moment().tz("America/Lima").format("YYYY-MM-DD HH:mm:ss"), // Fecha y hora PERU
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
let pedidosListos = { cocinero_1: [], cocinero_2: [] };  // Lista de pedidos completados


// Asignación de platos por cocinero
const categoriasCocinero1 = [
  "Platos_CHICOS", 
  "Platos_CHICOS_CHOCLO", 
  "Platos_MIXTOS",
  "Platos_Completos_1P",
  "Platos_Completos_2P",
  "Platos_Familares_2",
  "Platos_Familares_4",
  "BEBIDAS_M"
];

const categoriasCocinero2 = [
  "Platos_CARTA",
  "Platos_POBRE",
  "Platos_CHAUFA",
  "Platos_SOPAS", 
  "Platos_BROASTER",
  "Platos_SALCHIPAPAS",
  "BEBIDAS_TIO",
  "ALITAS"
];

// Almacenar qué cliente pertenece a qué rol
const cocinerosConectados = {};

io.on("connection", (socket) => {
  console.log("Cliente conectado");

  // Asignar rol al cocinero conectado
  socket.on("rolCocinero", (rol) => {
    cocinerosConectados[socket.id] = rol;

    // Enviar pedidos pendientes y listos correspondientes al rol
    socket.emit("pedidosCocina", pedidosCocina.filter((pedido) => pedido.cocinero === rol));
    socket.emit("pedidosListos", pedidosListos[rol]);
  });

  // Recibir pedidos y enviarlos a cada cocinero según las categorías
  socket.on("enviarPedido", (pedido) => {
    let platosCocinero1 = [];
    let platosCocinero2 = [];
  
    pedido.platos.forEach((plato) => {
      let categoriaPrincipal = pedido.categorias[0]; // Categoría principal
      let subcategoriaEncontrada = pedido.categorias[1]; // Subcategoría
  
      if (!categoriaPrincipal || !subcategoriaEncontrada) {
        console.error(`Error: No se encontró la categoría del plato "${plato.nombre}"`);
        return;
      }
  
      // Asignar el plato al cocinero correspondiente
      if (categoriasCocinero1.includes(subcategoriaEncontrada)) {
        platosCocinero1.push(plato);
      } else if (categoriasCocinero2.includes(subcategoriaEncontrada)) {
        platosCocinero2.push(plato);
      }
    });
  
    if (platosCocinero1.length > 0) {
      pedidosCocina.push({
        id: generateUniqueId(),
        mesaId: pedido.mesaId,
        platos: platosCocinero1,
        cocinero: "cocinero_1"
      });
      actualizarPedidosCocinero("cocinero_1");
    }
  
    if (platosCocinero2.length > 0) {
      pedidosCocina.push({
        id: generateUniqueId(),
        mesaId: pedido.mesaId,
        platos: platosCocinero2,
        cocinero: "cocinero_2"
      });
      actualizarPedidosCocinero("cocinero_2");
    }
  });

  // Marcar un pedido como listo
  socket.on("pedidoListo", ({ pedidoId, cocinero }) => {
    // Encontrar el índice del pedido en la lista de pedidos pendientes
    const index = pedidosCocina.findIndex(p => p.id === pedidoId && p.cocinero === cocinero);
    
    if (index !== -1) {
      // Remover el pedido de la lista de pedidos pendientes
      const pedidoCompletado = pedidosCocina.splice(index, 1)[0];
  
      // Verificar si el cocinero tiene una lista de pedidos listos, si no, inicializarla
      if (!pedidosListos[cocinero]) {
        pedidosListos[cocinero] = [];
      }
  
      // Agregar el pedido completado a la lista de pedidos listos del cocinero
      pedidosListos[cocinero].push({
        mesaId: pedidoCompletado.mesaId,
        fechaHora: new Date().toLocaleString(), // Agregar la fecha y hora del pedido listo
        platos: pedidoCompletado.platos.map(plato => ({
          nombre: plato.nombre,
          cantidad: plato.cantidad
        })) // Guardar correctamente nombre y cantidad
      });
  
      // Emitir la actualización en tiempo real a los cocineros
      actualizarPedidosCocinero(cocinero);
    }
  });

  // Eliminar un pedido listo
  socket.on("eliminarPedidoListo", ({ index, cocinero }) => {
    pedidosListos[cocinero].splice(index, 1);
    actualizarPedidosCocinero(cocinero);
  });

  // Eliminar todos los pedidos listos
  socket.on("eliminarTodosPedidosListos", (cocinero) => {
    pedidosListos[cocinero] = [];
    actualizarPedidosCocinero(cocinero);
  });

  // Desconectar
  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
    delete cocinerosConectados[socket.id];
  });

  // Función para actualizar los pedidos de un cocinero en tiempo real
  function actualizarPedidosCocinero(cocinero) {
    for (const [id, rol] of Object.entries(cocinerosConectados)) {
      if (rol === cocinero) {
        // Enviar los pedidos pendientes
        io.to(id).emit("pedidosCocina", pedidosCocina.filter(p => p.cocinero === cocinero));
        
        // Enviar los pedidos listos
        io.to(id).emit("pedidosListos", pedidosListos[cocinero]);
      }
    }
  }

  function generateUniqueId() {
    return "pedido_" + Math.random().toString(36).substr(2, 9);
  }
});

