import React, { useEffect, useState } from 'react';
import * as THREE from 'three';

export default function Jovenes() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

    useEffect(() => {
        // Configuración de Three.js para el fondo estrellado y el planeta
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);

        // Fondo estrellado
        const spaceTexture = new THREE.TextureLoader().load('/assets/2k_stars.jpg');
        scene.background = spaceTexture;

        // Planeta giratorio
        const sphereGeometry = new THREE.SphereGeometry(5, 64, 64);
        const sphereMaterial = new THREE.MeshStandardMaterial({
            map: new THREE.TextureLoader().load(textures[0]), // Usar la primera textura por defecto
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);

        // Luz para iluminar el planeta
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(5, 5, 10);
        scene.add(pointLight);

        // Posición de la cámara
        camera.position.set(0, 0, 15);

        // Animación del planeta
        const animate = () => {
            requestAnimationFrame(animate);
            sphere.rotation.y += 0.005; // Rotación del planeta
            renderer.render(scene, camera);
        };
        animate();

        // Crear el contenedor principal
        const mainDiv = document.createElement('div');
        mainDiv.style.position = 'absolute';
        mainDiv.style.top = '0';
        mainDiv.style.left = '0';
        mainDiv.style.width = '100%';
        mainDiv.style.height = '100%';
        mainDiv.style.display = 'flex';
        mainDiv.style.flexDirection = 'column';
        mainDiv.style.alignItems = 'center';
        mainDiv.style.justifyContent = 'center';
        mainDiv.style.color = 'white';
        mainDiv.style.pointerEvents = 'none';
        document.body.appendChild(mainDiv);

        // Función para crear botones
        const createButton = (text, onClick, color = '#ff0000') => {
            const button = document.createElement('button');
            button.innerHTML = text;
            button.style.fontSize = '20px';
            button.style.background = 'none';
            button.style.border = `2px solid ${color}`;
            button.style.color = color;
            button.style.cursor = 'pointer';
            button.style.padding = '12px 32px';
            button.style.borderRadius = '12px';
            button.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
            button.style.transition = 'all 0.3s ease';
            button.style.textShadow = `0 0 3px ${color}`;
            button.style.marginTop = '10px';
            button.style.pointerEvents = 'auto'; // Asegurar que los botones sean clickeables

            // Efecto hover
            button.addEventListener('mouseover', () => {
                button.style.transform = 'scale(1.05)';
                button.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;
                button.style.textShadow = `0 0 5px ${color}`;
            });

            // Efecto al salir del hover
            button.addEventListener('mouseout', () => {
                button.style.transform = 'scale(1)';
                button.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
                button.style.textShadow = `0 0 3px ${color}`;
            });

            // Acción al hacer clic
            button.addEventListener('click', onClick);

            return button;
        };

        // Crear los divs de contenido
        const createContentDiv = (content, isLeft) => {
            const div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.fontSize = '20px';
            div.style.backgroundColor = 'rgba(252, 107, 102, 0.32)';
            div.style.padding = '24px';
            div.style.margin = '32px';
            div.style.borderRadius = '10px';
            div.style.pointerEvents = 'auto';
            div.style.maxWidth = '400px';
            div.style.width = '100%';
            div.innerHTML = content;

            if (isMobile) {
                // En móvil, los divs se apilan verticalmente
                div.style.position = 'static';
                div.style.margin = '20px 0';
            } else {
                // En escritorio, los divs se posicionan a los lados
                div.style.left = isLeft ? '10%' : '90%';
                div.style.top = '50%';
                div.style.transform = isLeft ? 'translateY(-50%)' : 'translate(-100%, -50%)';
            }

            return div;
        };

        // Crear el div de Resumen del Curso
        const leftDiv = createContentDiv(`
            <h2>Resumen del Curso</h2>
            <p>Este curso te llevará a través de los conceptos básicos y avanzados del planeta KIO, explorando su geografía, clima, y los desafíos únicos que presenta.</p>
        `, true);

        // Crear el div de Beneficios
        const rightDiv = createContentDiv(`
            <h2>Beneficios</h2>
            <p>Al completar este curso, ganarás una comprensión profunda de KIO, habilidades prácticas para navegar sus desafíos, y una certificación reconocida.</p>
        `, false);

        // Botón "Seguir explorando" debajo del Resumen
        const seguirExplorandoButton = createButton('Seguir explorando', () => {
            window.history.back(); // Redirige a la página anterior
        }, '#FFFFFF'); // Color

        // Botón "Comprar" debajo de Beneficios
        const comprarButton = createButton('Comprar', () => {
            window.location.href = ''; // ----------------------- LANDING PAGE -------------     <<<<<<------
        }, '#FFFFFF'); // Color

        // Crear un contenedor para el contenido izquierdo y su botón
        const leftContainer = document.createElement('div');
        leftContainer.style.display = 'flex';
        leftContainer.style.flexDirection = 'column';
        leftContainer.style.alignItems = 'center';
        leftContainer.appendChild(leftDiv);
        leftContainer.appendChild(seguirExplorandoButton);

        // Crear un contenedor para el contenido derecho y su botón
        const rightContainer = document.createElement('div');
        rightContainer.style.display = 'flex';
        rightContainer.style.flexDirection = 'column';
        rightContainer.style.alignItems = 'center';
        rightContainer.appendChild(rightDiv);
        rightContainer.appendChild(comprarButton);

        // Añadir los contenedores al div principal
        mainDiv.appendChild(rightContainer);
        mainDiv.appendChild(leftContainer);

        // Crear la pasarela de planetas
        const planetCarousel = document.createElement('div');
        planetCarousel.style.position = 'absolute';
        planetCarousel.style.bottom = '20px';
        planetCarousel.style.left = '50%';
        planetCarousel.style.transform = 'translateX(-50%)';
        planetCarousel.style.display = 'flex';
        planetCarousel.style.gap = '20px';
        planetCarousel.style.pointerEvents = 'auto';
        planetCarousel.style.zIndex = '1000';
        planetCarousel.style.overflowX = 'auto'; // Para permitir el desplazamiento horizontal en móviles
        planetCarousel.style.padding = '10px'; // Espaciado interno
        planetCarousel.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Fondo semitransparente
        planetCarousel.style.borderRadius = '10px'; // Bordes redondeados
        mainDiv.appendChild(planetCarousel);

        // Crear miniaturas de planetas
        textures.forEach((texture, index) => {
            const planetThumbnail = document.createElement('div');
            planetThumbnail.style.width = '60px';
            planetThumbnail.style.height = '60px';
            planetThumbnail.style.borderRadius = '50%';
            planetThumbnail.style.backgroundImage = `url(${texture})`;
            planetThumbnail.style.backgroundSize = 'cover';
            planetThumbnail.style.cursor = 'pointer';
            planetThumbnail.style.transition = 'transform 0.3s ease';

            // Efecto hover
            planetThumbnail.addEventListener('mouseover', () => {
                planetThumbnail.style.transform = 'scale(1.1)';
            });

            planetThumbnail.addEventListener('mouseout', () => {
                planetThumbnail.style.transform = 'scale(1)';
            });

            // Acción al hacer clic
            planetThumbnail.addEventListener('click', () => {
                window.location.href = planetUrls[index]; // Redirige a la URL correspondiente
            });

            planetCarousel.appendChild(planetThumbnail);
        });

        // Manejar cambios de tamaño de la ventana
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);

            // Actualizar el tamaño del renderizador de Three.js
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);

            // Reposicionar los divs según el modo (móvil o escritorio)
            if (mobile) {
                leftDiv.style.position = 'static';
                leftDiv.style.margin = '20px 0';
                rightDiv.style.position = 'static';
                rightDiv.style.margin = '20px 0';
            } else {
                leftDiv.style.position = 'absolute';
                leftDiv.style.left = '10%';
                leftDiv.style.top = '50%';
                leftDiv.style.transform = 'translateY(-50%)';
                rightDiv.style.position = 'absolute';
                rightDiv.style.left = '90%';
                rightDiv.style.top = '50%';
                rightDiv.style.transform = 'translate(-100%, -50%)';
            }
        };

        window.addEventListener('resize', handleResize);

        // Limpieza al desmontar el componente
        return () => {
            window.removeEventListener('resize', handleResize);
            document.body.removeChild(mainDiv);
            renderer.dispose();
        };
    }, [isMobile]);

    return <h1 style={{ textAlign: 'center', color: 'white', marginTop: '20px' }}>Bienvenidos al Planeta KIO</h1>;
}