import GalaxiaInterior from './GalaxiaInterior';

// Galaxia "Peligros Digitales" de la etapa Niño (ruta /ninos/peligros_digitales).
// Pantalla de Figma (imagen 4). Los planetas salen de data.js: los activos de la categoría "niños" de esta galaxia.
// (Antes esta página dibujaba su propia escena 3D con las decoraciones infantiles; ahora todas usan GalaxiaInterior.)
export default function PeligrosDigitales() {
    return <GalaxiaInterior etapa="ninos" galaxia="peligros_digitales" categoria="niños" />;
}