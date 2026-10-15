import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// ============================================================================
// DEMO TÉCNICO: prueba si el traje de un astronauta se puede recolorear por
// código, a partir de si los trajes podrán ser de colores elegidos por el
// usuario, y de que los modelos reales van en .glb, con movimientos.
//
// Este componente es INDEPENDIENTE de ThreeScene.jsx a propósito: tiene su
// propio <canvas>, su propia escena, cámara y renderer de Three.js. No toca
// nada de la escena principal (planeta, cohetes, fases de scroll) -- por eso
// se puede borrar este archivo y su línea de montaje en Home.jsx sin afectar
// el resto del código.
//
// Qué prueba: que SÍ se puede cambiar el color de un traje por código, en
// tiempo real, sin tocar el modelo 3D (los botones de color de abajo).
//
// Qué NO es: el diseño final de los astronautas. El modelo que se ve aquí es un
// astronauta de muestra, gratuito, de Google (antes "Poly", licencia CC-BY --
// pide atribución si esto llega a producción), descargado de
// https://modelviewer.dev/shared-assets/models/Astronaut.glb,
// SOLO porque todavía no se ha subido ningún .glb propio del proyecto.
//
// Limitación encontrada: este modelo de muestra tiene UN SOLO material para
// todo el traje y el casco juntos -- no hay un material separado solo para
// "el traje" y otro para "la cara/visor". Por eso el botón de color cambia
// TODO el modelo de una vez. Para que el usuario pueda elegir el color SOLO
// del traje (sin afectar el casco, la cara o los detalles), el modelo real
// que se suba necesita el traje en su propio material separado.
// ============================================================================

const MODELO_URL = '/assets/demo/astronauta-ejemplo-placeholder.glb';

// Valor especial (no es un color): prueba que, a parte de un color sólido, también se puede
// poner una TEXTURA -- una imagen completa, acá un degradado de varios tonos de azul (no solo
// un color sólido, también varios tonos/texturas).
const TEXTURA_DEGRADADO = 'TEXTURA_DEGRADADO';

const COLORES = [
    { nombre: 'Gris original', valor: null }, // null = color de fábrica del modelo
    { nombre: 'Azul', valor: '#2F6FED' },
    { nombre: 'Rojo', valor: '#E5484D' },
    { nombre: 'Verde', valor: '#30A46C' },
    { nombre: 'Amarillo', valor: '#F5B700' },
    { nombre: 'Degradado de azules (textura, no color)', valor: TEXTURA_DEGRADADO },
];

// Dibuja un degradado de 4 tonos de azul en un canvas, y lo convierte en una textura de
// Three.js. Esto es justo lo que un color sólido NO puede hacer (un material.color es un solo
// tono parejo) -- para varios tonos en una misma pieza hace falta una imagen de por medio.
function crearTexturaDegradadoAzules() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const degradado = ctx.createLinearGradient(0, 0, 0, 256);
    degradado.addColorStop(0, '#BFDBFE'); // azul muy claro
    degradado.addColorStop(0.35, '#60A5FA'); // azul claro
    degradado.addColorStop(0.68, '#2563EB'); // azul medio
    degradado.addColorStop(1, '#1E3A8A'); // azul oscuro
    ctx.fillStyle = degradado;
    ctx.fillRect(0, 0, 256, 256);
    const textura = new THREE.CanvasTexture(canvas);
    textura.colorSpace = THREE.SRGBColorSpace;
    return textura;
}

