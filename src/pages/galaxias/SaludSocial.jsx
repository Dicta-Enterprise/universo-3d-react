import { useEffect, useState } from 'react';
import * as THREE from 'three';

export default function EsferaTexturizada() {
    const [currentTextureIndex, setCurrentTextureIndex] = useState(0);

    // Lista de texturas disponibles
    const textures = [
        '/assets/2k_makemake_fictional.jpg',
        '/assets/2k_haumea_fictional.jpg',
        '/assets/earthx5400x2700.jpg',
    ];

    // Lista de textos correspondientes a las texturas
    const texts = [
        "Tipo de riesgo: Peligro digital\nPlaneta: Planeta KIO\nTamaño del planeta: 1.737,4 km (satélite que gira alrededor del mundo dictariano)\nComposición: Tierra árida\nNombre del riesgo: Ciberbullying\nNivel de riesgo: Alto\nAmbiente: Tóxico puede llevar a la muerte\nTemperatura: extremadamente o frío=-30°C es muerte   o caliente hasta 127ºC es muerte\nVillano: Ciberbull",
        "En este planeta....",
        "En este otro planeta....",
    ];

    // Lista de URLs de los planetas
    const planetUrls = [
        '/ninos/salud_social/planeta_kio',  // URL para el primer planeta
        'https://www.planetox.com',    // URL para el segundo planeta
        'https://www.planetoye.com',   // URL para el tercer planeta
    ];

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);

        // Fondo estrellado
        const spaceTexture = new THREE.TextureLoader().load('/assets/2k_stars.jpg');
        scene.background = spaceTexture;

        // Crear esfera texturizada
        const sphereGeometry = new THREE.SphereGeometry(6, 64, 64); // Esfera con mayor detalle
        const sphereMaterial = new THREE.MeshStandardMaterial({
            map: new THREE.TextureLoader().load(textures[currentTextureIndex]),
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(0, 0, 0);
        scene.add(sphere);

        // Luz
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(2, 5, 10);
        scene.add(pointLight);

        camera.position.set(0, 0, 18);

        // Ajustar el tamaño y posición de la esfera al centro de la pantalla
        const resizeHandler = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', resizeHandler);

// Contenedor principal para texto y botones
const mainDiv = document.createElement('div');
mainDiv.style.position = 'absolute';
mainDiv.style.top = '0';
mainDiv.style.left = '0';
mainDiv.style.width = '100%';
mainDiv.style.height = '100%';
mainDiv.style.display = 'flex';
mainDiv.style.flexDirection = 'column';
mainDiv.style.alignItems = 'center'; // Centrado horizontal
mainDiv.style.justifyContent = 'center'; // Centrado vertical
mainDiv.style.color = 'white';
mainDiv.style.pointerEvents = 'none'; // Asegura que Three.js funcione correctamente
document.body.appendChild(mainDiv);

// Título centrado
const title = document.createElement('h1');
title.textContent = 'Bienvenidos a la sección de Salud Social';
title.style.fontSize = '32px';
title.style.textAlign = 'center'; // Asegura que el texto esté centrado
title.style.pointerEvents = 'auto';
mainDiv.appendChild(title);

        // Contenedor de texto
        const textContainer = document.createElement('div');
        textContainer.style.margin = 'auto';
        textContainer.style.backgroundColor = 'rgba(255, 153, 135, 0.27)';
        textContainer.style.padding = '24px';
        textContainer.style.borderRadius = '10px';
        textContainer.style.pointerEvents = 'auto';
        textContainer.innerHTML = texts[currentTextureIndex].replace(/\n/g, '<br />'); // Reemplaza saltos de línea

        // Controles (botones en forma de flechas)
        const controlsDiv = document.createElement('div');
        controlsDiv.style.display = 'flex';
        controlsDiv.style.justifyContent = 'space-between';
        controlsDiv.style.width = '100%';
        controlsDiv.style.pointerEvents = 'auto';

        // Botón izquierdo (anterior)
        const leftArrow = document.createElement('button');
        leftArrow.innerHTML = '⟵';
        leftArrow.style.fontSize = '32px';
        leftArrow.style.background = 'rgba(255, 255, 255, 0.2)'; // Fondo transparente pero visible
        leftArrow.style.border = 'none';
        leftArrow.style.color = 'white';
        leftArrow.style.cursor = 'pointer';
        leftArrow.style.margin = '20px';
        leftArrow.style.padding = '10px';
        leftArrow.style.borderRadius = '10px';
        controlsDiv.appendChild(leftArrow);

        // Botón para abrir URL
        const urlButton = document.createElement('button');
        urlButton.innerHTML = 'Ver más';
        urlButton.style.fontSize = '24px';
        urlButton.style.background = 'rgba(255, 255, 255, 0.5)';
        urlButton.style.border = 'none';
        urlButton.style.color = 'black';
        urlButton.style.cursor = 'pointer';
        urlButton.style.margin = '20px';
        urlButton.style.padding = '10px';
        urlButton.style.borderRadius = '10px';
        urlButton.addEventListener('click', () => {
            window.open(planetUrls[currentTextureIndex], '_blank'); // Redirige a la URL del planeta actual
        });
        controlsDiv.appendChild(urlButton);

        // Botón derecho (siguiente)
        const rightArrow = document.createElement('button');
        rightArrow.innerHTML = '⟶';
        rightArrow.style.fontSize = '32px';
        rightArrow.style.background = 'rgba(255, 255, 255, 0.2)'; // Fondo transparente pero visible
        rightArrow.style.border = 'none';
        rightArrow.style.color = 'white';
        rightArrow.style.cursor = 'pointer';
        rightArrow.style.margin = '20px';
        rightArrow.style.padding = '10px';
        rightArrow.style.borderRadius = '10px';
        controlsDiv.appendChild(rightArrow);

        // Añadir contenedor de texto y controles al final
        mainDiv.appendChild(textContainer);
        mainDiv.appendChild(controlsDiv);

        // Función para cambiar textura y texto
        const changeTexture = (direction) => {
            let nextIndex = currentTextureIndex;
            if (direction === 'next') {
                nextIndex = (currentTextureIndex + 1) % textures.length;
            } else if (direction === 'prev') {
                nextIndex = (currentTextureIndex - 1 + textures.length) % textures.length;
            }
            const newTexture = new THREE.TextureLoader().load(textures[nextIndex]);
            sphere.material.map = newTexture;
            sphere.material.needsUpdate = true;
            setCurrentTextureIndex(nextIndex); // Actualiza el índice actual
            textContainer.innerHTML = texts[nextIndex].replace(/\n/g, '<br />'); // Actualiza el texto con saltos de línea
        };

        rightArrow.addEventListener('click', () => changeTexture('next'));
        leftArrow.addEventListener('click', () => changeTexture('prev'));

        // Animación
        const animate = () => {
            requestAnimationFrame(animate);
            sphere.rotation.y += 0.0005; // Rotación animada
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            window.removeEventListener('resize', resizeHandler);
            renderer.dispose();
            document.body.removeChild(renderer.domElement);
            document.body.removeChild(mainDiv);
        };
    }, [currentTextureIndex, textures, texts, planetUrls]);

    return null;
}
