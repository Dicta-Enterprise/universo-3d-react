import DataPadres from "../Componentes/galaxias";
import { Link } from "react-router-dom";

const LandingPages = () => {
  return (
    <div>
      <h1>Bienvenido a la Galaxia de Padres</h1>
      {Object.entries(DataPadres).map(([categoriaKey, categoria]) => (
        <div key={categoriaKey}>
          <h2>{categoria.titulo}</h2>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {categoria.Planetas.map((planeta) => (
              <div key={planeta.id} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
                <h3>{planeta.nombre}</h3>
                <img src={planeta.imagenResumen} alt={planeta.nombre} width={150} />
                <p>{planeta.descripcionResumen}</p>
                <Link to={planeta.planetarlink.replace("/padres", "")}>
                  Ver más
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LandingPages;