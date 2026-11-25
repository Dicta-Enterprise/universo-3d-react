import GalaxiaInterior from './GalaxiaInterior';

// Galaxia "Salud Mental" de la etapa Niño (ruta /ninos/salud_mental).
// Pantalla de Figma (imagen 4). Los planetas salen de data.js: los activos de la categoría "niños" de esta galaxia.
// (Antes esta página dibujaba su propia escena 3D con las decoraciones infantiles; ahora todas usan GalaxiaInterior.)
export default function SaludMental() {
    return <GalaxiaInterior etapa="ninos" galaxia="salud_mental" categoria="niños" />;
}