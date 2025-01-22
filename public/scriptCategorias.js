const socket = io();
const categoriasContainer = document.getElementById("categorias-container");

// Platos iniciales organizados por categoría
const platosPorCategoria = {
  Carta: [
    { nombre: "Anticuchos", precio: 15 },
    { nombre: "Rachi", precio: 12 },
    { nombre: "Choncholí", precio: 10 }
  ],
  Bebidas: [
    { nombre: "Chicha Morada", precio: 5 },
    { nombre: "Agua Mineral", precio: 3 },
    { nombre: "Cerveza", precio: 8 }
  ]
};

// Estado para contar los platos vendidos y su precio total
let platosVendidos = {
  Carta: {},
  Bebidas: {}
};

// Inicializar el conteo de platos y precios
Object.keys(platosPorCategoria).forEach((categoria) => {
  platosVendidos[categoria] = {
    totalPrecio: 0,
    items: {}
  };
  platosPorCategoria[categoria].forEach((plato) => {
    platosVendidos[categoria].items[plato.nombre] = { cantidad: 0, precio: plato.precio };
  });
});

// Escuchar el historial de ventas desde el servidor
socket.on("historialVentas", (ventas) => {
  // Resetear los contadores antes de recalcular
  Object.keys(platosVendidos).forEach((categoria) => {
    platosVendidos[categoria].totalPrecio = 0;
    Object.keys(platosVendidos[categoria].items).forEach((plato) => {
      platosVendidos[categoria].items[plato].cantidad = 0;
    });
  });

    // Contar los platos vendidos por categoría
    ventas.forEach((venta) => {
      venta.platos.forEach((platoInfo) => {
        const [nombre, precioTexto] = platoInfo.split(" - $");
        const precio = parseFloat(precioTexto);
  
        Object.keys(platosPorCategoria).forEach((categoria) => {
          if (platosPorCategoria[categoria].some((p) => p.nombre === nombre)) {
            platosVendidos[categoria].items[nombre].cantidad++;
            platosVendidos[categoria].totalPrecio += precio;
          }
        });
      });
    });

  // Renderizar el conteo actualizado
  renderizarPlatosVendidos();
});

// Renderizar los platos vendidos en la interfaz con total de precio
function renderizarPlatosVendidos() {
  categoriasContainer.innerHTML = Object.keys(platosVendidos)
    .map(
      (categoria) => `
        <div class="categoria">
          <h2>${categoria}</h2>
          <ul>
            ${Object.keys(platosVendidos[categoria].items)
              .map(
                (plato) => `
                  <li>${plato}: 
                    <strong>${platosVendidos[categoria].items[plato].cantidad}</strong> vendidos 
                    (Total: $${platosVendidos[categoria].items[plato].cantidad * platosVendidos[categoria].items[plato].precio})
                  </li>
                `
              )
              .join("")}
          </ul>
          <h3>Total en ${categoria}: $${platosVendidos[categoria].totalPrecio}</h3>
        </div>
      `
    )
    .join("");
}



// Cerrar sesión
document.getElementById("logout-button").addEventListener("click", () => {
  localStorage.removeItem("userRole");
  window.location.href = "index.html";
});
