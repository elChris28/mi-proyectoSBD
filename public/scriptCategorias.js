const socket = io();
const categoriasContainer = document.getElementById("categorias-container");

// Platos organizados por Categoría y Subcategoría
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

// Estado para contar los platos vendidos
let platosVendidos = {
  Platos_Anticucheria:{
    Platos_CHICOS:{}
  }
  
};

// Inicializar la estructura de conteo
Object.keys(platosMenu).forEach((categoria) => {
  platosVendidos[categoria] = {};

  Object.keys(platosMenu[categoria]).forEach((subcategoria) => {
    platosVendidos[categoria][subcategoria] = {
      totalPrecio: 0,
      items: {}
    };

    platosMenu[categoria][subcategoria].forEach((plato) => {
      platosVendidos[categoria][subcategoria].items[plato.nombre] = { cantidad: 0, precio: plato.precio };
    });
  });
});

// Escuchar el historial de ventas en tiempo real desde el servidor
socket.on("historialVentas", (ventas) => {
  // Reiniciar contadores antes de recalcular
  Object.keys(platosVendidos).forEach((categoria) => {
    Object.keys(platosVendidos[categoria]).forEach((subcategoria) => {
      platosVendidos[categoria][subcategoria].totalPrecio = 0;

      Object.keys(platosVendidos[categoria][subcategoria].items).forEach((plato) => {
        platosVendidos[categoria][subcategoria].items[plato].cantidad = 0;
      });
    });
  });

  // Contar los platos vendidos por categoría y subcategoría
  ventas.forEach((venta) => {
    venta.platos.forEach((platoInfo) => {
      const [nombre, precioTexto] = platoInfo.split(" - $");
      const precio = parseFloat(precioTexto);

      Object.keys(platosMenu).forEach((categoria) => {
        Object.keys(platosMenu[categoria]).forEach((subcategoria) => {
          if (platosMenu[categoria][subcategoria].some((p) => p.nombre === nombre)) {
            platosVendidos[categoria][subcategoria].items[nombre].cantidad++;
            platosVendidos[categoria][subcategoria].totalPrecio += precio;
          }
        });
      });
    });
  });

  // Renderizar la interfaz con los datos actualizados
  renderizarPlatosVendidos();
});

// Función para renderizar la interfaz
function renderizarPlatosVendidos() {
  categoriasContainer.innerHTML = Object.keys(platosVendidos)
    .map(
      (categoria) => `
        <div class="categoria">
          <h2>${categoria}</h2>
          ${Object.keys(platosVendidos[categoria])
            .map(
              (subcategoria) => `
                <div class="subcategoria">
                  <h3>${subcategoria}</h3>
                  <ul>
                    ${Object.keys(platosVendidos[categoria][subcategoria].items)
                      .map(
                        (plato) => `
                          <li>${plato}: 
                            <strong>${platosVendidos[categoria][subcategoria].items[plato].cantidad}</strong> vendidos 
                            (Total: $${platosVendidos[categoria][subcategoria].items[plato].cantidad * platosVendidos[categoria][subcategoria].items[plato].precio})
                          </li>
                        `
                      )
                      .join("")}
                  </ul>
                  <h3>Total en ${subcategoria}: $${platosVendidos[categoria][subcategoria].totalPrecio}</h3>
                </div>
              `
            )
            .join("")}
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
