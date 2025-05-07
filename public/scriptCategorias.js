const socket = io();
const categoriasContainer = document.getElementById("categorias-container");
const filtroSelect = document.getElementById("categoria-select");
const btnExportarPDF = document.getElementById("btn-exportar-pdf");
const btnExportarExcel = document.getElementById("btn-exportar-excel");

// Platos organizados por Categoría y Subcategoría
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
    ],
  }

};

// Estado para contar los platos vendidos
let platosVendidos = {};
let ventasHistorial = [];
let categoriaFiltrada = "todas";

// Inicializar la estructura de conteo
function inicializarPlatosVendidos() {
  platosVendidos = {};
  Object.keys(platosMenu).forEach((categoria) => {
    platosVendidos[categoria] = {};
    Object.keys(platosMenu[categoria]).forEach((subcategoria) => {
      platosVendidos[categoria][subcategoria] = {
        totalPrecio: 0,
        items: {}
      };
      platosMenu[categoria][subcategoria].forEach((plato) => {
        platosVendidos[categoria][subcategoria].items[plato.nombre] = {
          cantidad: 0,
          precio: plato.precio
        };
      });
    });
  });

  // Llenar el filtro select
  filtroSelect.innerHTML = `<option value="todas">Todas</option>`;
  Object.keys(platosMenu).forEach((categoria) => {
    filtroSelect.innerHTML += `<option value="${categoria}">${categoria}</option>`;
  });
}

// Escuchar el historial de ventas en tiempo real desde el servidor
socket.on("historialVentas", (ventas) => {
  inicializarPlatosVendidos(); // Reiniciar antes de actualizar

  // Recorrer todas las ventas registradas
  ventas.forEach((venta) => {
    venta.platos.forEach((platoInfo) => {
      // Extraer el nombre y la cantidad del formato "nombre xN - $precio"
      const match = platoInfo.match(/(.+?) x(\d+) - \$(\d+(\.\d+)?)/);
      if (!match) return;

      const nombre = match[1].trim();
      const cantidad = parseInt(match[2]);
      const precio = parseFloat(match[3]);

      // Buscar en el menú y asignar la venta a la categoría correcta
      Object.keys(platosMenu).forEach((categoria) => {
        Object.keys(platosMenu[categoria]).forEach((subcategoria) => {
          if (platosMenu[categoria][subcategoria].some((p) => p.nombre === nombre)) {
            platosVendidos[categoria][subcategoria].items[nombre].cantidad += cantidad;
            platosVendidos[categoria][subcategoria].totalPrecio += cantidad * precio;
          }
        });
      });
    });
  });

  renderizarPlatosVendidos();
});

// Función para renderizar la interfaz con los platos vendidos
function renderizarPlatosVendidos() {
  categoriasContainer.innerHTML = "";

  Object.keys(platosVendidos).forEach((categoria) => {
    if (categoriaFiltrada !== "todas" && categoria !== categoriaFiltrada) return;

    let categoriaHTML = `
      <div class="categoria">
        <h2>${categoria}</h2>
    `;

    Object.keys(platosVendidos[categoria]).forEach((subcategoria) => {
      let listaPlatos = Object.entries(platosVendidos[categoria][subcategoria].items)
        .filter(([_, data]) => data.cantidad > 0)
        .map(([nombre, data]) =>
          `<li><strong>${nombre}</strong> — ${data.cantidad} vendidos <span class="importe">(S/ ${(
            data.precio * data.cantidad
          ).toFixed(2)})</span></li>`
        )
        .join("");

      if (listaPlatos) {
        categoriaHTML += `
          <div class="subcategoria">
            <h3>${subcategoria}</h3>
            <ul>${listaPlatos}</ul>
            <div class="subtotal">Total: <strong>S/ ${platosVendidos[categoria][subcategoria].totalPrecio.toFixed(
              2
            )}</strong></div>
          </div>
        `;
      }
    });

    categoriaHTML += "</div>";
    categoriasContainer.innerHTML += categoriaHTML;
  });
}

filtroSelect.addEventListener("change", () => {
  categoriaFiltrada = filtroSelect.value;
  renderizarPlatosVendidos();
});

// Exportar a Excel
btnExportarExcel.addEventListener("click", () => {
  const wb = XLSX.utils.book_new();
  const ws_data = [["Categoría", "Subcategoría", "Plato", "Cantidad", "Total S/"]];

  Object.entries(platosVendidos).forEach(([categoria, subcategorias]) => {
    if (categoriaFiltrada !== "todas" && categoria !== categoriaFiltrada) return;

    Object.entries(subcategorias).forEach(([subcategoria, datos]) => {
      Object.entries(datos.items).forEach(([nombre, data]) => {
        if (data.cantidad > 0) {
          ws_data.push([
            categoria,
            subcategoria,
            nombre,
            data.cantidad,
            (data.precio * data.cantidad).toFixed(2),
          ]);
        }
      });
    });
  });

  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, "Platos Vendidos");
  XLSX.writeFile(wb, "PlatosVendidos.xlsx");
});

// Exportar a PDF
btnExportarPDF.addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 10;

  doc.setFontSize(16);
  doc.text("Resumen de Platos Vendidos", 10, y);
  y += 10;

  Object.entries(platosVendidos).forEach(([categoria, subcategorias]) => {
    if (categoriaFiltrada !== "todas" && categoria !== categoriaFiltrada) return;

    doc.setFontSize(14);
    doc.text(`Categoría: ${categoria}`, 10, y);
    y += 8;

    Object.entries(subcategorias).forEach(([subcategoria, datos]) => {
      const items = Object.entries(datos.items).filter(([_, data]) => data.cantidad > 0);
      if (items.length === 0) return;

      doc.setFontSize(12);
      doc.text(`Subcategoría: ${subcategoria}`, 12, y);
      y += 6;

      items.forEach(([nombre, data]) => {
        const texto = `- ${nombre}: ${data.cantidad} vendidos (S/ ${(data.precio * data.cantidad).toFixed(2)})`;
        if (y > 270) {
          doc.addPage();
          y = 10;
        }
        doc.setFontSize(10);
        doc.text(texto, 14, y);
        y += 5;
      });

      y += 4;
    });

    y += 6;
  });

  doc.save("PlatosVendidos.pdf");
});

// Cerrar sesión
document.getElementById("logout-button").addEventListener("click", () => {
  localStorage.removeItem("userRole");
  window.location.href = "index.html";
});

// Inicializar los datos al cargar la página
inicializarPlatosVendidos();
