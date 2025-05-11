import React, { useState, useEffect } from "react";

// 🔹 Cursos adicionales con descuento (PlanetaMer y PlanetaVen)
const additionalCourses = [
  {
    id: "curso-mer",
    name: "Seguridad en Mer",
    price: 49.99,
    discount: 20,
    planeta: "Mer",
    resumen: "Curso avanzado sobre el planeta Mer.",
    beneficios: "Certificación en seguridad espacial.",
  },
  {
    id: "curso-ven",
    name: "Seguridad en Ven",
    price: 59.99,
    discount: 25,
    planeta: "Ven",
    resumen: "Curso avanzado sobre el planeta Ven.",
    beneficios: "Certificación en seguridad espacial.",
  },
];

// 🎨 Estilos mejorados
const styles = {
  body: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#0b0c10",
    color: "#c5c6c7",
    textAlign: "center",
    padding: "20px",
    minHeight: "100vh",
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  section: {
    marginBottom: "30px",
    padding: "20px",
    background: "#1f2833",
    borderRadius: "10px",
  },
  title: {
    color: "#66fcf1",
    fontSize: "26px",
    marginBottom: "10px",
  },
  button: {
    backgroundColor: "#45a29e",
    color: "white",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "5px",
    marginLeft: "10px",
  },
  footer: {
    marginTop: "50px",
    padding: "20px",
    backgroundColor: "#0b0c10",
    color: "#c5c6c7",
    textAlign: "center",
  },
  responsiveList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};

const App = () => {
  const [cart, setCart] = useState([]);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("Carrito cargado desde localStorage:", savedCart); // Depuración
    setCart(savedCart);
  }, []);

  // Sincronizar carrito con localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ Agregar curso con descuento (para los cursos recomendados)
  const addDiscountedCourse = (course) => {
    const discountedPrice = course.price - (course.price * course.discount) / 100;
    const existingItem = cart.find((item) => item.id === course.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === course.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...course, price: discountedPrice, quantity: 1 }]);
    }
  };

  // ❌ Eliminar curso
  const removeFromCart = (id) => {
    const updatedCart = cart
      .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
      .filter((item) => item.quantity > 0);
    setCart(updatedCart);
  };

  // 🔥 Calcular total
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ✅ Redirigir a la pasarela de pago
  const handleCheckout = () => {
    alert("Redirigiendo a la pasarela de pago...");
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        {/* ✅ Sección de cursos adicionales con descuento (PlanetaMer y PlanetaVen) */}
        <div style={styles.section}>
          <h2 style={styles.title}>🌟 Cursos Adicionales de Interés</h2>
          <p>¡Aprovecha estos cursos con descuento especial!</p>
          <div style={styles.responsiveList}>
            {additionalCourses.map((course) => (
              <div
                key={course.id}
                style={{
                  background: "#1f2833",
                  padding: "10px",
                  borderRadius: "8px",
                  width: "90%",
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  {course.name} -{" "}
                  <span style={{ textDecoration: "line-through", color: "#ff7675" }}>
                    ${course.price.toFixed(2)}
                  </span>{" "}
                  <strong>${(course.price - (course.price * course.discount) / 100).toFixed(2)}</strong>
                </span>
                <button style={styles.button} onClick={() => addDiscountedCourse(course)}>
                  Agregar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 🛒 Sección del carrito */}
        <div style={styles.section}>
          <h2 style={styles.title}>🛒 Carrito de Compras</h2>
          {cart.length === 0 ? (
            <p>El carrito está vacío</p>
          ) : (
            <div style={styles.responsiveList}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "#1f2833",
                    padding: "10px",
                    borderRadius: "8px",
                    width: "90%",
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    {item.name} - ${item.price.toFixed(2)} (x{item.quantity})
                  </span>
                  <button style={styles.button} onClick={() => removeFromCart(item.id)}>
                    ❌
                  </button>
                </div>
              ))}
            </div>
          )}
          <h3>Total: ${totalPrice.toFixed(2)}</h3>
          <button style={{ ...styles.button, fontSize: "16px", marginTop: "10px" }} onClick={handleCheckout}>
            🛒 Pagar
          </button>
        </div>

        {/* 📌 Pie de página corregido */}
        <footer style={styles.footer}>
          <p>© 2025 Academia Espacial de Seguridad Digital | Todos los derechos reservados</p>
        </footer>
      </div>
    </div>
  );
};

export default App;