import React, { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import './RocketCards.css';
import { bloquearScroll, liberarScroll } from './bloqueoScroll';
import { reproducirTecla, detenerEscritura } from './sonidos';
import { VELOCIDAD_ESCRITURA_MS } from './escritura';

// ============================================================================================
// >>> IMAGEN DEL INTERIOR DE LA NAVE <<<
// Coloca el archivo definitivo en:   public/assets/nave/nave-interior.webp
// (se sirve como /assets/nave/nave-interior.webp, igual que /assets/nino-astronauta.webp).
// Si usas otro nombre o formato (.png, .jpg), cambia SOLO esta constante, o pásala como
// propiedad:  <RocketCards shipInteriorImage="/assets/nave/otra.png" />
// El marco se ajusta solo a la proporción de la imagen (no se deforma ni se recorta).
// ============================================================================================
const SHIP_INTERIOR_IMAGE = '/assets/nave/nave-interior.webp';

// El \n fuerza el salto de línea del Figma: la pregunta "¿A quién vas a proteger?" queda sola en la línea de abajo
// (los dos <span> del título usan white-space: pre-line en RocketCards.css para respetarlo).
const TEXTO_INTRO = 'En un universo plagado de peligros digitales que acechan tu hogar...\n¿A quién vas a proteger?';
const VELOCIDAD_TEXTO_MS = VELOCIDAD_ESCRITURA_MS; // velocidad central de escritura (components/escritura.js)

const MODAL_ANIM_MS = 280; // debe coincidir con la transición de .nave-modal-overlay en RocketCards.css

const CARDS = [
    {
        id: 'nino',
        title: 'Niño',
        description: '¡Hola! Soy Froita. Ponte el traje y vamos a explorar.',
        primary: '#33ff66',
        secondary: '#1ca34d',
        textColor: '#0a2f12',
        url: '/ninos',
        img: '/assets/nino-astronauta.webp', 
    },
    {
        id: 'joven',
        title: 'Joven',
        description: 'Soy Mors. El universo es enorme... ¡Hay que descubrirlo!',
        primary: '#ffcc00',
        secondary: '#cc9900',
        textColor: '#3a2a00',
        url: '/jovenes',
        img: '/assets/joven-astronauta.webp',
    },
    {
        id: 'padre',
        title: 'Padre',
        description: 'Somos Florencia y Kato. Conoce este universo y te acompañaremos durante el viaje.',
        primary: '#33ccff',
        secondary: '#1c99cc',
        textColor: '#0a1a3a',
        url: '/padres',
        img: '/assets/padres-astronauta.webp',
    },
];

// Este es el ÚNICO modal de la pantalla de cohetes. Lo abren tanto el botón "Elegir" como un clic
// sobre el cohete 3D (Home.jsx llama a ref.elegir(index)). Avisa a Home de cada paso:
//   Elegir        -> onElegir(index, url) : se registra la etapa y el cohete se prepara (vibra) detrás del modal
//   Cerrar (X/Esc)-> onCerrarModal()  : Home arma la secuencia de scroll del cohete elegido
// mostrarGuia: muestra "Desliza para seguir la exploración ↓" debajo de las tarjetas.
const RocketCards = forwardRef(function RocketCards(
    { onElegir, onCerrarModal, onTarjetasListas, onEscribiendo, mostrarGuia = false, shipInteriorImage = SHIP_INTERIOR_IMAGE },
    ref,
) {
    const [visible, setVisible] = useState(false);
    const [textoEscrito, setTextoEscrito] = useState('');       // texto introductorio, letra por letra
    const [tarjetasListas, setTarjetasListas] = useState(false); // terminó el texto: aparecen las tarjetas
    const [modalMontado, setModalMontado] = useState(false);  // el modal existe en el DOM
    const [modalAbierto, setModalAbierto] = useState(false);  // clase de la transición (opacidad + escala)
    const [etapaIndex, setEtapaIndex] = useState(null);       // etapa cuyo modal está abierto
    const [imagenFallida, setImagenFallida] = useState(false);
    const montadoRef = useRef(false);
    const cerrandoRef = useRef(false);
    const timeoutRef = useRef(null);
    const botonCerrarRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 1000);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => () => clearTimeout(timeoutRef.current), []);

    // Efecto de escritura: empieza cuando la sección entra en escena (visible) y NO se reinicia con
    // movimientos pequeños del scroll (solo depende de `visible`). Si se sale de la sección hacia
    // arriba se limpia, y al volver a entrar se escribe de nuevo (mismo patrón que las otras fases).
    useEffect(() => {
        if (!visible) {
            setTextoEscrito('');
            setTarjetasListas(false);
            return undefined;
        }
        const reducir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducir) {
            setTextoEscrito(TEXTO_INTRO);
            setTarjetasListas(true);
            return undefined;
        }
        let i = 0;
        const id = setInterval(() => {
            i += 1;
            setTextoEscrito(TEXTO_INTRO.slice(0, i));
            reproducirTecla(); // suena solo mientras se escribe, una vez por letra
            if (i >= TEXTO_INTRO.length) {
                clearInterval(id);
                detenerEscritura(); // último carácter: el sonido se corta de inmediato
                setTarjetasListas(true);
            }
        }, VELOCIDAD_TEXTO_MS);
        return () => {
            clearInterval(id);
            detenerEscritura(); // si se cancela o se desmonta, tampoco queda nada sonando
        };
    }, [visible]);

    // Avisa a Home mientras el texto introductorio se está escribiendo (Home bloquea el scroll en ese tramo)
    useEffect(() => { onEscribiendo?.(visible && !tarjetasListas); }, [visible, tarjetasListas, onEscribiendo]);

    // Avisa a Home (y de ahí a ThreeScene) para que los cohetes 3D aparezcan junto con las tarjetas
    useEffect(() => { onTarjetasListas?.(tarjetasListas); }, [tarjetasListas, onTarjetasListas]);

    const abrirModal = useCallback((index) => {
        if (montadoRef.current) return; // ya hay un modal abierto (o cerrándose)
        montadoRef.current = true;
        cerrandoRef.current = false;
        setEtapaIndex(index);
        setModalMontado(true);
        onElegir?.(index, CARDS[index].url); // la ruta de la etapa sale de CARDS (única fuente)
    }, [onElegir]);

    // Permite que un clic sobre el cohete 3D abra este mismo modal
    useImperativeHandle(ref, () => ({ elegir: abrirModal }), [abrirModal]);

    const handleElegirClick = (e, index) => {
        e.preventDefault();
        abrirModal(index);
    };

    const cerrarModal = useCallback(() => {
        if (!montadoRef.current || cerrandoRef.current) return;
        cerrandoRef.current = true;
        setModalAbierto(false); // arranca la transición de salida
        onCerrarModal?.();
        timeoutRef.current = setTimeout(() => {
            montadoRef.current = false;
            cerrandoRef.current = false;
            setModalMontado(false); // al desmontarse se libera el scroll
        }, MODAL_ANIM_MS);
    }, [onCerrarModal]);

    // Entrada: se monta con el estado "cerrado" y, dos frames después, pasa a "abierto" para que la
    // transición de opacidad/escala se vea (sin saltos de layout: el modal es position: fixed).
    useEffect(() => {
        if (!modalMontado) return undefined;
        let raf2 = 0;
        const raf1 = requestAnimationFrame(() => {
            raf2 = requestAnimationFrame(() => {
                if (!cerrandoRef.current) setModalAbierto(true);
            });
        });
        return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); };
    }, [modalMontado]);

    // Mientras el modal existe: scroll de la página bloqueado (bloqueo compartido, ver bloqueoScroll.js: conserva
    // la posición, evita el salto de la barra y se libera solo pase lo que pase) y foco en la X.
    useEffect(() => {
        if (!modalMontado) return undefined;
        bloquearScroll('modal', { maxMs: 600000 });
        botonCerrarRef.current?.focus({ preventScroll: true });
        return () => liberarScroll('modal');
    }, [modalMontado]);

    // Escape = cerrar
    useEffect(() => {
        if (!modalMontado) return undefined;
        const onKey = (e) => { if (e.key === 'Escape') cerrarModal(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [modalMontado, cerrarModal]);

    const etapa = etapaIndex !== null ? CARDS[etapaIndex] : null;

    return (
        <>
            <div className={`rocket-cards ${visible ? 'rocket-cards--visible' : ''}`}>
                
                {/* Título superior */}
                {/* El texto completo va invisible para reservar su espacio: así al escribirse no se mueve nada */}
                <h2 className="rocket-cards__header" aria-label={TEXTO_INTRO}>
                    <span className="rocket-cards__header-fantasma" aria-hidden="true">{TEXTO_INTRO}</span>
                    <span className="rocket-cards__header-texto" aria-hidden="true">{textoEscrito}</span>
                </h2>

                {/* Contenedor de las tarjetas */}
                <div className="rocket-cards__container">
                    {CARDS.map((card, index) => (
                        <div 
                            key={card.id} 
                            className={`rocket-card-wrapper ${tarjetasListas ? 'rocket-card-wrapper--listo' : ''}`}
                            style={{
                                '--i': index, // retraso escalonado de la aparición (ver RocketCards.css)
                                '--card-primary': card.primary,
                                '--card-secondary': card.secondary,
                                '--card-text': card.textColor,
                            }}
                        >
                            {/* data-rocket-card: ThreeScene ancla el cohete 3D de este índice al borde superior de esta tarjeta */}
                            <div className="rocket-card" data-rocket-card={index}>
                                <h3 className="rocket-card__title">{card.title}</h3>
                                
                                <div className="rocket-card__bubble">
                                    <p>{card.description}</p>
                                </div>
                                
                                <div className="rocket-card__character-space">
                                    <img src={card.img} alt={`Astronauta ${card.title}`} className="astronauta-img" />
                                </div>
                            </div>
                            
                            <a 
                                href={card.url} 
                                className="rocket-card__button"
                                onClick={(e) => handleElegirClick(e, index)}
                            >
                                Elegir
                            </a>
                        </div>
                    ))}
                </div>

                {/* Guía de scroll (después de cerrar el modal). Va posicionada en absoluto, así no
                    mueve las tarjetas; se oculta cuando empieza la animación del cohete. */}
                <div
                    className={`rocket-cards__guia ${mostrarGuia ? 'rocket-cards__guia--visible' : ''}`}
                    aria-hidden={!mostrarGuia}
                >
                    Desliza para seguir la exploración <span className="rocket-cards__guia-flecha">↓</span>
                </div>
            </div>

            {/* Modal de la nave. Se renderiza en <body> (portal) para quedar por encima de la capa 3D
                de los cohetes. La capa oscura + desenfoque es una capa HERMANA del modal que usa
                backdrop-filter: desenfoca solo lo que hay detrás, nunca el modal ni su imagen. */}
            {modalMontado && createPortal(
                <div
                    className={`nave-modal-overlay ${modalAbierto ? 'nave-modal-overlay--abierto' : ''}`}
                    role="presentation"
                >
                    <div
                        className="nave-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Interior de la nave${etapa ? ' - ' + etapa.title : ''}`}
                    >
                        {imagenFallida ? (
                            <div className="nave-modal__placeholder">
                                Coloca aquí la imagen del interior de la nave:<br />
                                <code>{shipInteriorImage}</code>
                            </div>
                        ) : (
                            <img
                                src={shipInteriorImage}
                                alt="Interior de la nave espacial"
                                className="nave-modal__img"
                                draggable={false}
                                onError={() => setImagenFallida(true)}
                            />
                        )}
                        <button
                            ref={botonCerrarRef}
                            type="button"
                            className="nave-modal__cerrar"
                            aria-label="Cerrar ventana"
                            onClick={cerrarModal}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" aria-hidden="true">
                                <line x1="5" y1="5" x2="19" y2="19" />
                                <line x1="19" y1="5" x2="5" y2="19" />
                            </svg>
                        </button>
                    </div>
                </div>,
                document.body,
            )}
        </>
    );
});

export default RocketCards;