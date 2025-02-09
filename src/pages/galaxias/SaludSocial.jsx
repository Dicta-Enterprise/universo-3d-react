import { useEffect, useState } from 'react';
import * as THREE from 'three';

export default function EsferaTexturizada() {
    const [currentTextureIndex, setCurrentTextureIndex] = useState(0);
    const [isZooming, setIsZooming] = useState(false);  // Estado para controlar la animación de acercamiento

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

        const resizeHandler = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', resizeHandler);

        // Contenedor principal
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
        title.textContent = 'Bienvenidos a la sección de Salud Social';
        title.style.fontSize = '40px';
        title.style.textAlign = 'center';
        title.style.pointerEvents = 'auto';
        title.style.position = 'absolute';
        title.style.left = '50%';
        title.style.top = '5%';
        title.style.transform = 'translate(-50%, 0%)';
        mainDiv.appendChild(title);

        // Contenedor de texto
        const textContainer = document.createElement('div');
        textContainer.style.fontSize = '20px';
        textContainer.style.backgroundColor = 'rgba(252, 107, 102, 0.32)';
        textContainer.style.padding = '24px';
        textContainer.style.margin = '32px';
        textContainer.style.borderRadius = '10px';
        textContainer.style.pointerEvents = 'auto';
        textContainer.innerHTML = texts[currentTextureIndex].replace(/\n/g, '<br />');
        mainDiv.appendChild(textContainer);

        // Contenedor de la pasarela de planetas
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
            planetThumbnail.style.width = '48px';
            planetThumbnail.style.height = '48px';
            planetThumbnail.style.borderRadius = '50%';
            planetThumbnail.style.backgroundImage = `url(${texture})`;
            planetThumbnail.style.backgroundSize = 'cover';
            planetThumbnail.style.cursor = 'pointer';
            planetThumbnail.style.border = index === currentTextureIndex ? '2px solid #ff0000' : '2px solid transparent';
            planetThumbnail.style.transition = 'border 0.3s ease';

            planetThumbnail.addEventListener('click', () => {
                setCurrentTextureIndex(index);
                textContainer.innerHTML = texts[index].replace(/\n/g, '<br />');
                sphere.material.map = new THREE.TextureLoader().load(textures[index]);
                sphere.material.needsUpdate = true;

                // Actualizar el borde de la miniatura seleccionada
                planetCarousel.childNodes.forEach((thumbnail, i) => {
                    thumbnail.style.border = i === index ? '2px solid #ff0000' : '2px solid transparent';
                });
            });

            planetCarousel.appendChild(planetThumbnail);
        });

        // Contenedor de los botones
        const controlsDiv = document.createElement('div');
        controlsDiv.style.display = 'flex';
        controlsDiv.style.gap = '32px';
        controlsDiv.style.pointerEvents = 'auto';
        controlsDiv.style.position = 'absolute';
        controlsDiv.style.bottom = '100px'; // Posición ajustada para no solaparse con la pasarela
        controlsDiv.style.left = '50%';
        controlsDiv.style.transform = 'translateX(-50%)';
        mainDiv.appendChild(controlsDiv);

        const createButton = (text, onClick, color = '#ff0000') => {
            const button = document.createElement('button');
            button.innerHTML = text;
            button.style.fontSize = '24px';
            button.style.background = 'none'; // Fondo transparente
            button.style.border = `2px solid ${color}`; // Borde con color personalizado
            button.style.color = color; // Color del texto
            button.style.cursor = 'pointer';
            button.style.padding = '12px 20px';
            button.style.borderRadius = '20px';
            button.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`; // Sombra más suave
            button.style.transition = 'all 0.3s ease';
            button.style.textShadow = `0 0 3px ${color}`; // Brillo en el texto más tenue

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

            // Efecto al hacer clic
            button.addEventListener('click', () => {
                button.style.boxShadow = `0 0 3px ${color}, 0 0 5px ${color}`;
                setTimeout(() => {
                    button.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
                }, 200);
                onClick();
            });

            return button;
        };

        const changeTexture = (direction) => {
            setCurrentTextureIndex((prevIndex) => {
                let nextIndex = prevIndex;
                if (direction === 'next') {
                    nextIndex = (prevIndex + 1) % textures.length;
                } else if (direction === 'prev') {
                    nextIndex = (prevIndex - 1 + textures.length) % textures.length;
                }

                // Cargar nueva textura antes de actualizar el estado
                const newTexture = new THREE.TextureLoader().load(textures[nextIndex]);
                sphere.material.map = newTexture;
                sphere.material.needsUpdate = true;

                // Actualizar el texto del contenedor
                textContainer.innerHTML = texts[nextIndex].replace(/\n/g, '<br />');

                // Actualizar el borde de la miniatura seleccionada
                planetCarousel.childNodes.forEach((thumbnail, index) => {
                    thumbnail.style.border = index === nextIndex ? '2px solid #ff0000' : '2px solid transparent';
                });

                return nextIndex; // Retorna el nuevo índice para actualizar el estado correctamente
            });
        };

        const backButton = createButton('← Back', () => {
            window.history.back();
        });

        backButton.style.position = 'absolute';
        backButton.style.left = '20px';
        backButton.style.top = '20px';
        backButton.style.zIndex = '1000'; // para que el botón esté por encima de todo

        document.body.appendChild(backButton);

        controlsDiv.appendChild(createButton('⟵', () => changeTexture('prev')));
        controlsDiv.appendChild(createButton('Ver más', () => {
            // Inicia la animación de acercamiento
            setIsZooming(true);

            // Llamar a la función de animación de acercamiento
            setTimeout(() => {
                setIsZooming(false);  // Detener la animación después de 1 segundo
                window.location.href = planetUrls[currentTextureIndex];  // Redirige a la URL en la misma ventana
            }, 1000);  // Espera 1 segundo antes de redirigir
        }));
        controlsDiv.appendChild(createButton('⟶', () => changeTexture('next')));

        // Función para manejar la animación de acercamiento de la cámara
        const zoomIn = () => {
            if (isZooming && camera.position.z > 7) {
                camera.position.z -= 0.07;  // Ajusta la velocidad de acercamiento
            }
        };

        const animate = () => {
            requestAnimationFrame(animate);
            zoomIn();  // Llama a la función de acercamiento en cada frame
            sphere.rotation.y += 0.0005;
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            window.removeEventListener('resize', resizeHandler);
            renderer.dispose();
            document.body.removeChild(renderer.domElement);
            document.body.removeChild(mainDiv);
        };
    }, [currentTextureIndex, textures, texts, planetUrls, isZooming]);

    return null;
}