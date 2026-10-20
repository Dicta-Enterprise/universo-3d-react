import React, { useState, useEffect, useCallback, useRef } from 'react';
import ThreeScene from '../components/ThreeScene';
import DemoTrajeAstronauta from '../components/DemoTrajeAstronauta';
import IconoMundoGirando from '../components/IconoMundoGirando';

const TITULO = 'MUNDO\nDICTARIANO';
const FRASE_PROTEGE = 'El mundo que protege a tu familia';
const FRASE_ANTICIPATE = 'Anticípate y enfrenta los riesgos de la era digital';
const VELOCIDAD_TIPEO_MS = 220; // Lento a propósito, efecto máquina de escribir
const UMBRAL_REVELAR_MUNDO = 40; // Bajando: a partir de aquí se pasa a la fase 1 (ya no es por tiempo)
const UMBRAL_VOLVER_AL_INICIO = 10; // Subiendo: por debajo de esto se reinicia todo, listo para verse de nuevo
// Fase 2 "Anticípate..." (diseño de Figma): va DESPUÉS de la frase bajo el planeta y
// ANTES de los cohetes. UMBRAL_OCULTAR_FRASE se queda con el mismo valor de siempre (400) -- lo
// único que cambia es que ahí ya no empiezan los cohetes de una vez, sino esta pantalla nueva.
const UMBRAL_OCULTAR_FRASE = 400; // Bajando: fase 1 -> 2
const UMBRAL_VOLVER_A_FRASE = 350; // Subiendo: fase 2 -> 1 (un poco antes, mismo margen que ya se usaba arriba)
// Mismo valor que el nuevo umbral de cohetes en ThreeScene.jsx (maxScrollY * 0.5) -- si se cambia
// uno, hay que cambiar el otro, para que la fase y los cohetes aparezcan exactamente juntos.
const UMBRAL_COHETES = 1000; // Bajando: fase 2 -> 3
const UMBRAL_VOLVER_A_ANTICIPATE = 950; // Subiendo: fase 3 -> 2

