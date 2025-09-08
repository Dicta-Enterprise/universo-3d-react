export async function fetchCategorias() {
  const response = await fetch('http://localhost:5000/api/categorias'); // Cambia el puerto si es necesario
  if (!response.ok) throw new Error('Error al obtener categorías');
  return await response.json();
}