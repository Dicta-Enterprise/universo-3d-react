const BACK_URL = import.meta.env.VITE_BACKEND_NEST_API_URL

export async function fetchCategorias() {
    const response = await fetch(BACK_URL+'/api/categorias').catch(() => {
        //window.location.href = "/error"
    });
    if (!response.ok) {
        //window.location.href = "/error"
        throw new Error('Error al obtener categorias')
    }
    const planetas = await response.json();
    if(!planetas.data.isSuccess) {
        //window.location.href = "/error"
        throw new Error('Error al obtener planetas')
    }
    return planetas.data._value
}

export async function fetchCategoria(id) {
    const response = await fetch(BACK_URL+'/api/categorias/'+id).catch(() => {
        //window.location.href = "/error"
    });
    if (!response.ok) {
        //window.location.href = "/error"
        throw new Error('Error al obtener categoria')
    }
    const planetas = await response.json();
    if(!planetas.data.isSuccess) {
        //window.location.href = "/error"
        throw new Error('Error al obtener categoria')
    }
    return planetas.data._value
}