// Escribe un texto letra por letra, arrancando cada vez que "texto" cambia (o cada vez que
// cambia "resetKey" -- se usa para forzar que se vuelva a escribir el mismo texto, cuando el
// usuario vuelve a scrollear hasta una fase que ya había visto completa).
// Avisa con onChar en cada letra nueva (para el sonido) y con onDone cuando termina
// (en vez de que un componente externo tenga que adivinar cuánto tarda).
function useMaquinaDeEscribir(texto, velocidadMs, onChar, onDone, resetKey) {
    const [escrito, setEscrito] = useState('');

    useEffect(() => {
        setEscrito('');
        if (!texto) return; // Nada que escribir todavía (ej. esta fase no está activa)
        let i = 0;
        const intervalo = setInterval(() => {
            i += 1;
            setEscrito(texto.slice(0, i));
            onChar(texto[i - 1]);
            if (i >= texto.length) {
                clearInterval(intervalo);
                onDone();
            }
        }, velocidadMs);
        return () => clearInterval(intervalo);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [texto, velocidadMs, resetKey]);

    return escrito;
}

export default function Home() {
    const [loading, setLoading] = useState(true); // Secciones visibles mientras Three.js no esté listo
    // Flujo por fases, una a la vez -- nunca se ven dos juntas, cada una solo se ve mientras el
    // scroll está "ahí" (ni antes ni después), y vuelve a aparecer si se regresa a su tramo:
    //   0 = título "MUNDO DICTARIANO", esperando a que el usuario haga scroll
    //   1 = el mundo revelado + "El mundo que protege a tu familia" + "Desliza para comenzar"
    //   2 = "Anticípate..." (diseño de Figma): el planeta se va a la esquina (ya no
    //       se oculta), aparecen los 4 astronautas flotando, el texto, el campo de nombre y los
    //       2 botones con su globo de texto
    //   3 = cohetes -- lo demás de esta parte ya existe en ThreeScene.jsx
    // Ninguna fase desaparece por tiempo, solo por scroll. Si se regresa a una fase ya vista,
    // su texto se vuelve a escribir desde cero (no se queda a medias ni ya completo).
    const [fase, setFase] = useState(0);
    const [tituloListo, setTituloListo] = useState(false); // Terminó de escribirse, esperando scroll
    const [tituloVersion, setTituloVersion] = useState(0); // Cambia para forzar que el título se reescriba
    const [fraseTerminada, setFraseTerminada] = useState(false); // Para mostrar "Desliza para comenzar" (fase 1)
    const [anticipateTerminado, setAnticipateTerminado] = useState(false); // Para mostrar "Desliza para comenzar" (fase 2)
    const [nombreUsuario, setNombreUsuario] = useState(''); // Campo opcional de la fase 2, todavía no se envía a ningún lado
    // Dónde quedó el planeta 3D en la pantalla ahora mismo (lo manda ThreeScene en cada frame).
    // La frase se mueve/achica siguiendo estos valores, para que no se desenganchen cuando la
    // cámara se aleja o se vuelve a acercar con el scroll.
    const [planetaTransform, setPlanetaTransform] = useState({ xPct: 50, yPct: 50, radioPct: 18, escala: 1, opacidad: 1 });
    const threeSceneRef = useRef(null);
    const sonidoTecla = useRef(null);
    const sonidoCampana = useRef(null);
    // Los 2 iconos de la esquina (musica/sonido). El de sonido silencia de verdad el efecto de
    // maquina de escribir que ya teniamos. El de musica, por ahora, solo cambia de aspecto --
    // todavia no hay ninguna pista de musica de fondo conectada (pendiente de confirmar cual usar).
    const [sonidoActivo, setSonidoActivo] = useState(true);
    const [musicaActiva, setMusicaActiva] = useState(true);
    // Botón de prueba del segundo efecto de estrellas (parpadeo) sin tocar el fondo de siempre --
    // apagado por defecto, así nadie ve nada distinto si no lo activa.
    const [estrellasAlternas, setEstrellasAlternas] = useState(false);
    // Los 4 astronautas flotando solo se ven en la fase 2 ("Anticípate...")
    const sonidoActivoRef = useRef(sonidoActivo);
    useEffect(() => { sonidoActivoRef.current = sonidoActivo; }, [sonidoActivo]);
    // Se actualiza DENTRO de handleScroll (no en un useEffect aparte) a propósito: un useEffect
    // solo corre después de que React vuelve a renderizar, y en ese ratito de por medio el
    // intervalo de la máquina de escribir (que sigue vivo con el valor viejo de "fase" en su
    // cierre) alcanza a disparar un sonido de más justo al cruzar a la fase de los cohetes.
    // Actualizándolo aquí, en el mismo evento de scroll, handleChar ve el valor nuevo en el
    // mismo instante, sin ese hueco.
    const faseRef = useRef(0);

    // Cambia de fase cuando el usuario hace scroll (nunca por tiempo); si vuelve a subir hasta
    // arriba del todo, reinicia todo para que la intro se pueda ver de nuevo desde cero. Se revisa
    // en cascada (subiendo primero, luego bajando) para que también funcione bien con un salto de
    // scroll grande -- ej. ir de los cohetes directo hasta arriba del todo con "Inicio" o una
    // barra arrastrada rápido, no solo bajando/subiendo de a poco.
    useEffect(() => {
        function handleScroll() {
            const y = window.scrollY;
            let nueva = fase;

            // Subiendo (regresando) -- de la fase más alta a la más baja
            if (nueva === 3 && y < UMBRAL_VOLVER_A_ANTICIPATE) {
                nueva = 2;
            }
            if (nueva === 2 && y < UMBRAL_VOLVER_A_FRASE) {
                nueva = 1;
                setAnticipateTerminado(false);
                threeSceneRef.current?.moveToCenter();
            }
            if (nueva === 1 && y < UMBRAL_VOLVER_AL_INICIO) {
                nueva = 0;
                setFraseTerminada(false);
                setTituloListo(false);
                setTituloVersion((v) => v + 1);
                threeSceneRef.current?.resetIntro();
            }

            // Bajando (avanzando) -- de la fase más baja a la más alta
            if (nueva === 0 && tituloListo && y > UMBRAL_REVELAR_MUNDO) {
                nueva = 1;
                threeSceneRef.current?.revealPlanet();
            }
            if (nueva === 1 && y > UMBRAL_OCULTAR_FRASE) {
                nueva = 2;
                setFraseTerminada(false);
                threeSceneRef.current?.moveToCorner();
            }
            if (nueva === 2 && y > UMBRAL_COHETES) {
                nueva = 3;
                setAnticipateTerminado(false);
            }

            faseRef.current = nueva; // sincrónico, antes que nada dependa del próximo render
            if (nueva !== fase) setFase(nueva);
        }
        window.addEventListener('scroll', handleScroll);
        // Si el usuario ya había hecho scroll ANTES de que el título terminara de escribirse,
        // no llega ningún evento de scroll nuevo cuando por fin termina -- por eso se revisa
        // también aquí, apenas tituloListo pasa a true, con la posición de scroll que haya en
        // ese momento (si ya estaba por debajo del umbral, pasa a la fase 1 de una vez).
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [fase, tituloListo]);

    useEffect(() => {
        sonidoTecla.current = new Audio('/assets/sounds/typewriter-key.mp3');
        sonidoCampana.current = new Audio('/assets/sounds/typewriter-bell.mp3');

        // El navegador bloquea play() hasta que haya una interacción real del usuario (clic,
        // toque o tecla) en la página -- por eso no se escuchaba nada: el título empieza a
        // escribirse solo, sin que nadie haya tocado nada todavía. En cuanto pasa la primera
        // interacción, se "desbloquean" los 2 sonidos (play + pause inmediato) para que de ahí
        // en adelante sí suenen sin pedir otra interacción.
        function desbloquearAudio() {
            [sonidoTecla.current, sonidoCampana.current].forEach((audio) => {
                audio?.play().then(() => {
                    audio.pause();
                    audio.currentTime = 0;
                }).catch(() => {});
            });
        }
        window.addEventListener('pointerdown', desbloquearAudio, { once: true });
        window.addEventListener('keydown', desbloquearAudio, { once: true });
        return () => {
            window.removeEventListener('pointerdown', desbloquearAudio);
            window.removeEventListener('keydown', desbloquearAudio);
        };
    }, []);

    const handleChar = useCallback((char) => {
        if (!sonidoActivoRef.current) return; // Silenciado con el icono de la esquina
        if (faseRef.current === 3) return; // En cohetes no se está escribiendo nada -- no debe sonar
        // Los navegadores pueden bloquear el audio hasta que haya una interacción del usuario;
        // se ignora el error en vez de dejarlo romper la escritura del texto.
        const sonido = char === '\n' ? sonidoCampana.current : sonidoTecla.current;
        if (!sonido) return;
        sonido.currentTime = 0;
        sonido.play().catch(() => {});
    }, []);

    // --- Fase 0: título -> esperar a que el usuario haga scroll ---
    const handleTituloTerminado = useCallback(() => {
        setTituloListo(true);
    }, []);

    const tituloEscrito = useMaquinaDeEscribir(TITULO, VELOCIDAD_TIPEO_MS, handleChar, handleTituloTerminado, tituloVersion);

    // --- Fase 1: "El mundo que protege a tu familia" -> al terminar, muestra "Desliza para
    // comenzar". Al pasar texto de '' a FRASE_PROTEGE (y viceversa, cada vez que se entra/sale
    // de la fase 1) la máquina de escribir ya se reinicia sola, sin necesitar un resetKey aparte. ---
    const handleFraseTerminada = useCallback(() => {
        setFraseTerminada(true);
    }, []);

    const fraseEscrita = useMaquinaDeEscribir(
        fase === 1 ? FRASE_PROTEGE : '',
        VELOCIDAD_TIPEO_MS,
        handleChar,
        handleFraseTerminada,
    );

    // --- Fase 2: "Anticípate y enfrenta los riesgos de la era digital" -> al terminar, muestra
    // "Desliza para comenzar la exploración". Mismo patrón que la fase 1. ---
    const handleAnticipateTerminado = useCallback(() => {
        setAnticipateTerminado(true);
    }, []);

    const anticipateEscrito = useMaquinaDeEscribir(
        fase === 2 ? FRASE_ANTICIPATE : '',
        VELOCIDAD_TIPEO_MS,
        handleChar,
        handleAnticipateTerminado,
    );

    // Se pasa a ThreeScene; lo llama en cada frame con dónde quedó el planeta en pantalla.
    const handlePlanetTransform = useCallback((t) => {
        setPlanetaTransform(t);
    }, []);

    // Función que se pasa a ThreeScene para avisar que Three.js ya está listo.
    // useCallback evita que ThreeScene reciba una referencia nueva en cada render
    // (lo que antes reconstruía toda la escena 3D una segunda vez sin motivo).
    const handleThreeJsLoad = useCallback(() => {
        setLoading(false);
    }, []);

    return (
        <div className="app-container">
            <div className="iconos-esquina">
                <button
                    type="button"
                    className="icono-esquina-btn"
                    onClick={() => setMusicaActiva((v) => !v)}
                    aria-pressed={musicaActiva}
                    aria-label={musicaActiva ? 'Apagar música' : 'Encender música'}
                >
                    <img src="/assets/icons/icono-musica.png" alt="" className={musicaActiva ? '' : 'icono-esquina-apagado'} />
                </button>
                <button
                    type="button"
                    className="icono-esquina-btn"
                    onClick={() => setSonidoActivo((v) => !v)}
                    aria-pressed={sonidoActivo}
                    aria-label={sonidoActivo ? 'Silenciar sonido' : 'Activar sonido'}
                >
                    <img src="/assets/icons/icono-sonido.png" alt="" className={sonidoActivo ? '' : 'icono-esquina-apagado'} />
                </button>
                {/* Reemplaza al "mundo-badge" anterior (el que seguía la posición 3D del planeta
                    grande mientras se desvanecía): un ícono fijo en esta fila, aparte del planeta
                    grande que se desvanece hacia la esquina -- son esferas independientes, cada
                    una con su propia animación. Aparece justo cuando el planeta grande ya terminó
                    de desvanecerse. */}
                {(fase === 2 || fase === 3) && <IconoMundoGirando />}
            </div>

            {/* Botón de prueba: segundo efecto de estrellas (parpadeo), aparte de los iconos de
                música/sonido para no mezclarlos -- esquina opuesta. */}
            <button
                type="button"
                className={`icono-estrellas-btn ${estrellasAlternas ? 'icono-estrellas-btn--activo' : ''}`}
                onClick={() => setEstrellasAlternas((v) => !v)}
                aria-pressed={estrellasAlternas}
                aria-label={estrellasAlternas ? 'Usar fondo de estrellas normal' : 'Probar estrellas con parpadeo'}
                title={estrellasAlternas ? 'Estrellas: parpadeo (clic para volver al fondo normal)' : 'Probar: estrellas con parpadeo'}
            >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2l2.4 7.2H22l-6 4.6 2.3 7.2-6.3-4.5-6.3 4.5 2.3-7.2-6-4.6h7.6z" />
                </svg>
            </button>

            <ThreeScene
                ref={threeSceneRef}
                onLoad={handleThreeJsLoad}
                onPlanetTransform={handlePlanetTransform}
                estrellasAlternas={estrellasAlternas}
                mostrarAstronautas={fase === 2}
            />

            {fase === 0 && (
                <div className="titulo-intro">
                    <span className="titulo-maquina-escribir">
                        {tituloEscrito}
                        <span className="cursor-maquina-escribir">|</span>
                    </span>
                </div>
            )}

            {fase === 1 && (
                <>
                    {/* Posición y escala vienen del planeta real (ver onPlanetTransform en ThreeScene),
                        para que el texto se mueva/achique junto con él y no se desenganchen. */}
                    <div
                        className="frase-protege"
                        style={{
                            left: `${planetaTransform.xPct}%`,
                            top: `calc(${planetaTransform.yPct + planetaTransform.radioPct}% + 3vh)`,
                            transform: `translate(-50%, 0) scale(${planetaTransform.escala})`,
                        }}
                    >
                        <span className="frase-protege-texto">
                            {fraseEscrita}
                            <span className="cursor-maquina-escribir">|</span>
                        </span>
                    </div>
                    {/* Esta sí se queda fija abajo, no sigue al planeta */}
                    <div className={`desliza-hint ${fraseTerminada ? 'desliza-hint--visible' : ''}`}>
                        Desliza para comenzar ↓
                    </div>
                </>
            )}

            {fase === 2 && (
                <div className="anticipate-pantalla">
                    <span className="anticipate-titulo">
                        {anticipateEscrito}
                        <span className="cursor-maquina-escribir">|</span>
                    </span>

                    <input
                        type="text"
                        className="anticipate-input"
                        placeholder="Ingresa tu nombre aquí (Opcional)"
                        value={nombreUsuario}
                        onChange={(e) => setNombreUsuario(e.target.value)}
                        maxLength={40}
                    />

                    <div className="anticipate-botones">
                        <div className="anticipate-boton-wrap">
                            <div className="anticipate-burbuja">¿Qué es este mundo? Descubre nuestra historia aquí</div>
                            {/* Todavía no lleva a ningún lado -- falta que el equipo defina qué pantalla abre */}
                            <button type="button" className="anticipate-boton" aria-label="Descubre nuestra historia">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                                    <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                                    <line x1="12" y1="18" x2="12" y2="22" />
                                    <line x1="9" y1="22" x2="15" y2="22" />
                                </svg>
                            </button>
                        </div>
                        <div className="anticipate-boton-wrap">
                            <div className="anticipate-burbuja">Prepárate para el viaje. Personaliza tu traje aquí</div>
                            {/* Todavía no lleva a ningún lado -- falta decidir si conecta con el demo de personalización */}
                            <button type="button" className="anticipate-boton" aria-label="Personaliza tu traje">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M12 2a7 7 0 0 0-7 7v5a7 7 0 0 0 14 0V9a7 7 0 0 0-7-7Z" />
                                    <path d="M5 11h14" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className={`anticipate-guia ${anticipateTerminado ? 'anticipate-guia--visible' : ''}`}>
                        Desliza para comenzar la exploración ↓
                    </div>
                </div>
            )}

            {/* Demo técnico (NO es parte del flujo real): se ve al lado de los cohetes, para mostrar
                que el color del traje sí se puede cambiar por código. Ver comentario completo en
                DemoTrajeAstronauta.jsx. Se puede quitar borrando este bloque y el import. */}
            {fase === 3 && <DemoTrajeAstronauta />}

            <div className={`sections-container ${!loading ? 'hidden' : ''}`}>
                <div className="section" aria-hidden="true"></div>{/* Espaciador: mantiene "Aquí están las naves" en su mismo tramo de scroll de siempre */}
                <div className="section">Aquí están las naves</div>
            </div>
        </div>
    );
}
