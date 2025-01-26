import { useEffect } from 'react';
import * as THREE from 'three';

export default function Galaxias() {
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

        // Crear galaxia roja
        const particles = 20000;
        const spiralArms = 7;
        const radius = 10;
        const spread = 0.5; //dispercion de las particulas
        const positions = new Float32Array(particles * 3);
        const colors = new Float32Array(particles * 3);
        const color = new THREE.Color('#ff0000');

        for (let i = 0; i < particles; i++) {
            const i3 = i * 3;
            const r = Math.random() * radius;
            const angle = (i % spiralArms) * (Math.PI * 2 / spiralArms) + r * 0.5 + Math.random() * spread;

            const x = Math.cos(angle) * r + (Math.random() - 0.5) * spread;
            const y = (Math.random() - 0.5) * spread;
            const z = Math.sin(angle) * r + (Math.random() - 0.5) * spread;

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            const variation = Math.random() * 0.4 - 0.2;
            const adjustedColor = color.clone().offsetHSL(0, 0, variation);

            colors[i3] = adjustedColor.r;
            colors[i3 + 1] = adjustedColor.g;
            colors[i3 + 2] = adjustedColor.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
        });

        const galaxy = new THREE.Points(geometry, material);
        galaxy.position.set(0, 2, 0); // Posición de la galaxia
        galaxy.rotation.set(Math.PI / 5, 0, 0); // Rotación inicial de la galaxia
        scene.add(galaxy);

        // Crear esfera roja (sol)
        const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32); // Esfera con un radio de 0.5
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: '#ff0000' });
        const sun = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sun.position.set(0, 2, 0); // Posición central de la galaxia
        scene.add(sun);

        camera.position.set(0, 0, 18);

        // Crear contenedor de texto de entrada (centro)
        const centralDiv = document.createElement('div');
        centralDiv.style.position = 'absolute';
        centralDiv.style.top = '50%';
        centralDiv.style.left = '15%';
        centralDiv.style.transform = 'translate(-50%, -50%)';
        centralDiv.style.color = 'white';
        centralDiv.style.fontSize = '24px';
        centralDiv.style.backgroundColor = 'rgba(255, 153, 135, 0.27)';
        centralDiv.style.padding = '20px';
        centralDiv.style.borderRadius = '10px';
        centralDiv.style.display = 'flex';
        centralDiv.style.flexDirection = 'column';
        centralDiv.style.alignItems = 'center';
        centralDiv.style.width = '360px';
        document.body.appendChild(centralDiv);

        const centralText = document.createElement('p');
        centralText.textContent = "En los confines del vasto universo digital, existe una galaxia única conocida como Salud Social, un sistema estelar compuesto por planetas dedicados a promover el bienestar, el acceso equitativo a servicios y la colaboración entre comunidades. Esta galaxia se ha formado a través de la convergencia de tecnologías, iniciativas sociales y plataformas en línea que buscan mejorar la calidad de vida de las personas a través del conocimiento y la acción colectiva.";
        centralDiv.appendChild(centralText);

        // Crear contenedor de texto de entrada (derecha) con título y botones
        const rightDiv = document.createElement('div');
        rightDiv.style.position = 'absolute';
        rightDiv.style.top = '50%';
        rightDiv.style.right = '15%';
        rightDiv.style.transform = 'translate(50%, -50%)';
        rightDiv.style.color = 'white';
        rightDiv.style.fontSize = '24px';
        rightDiv.style.backgroundColor = 'rgba(135, 153, 255, 0.27)';
        rightDiv.style.padding = '20px';
        rightDiv.style.borderRadius = '10px';
        rightDiv.style.display = 'flex';
        rightDiv.style.flexDirection = 'column';
        rightDiv.style.alignItems = 'center';
        rightDiv.style.width = '360px';
        document.body.appendChild(rightDiv);

        const rightTitle = document.createElement('h2');
        rightTitle.textContent = "Explora nuestros planetas";
        rightDiv.appendChild(rightTitle);

        // Crear los botones con imagen y redirección
        const planets = [
            { name: 'Planeta 1', url: 'url1', imageUrl: '/assets/planet1.jpg' },
            { name: 'Planeta 1', url: 'url1', imageUrl: '/assets/planet1.jpg' },
            { name: 'Planeta 1', url: 'url1', imageUrl: '/assets/planet1.jpg' },
            { name: 'Planeta 1', url: 'url1', imageUrl: '/assets/planet1.jpg' },
            { name: 'Planeta 1', url: 'url1', imageUrl: '/assets/planet1.jpg' }
        ];

        planets.forEach(planet => {
            const button = document.createElement('button');
            button.style.backgroundColor = 'transparent';
            button.style.border = 'none';
            button.style.margin = '10px';
            button.style.cursor = 'pointer';

            const img = document.createElement('img');
            img.src = planet.imageUrl;
            img.alt = planet.name;
            img.style.width = '50px';
            img.style.height = '50px';
            img.style.marginRight = '10px';

            const text = document.createElement('span');
            text.textContent = planet.name;
            text.style.color = 'white';

            button.appendChild(img);
            button.appendChild(text);
            button.onclick = () => window.open(planet.url, '_blank');
            rightDiv.appendChild(button);
        });

        const animate = () => {
            requestAnimationFrame(animate);
            galaxy.rotation.y += 0.0005; // Animación de rotación
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            renderer.dispose();
            document.body.removeChild(renderer.domElement);
        };
    }, []);

    return <h1>Bienvenidos a la sección de Salud Social</h1>;
}
