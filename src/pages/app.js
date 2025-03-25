// Array de cursos con texturas de planetas
const cursos = [
    {
      id: 1,
      nombre: "Viaje al Planeta Kio",
      descripcion: "Explora los secretos del Planeta Kio.",
      precio: 29.99,
      imagen: "../../public/assets/2k_makemake_fictional.jpg" // Textura de Kio
    },
    {
      id: 2,
      nombre: "Aventura en el Planeta Mer",
      descripcion: "Descubre la vida en el Planeta Mer.",
      precio: 39.99,
      imagen: "../../public/assets/2k_haumea_fictional.jpg" // Textura de Mer
    },
    {
      id: 3,
      nombre: "Exploración del Planeta Ven",
      descripcion: "Aprende sobre la salud en el Planeta Ven.",
      precio: 49.99,
      imagen: "../../public/assets/earthx5400x2700.jpg" // Textura de Ven
    },
    {
      id: 4,
      nombre: "Superficie de Venus",
      descripcion: "Explora la superficie de Venus.",
      precio: 59.99,
      imagen: "../../public/assets/2k_venus_surface.jpg"
    },
    {
      id: 5,
      nombre: "Atmósfera de Venus",
      descripcion: "Descubre la atmósfera de Venus.",
      precio: 69.99,
      imagen: "../../public/assets/2k_venus_atmosphere.jpg"
    },
    {
      id: 6,
      nombre: "Nubes de la Tierra",
      descripcion: "Observa las nubes de la Tierra desde el espacio.",
      precio: 79.99,
      imagen: "../../public/assets/2k_earth_clouds.jpg"
    },
    {
      id: 7,
      nombre: "Júpiter",
      descripcion: "Explora el gigante gaseoso Júpiter.",
      precio: 89.99,
      imagen: "../../public/assets/2k_jupiter.jpg"
    },
    {
      id: 8,
      nombre: "Marte",
      descripcion: "Descubre los misterios de Marte.",
      precio: 99.99,
      imagen: "../../public/assets/2k_mars.jpg"
    }
  ];
  
  // Carrito de compras
  let carrito = [];
  
  // Función para cargar los cursos en la página
  function cargarCursos() {
    const cursosContainer = document.getElementById("cursos-container");
    cursosContainer.innerHTML = ""; // Limpiar el contenedor antes de cargar los cursos
  
    cursos.forEach(curso => {
      const card = document.createElement("div");
      card.classList.add("col-md-4", "mb-4");
  
      // Verificar si el curso ya está en el carrito
      const enCarrito = carrito.some(item => item.id === curso.id);
  
      card.innerHTML = `
        <div class="card h-100">
          <img src="${curso.imagen}" class="card-img-top" alt="${curso.nombre}" onerror="this.src='https://via.placeholder.com/300x200';">
          <div class="card-body">
            <h5 class="card-title">${curso.nombre}</h5>
            <p class="card-text">${curso.descripcion}</p>
            <p class="card-text"><strong>Precio: $${curso.precio}</strong></p>
            <button class="btn btn-primary w-100" onclick="agregarAlCarrito(${curso.id})" ${enCarrito ? 'disabled' : ''}>
              ${enCarrito ? 'Agregado' : 'Agregar al Carrito'}
            </button>
          </div>
        </div>
      `;
  
      cursosContainer.appendChild(card);
    });
  }
  
  // Función para agregar un curso al carrito
  function agregarAlCarrito(id) {
    const curso = cursos.find(curso => curso.id === id);
    if (curso && !carrito.some(item => item.id === curso.id)) {
      carrito.push(curso);
      actualizarCarrito();
      // Abrir el offcanvas automáticamente
      const offcanvas = new bootstrap.Offcanvas(document.getElementById('carritoOffcanvas'));
      offcanvas.show();
      // Recargar los cursos para actualizar los botones
      cargarCursos();
    }
  }
  
  // Función para eliminar un curso del carrito
  function eliminarDelCarrito(id) {
    carrito = carrito.filter(curso => curso.id !== id);
    actualizarCarrito();
    // Recargar los cursos para actualizar los botones
    cargarCursos();
  }
  
  // Función para actualizar el carrito
  function actualizarCarrito() {
    const carritoLista = document.getElementById("carrito-lista");
    const carritoTotal = document.getElementById("carrito-total");
    const cartCount = document.getElementById("cart-count");
  
    // Limpiar la lista del carrito
    carritoLista.innerHTML = "";
  
    // Calcular el total
    let total = 0;
    carrito.forEach(curso => {
      total += curso.precio;
  
      // Crear una mini card para cada curso en el carrito
      const item = document.createElement("li");
      item.classList.add("list-group-item", "d-flex", "align-items-center");
  
      item.innerHTML = `
        <div class="flex-shrink-0">
          <img src="${curso.imagen}" alt="${curso.nombre}" style="width: 50px; height: 50px; border-radius: 50%; border: none;">
        </div>
        <div class="flex-grow-1 ms-3">
          <h6 class="mb-0 text-white">${curso.nombre}</h6> <!-- Texto blanco -->
          <small class="text-light">Precio: $${curso.precio}</small> <!-- Texto claro -->
        </div>
        <button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${curso.id})">
          <i class="fas fa-trash"></i>
        </button>
      `;
  
      carritoLista.appendChild(item);
    });
  
    // Actualizar el total y el contador del carrito
    carritoTotal.textContent = total.toFixed(2);
    cartCount.textContent = carrito.length;
  }
  
  // Función para finalizar la compra
  function finalizarCompra() {
    if (carrito.length > 0) {
      alert(`Compra finalizada. Total: $${carrito.reduce((sum, curso) => sum + curso.precio, 0).toFixed(2)}`);
      carrito = [];
      actualizarCarrito();
      // Recargar los cursos para actualizar los botones
      cargarCursos();
    } else {
      alert("El carrito está vacío.");
    }
  }
  
  // Cargar los cursos al iniciar la página
  document.addEventListener("DOMContentLoaded", cargarCursos);