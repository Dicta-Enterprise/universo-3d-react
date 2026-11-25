import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import ThreeScene from '../components/ThreeScene';
import DemoTrajeAstronauta from '../components/DemoTrajeAstronauta';
import ControlesSuperiores from '../components/ControlesSuperiores';
import BotonImagen from '../components/BotonImagen';
import { VELOCIDAD_ESCRITURA_MS } from '../components/escritura';
import RocketCards from '../components/RocketCards';
import SpaceJourney from '../components/SpaceJourney';
import ControlesViaje from '../components/ControlesViaje';
import { reproducirTecla, reproducirCampana, detenerEscritura } from '../components/sonidos';
import { bloquearScroll, liberarScroll } from '../components/bloqueoScroll';
import { TOTAL_U } from '../components/journey';

const TITULO = 'MUNDO\nDICTARIANO';
const FRASE_PROTEGE = 'El mundo que protege a tu familia';
const FRASE_ANTICIPATE = 'Anticípate y enfrenta los riesgos de la era digital';
const VELOCIDAD_TIPEO_MS = VELOCIDAD_ESCRITURA_MS; // velocidad central de escritura (components/escritura.js)
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
// Guía "Desliza para seguir la exploración": se oculta cuando el scroll avanza más de esto (px)
// desde donde se cerró el modal, y vuelve a mostrarse si se regresa a ese punto.
const GUIA_OCULTAR_PX = 30;

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
        // Con prefers-reduced-motion el texto se completa casi de golpe (y el scroll se libera enseguida)
        const reducir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const intervaloMs = reducir ? 12 : velocidadMs;
        let i = 0;
        const intervalo = setInterval(() => {
            i += 1;
            setEscrito(texto.slice(0, i));
            onChar(texto[i - 1]);
            if (i >= texto.length) {
                clearInterval(intervalo);
                detenerEscritura(); // último carácter escrito: el sonido de escritura se corta de inmediato
                onDone();
            }
        }, intervaloMs);
        return () => {
            clearInterval(intervalo);
            detenerEscritura(); // el texto se canceló o se desmontó: no debe quedar sonando
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [texto, velocidadMs, resetKey]);

    return escrito;
}

