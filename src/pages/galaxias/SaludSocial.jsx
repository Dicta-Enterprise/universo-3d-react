import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import BackButton from '../../components/BackButton';
import DivCentral from '../../components/Planetas/DivCentral';
import ControlButtons from '../../components/Planetas/ControlButtons';
import InfoBox from '../../components/Planetas/InfoBox';

export default function EsferaTexturizada() {
    const [currentTextureIndex, setCurrentTextureIndex] = useState(0);
    const [isZooming, setIsZooming] = useState(false);
    const clickSoundRef = useRef(null); // Referencia para el sonido de clic
    const planetSoundRef = useRef(null); // Referencia para el sonido de "Planet.mp3"

    const textures = [
        '/assets/2k_makemake_fictional.jpg',
        '/assets/2k_haumea_fictional.jpg',
        '/assets/earthx5400x2700.jpg',
        '/assets/2k_neptune.jpg',
        '/assets/2k_venus_surface.jpg',
        '/assets/2k_uranus.jpg',
        '/assets/2k_venus_atmosphere.jpg',
        '/assets/2k_earth_clouds.jpg',
        '/assets/2k_jupiter.jpg',
        '/assets/2k_mars.jpg',
    ];

    const texts = [
        "Tipo de riesgo: Peligro digital\nPlaneta: Planeta KIO\nTamaño del planeta: 1.737,4 km\nComposición: Tierra árida\nNombre del riesgo: Ciberbullying\nNivel de riesgo: Alto\nAmbiente: Tóxico\nTemperatura: -30°C a 127°C\nVillano: Ciberbull",
        "SEGUNDO PLANETA - - ",
        "TERCER PLANETA - - - ",
        "CUARTO PLANETA - - - - ",
        "QUINTO PLANETA - - - - - ",
        "SEXTO PLANETA - - - - - ",
        "SEPTIMO PLANETA - - - - - ",
        "OCTAVO PLANETA - - - - - ",
        "NOVENO PLANETA - - - - - ",
        "DECIMO PLANETA - - - - - ",
    ];

    const planetUrls = [
        '/ninos/salud_social/planeta_kio',
        '/ninos/salud_social/planeta_2',
        '/ninos/salud_social/planeta_3',
        '/ninos/salud_social/planeta_4',
        '/ninos/salud_social/planeta_5',
        '/ninos/salud_social/planeta_6',
        '/ninos/salud_social/planeta_7',
        '/ninos/salud_social/planeta_8',
        '/ninos/salud_social/planeta_9',
        '/ninos/salud_social/planeta_10',
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

        // Configurar el AudioListener
        const listener = new THREE.AudioListener();
        camera.add(listener);

        // Cargar el sonido de clic
        const clickSound = new THREE.Audio(listener);
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('/assets/sounds/click-space.mp3', (buffer) => {
            clickSound.setBuffer(buffer);
            clickSound.setLoop(false);
            clickSound.setVolume(0.5);
        });
        clickSoundRef.current = clickSound;

        // Cargar el sonido de "Planeta.mp3"
        const planetSound = new THREE.Audio(listener);
        audioLoader.load('/assets/sounds/Planeta.mp3', (buffer) => {
            planetSound.setBuffer(buffer);
            planetSound.setLoop(false);
            planetSound.setVolume(0.5);
        });
        planetSoundRef.current = planetSound;

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
                clickSoundRef={clickSoundRef}
                planetSoundRef={planetSoundRef}
            />
        </div>
    );
}