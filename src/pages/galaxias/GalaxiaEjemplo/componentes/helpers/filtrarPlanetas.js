// src/pages/galaxias/GalaxiaEjemplo/helpers/filtrarPlanetas.js

export function getPlanetasVisiblesPorCategoria(planetas, categoriaId) {
  return planetas.filter(p => p.activo && p.categoriaId === categoriaId);
}