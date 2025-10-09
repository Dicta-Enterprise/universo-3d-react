const BACK_URL = import.meta.env.VITE_BACKEND_NEST_API_URL

export async function fetchGalaxias() {
    const response = await fetch(BACK_URL+'/api/galaxias').catch(() => {
        window.location.href = "/error"
    });
    if (!response.ok) {
        window.location.href = "/error"
        throw new Error('Error al obtener galaxias')
    }
    const planetas = await response.json();
    if(!planetas.data.isSuccess) {
        window.location.href = "/error"
        throw new Error('Error al obtener galaxias')
    }
    return planetas.data._value
}

export async function fetchGalaxiasDeCategoria(categoriaID) {
    const response = await fetch(BACK_URL+'/api/galaxias?categoriaId='+categoriaID).catch(() => {
        //window.location.href = "/error"
    });
    if (!response.ok) {
        //window.location.href = "/error"
        throw new Error('Error al obtener galaxias')
    }
    const planetas = await response.json();
    if(!planetas.data.isSuccess) {
        //window.location.href = "/error"
        throw new Error('Error al obtener galaxias')
    }
    return planetas.data._value
}