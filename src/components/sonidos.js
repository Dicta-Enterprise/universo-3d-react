// ============================================================================================
// GESTOR ÚNICO DE AUDIO de toda la aplicación. Todos los sonidos pasan por aquí, así un solo
// interruptor (el icono de sonido de la esquina, en Home) los controla a todos:
//   clic     ABRIR-BOTON.wav           clic en iconos, botones, enlaces y galaxias
//   motor    rocket_engine.001.wav     motor del cohete cuando empieza a moverse
//   tecla    typewriter-key.mp3        una pulsación por cada letra que se escribe
//   campana  typewriter-bell.mp3       salto de línea de la máquina de escribir
//   magia    magic.mp3                 al confirmar una galaxia (acercamiento)
//   clicEspacio  click-space.mp3       flechas / cambio de planeta en las páginas de galaxia
//   planeta  Planeta.mp3               al ingresar a un planeta
// Los archivos están en public/assets/sounds/ (se sirven como /assets/sounds/...).
//
// SILENCIO GLOBAL: establecerSonidoActivo(false) corta de inmediato todo lo que suena y bloquea
// cualquier reproducción posterior; establecerSonidoActivo(true) los habilita otra vez SIN
// reproducir nada de lo que se perdió. La preferencia se guarda en localStorage, así se mantiene
// al navegar entre Home, Niño, Joven y Padre (cada sección es una página distinta).
//
// ESCRITURA: reproducirTecla() suena por cada letra (la llama la máquina de escribir justo cuando
// aparece la letra) y detenerEscritura() corta tecla y campana en cuanto termina o se cancela el
// texto, así no queda nada sonando.
//
// CLIC sin duplicados: hay UN solo escuchador de clics en todo el documento (se instala al importar
// este módulo) y reproducirClic() ignora llamadas a menos de 120 ms de la anterior. Los clics sobre
// un <canvas> 3D (galaxias, cohetes) los llaman a mano. Un elemento con data-sin-sonido no suena.
// ============================================================================================

const RUTAS = {
    clic: '/assets/sounds/ABRIR-BOTON.wav',
    motor: '/assets/sounds/rocket_engine.001.wav',
    tecla: '/assets/sounds/typewriter-key.mp3',
    campana: '/assets/sounds/typewriter-bell.mp3',
    magia: '/assets/sounds/magic.mp3',
    clicEspacio: '/assets/sounds/click-space.mp3',
    planeta: '/assets/sounds/Planeta.mp3',
};
const VOLUMEN = { clic: 0.6, motor: 0.7, tecla: 1, campana: 1, magia: 0.5, clicEspacio: 0.5, planeta: 0.5 };
const INTERVALO_MIN_CLIC_MS = 120;
const CLAVE_PREFERENCIA = 'universo:sonido'; // 'off' = silenciado

// Lo que cuenta como "interactivo" para el sonido de clic
const SELECTOR_INTERACTIVO = [
    'button',
    'a[href]',
    '[role="button"]',
    'summary',
    'select',
    'input[type="button"]',
    'input[type="submit"]',
    'input[type="checkbox"]',
    'input[type="radio"]',
].join(',');

const audios = {};
const avisos = {};
let ultimoClicMs = 0;

function leerPreferencia() {
    try { return window.localStorage.getItem(CLAVE_PREFERENCIA) !== 'off'; } catch (e) { return true; }
}
let sonidoActivo = typeof window !== 'undefined' ? leerPreferencia() : true;

function avisarUnaVez(clave, ...args) {
    if (avisos[clave]) return;
    avisos[clave] = true;
    console.warn(...args);
}

// Crea (una sola vez) el <audio> de cada sonido
function obtener(nombre) {
    if (typeof Audio === 'undefined') return null;
    if (!audios[nombre]) {
        const audio = new Audio(RUTAS[nombre]);
        audio.preload = 'auto';
        audio.volume = VOLUMEN[nombre];
        audio.addEventListener('error', () => {
            avisarUnaVez('carga-' + nombre, `Sonido "${nombre}": no se pudo cargar ${RUTAS[nombre]} (¿está en public/assets/sounds?)`);
        });
        audios[nombre] = audio;
    }
    return audios[nombre];
}

function detener(nombre) {
    const audio = audios[nombre];
    if (!audio) return;
    audio.pause();
    try { audio.currentTime = 0; } catch (e) { /* nada */ }
}

