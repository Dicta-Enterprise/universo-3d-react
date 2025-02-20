import { useEffect, useState } from 'react';
import * as THREE from 'three';
import BackButton from '../../components/BackButton';
import DivCentral from '../../components/Planetas/DivCentral';
import ControlButtons from '../../components/Planetas/ControlButtons';
import InfoBox from '../../components/Planetas/InfoBox';

export default function EsferaTexturizada() {
    const [currentTextureIndex, setCurrentTextureIndex] = useState(0);
    const [isZooming, setIsZooming] = useState(false);

    const textures = [
        '/assets/2k_makemake_fictional.jpg',
        '/assets/2k_haumea_fictional.jpg',
        '/assets/earthx5400x2700.jpg',
        '/assets/2k_neptune.jpg',
        '/assets/2k_venus_surface.jpg',
    ];

    const texts = [
        "Tipo de riesgo: Peligro digital\nPlaneta: Planeta KIO\nTamaño del planeta: 1.737,4 km\nComposición: Tierra árida\nNombre del riesgo: Ciberbullying\nNivel de riesgo: Alto\nAmbiente: Tóxico\nTemperatura: -30°C a 127°C\nVillano: Ciberbull",
        "SEGUNDO PLANETA - - ",
        "TERCER PLANETA - - - ",
        "CUARTO PLANETA - - - - ",
        "QUINTO PLANETA - - - - - ",
    ];

    const planetUrls = [
        '/ninos/salud_social/planeta_kio',
        '/ninos/salud_social/planeta_2',
        '/ninos/salud_social/planeta_3',
        '/ninos/salud_social/planeta_4',
        '/ninos/salud_social/planeta_5',
    ];

    const changeTexture = (direction) => {
        setCurrentTextureIndex((prevIndex) => {
            let nextIndex = prevIndex;
            if (direction === 'next') {
                nextIndex = (prevIndex + 1) % textures.length;
            } else if (direction === 'prev') {
                nextIndex = (prevIndex - 1 + textures.length) % textures.length;
            }
            return nextIndex;
        });
    };

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.style.overflow = 'hidden';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.appendChild(renderer.domElement);

        const spaceTexture = new THREE.TextureLoader().load('/assets/2k_stars.jpg');
        scene.background = spaceTexture;

        const sphereGeometry = new THREE.SphereGeometry(6, 64, 64);
        const sphereMaterial = new THREE.MeshStandardMaterial({
            map: new THREE.TextureLoader().load(textures[currentTextureIndex]),
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);

        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(2, 5, 10);
        scene.add(pointLight);

        camera.position.set(0, 0, 18);

        const animate = () => {
            requestAnimationFrame(animate);

            // Animación de zoom
            if (isZooming && camera.position.z > 7) {
                camera.position.z -= 0.1; // Ajusta la velocidad del zoom
            }

            sphere.rotation.y += 0.0005;
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            renderer.dispose();
            document.body.removeChild(renderer.domElement);
        };
    }, [currentTextureIndex, textures, isZooming]); // Añade isZooming como dependencia

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100vh',
                overflow: 'hidden',
            }}
        >
            <BackButton />
            <DivCentral title="Bienvenidos a la sección de Salud Social">
                <InfoBox text={texts[currentTextureIndex]} />
            </DivCentral>
            <ControlButtons
                onPrev={() => changeTexture('prev')}
                onNext={() => changeTexture('next')}
                onViewMore={() => {
                    setIsZooming(true); // Activa la animación de zoom
                    setTimeout(() => {
                        setIsZooming(false); // Desactiva la animación
                        window.location.href = planetUrls[currentTextureIndex]; // Redirige
                    }, 1000); // Ajusta el tiempo según la duración de la animación
                }}
            />
        </div>
    );
}