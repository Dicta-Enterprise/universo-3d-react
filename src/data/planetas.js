const BACK_URL = import.meta.env.VITE_BACKEND_NEST_API_URL

export async function fetchPlanetas() {
    const response = await fetch(BACK_URL+'planetas').catch(() => {
        window.location.href = "/error"
    });
    if (!response.ok) {
        window.location.href = "/error"
        throw new Error('Error al obtener planetas')
    }
    const planetas = await response.json();
    if(!planetas.data.isSuccess) {
        window.location.href = "/error"
        throw new Error('Error al obtener planetas')
    }
    return planetas.data._value
}
export async function fetchPlanetasEnGalaxia(idGalaxia) {
    const response = await fetch(BACK_URL+'planetas?galaxiaId='+idGalaxia).catch(() => {
        window.location.href = "/error"
    })
    if (!response.ok) {
        window.location.href = "/error"
        throw new Error('Error al obtener planetas')
    };
    const planetas = await response.json();
    if(!planetas.data.isSuccess) {
        window.location.href = "/error"
        throw new Error('Error al obtener planetas')
    }
    return planetas.data._value
}
export async function fetchPlaneta(id) {
    const response = await fetch(BACK_URL+'planetas/'+id).catch(() => {
        window.location.href = "/error"
    });
    if (!response.ok) {
        window.location.href = "/error"
        throw new Error('Error al obtener planeta')
    }
    const planeta = await response.json();
    if(!planeta.data.isSuccess) {
        window.location.href = "/error"
        throw new Error('Error al obtener planeta')
    }
    return planeta.data._value
}

export async function fetchColorPlaneta(id) {
    const response = await fetch(BACK_URL+'galaxias/'+id);
    if (!response.ok) {
        window.location.href = "/error"
        throw new Error('Error al obtener galaxia')
    }
    const planeta = await response.json();
    if(!planeta.data.isSuccess) {
        window.location.href = "/error"
        throw new Error('Error al obtener galaxia')
    }
    return planeta.data._value
}

export async function fetchColorPlanetaPrueba() {
    const response = await fetch(BACK_URL+'galaxias/').catch(() => {
        window.location.href = "/error"
    });
    if (!response.ok) {
        window.location.href = "/error"
        throw new Error('Error al obtener galaxias')
    }
    const planeta = await response.json();
    if(!planeta.data.isSuccess) {
        window.location.href = "/error"
        throw new Error('Error al obtener galaxias')
    }
    return planeta.data._value[0]
}