const socket = io();
const categoriasContainer = document.getElementById("categorias-container");

// Platos iniciales organizados por categoría
const platosPorCategoria = {
  Platos_CHICOS: [
    { nombre: "Porción de pancita", precio: 13 },
    { nombre: "Porción de anticucho", precio: 13 },
    { nombre: "Porción de rachi", precio: 15 },
    { nombre: "Porción de mollejita", precio: 13 },
    { nombre: "Porción de pancho", precio: 4 },
    { nombre: "1P.Anti", precio: 7 },
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
    { nombre: "SALTADO DE POLLO A LO POBRE", precio: 15 },
    { nombre: "BISTECK A LO POBRE", precio: 16 },
    { nombre: "POLLO A LA PLANCHA A LO POBRE", precio: 16 },
    { nombre: "POLLO A LA PLANCHA ", precio: 12 },
    { nombre: "TALLARIN SALTADO DE CARNE", precio: 13 },
    { nombre: "TALLARIN SALTADO DE POLLO", precio: 12 },
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
    { nombre: "BROASTER POBRE (PURA PAPA)", precio: 14 },
    { nombre: "BROASTER POBRE (CON ARROZ)", precio: 14 },
    { nombre: "CHICHARRON DE POLLO POBRE (PURA PAPA)", precio: 13 },
    { nombre: "CHICHARRON DE POLLO POBRE (CON ARROZ)", precio: 13 },
    { nombre: "MOSTRITO BROASTER", precio: 11 },
  ],
  Platos_SALCHIPAPAS: [
    { nombre: "CLASICA", precio: 6.5 },
    { nombre: "MIXTA", precio: 9 },
    { nombre: "A LO POBRE", precio: 10 },
    { nombre: "MIXTA A LO POBRE", precio: 11 },
  ],
  BEBIDAS: [
    { nombre: "personal Inka", precio: 2.5 },
    { nombre: "Personal coka kola", precio: 2.5 },
    { nombre: "Gordita", precio: 5 },
    { nombre: "Yumbo", precio: 5 },
    { nombre: "1LT INKA", precio: 7 },
    { nombre: "1LT Coka kola", precio: 7 },
    { nombre: "1 1/2 LT Inka", precio: 9 },
    { nombre: "1 1/2 LT Coka kola", precio: 9 },
    { nombre: "1 Lt Chicha", precio: 7 },
    { nombre: "Café", precio: 2.5 },
    { nombre: "Té", precio: 2 },
    { nombre: "Anis", precio: 2 },
    { nombre: "Manzanilla", precio: 2 },
    { nombre: "Limonada", precio: 6 },
  ]
};

// Estado para contar los platos vendidos y su precio total
let platosVendidos = {
  Platos_CHICOS: {},
  Platos_CHICOS_CHOCLO: {},
  Platos_MIXTOS: {},
  Platos_Completos_1P: {},
  Platos_Completos_2P:{},
  Platos_Familares_2: {},
  Platos_Familares_4: {},
  Platos_CARTA: {},
  Platos_CHAUFA: {},
  Platos_SOPAS: {},
  Platos_BROASTER: {},
  Platos_SALCHIPAPAS: {},
  BEBIDAS: {}


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
