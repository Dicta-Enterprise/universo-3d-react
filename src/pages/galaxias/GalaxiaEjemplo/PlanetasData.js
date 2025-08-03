import { CATEGORIAS } from './CategoriasEnum';
import { GRUPOS } from './GruposEnum';
import { TEMAS } from './TemasEnum';

export const planetasEjemplo = [
  // 🌈 salud-mental
  {
    id: 1,
    grupo: GRUPOS.NIÑOS,
    nombre: "Calmito",
    activo: true,
    tema: TEMAS.SALUD_MENTAL,
    textura: "/assets/2k_neptune.jpg",
    url: "/galaxia/ninos/salud-mental/calmito",
    info: {
      tipoRiesgo: "Estrés infantil",
      tamaño: "5.000 km",
      composición: "Niebla de lavanda",
      riesgo: "Ansiedad",
      nivel: "Medio",
      ambiente: "Bosques flotantes",
      temperatura: "19°C",
      villano: "El Torbellino"
    }
  },
  {
    id: 2,
    grupo: GRUPOS.NIÑOS,
    nombre: "Mentis",
    activo: true,
    tema: TEMAS.SALUD_MENTAL,
    textura: "/assets/2k_mars.jpg",
    url: "/galaxia/ninos/salud-mental/mentis",
    info: {
      tipoRiesgo: "Desregulación emocional",
      tamaño: "4.700 km",
      composición: "Cristales musicales",
      riesgo: "Impulsividad",
      nivel: "Bajo",
      ambiente: "Cuevas armónicas",
      temperatura: "21°C",
      villano: "Eco el Confusor"
    }
  },
  {
    id: 3,
    grupo: GRUPOS.NIÑOS,
    nombre: "Pensadín",
    activo: true,
    tema: TEMAS.SALUD_MENTAL,
    textura: "/assets/2k_venus_surface.jpg",
    url: "/galaxia/ninos/salud-mental/pensadin",
    info: {
      tipoRiesgo: "Irritabilidad",
      tamaño: "5.100 km",
      composición: "Humo brillante",
      riesgo: "Frustración acumulada",
      nivel: "Medio",
      ambiente: "Montañas suaves",
      temperatura: "20°C",
      villano: "Ruido el Acelerado"
    }
  },

  // 🫂 salud-social
  {
    id: 4,
    grupo: GRUPOS.NIÑOS,
    nombre: "Risitas",
    activo: true,
    tema: "salud-social",
    textura: "/assets/2k_earth_clouds.jpg",
    url: "/galaxia/ninos/salud-social/risitas",
    info: {
      tipoRiesgo: "Aislamiento",
      tamaño: "5.100 km",
      composición: "Risas y burbujas",
      riesgo: "Poca interacción",
      nivel: "Bajo",
      ambiente: "Escuela divertida",
      temperatura: "24°C",
      villano: "Sombrío el Silenciador"
    }
  },
  {
    id: 5,
    grupo: GRUPOS.NIÑOS,
    nombre: "Amiguín",
    activo: true,
    tema: "salud-social",
    textura: "/assets/2k_saturn.jpg",
    url: "/galaxia/ninos/salud-social/amiguin",
    info: {
      tipoRiesgo: "Timidez extrema",
      tamaño: "4.900 km",
      composición: "Anillos de caramelos",
      riesgo: "Inseguridad social",
      nivel: "Medio",
      ambiente: "Plaza flotante",
      temperatura: "18°C",
      villano: "El Mudo Sombrío"
    }
  },
  {
    id: 6,
    grupo: GRUPOS.NIÑOS,
    nombre: "Silencio",
    activo: false,
    tema: "salud-social",
    textura: "/assets/2k_uranus.jpg",
    url: "/galaxia/ninos/salud-social/silencio",
    info: {
      tipoRiesgo: "Apatía social",
      tamaño: "5.200 km",
      composición: "Espuma densa",
      riesgo: "Soledad prolongada",
      nivel: "Alto",
      ambiente: "Islas invisibles",
      temperatura: "15°C",
      villano: "Mutis el Olvidado"
    }
  },

  // 🏃 salud-fisica
  {
    id: 7,
    grupo: GRUPOS.NIÑOS,
    nombre: "Vitalito",
    activo: true,
    tema: "salud-fisica",
    textura: "/assets/2k_earth_clouds.jpg",
    url: "/galaxia/ninos/salud-fisica/vitalito",
    info: {
      tipoRiesgo: "Sedentarismo",
      tamaño: "5.000 km",
      composición: "Hierba luminosa",
      riesgo: "Fatiga",
      nivel: "Medio",
      ambiente: "Senderos saltarines",
      temperatura: "23°C",
      villano: "Perezón"
    }
  },
  {
    id: 8,
    grupo: GRUPOS.NIÑOS,
    nombre: "Corpalin",
    activo: true,
    tema: "salud-fisica",
    textura: "/assets/2k_jupiter.jpg",
    url: "/galaxia/ninos/salud-fisica/corpalin",
    info: {
      tipoRiesgo: "Hábitos alimentarios",
      tamaño: "4.800 km",
      composición: "Nubes nutricionales",
      riesgo: "Desnutrición",
      nivel: "Bajo",
      ambiente: "Cascadas de fruta",
      temperatura: "25°C",
      villano: "Chatarro"
    }
  },
  {
    id: 9,
    grupo: GRUPOS.NIÑOS,
    nombre: "Oxigenín",
    activo: false,
    tema: "salud-fisica",
    textura: "/assets/2k_mars.jpg",
    url: "/galaxia/ninos/salud-fisica/oxigenin",
    info: {
      tipoRiesgo: "Contaminación",
      tamaño: "5.300 km",
      composición: "Esferas verdes",
      riesgo: "Tos persistente",
      nivel: "Alto",
      ambiente: "Bosques oxidados",
      temperatura: "30°C",
      villano: "Smogo"
    }
  },

  // 💻 peligros-digitales
  {
    id: 10,
    grupo: GRUPOS.NIÑOS,
    nombre: "Tecnotín",
    activo: true,
    tema: "peligros-digitales",
    textura: "/assets/2k_neptune.jpg",
    url: "/galaxia/ninos/peligros-digitales/tecnotin",
    info: {
      tipoRiesgo: "Pantalla excesiva",
      tamaño: "5.100 km",
      composición: "LEDs flotantes",
      riesgo: "Irritabilidad",
      nivel: "Medio",
      ambiente: "Bosques de píxeles",
      temperatura: "27°C",
      villano: "El Parpadeo"
    }
  },
  {
    id: 11,
    grupo: GRUPOS.NIÑOS,
    nombre: "Datin",
    activo: true,
    tema: "peligros-digitales",
    textura: "/assets/2k_uranus.jpg",
    url: "/galaxia/ninos/peligros-digitales/datin",
    info: {
      tipoRiesgo: "Desinformación",
      tamaño: "5.000 km",
      composición: "Bits etéreos",
      riesgo: "Confusión digital",
      nivel: "Alto",
      ambiente: "Torres de datos",
      temperatura: "20°C",
      villano: "El Fakeador"
    }
  },
  {
    id: 12,
    grupo: GRUPOS.NIÑOS,
    nombre: "Apagón",
    activo: false,
    tema: "peligros-digitales",
    textura: "/assets/2k_saturn.jpg",
    url: "/galaxia/ninos/peligros-digitales/apagon",
    info: {
      tipoRiesgo: "Desconexión total",
      tamaño: "5.200 km",
      composición: "Energía fragmentada",
      riesgo: "Falta de atención",
      nivel: "Crítico",
      ambiente: "Zona sin señal",
      temperatura: "26°C",
      villano: "El Cortacircuitos"
    }
  },
  // 🧠 salud-mental
  {
    id: 13,
    grupo: GRUPOS.JOVENES,
    nombre: "Euforia",
    activo: true,
    tema: TEMAS.SALUD_MENTAL,
    textura: "/assets/2k_jupiter.jpg",
    url: "/galaxia/jovenes/salud-mental/euforia",
    info: {
      tipoRiesgo: "Impulsividad",
      tamaño: "7.300 km",
      composición: "Ondas de energía",
      riesgo: "Inestabilidad emocional",
      nivel: "Alto",
      ambiente: "Tormentas mentales",
      temperatura: "31°C",
      villano: "El Impulsor"
    }
  },
  {
    id: 14,
    grupo: GRUPOS.JOVENES,
    nombre: "Serenix",
    activo: true,
    tema: TEMAS.SALUD_MENTAL,
    textura: "/assets/2k_earth_clouds.jpg",
    url: "/galaxia/jovenes/salud-mental/serenix",
    info: {
      tipoRiesgo: "Presión académica",
      tamaño: "6.900 km",
      composición: "Bruma concentrada",
      riesgo: "Estrés acumulado",
      nivel: "Medio",
      ambiente: "Bibliotecas flotantes",
      temperatura: "26°C",
      villano: "El Demandante"
    }
  },
  {
    id: 15,
    grupo: GRUPOS.JOVENES,
    nombre: "Confusón",
    activo: false,
    tema: TEMAS.SALUD_MENTAL,
    textura: "/assets/2k_mars.jpg",
    url: "/galaxia/jovenes/salud-mental/confuson",
    info: {
      tipoRiesgo: "Identidad difusa",
      tamaño: "6.600 km",
      composición: "Neblina gris",
      riesgo: "Autoimagen confusa",
      nivel: "Medio",
      ambiente: "Laberintos circulares",
      temperatura: "22°C",
      villano: "El Fragmentador"
    }
  },

  // 🫂 salud-social
  {
    id: 16,
    grupo: GRUPOS.JOVENES,
    nombre: "Conexión",
    activo: true,
    tema: "salud-social",
    textura: "/assets/2k_mars.jpg",
    url: "/galaxia/jovenes/salud-social/conexion",
    info: {
      tipoRiesgo: "Desconexión emocional",
      tamaño: "7.000 km",
      composición: "Redes vivas",
      riesgo: "Aislamiento",
      nivel: "Alto",
      ambiente: "Foros flotantes",
      temperatura: "29°C",
      villano: "El Desvinculador"
    }
  },
  {
    id: 17,
    grupo: GRUPOS.JOVENES,
    nombre: "Círculo",
    activo: true,
    tema: "salud-social",
    textura: "/assets/2k_neptune.jpg",
    url: "/galaxia/jovenes/salud-social/circulo",
    info: {
      tipoRiesgo: "Presión social",
      tamaño: "6.700 km",
      composición: "Órbitas de palabras",
      riesgo: "Autoexclusión",
      nivel: "Medio",
      ambiente: "Zonas grupales",
      temperatura: "24°C",
      villano: "El Influencer"
    }
  },
  {
    id: 18,
    grupo: GRUPOS.JOVENES,
    nombre: "Sombras",
    activo: false,
    tema: "salud-social",
    textura: "/assets/2k_jupiter.jpg",
    url: "/galaxia/jovenes/salud-social/sombras",
    info: {
      tipoRiesgo: "Bullying",
      tamaño: "6.800 km",
      composición: "Oscuridad espiral",
      riesgo: "Acoso silencioso",
      nivel: "Crítico",
      ambiente: "Pasillos ocultos",
      temperatura: "20°C",
      villano: "El Acosador"
    }
  },

  // 🏃 salud-fisica
  {
    id: 19,
    grupo: GRUPOS.JOVENES,
    nombre: "Motrion",
    activo: true,
    tema: "salud-fisica",
    textura: "/assets/2k_mars.jpg",
    url: "/galaxia/jovenes/salud-fisica/motrion",
    info: {
      tipoRiesgo: "Vida sedentaria",
      tamaño: "7.200 km",
      composición: "Rocas energéticas",
      riesgo: "Fatiga general",
      nivel: "Medio",
      ambiente: "Zonas deportivas",
      temperatura: "27°C",
      villano: "El Reposón"
    }
  },
  {
    id: 20,
    grupo: GRUPOS.JOVENES,
    nombre: "Nutrilia",
    activo: true,
    tema: "salud-fisica",
    textura: "/assets/2k_saturn.jpg",
    url: "/galaxia/jovenes/salud-fisica/nutrilia",
    info: {
      tipoRiesgo: "Desequilibrio alimenticio",
      tamaño: "6.900 km",
      composición: "Semillas flotantes",
      riesgo: "Desnutrición / sobrepeso",
      nivel: "Alto",
      ambiente: "Huertos orbitales",
      temperatura: "25°C",
      villano: "El Azucarón"
    }
  },
  {
    id: 21,
    grupo: GRUPOS.JOVENES,
    nombre: "Desconectón",
    activo: false,
    tema: "salud-fisica",
    textura: "/assets/2k_saturn.jpg",
    url: "/galaxia/jovenes/salud-fisica/desconecton",
    info: {
      tipoRiesgo: "Fatiga crónica",
      tamaño: "7.100 km",
      composición: "Cápsulas opacas",
      riesgo: "Debilidad corporal",
      nivel: "Bajo",
      ambiente: "Páramos estáticos",
      temperatura: "22°C",
      villano: "El Apático"
    }
  },

  // 💻 peligros-digitales
  {
    id: 22,
    grupo: GRUPOS.JOVENES,
    nombre: "Digitox",
    activo: true,
    tema: "peligros-digitales",
    textura: "/assets/2k_uranus.jpg",
    url: "/galaxia/jovenes/peligros-digitales/digitox",
    info: {
      tipoRiesgo: "Adicción a redes",
      tamaño: "7.000 km",
      composición: "Señales repetidas",
      riesgo: "Desconcentración",
      nivel: "Alto",
      ambiente: "Picos virales",
      temperatura: "26°C",
      villano: "El Scroll Infinito"
    }
  },
  {
    id: 23,
    grupo: GRUPOS.JOVENES,
    nombre: "Infoburbuja",
    activo: true,
    tema: "peligros-digitales",
    textura: "/assets/2k_uranus.jpg",
    url: "/galaxia/jovenes/peligros-digitales/infoburbuja",
    info: {
      tipoRiesgo: "Falsas noticias",
      tamaño: "6.800 km",
      composición: "Capas de opinión",
      riesgo: "Desinformación",
      nivel: "Alto",
      ambiente: "Burbujas mediáticas",
      temperatura: "33°C",
      villano: "El Distorsionador"
    }
  },
  {
    id: 24,
    grupo: GRUPOS.JOVENES,
    nombre: "Lagón",
    activo: false,
    tema: "peligros-digitales",
    textura: "/assets/2k_haumea_fictional.jpg",
    url: "/galaxia/jovenes/peligros-digitales/lagon",
    info: { tipoRiesgo: "Fatiga tecnológica", tamaño: "6.900 km", composición: "Códigos corrompidos", riesgo: "Estrés visual", nivel: "Medio", ambiente: "Pantallas parpadeantes", temperatura: "29°C", villano: "Laggster" }
  },
    // 🧠 salud-mental
  {
    id: 25,
    grupo: GRUPOS.PADRES,
    nombre: "Neuronia",
    activo: true,
    tema: TEMAS.SALUD_MENTAL,
    textura: "/assets/2k_mars.jpg",
    url: "/galaxia/salud-mental/neuronia",
    info: {
      tipoRiesgo: "Sobrecarga emocional",
      tamaño: "7.500 km",
      composición: "Ondas cerebrales",
      riesgo: "Ansiedad laboral",
      nivel: "Crítico",
      ambiente: "Ciudades mentales",
      temperatura: "28°C",
      villano: "El Rumiante"
    }
  },
  {
    id: 26,
    grupo: GRUPOS.PADRES,
    nombre: "Tranquilis",
    activo: true,
    tema: TEMAS.SALUD_MENTAL,
    textura: "/assets/2k_neptune.jpg",
    url: "/galaxia/salud-mental/tranquilis",
    info: {
      tipoRiesgo: "Estrés crónico",
      tamaño: "7.300 km",
      composición: "Agua calma",
      riesgo: "Irritabilidad",
      nivel: "Alto",
      ambiente: "Espejos infinitos",
      temperatura: "25°C",
      villano: "El Apurador"
    }
  },
  {
    id: 27,
    grupo: GRUPOS.PADRES,
    nombre: "Caóticon",
    activo: false,
    tema: TEMAS.SALUD_MENTAL,
    textura: "/assets/2k_saturn.jpg",
    url: "/galaxia/salud-mental/caoticon",
    info: {
      tipoRiesgo: "Desorganización emocional",
      tamaño: "7.000 km",
      composición: "Relámpagos mentales",
      riesgo: "Desborde afectivo",
      nivel: "Medio",
      ambiente: "Vórtices de tareas",
      temperatura: "30°C",
      villano: "El Agobiador"
    }
  },

  // 🫂 salud-social
  {
    id: 28,
    grupo: GRUPOS.PADRES,
    nombre: "Redalia",
    activo: true,
    tema: "salud-social",
    textura: "/assets/2k_earth_clouds.jpg",
    url: "/galaxia/salud-social/redalia",
    info: {
      tipoRiesgo: "Aislamiento",
      tamaño: "7.100 km",
      composición: "Hilos sociales",
      riesgo: "Falta de vínculos",
      nivel: "Alto",
      ambiente: "Círculos suspendidos",
      temperatura: "27°C",
      villano: "El Individualista"
    }
  },
  {
    id: 29,
    grupo: GRUPOS.PADRES,
    nombre: "Colaboris",
    activo: true,
    tema: "salud-social",
    textura: "/assets/2k_mars.jpg",
    url: "/galaxia/salud-social/colaboris",
    info: {
      tipoRiesgo: "Ambiente hostil",
      tamaño: "7.400 km",
      composición: "Esferas compartidas",
      riesgo: "Fricción interpersonal",
      nivel: "Medio",
      ambiente: "Salas sin puertas",
      temperatura: "26°C",
      villano: "El Competidor"
    }
  },
  {
    id: 30,
    grupo: GRUPOS.PADRES,
    nombre: "Ausentia",
    activo: false,
    tema: "salud-social",
    textura: "/assets/2k_uranus.jpg",
    url: "/galaxia/padres/salud-social/ausentia",
    info: {
      tipoRiesgo: "Desconexión afectiva",
      tamaño: "7.200 km",
      composición: "Vacíos resonantes",
      riesgo: "Apatía relacional",
      nivel: "Crítico",
      ambiente: "Espacios sin eco",
      temperatura: "22°C",
      villano: "El Silencioso"
    }
  },

  // 🏃 salud-fisica
  {
    id: 31,
    grupo: GRUPOS.PADRES,
    nombre: "Vitalor",
    activo: true,
    tema: "salud-fisica",
    textura: "/assets/2k_earth_clouds.jpg",
    url: "/galaxia/salud-fisica/vitalor",
    info: {
      tipoRiesgo: "Desgaste físico",
      tamaño: "7.500 km",
      composición: "Tierra fértil",
      riesgo: "Dolencias posturales",
      nivel: "Medio",
      ambiente: "Rutas de energía",
      temperatura: "23°C",
      villano: "El Fatigón"
    }
  },
  {
    id: 32,
    grupo: GRUPOS.PADRES,
    nombre: "Nutralia",
    activo: true,
    tema: "salud-fisica",
    textura: "/assets/2k_venus_surface.jpg",
    url: "/galaxia/salud-fisica/nutralia",
    info: {
      tipoRiesgo: "Alimentación desequilibrada",
      tamaño: "7.300 km",
      composición: "Capas nutricionales",
      riesgo: "Metabolismo alterado",
      nivel: "Alto",
      ambiente: "Cadenas digestivas",
      temperatura: "27°C",
      villano: "El Procesado"
    }
  },
  {
    id: 33,
    grupo: GRUPOS.PADRES,
    nombre: "Inerción",
    activo: false,
    tema: "salud-fisica",
    textura: "/assets/2k_jupiter.jpg",
    url: "/galaxia/salud-fisica/inercion",
    info: {
      tipoRiesgo: "Inactividad prolongada",
      tamaño: "7.600 km",
      composición: "Materia letárgica",
      riesgo: "Fatiga constante",
      nivel: "Bajo",
      ambiente: "Llanuras quietas",
      temperatura: "21°C",
      villano: "El Estático"
    }
  },

  // 💻 peligros-digitales
  {
    id: 34,
    grupo: GRUPOS.PADRES,
    nombre: "Infox",
    activo: true,
    tema: "peligros-digitales",
    textura: "/assets/2k_mars.jpg",
    url: "/galaxia/peligros-digitales/infox",
    info: {
      tipoRiesgo: "Infoxicación",
      tamaño: "7.000 km",
      composición: "Flujos incontrolables",
      riesgo: "Estrés cognitivo",
      nivel: "Crítico",
      ambiente: "Tormentas de datos",
      temperatura: "33°C",
      villano: "El Repetidor"
    }
  },
  {
    id: 35,
    grupo: GRUPOS.PADRES,
    nombre: "Redas",
    activo: true,
    tema: "peligros-digitales",
    textura: "/assets/2k_jupiter.jpg",
    url: "/galaxia/padres/peligros-digitales/redas",
    info: {
      tipoRiesgo: "Dependencia tecnológica",
      tamaño: "7.200 km",
      composición: "Circuitos vivos",
      riesgo: "Desvinculación real",
      nivel: "Alto",
      ambiente: "Interfaz total",
      temperatura: "28°C",
      villano: "El Enlazador"
    }
  },
  {
    id: 36,
    grupo: GRUPOS.PADRES,
    nombre: "VacioNet",
    activo: false,
    tema: "peligros-digitales",
    textura: "/assets/2k_mars.jpg",
    url: "/galaxia/padres/peligros-digitales/vacionet",
    info: {
      tipoRiesgo: "Aburrimiento digital",
      tamaño: "7.300 km",
      composición: "Bytes huecos",
      riesgo: "Desánimo cibernético",
      nivel: "Medio",
      ambiente: "Foros vacíos",
      temperatura: "26°C",
      villano: "El Scroll Eterno"
    }
  }
];

export default planetasEjemplo;
