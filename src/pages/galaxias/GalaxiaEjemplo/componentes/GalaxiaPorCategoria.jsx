import { useParams } from "react-router-dom";
import { planetasEjemplo } from '../PlanetasData';
import GalaxiaGenerica from "../GalaxiaGenerica";

// Utilidades
function categoriaIdPorGrupo(grupo) {
  switch (grupo) {
    case "ninos": return 1;
    case "jovenes": return 2;
    case "padres": return 3;
    default: return null;
  }
}

function fondoPorCategoria(categoriaId) {
  switch (categoriaId) {
    case 1: return "ninos";
    case 2: return "jovenes";
    case 3: return "padres";
    default: return null;
  }
}

function colorPorTema(tema) {
  switch (tema) {
    case "salud-mental": return "#00c0ff";
    case "salud-social": return "#ff90d3";
    case "salud-fisica": return "#aaff77";
    case "peligros-digitales": return "#ffa400";
    default: return "#ffffff";
  }
}

export default function GalaxiaPorCategoria() {
  const { grupo, tema } = useParams();
  const categoriaId = categoriaIdPorGrupo(grupo);

  if (!grupo || !tema || !categoriaId) {
    return (
      <div style={{ color: "white", textAlign: "center", padding: "3rem" }}>
        🚫 Ruta o grupo no reconocido. Esta galaxia no ha sido registrada.
      </div>
    );
  }

  // 💥 Filtramos directo desde la data
  const planetas = planetasEjemplo.filter(
    (p) => p.grupo === grupo && p.tema === tema && p.activo
  );

  if (planetas.length === 0) {
    return (
      <div style={{ color: "black", textAlign: "center", padding: "3rem" }}>
        🚧 Nada para mostrar, aún...
      </div>
    );
  }

  const fondo = fondoPorCategoria(categoriaId);
  const color = colorPorTema(tema);

  return (
    <GalaxiaGenerica
      titulo={`🌌 Galaxia de ${tema.replace("-", " ")}`}
      color={color}
      planetas={planetas}
      tipoFondo={fondo}
      backUrl="/"
    />
  );
}