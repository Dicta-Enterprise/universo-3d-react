// Un solo registro por slug (usa el slug que tú definas en cada planeta)
export const PLANET_EXTRAS = {
  calmito: {
    peligros: [
      {
            nombre: "🌐 Ciberbullying",
            descripcion: "🛑 Acoso virtual que puede llevar a la víctima a sufrir daños emocionales y psicológicos.",
            nivelRiesgo: "🔴 Alto",
            temperatura: "🌡️ -30°C a 127°C",
            villano: "👾 Ciberbull",
            cta: "🚀 Visita al planeta KIO",
        },
        {
            nombre: "🌪️ Tormentas de arena eléctricas",
            descripcion: "⚡ Fenómenos climáticos extremos que pueden dañar equipos y estructuras.",
            nivelRiesgo: "🟠 Medio",
            temperatura: "🌡️ -50°C a 150°C",
            villano: "🌀 Electrostorm",
            cta: "🚀 Visita al planeta KIO",
        },
        {
            nombre: "🌧️ Lluvias ácidas",
            descripcion: "☣️ Precipitaciones corrosivas que afectan el ambiente y la salud.",
            nivelRiesgo: "🔴 Alto",
            temperatura: "🌡️ -20°C a 100°C",
            villano: "☠️ Acidrain",
            cta: "🚀 Visita al planeta KIO",
        },
      // ...
    ],
    beneficios: [
        {
            titulo: "📚 Comprensión profunda de Kio",
            descripcion: "🪐 Conoce todos los detalles sobre este fascinante planeta.",
        },
        {
            titulo: "🛠️ Habilidades prácticas",
            descripcion: "🧭 Aprende a navegar y sobrevivir en los desafíos únicos de Kio.",
        },
        {
            titulo: "📜 Certificación reconocida",
            descripcion: "🎓 Obtén un certificado que valide tus conocimientos.",
        },
    ],
  },

};

// Helper para no repetir lógica en todos lados
export function getExtras(slug) {
  return PLANET_EXTRAS[slug] ?? { peligros: [], beneficios: [] };
}