export default function DemoTrajeAstronauta() {
    const canvasRef = useRef(null);
    const materialRef = useRef(null);
    const colorOriginalRef = useRef(null);
    const mapaOriginalRef = useRef(null); // La textura de fábrica (insignia, franjas) -- se restaura al salir del degradado
    const texturaDegradadoRef = useRef(null);
    const [cargado, setCargado] = useState(false);
    const [colorElegido, setColorElegido] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // El tamaño real (110px, o 84px en celular por el CSS) lo manda el contenedor -- con
        // fallback a 110 por si se lee en un instante en que el layout todavía no está listo.
        const ancho = canvas.parentElement.clientWidth || 110;
        const alto = canvas.parentElement.clientHeight || 110;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, ancho / alto, 0.1, 100);
        camera.position.set(0, 1.2, 3.4);
        camera.lookAt(0, 0.9, 0);

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        // El "false" es a propósito: evita que Three.js escriba un width/height inline en el
        // canvas (lo hace por defecto) que pisaría el "width:100%; height:100%" del CSS -- eso
        // fue justo lo que causó que el canvas se agrandara y tapara los botones de color.
        renderer.setSize(ancho, alto, false);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        scene.add(new THREE.AmbientLight(0xffffff, 1.1));
        const luzDireccional = new THREE.DirectionalLight(0xffffff, 1.4);
        luzDireccional.position.set(2, 3, 2);
        scene.add(luzDireccional);

        let astronauta = null;
        let animId = null;

        new GLTFLoader().load(
            MODELO_URL,
            (gltf) => {
                astronauta = gltf.scene;
                astronauta.position.set(0, -0.55, 0);
                astronauta.scale.setScalar(1);
                scene.add(astronauta);

                // Guarda el material (es uno solo para todo el modelo, ver nota arriba)
                astronauta.traverse((hijo) => {
                    if (hijo.isMesh && hijo.material && !materialRef.current) {
                        materialRef.current = hijo.material;
                        colorOriginalRef.current = hijo.material.color.clone();
                        mapaOriginalRef.current = hijo.material.map ?? null;
                    }
                });
                texturaDegradadoRef.current = crearTexturaDegradadoAzules();

                setCargado(true);
            },
            undefined,
            (error) => {
                // No afecta el resto de la página si falla -- solo este panel se queda vacío
                console.warn('Demo traje: no se pudo cargar el modelo de muestra.', error);
            },
        );

        function animar() {
            animId = requestAnimationFrame(animar);
            if (astronauta) astronauta.rotation.y += 0.008; // Giro lento, para verlo de varios lados
            renderer.render(scene, camera);
        }
        animar();

        return () => {
            cancelAnimationFrame(animId);
            renderer.dispose();
        };
    }, []);

    function elegirColor(color) {
        setColorElegido(color.valor);
        const material = materialRef.current;
        if (!material) return;

        if (color.valor === TEXTURA_DEGRADADO) {
            // Reemplaza la textura entera (no solo el color) -- por eso puede tener varios
            // tonos en la misma pieza, cosa que un "material.color" solo no puede hacer.
            material.map = texturaDegradadoRef.current;
            material.color.set('#ffffff'); // blanco: para que el degradado se vea con sus tonos reales, sin tinte encima
        } else {
            // Vuelve a la textura de fábrica (insignia, franjas) y solo le cambia el tinte de color.
            material.map = mapaOriginalRef.current;
            material.color.copy(color.valor === null ? colorOriginalRef.current : new THREE.Color(color.valor));
        }
        material.needsUpdate = true;
    }

    return (
        // onClick con stopPropagation en el panel entero: ThreeScene.jsx escucha clics en
        // "window" para detectar si se le dio a un cohete (raycaster) -- sin esto, un clic
        // acá también disparaba el popup "¿Deseas ir a...?" de los cohetes de atrás.
        <div className="demo-traje" onClick={(e) => e.stopPropagation()}>
            <div className="demo-traje-canvas-wrap">
                <canvas ref={canvasRef} className="demo-traje-canvas" />
                {!cargado && <div className="demo-traje-cargando">Cargando...</div>}
            </div>
            <div className="demo-traje-texto">
                <span className="demo-traje-titulo">Ejemplo: traje personalizable</span>
                <div className="demo-traje-colores">
                    {COLORES.map((color) => (
                        <button
                            key={color.nombre}
                            type="button"
                            className={`demo-traje-swatch ${colorElegido === color.valor ? 'demo-traje-swatch--activo' : ''}`}
                            style={{
                                background:
                                    color.valor === TEXTURA_DEGRADADO
                                        ? 'linear-gradient(180deg, #BFDBFE, #60A5FA, #2563EB, #1E3A8A)'
                                        : (color.valor ?? 'linear-gradient(135deg, #9aa0a6, #c7cbd1)'),
                            }}
                            onClick={() => elegirColor(color)}
                            aria-label={color.nombre}
                            title={color.nombre}
                        />
                    ))}
                </div>
                <span className="demo-traje-nota">Modelo de muestra, no es el diseño final</span>
            </div>
        </div>
    );
}
