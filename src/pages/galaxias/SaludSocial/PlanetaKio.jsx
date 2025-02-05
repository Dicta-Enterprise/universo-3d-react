import React, { useEffect, useState } from 'react';
import * as THREE from 'three';

export default function Jovenes() {
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
            map: new THREE.TextureLoader().load('/assets/2k_makemake_fictional.jpg'), // Textura del planeta
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
            button.style.fontSize = '16px';
            button.style.background = 'none';
            button.style.border = `2px solid ${color}`;
            button.style.color = color;
            button.style.cursor = 'pointer';
            button.style.padding = '10px 20px';
            button.style.borderRadius = '20px';
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

        // Botón "Seguir explorando" debajo del Resumen
        const seguirExplorandoButton = createButton('Seguir explorando', () => {
            window.history.back(); // Redirige a la página anterior
        }, '#FFFFFF'); // Color

        leftDiv.appendChild(seguirExplorandoButton);

        // Crear el div de Beneficios
        const rightDiv = createContentDiv(`
            <h2>Beneficios</h2>
            <p>Al completar este curso, ganarás una comprensión profunda de KIO, habilidades prácticas para navegar sus desafíos, y una certificación reconocida.</p>
        `, false);

        // Botón "Comprar" debajo de Beneficios
        const comprarButton = createButton('Comprar', () => {
            window.location.href = ''; // ----------------------- LANDING PAGE -------------     <<<<<<------
        }, '#FFFFFF'); // Color

        rightDiv.appendChild(comprarButton);

        mainDiv.appendChild(leftDiv);
        mainDiv.appendChild(rightDiv);

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