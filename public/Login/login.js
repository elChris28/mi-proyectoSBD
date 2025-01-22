document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "1234") {
    localStorage.setItem("userRole", "mesas");
    window.location.href = "gestionMesas.html";
  } else if (username === "admin_categorias" && password === "5678") {
    localStorage.setItem("userRole", "categorias");
    window.location.href = "gestionCategorias.html";
  } else if (username === "cocinero" && password === "abcd") {
    localStorage.setItem("userRole", "cocinero");
    window.location.href = "gestionCocina.html";
  }

  else {
    const errorMessage = document.getElementById("error-message");
    errorMessage.classList.remove("hidden");
    setTimeout(() => errorMessage.classList.add("hidden"), 3000);
  }
});
