export async function fetchGalaxias() {
  const response = await fetch('http://localhost:5000/api/galaxias'); // Cambia la URL si es necesario
  if (!response.ok) throw new Error('Error al obtener galaxias');
  return await response.json();
}