// Reinicia el sonido desde el principio y lo reproduce (si el sonido global está activo)
function reproducir(nombre) {
    if (!sonidoActivo) return;
    const audio = obtener(nombre);
    if (!audio) return;
    try { audio.currentTime = 0; } catch (e) { /* aún sin metadatos: arranca igualmente desde 0 */ }
    const promesa = audio.play();
    if (promesa && promesa.catch) {
        promesa.catch((error) => {
            // AbortError = lo interrumpió otro play/pause (normal al repetir rápido). NotAllowedError = el
            // navegador exige un gesto del usuario antes de reproducir audio (se resuelve en el primer clic).
            if (error && error.name !== 'AbortError') {
                avisarUnaVez('play-' + nombre + error.name, `Sonido "${nombre}": no se pudo reproducir (${error.name}).`);
            }
        });
    }
}

export function reproducirClic() {
    const ahora = performance.now();
    if (ahora - ultimoClicMs < INTERVALO_MIN_CLIC_MS) return; // misma interacción: una sola vez
    ultimoClicMs = ahora;
    reproducir('clic');
}
export function reproducirMotor() { reproducir('motor'); }
export function detenerMotor() { detener('motor'); }
// Con la escritura rápida llegan ~50 letras por segundo: se limita a una pulsación cada INTERVALO_MIN_TECLA_MS
// para que suene como una máquina de escribir y no como un zumbido (sin acelerar ni deformar el audio).
const INTERVALO_MIN_TECLA_MS = 45;
let ultimaTeclaMs = 0;
export function reproducirTecla() {
    const ahora = performance.now();
    if (ahora - ultimaTeclaMs < INTERVALO_MIN_TECLA_MS) return;
    ultimaTeclaMs = ahora;
    reproducir('tecla');
}
export function reproducirCampana() { reproducir('campana'); }
export function reproducirMagia() { reproducir('magia'); }
export function reproducirClicEspacio() { reproducir('clicEspacio'); }
export function reproducirPlaneta() { reproducir('planeta'); }
// Corta el sonido de escritura (al escribirse el último carácter, o si el texto se cancela o se desmonta)
export function detenerEscritura() {
    ultimaTeclaMs = 0;
    detener('tecla');
    detener('campana');
}

export function estaSonidoActivo() { return sonidoActivo; }

// Interruptor global. Devuelve el estado nuevo.
export function establecerSonidoActivo(activo) {
    sonidoActivo = !!activo;
    try { window.localStorage.setItem(CLAVE_PREFERENCIA, sonidoActivo ? 'on' : 'off'); } catch (e) { /* sin almacenamiento */ }
    if (!sonidoActivo) {
        // Silencio total: se corta ahora mismo todo lo que suene (los nuestros y cualquier <audio>/<video> de la página)
        Object.keys(audios).forEach(detener);
        if (typeof document !== 'undefined') document.querySelectorAll('audio, video').forEach((m) => m.pause());
    }
    return sonidoActivo;
}

// --------------------------------------------------------------------------------------------
// Escuchador único de clics sobre elementos HTML interactivos
// --------------------------------------------------------------------------------------------
function alHacerClic(evento) {
    const objetivo = evento.target;
    if (!objetivo || !objetivo.closest) return;
    const elemento = objetivo.closest(SELECTOR_INTERACTIVO);
    if (!elemento) return;
    if (elemento.disabled || elemento.getAttribute('aria-disabled') === 'true') return;
    if (elemento.closest('[data-sin-sonido]')) return; // p. ej. el propio botón de sonido
    reproducirClic();
}

// Safari/iOS solo deja reproducir un <audio> por temporizador si antes se reprodujo uno dentro de un gesto.
// En el primer toque/tecla se "prepara" (en silencio, sin oírse) los sonidos que NO suenan dentro de un clic:
// la máquina de escribir y el motor.
function prepararAudios() {
    ['tecla', 'campana', 'motor'].forEach((nombre) => {
        const audio = obtener(nombre);
        if (!audio) return;
        audio.muted = true;
        const p = audio.play();
        const listo = () => { audio.pause(); try { audio.currentTime = 0; } catch (e) { /* nada */ } audio.muted = false; };
        if (p && p.then) p.then(listo).catch(() => { audio.muted = false; });
        else listo();
    });
}

if (typeof document !== 'undefined') {
    // Si el módulo se recarga (HMR) se reemplaza el escuchador anterior en vez de sumar otro
    if (window.__sonidosAlHacerClic) document.removeEventListener('click', window.__sonidosAlHacerClic, true);
    window.__sonidosAlHacerClic = alHacerClic;
    document.addEventListener('click', alHacerClic, true); // en captura: no lo frena ningún stopPropagation
    window.addEventListener('pointerdown', prepararAudios, { once: true });
    window.addEventListener('keydown', prepararAudios, { once: true });
    Object.keys(RUTAS).forEach(obtener); // empieza a descargar los audios desde el principio
}