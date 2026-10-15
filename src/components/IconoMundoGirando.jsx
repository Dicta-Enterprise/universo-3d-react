import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ============================================================================
// Ícono "MUNDO DICTARIANO" de la fila música/sonido, pantalla "Anticípate...".
// A propósito es una esfera INDEPENDIENTE del planeta grande que se desvanece
// hacia la esquina -- no es el mismo objeto reubicado, es su propio mini
// Three.js aparte (mismo patrón que DemoTrajeAstronauta.jsx), para no mezclar
// su animación con la del planeta grande (son esferas independientes).
// Usa la misma textura (TTNN.png) que el planeta grande, solo que aquí no
// desaparece ni se asocia a la cámara -- gira sola, todo el tiempo que esté montada.
// ============================================================================

const TEXTURA_URL = '/assets/TTNN.png';

export default function IconoMundoGirando() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Del canvas mismo (su CSS ya le fija 44px, o 36px en móvil) -- no del contenedor, que no
        // tiene un ancho fijo propio (es una columna flex con el ícono y la etiqueta debajo).
        const ancho = canvas.clientWidth || 44;
        const alto = canvas.clientHeight || 44;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(30, ancho / alto, 0.1, 10);
        camera.position.z = 3;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(ancho, alto, false); // false: no pisar el width/height:100% del CSS (mismo bug ya visto con el canvas del demo de traje)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const textura = new THREE.TextureLoader().load(TEXTURA_URL);
        // MeshBasicMaterial a propósito, no MeshStandardMaterial: mismo ajuste que se le hizo
        // al planeta grande (sin sombra, parejo, como el ícono plano del Figma).
        const esfera = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 24), new THREE.MeshBasicMaterial({ map: textura }));
        scene.add(esfera);

        let animId;
        function animar() {
            animId = requestAnimationFrame(animar);
            esfera.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        animar();

        return () => {
            cancelAnimationFrame(animId);
            renderer.dispose();
            textura.dispose();
        };
    }, []);

    return (
        <div className="icono-mundo-girando">
            <canvas ref={canvasRef} className="icono-mundo-girando-canvas" />
            <span className="icono-mundo-girando-texto">MUNDO<br />DICTARIANO</span>
        </div>
    );
}
