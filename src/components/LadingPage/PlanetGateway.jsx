import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import BackButton from '../BackButton'; // Importar el componente BackButton

const PlanetGateway = ({ textures, texts, planetUrls }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
        const pointLight = new THREE.PointLight(0xffffff, 0.15, 100);
        pointLight.position.set(5, 5, 10);
        scene.add(pointLight);

        // Agregar una luz direccional para iluminar los planetas
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Color blanco, intensidad 1
        directionalLight.position.set(5, 15, 10); // Posición de la luz
        scene.add(directionalLight);

        // Agregar una luz ambiental para suavizar las sombras
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Color gris, intensidad 0.5
        scene.add(ambientLight);

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

        // Texto principal
        const title = document.createElement('h1');
        title.textContent = 'Bienvenidos al Planeta KIO';
        title.style.fontSize = '40px';
        title.style.textAlign = 'center';
        title.style.pointerEvents = 'auto';
        title.style.position = 'absolute';
        title.style.left = '50%';
        title.style.top = '6%';
        title.style.transform = 'translate(-50%, 0%)';
        mainDiv.appendChild(title);

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
            div.style.maxWidth = '340px';
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

        // Botón "Comprar" debajo del Resumen
        const comprarButton = createButton('Comprar', () => {
            window.location.href = ''; // ----------------------- LANDING PAGE -------------     <<<<<<------
        }, '#FFFFFF'); // Color

        // Crear un contenedor para el contenido izquierdo y su botón
        const leftContainer = document.createElement('div');
        leftContainer.style.display = 'flex';
        leftContainer.style.flexDirection = 'column';
        leftContainer.style.alignItems = 'center';
        leftContainer.appendChild(leftDiv);
        leftContainer.appendChild(comprarButton); // Aquí se añade el botón "Comprar"

        // Crear un contenedor para el contenido derecho
        const rightContainer = document.createElement('div');
        rightContainer.style.display = 'flex';
        rightContainer.style.flexDirection = 'column';
        rightContainer.style.alignItems = 'center';
        rightContainer.appendChild(rightDiv);

        // Añadir los contenedores al div principal
        mainDiv.appendChild(rightContainer);
        mainDiv.appendChild(leftContainer);

        // Crear el título "Explore más"
        const exploreTitle = document.createElement('h2');

        exploreTitle.textContent = 'Explore más';
        exploreTitle.style.fontSize = '24px';
        exploreTitle.style.textAlign = 'center';
        exploreTitle.style.position = 'absolute';
        exploreTitle.style.left = '50%';
        exploreTitle.style.bottom = '90px'; // Posición por encima del carrusel de planetas
        exploreTitle.style.transform = 'translateX(-50%)';
        exploreTitle.style.color = 'white';
        exploreTitle.style.zIndex = '1000'; // Asegurar que esté por encima de otros elementos
        mainDiv.appendChild(exploreTitle);

        // Índices reorganizados para mover los planetas correctamente
        const newOrder = [3, 4, 0, 1, 2]; // Reorganiza los índices según el nuevo orden

        const kioIndex = 2; // El nuevo índice del Planeta KIO en la nueva disposición

        // Tamaños de los planetas con KIO en grande
        const planetSizes = [0.8, 1.2, 1.8, 1.2, 0.8]; // KIO más grande en la tercera posición

        const planets = newOrder.map((originalIndex, newIndex) => {
            const size = newIndex === kioIndex ? 2 : planetSizes[newIndex]; // Asegurar que KIO sea el más grande
            const geometry = new THREE.SphereGeometry(size, 32, 32);
            const material = new THREE.MeshStandardMaterial({
                map: new THREE.TextureLoader().load(textures[originalIndex]), // Usar la textura en el nuevo orden
            });

            const planet = new THREE.Mesh(geometry, material);

            planet.position.x = (newIndex - 2) * 4; // Centrar KIO y alinear los demás planetas
            planet.position.y = -17;
            planet.position.z = -10;

            planet.userData.url = planetUrls[originalIndex]; // Mantener la URL original del planeta

            scene.add(planet);
            return planet;
        });

        // Raycaster para detectar clics en los planetas
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        // Manejar clics en los planetas
        const onDocumentClick = (event) => {
            event.preventDefault();

            // Calcular la posición del mouse en coordenadas normalizadas (-1 to +1)
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Lanzar un rayo desde la cámara en la dirección del mouse
            raycaster.setFromCamera(mouse, camera);

            // Verificar si el rayo intersecta con algún planeta
            const intersects = raycaster.intersectObjects(planets);

            if (intersects.length > 0) {
                const planet = intersects[0].object;
                window.location.href = planet.userData.url; // Redirigir a la URL del planeta
            }
        };

        document.addEventListener('click', onDocumentClick, false);

        // Animación de los planetas
        const animatePlanets = () => {
            requestAnimationFrame(animatePlanets);

            // Rotar los planetas
            planets.forEach((planet) => {
                planet.rotation.y += 0.005;
            });

            renderer.render(scene, camera);
        };
        animatePlanets();

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
            document.removeEventListener('click', onDocumentClick);
            document.body.removeChild(mainDiv);
            renderer.dispose();
        };
    }, [isMobile, textures, planetUrls]);

    return (
        <>
            <BackButton color="#FFFFFF" /> {/* BackButton blanco */}
        </>
    );
};

export default PlanetGateway;