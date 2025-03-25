import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Galaxy from './Galaxy';

export default function GalaxyScene({ isMobile, galaxiesData, onGalaxyClick, selectedGalaxy }) {
    const mountRef = useRef(null);
    const sceneRef = useRef(new THREE.Scene());
    const cameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
    const rendererRef = useRef(null);
    const galaxiesRef = useRef([]);
    const raycasterRef = useRef(new THREE.Raycaster());
    const mouseRef = useRef(new THREE.Vector2());

    useEffect(() => {
        const scene = sceneRef.current;
        const camera = cameraRef.current;
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement);
        }
        rendererRef.current = renderer;

        // Configurar la textura de fondo
        const spaceTexture = new THREE.TextureLoader().load('/assets/2k_stars.jpg');
        scene.background = spaceTexture;

        // Posicionar la cámara
        camera.position.set(0, 0, 18);

        // Crear las galaxias
        galaxiesData.forEach((data) => {
            const galaxy = <Galaxy key={data.id} position={data.position} color={data.color} rotation={data.rotation} />;
            scene.add(galaxy);
            galaxiesRef.current.push(galaxy);
        });

        // Animación
        const animate = () => {
            requestAnimationFrame(animate);
            galaxiesRef.current.forEach((galaxy, index) => {
                const speed = 0.0002 + index * 0.0002;
                galaxy.rotation.y += speed;
            });
            renderer.render(scene, camera);
        };
        animate();

        // Manejar clics en las galaxias
        const handleClick = (event) => {
            const mouse = mouseRef.current;
            const raycaster = raycasterRef.current;

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(galaxiesRef.current);

            if (intersects.length > 0) {
                const galaxy = intersects[0].object;
                const galaxyIndex = galaxiesRef.current.indexOf(galaxy);
                onGalaxyClick(galaxyIndex);
            }
        };

        renderer.domElement.addEventListener('click', handleClick);

        // Limpieza al desmontar el componente
        return () => {
            if (rendererRef.current) {
                rendererRef.current.dispose();
                if (mountRef.current && rendererRef.current.domElement) {
                    mountRef.current.removeChild(rendererRef.current.domElement);
                }
            }
            renderer.domElement.removeEventListener('click', handleClick);
        };
    }, [galaxiesData, onGalaxyClick]);

    return <div ref={mountRef} />;
}