export default function Home() {
    // "Volver a roles" (desde las galaxias de Niño, Joven y Padre) llega con state.seleccion: se salta la portada y se
    // aterriza directamente en la selección de cohetes (ver el efecto "aterrizar en la selección" más abajo)
    const location = useLocation();
    const navigate = useNavigate();
    const volviendoRef = useRef(!!(location.state && location.state.seleccion));
    const aterrizoRef = useRef(false);

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
    const [tituloListo, setTituloListo] = useState(volviendoRef.current); // Terminó de escribirse, esperando scroll
    const [tituloVersion, setTituloVersion] = useState(0); // Cambia para forzar que el título se reescriba
    const [fraseTerminada, setFraseTerminada] = useState(false); // Para mostrar "Desliza para comenzar" (fase 1)
    const [anticipateTerminado, setAnticipateTerminado] = useState(false); // Para mostrar "Desliza para comenzar" (fase 2)
    // Bloqueo de scroll mientras se escriben los textos introductorios (ver más abajo y bloqueoScroll.js).
    // `avanzando`: la fase actual se alcanzó bajando; al regresar hacia arriba NO se bloquea (el texto se reescribe
    // igual, pero no se atrapa a quien está volviendo).
    const [avanzando, setAvanzando] = useState(!volviendoRef.current); // al volver a roles no se bloquea el scroll
    const [escribiendoCards, setEscribiendoCards] = useState(false); // el texto de las tarjetas (fase 3) se está escribiendo
    const [nombreUsuario, setNombreUsuario] = useState(''); // Campo opcional de la fase 2, todavía no se envía a ningún lado
    // Dónde quedó el planeta 3D en la pantalla ahora mismo (lo manda ThreeScene en cada frame).
    // La frase se mueve/achica siguiendo estos valores, para que no se desenganchen cuando la
    // cámara se aleja o se vuelve a acercar con el scroll.
    const [planetaTransform, setPlanetaTransform] = useState({ xPct: 50, yPct: 50, radioPct: 18, escala: 1, opacidad: 1 });
    const threeSceneRef = useRef(null);
    const rocketCardsRef = useRef(null);
    // Etapa elegida (0 = Niño, 1 = Joven, 2 = Padre). Se guarda al pulsar "Elegir" y se conserva
    // al abrir/cerrar el modal. `secuencia` solo existe con el modal CERRADO: { index, startY }.
    const etapaElegidaRef = useRef(null); // { index, url } -- única fuente de la etapa elegida (url sale de RocketCards)
    // Capas que se desvanecen al salir de la pantalla de selección (SpaceJourney les escribe el opacity por ref)
    const cardsLayerRef = useRef(null);
    // Barra superior y pantalla "Anticípate": ControlesViaje mide los huecos de cada una para mover
    // los botones de Historia y Personalización con el scroll
    const barraRef = useRef(null);
    const pantallaRef = useRef(null);
    // Panel flotante "Ejemplo: traje personalizable" (DemoTrajeAstronauta): oculto al cargar; lo abre/cierra el
    // icono del astronauta de la barra superior. El componente queda montado (solo se oculta) para no perder
    // la selección de color al cerrarlo.
    const [panelTrajeAbierto, setPanelTrajeAbierto] = useState(false);
    const alternarPanelTraje = useCallback(() => setPanelTrajeAbierto((v) => !v), []);
    useEffect(() => {
        if (!panelTrajeAbierto) return undefined;
        const alPulsar = (e) => { if (e.key === 'Escape') setPanelTrajeAbierto(false); };
        window.addEventListener('keydown', alPulsar);
        return () => window.removeEventListener('keydown', alPulsar);
    }, [panelTrajeAbierto]);
    useEffect(() => { if (fase < 2) setPanelTrajeAbierto(false); }, [fase]); // sin barra superior no hay panel
    const demoLayerRef = useRef(null);
    const [secuencia, setSecuencia] = useState(null);
    const [guiaVisible, setGuiaVisible] = useState(false);
    // Los iconos de la esquina (música / sonido / logotipo) los pinta <ControlesSuperiores />, el mismo componente que usan
    // las páginas de Niño, Joven y Padre. El de sonido es el interruptor GLOBAL de audio (sonidos.js).
    // Botón de prueba del segundo efecto de estrellas (parpadeo) sin tocar el fondo de siempre --
    // apagado por defecto, así nadie ve nada distinto si no lo activa.
    const [estrellasAlternas, setEstrellasAlternas] = useState(false);
    // Los 4 astronautas flotando solo se ven en la fase 2 ("Anticípate...")
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

            if (nueva > fase) setAvanzando(true);
            else if (nueva < fase) setAvanzando(false);

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


    // Una pulsación por cada letra, justo cuando aparece (la llama useMaquinaDeEscribir). El silencio global lo
    // aplica sonidos.js; el corte al terminar el texto lo hace el propio useMaquinaDeEscribir.
    const handleChar = useCallback((char) => {
        if (faseRef.current === 3) return; // En cohetes no se está escribiendo nada -- no debe sonar
        if (char === '\n') reproducirCampana();
        else reproducirTecla();
    }, []);

    // --- Fase 0: título -> esperar a que el usuario haga scroll ---
    const handleTituloTerminado = useCallback(() => {
        setTituloListo(true);
    }, []);

    const tituloEscrito = useMaquinaDeEscribir(volviendoRef.current ? '' : TITULO, VELOCIDAD_TIPEO_MS, handleChar, handleTituloTerminado, tituloVersion);

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

    // --- Aterrizar en la selección de cohetes al volver desde una galaxia -------------------------------
    // Cuando la escena 3D ya cargó, se coloca el scroll donde las tres tarjetas y sus cohetes quedan completamente a
    // la vista. Las fases se recalculan solas con ese scroll (ya sin esperar la escritura de la portada) y se
    // limpia el aviso de la ruta para que recargar la página no repita el salto.
    useEffect(() => {
        if (loading || !volviendoRef.current || aterrizoRef.current) return;
        aterrizoRef.current = true;
        window.scrollTo(0, UMBRAL_COHETES + 60);
        navigate('.', { replace: true, state: null });
    }, [loading, navigate]);

    // --- Bloqueo de scroll durante la escritura de los textos introductorios -----------------------------
    // Mientras se escribe el texto de la fase en la que está el usuario, la página no se puede desplazar
    // (rueda, teclado, gestos táctiles ni barra). La escritura sigue sola, sin depender del scroll, y el
    // scroll se libera automáticamente al escribirse el último carácter. Cada fase lleva su propio estado
    // de finalización (tituloListo / fraseTerminada / anticipateTerminado / texto de las tarjetas). Salida
    // segura: bloqueoScroll.js lo libera solo tras maxMs, aunque algo fallara.
    const escribiendo = avanzando && (
        (fase === 0 && !tituloListo)
        || (fase === 1 && !fraseTerminada)
        || (fase === 2 && !anticipateTerminado)
        || (fase === 3 && escribiendoCards)
    );
    useEffect(() => {
        if (!escribiendo) {
            liberarScroll('escritura');
            return undefined;
        }
        bloquearScroll('escritura', { maxMs: 20000 });
        return () => liberarScroll('escritura');
    }, [escribiendo]);

    // Se pasa a ThreeScene; lo llama en cada frame con dónde quedó el planeta en pantalla.
    const handlePlanetTransform = useCallback((t) => {
        setPlanetaTransform(t);
    }, []);

    // --- Cohetes: modal de la nave (en RocketCards) + secuencia de scroll del cohete elegido ---
    // Elegir -> se registra la etapa; el cohete se prepara (vibra) detrás del modal y cualquier
    // secuencia anterior se desarma (el cohete vuelve a su tarjeta mientras el modal tapa la pantalla)
    const handleRocketElegir = useCallback((index, url) => {
        etapaElegidaRef.current = { index, url };
        setSecuencia(null);
        threeSceneRef.current?.disarmSequence();
        threeSceneRef.current?.prepareLaunch(index);
    }, []);
    // Cerrar el modal -> el cohete se calma y se arma la secuencia de scroll para la etapa elegida,
    // tomando como punto de partida el scroll de este momento (por eso no hay saltos)
    const handleRocketCerrarModal = useCallback(() => {
        const etapa = etapaElegidaRef.current;
        if (!etapa) return;
        const startY = window.scrollY;
        threeSceneRef.current?.cancelLaunch();
        threeSceneRef.current?.armSequence(etapa.index, startY);
        setSecuencia({ index: etapa.index, url: etapa.url, startY });
    }, []);
    // Clic sobre el cohete 3D = lo mismo que pulsar "Elegir" (abre el mismo y único popup)
    const handleRocketClick = useCallback((index) => {
        rocketCardsRef.current?.elegir(index);
    }, []);

    // Si se sale de la fase de los cohetes (scroll hacia arriba), la selección y la secuencia se reinician
    useEffect(() => {
        if (fase !== 3) {
            setSecuencia(null);
            threeSceneRef.current?.disarmSequence();
        }
    }, [fase]);

    // Guía "Desliza para seguir la exploración": visible con el modal cerrado y mientras el scroll
    // no haya avanzado desde donde se cerró; desaparece cuando empieza la animación del cohete
    useEffect(() => {
        if (!secuencia) {
            setGuiaVisible(false);
            return undefined;
        }
        const actualizar = () => setGuiaVisible(window.scrollY - secuencia.startY < GUIA_OCULTAR_PX);
        window.addEventListener('scroll', actualizar, { passive: true });
        actualizar();
        return () => window.removeEventListener('scroll', actualizar);
    }, [secuencia]);

    // Función que se pasa a ThreeScene para avisar que Three.js ya está listo.
    // useCallback evita que ThreeScene reciba una referencia nueva en cada render
    // (lo que antes reconstruía toda la escena 3D una segunda vez sin motivo).
    const handleThreeJsLoad = useCallback(() => {
        setLoading(false);
    }, []);

    return (
        <div className="app-container">
            <ControlesSuperiores barraRef={barraRef} mundoAbierto={fase === 2 || fase === 3}>
                {/* Huecos de Historia y Personalización (ver ControlesViaje.jsx): cerrados hasta que el scroll los abre */}
                <div className="barra-slot" data-slot="historia" aria-hidden="true" />
                <div className="barra-slot" data-slot="personalizar" aria-hidden="true" />
            </ControlesSuperiores>

            {/* Botón de prueba: segundo efecto de estrellas (parpadeo), aparte de los iconos de
                música/sonido para no mezclarlos -- esquina opuesta. */}
            <BotonImagen
                className={`icono-estrellas-btn ${estrellasAlternas ? 'icono-estrellas-btn--activo' : ''}`}
                src="/assets/estrella.png"
                onClick={() => setEstrellasAlternas((v) => !v)}
                pressed={estrellasAlternas}
                etiqueta={estrellasAlternas ? 'Usar fondo de estrellas normal' : 'Probar estrellas con parpadeo'}
                title={estrellasAlternas ? 'Estrellas: parpadeo (clic para volver al fondo normal)' : 'Probar: estrellas con parpadeo'}
            />

            <ThreeScene
                ref={threeSceneRef}
                onLoad={handleThreeJsLoad}
                onPlanetTransform={handlePlanetTransform}
                estrellasAlternas={estrellasAlternas}
                mostrarAstronautas={fase === 2}
                onRocketClick={handleRocketClick}
            />
            {/* Envoltorio con z-index 5 (el mismo de las tarjetas): al bajar su opacity no pierde su capa */}
            <div ref={cardsLayerRef} style={{ position: 'relative', zIndex: 5 }}>
                <RocketCards
                    ref={rocketCardsRef}
                    onElegir={handleRocketElegir}
                    onCerrarModal={handleRocketCerrarModal}
                    onEscribiendo={setEscribiendoCards}
                    mostrarGuia={guiaVisible}
                />
            </div>
            {/* Da al documento el recorrido de scroll de TODA la secuencia (scroll al cerrar el modal +
                tramo del cohete + TOTAL_U unidades de journey.js + una pantalla). Ver journey.js. */}
            {secuencia && createPortal(
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 1,
                        height: `calc(${secuencia.startY}px + max(500px, 120vh) + ${TOTAL_U} * max(100vh, 500px) + 100vh)`,
                        pointerEvents: 'none',
                        visibility: 'hidden',
                    }}
                />,
                document.body,
            )}

            {/* Viaje espacial -> Frutia -> fundido -> página de la etapa elegida (su galaxia y la llegada del cohete).
                Solo existe con una etapa elegida y el modal cerrado; al subir por encima de la fase 3 se desmonta. */}
            {secuencia && (
                <SpaceJourney
                    key={`${secuencia.index}-${secuencia.startY}`}
                    startY={secuencia.startY}
                    rutaBase={secuencia.url}
                    cardsLayerRef={cardsLayerRef}
                    demoLayerRef={demoLayerRef}
                />
            )}
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
                <div className="anticipate-pantalla" ref={pantallaRef}>
                    {/* El texto completo (invisible) reserva su espacio: al escribirse no se mueve nada */}
                    <span className="anticipate-titulo">
                        <span className="anticipate-titulo__fantasma" aria-hidden="true">{FRASE_ANTICIPATE}</span>
                        <span className="anticipate-titulo__texto">
                            {anticipateEscrito}
                            <span className="cursor-maquina-escribir">|</span>
                        </span>
                    </span>

                    {/* Campo y globos aparecen juntos cuando el título termina de escribirse (anticipateTerminado) */}
                    <input
                        type="text"
                        className={`anticipate-input anticipate-revelable ${anticipateTerminado ? 'anticipate-revelable--on' : ''}`}
                        placeholder="Ingresa tu nombre aquí (Opcional)"
                        value={nombreUsuario}
                        onChange={(e) => setNombreUsuario(e.target.value)}
                        maxLength={40}
                        tabIndex={anticipateTerminado ? 0 : -1}
                    />

                    <div className={`anticipate-botones anticipate-revelable ${anticipateTerminado ? 'anticipate-revelable--on' : ''}`}>
                        {/* Los botones reales son los de ControlesViaje (flotan sobre estos huecos y luego viajan a la barra) */}
                        <div className="anticipate-boton-wrap">
                            <div className="anticipate-burbuja">¿Qué es este mundo? Descubre nuestra historia aquí</div>
                            <div className="anticipate-slot" data-slot="historia" aria-hidden="true" />
                        </div>
                        <div className="anticipate-boton-wrap">
                            <div className="anticipate-burbuja">Prepárate para el viaje. Personaliza tu traje aquí</div>
                            <div className="anticipate-slot" data-slot="personalizar" aria-hidden="true" />
                        </div>
                    </div>

                    <div className={`anticipate-guia ${anticipateTerminado ? 'anticipate-guia--visible' : ''}`}>
                        Desliza para comenzar la exploración ↓
                    </div>
                </div>
            )}

            {(fase === 2 || fase === 3) && (
                <ControlesViaje
                    revelado={anticipateTerminado || fase === 3}
                    startY={secuencia ? secuencia.startY : null}
                    pantallaRef={pantallaRef}
                    barraRef={barraRef}
                    onPersonalizar={alternarPanelTraje}
                    personalizarAbierto={panelTrajeAbierto}
                />
            )}

            {/* Demo técnico (NO es parte del flujo real): se ve al lado de los cohetes, para mostrar
                que el color del traje sí se puede cambiar por código. Ver comentario completo en
                DemoTrajeAstronauta.jsx. Se puede quitar borrando este bloque y el import. */}
            {(fase === 2 || fase === 3) && (
                <div ref={demoLayerRef} style={{ position: 'relative', zIndex: 5 }}>
                    {/* Panel flotante, NO modal: sin capa oscura ni desenfoque; solo su caja recibe clics */}
                    <div className={`panel-traje ${panelTrajeAbierto ? 'panel-traje--abierto' : ''}`} aria-hidden={!panelTrajeAbierto}>
                        <DemoTrajeAstronauta />
                    </div>
                </div>
            )}

            <div className={`sections-container ${!loading ? 'hidden' : ''}`}>
                <div className="section" aria-hidden="true"></div>{/* Espaciador: mantiene "Aquí están las naves" en su mismo tramo de scroll de siempre */}
                <div className="section">Aquí están las naves</div>
            </div>
        </div>
    );
}