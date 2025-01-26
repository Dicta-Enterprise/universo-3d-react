import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

export default function Jovenes() {
    const [selectedGalaxy, setSelectedGalaxy] = useState(null);

    const navigate = useNavigate();  // Usamos el useNavigate

    useEffect(() => {
        // Evitar el desplazamiento
        document.body.style.overflow = 'hidden';

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        scene.background = new THREE.Color(0x000000);

        const textureLoader = new THREE.TextureLoader();
        const galaxyTextures = [
            textureLoader.load('/assets/galaxiaJovenes/textura de la galaxia.jfif'),
            textureLoader.load('/assets/galaxiaJovenes/textura-galaxia2.jpg'),
            textureLoader.load('/assets/galaxiaJovenes/textura-galaxia3.jpg'),
            textureLoader.load('/assets/galaxiaJovenes/textura-galaxia4.jpg')
        ];

        function createStars(num_stars, z) {
            const starGeometry = new THREE.BufferGeometry();
            const starMaterial = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.5,
                sizeAttenuation: true,
                transparent: true,
                opacity: 1,
            });

            const starVertices = [];
            for (let i = 0; i < num_stars; i++) {
                const x = Math.random() * 2000 - 1000;
                const y = Math.random() * 2000 - 1000;
                //const z = Math.random() * 2000 - 1000;
                starVertices.push(x, y, z);
            }

            starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
            const stars = new THREE.Points(starGeometry, starMaterial);
            scene.add(stars);

            return { stars, starMaterial };
        }

        const starsData1 = createStars(5000, -400);
        const starsData2 = createStars(5000, -400);
        const starsData3 = createStars(5000, -90);
        const starsData4 = createStars(5000, -90);

        function createSpiralGalaxy(position, texture, rotation) {
            const galaxyGeometry = new THREE.BufferGeometry();
            const galaxyMaterial = new THREE.PointsMaterial({
                map: texture,
                size: 0.1,
                sizeAttenuation: true,
                transparent: true,
            });

            const positions = [];
            for (let i = 0; i < 10000; i++) {
                const armAngle = (i % 4) * ((2 * Math.PI) / 4);
                const distance = Math.random() * 10;
                const spinAngle = distance * 4;
                const x = Math.cos(armAngle + spinAngle) * distance;
                const y = Math.sin(armAngle + spinAngle) * distance;
                const z = Math.random() * 0.5 - 0.25;
                positions.push(x, y, z);
            }

            galaxyGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
            galaxy.position.set(position.x, position.y, position.z);
            galaxy.rotation.set(rotation.x, rotation.y, rotation.z);

            scene.add(galaxy);
            return galaxy;
        }

        createSpiralGalaxy({ x: 0, y: 10, z: -20 }, galaxyTextures[0], { x: Math.PI / 2, y: 0, z: 0 });
        createSpiralGalaxy({ x: 0, y: -10, z: -10 }, galaxyTextures[1], { x: Math.PI / 2, y: 0, z: 0 });
        createSpiralGalaxy({ x: -30, y: -4, z: -15 }, galaxyTextures[2], { x: Math.PI / 2, y: 0, z: 0 });
        createSpiralGalaxy({ x: 30, y: -4, z: -15 }, galaxyTextures[3], { x: Math.PI / 2, y: 0, z: 0 });

        // Creacion de la nebulosa
        const loader = new THREE.TextureLoader();
        const planos = []; // Array para almacenar los planos
        
        function crearPlano(x, y, z, textura, color, opacity = 1) {  // Agregamos un parámetro 'opacity' con valor por defecto 1 (totalmente opaco)
            loader.load(textura, (texture) => {
                texture.minFilter = THREE.LinearFilter;  // Para evitar problemas con el filtro de la textura
                texture.magFilter = THREE.LinearFilter;
                texture.encoding = THREE.sRGBEncoding;
        
                // Crear un material para el plano con el color y opacidad proporcionados
                const whiteMaterial = new THREE.MeshBasicMaterial({
                    color: color,  // Usar el color que se pasa como argumento
                    map: texture,
                    transparent: true,  // Hacer el material transparente
                    opacity: opacity,  // Establecer la opacidad (valor entre 0 y 1)
                });
        
                // Ajustar la escala del plano según la resolución de la imagen (proporción 200x150)
                const aspectRatio = 200 / 150;  // Relación de aspecto de la imagen (200x150)
                const planeWidth = 1;  // El ancho del plano es 1 unidad
                const planeHeight = planeWidth / aspectRatio;  // Mantener la proporción de la imagen
        
                // Crear la geometría del plano
                const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
                const plane = new THREE.Mesh(planeGeometry, whiteMaterial);
        
                // Ajustar las dimensiones del plano
                plane.scale.set(500, 500, 500);  // Tamaño del plano
                plane.position.set(x, y, z); // Posición inicial del plano
        
                // Agregar el plano a la escena
                scene.add(plane);
        
                // Guardar el plano en el array
                planos.push(plane);
            });
        }

        // Crear varios planos en diferentes posiciones
        crearPlano(-580, 280, -410,'/assets/galaxiaJovenes/prueba2.webp'); // Primer plano
        crearPlano(580, 280, -410, '/assets/galaxiaJovenes/prueba.jpeg');   // Segundo plano
        crearPlano(580, -280, -410, '/assets/galaxiaJovenes/prueba2.webp');  // Tercer plano
        crearPlano(-580, -280, -410, '/assets/galaxiaJovenes/prueba.jpeg');  // Tercer plano

        camera.position.z = 20;

        let time = 0;

        // Variables para la animación
        let time2 = 1;
        let movingLeft = false;
        let oscillationTime = 40; // Tiempo de oscilación en segundos
        let directionChangeTime = 0; // Tiempo transcurrido en cada dirección

        function animate() {
            requestAnimationFrame(animate);

            // Aumentamos el tiempo general
            time2 += 0.05;

            if (directionChangeTime < oscillationTime) {
                // Mientras no hayan pasado los 3 segundos de oscilación
                if (!movingLeft) {
                    planos.forEach((plane) => {
                        plane.position.z -= 0.1;
                    });
                } else {
                    planos.forEach((plane) => {
                        plane.position.z += 0.1;
                    });
                }
                directionChangeTime += 0.1; // Aumentamos el tiempo transcurrido
            } else {
                // Cuando haya pasado el tiempo de oscilación, cambiamos la dirección
                movingLeft = !movingLeft; // Alternamos la dirección
                directionChangeTime = 0; // Reiniciamos el contador de tiempo
            }

            // Alternar opacidad de los dos grupos de estrellas
            if (time % 2 < 1) {
                starsData1.starMaterial.opacity = Math.max(0, starsData1.starMaterial.opacity - 0.01); // Fade out
                starsData2.starMaterial.opacity = Math.min(1, starsData2.starMaterial.opacity + 0.01); // Fade in
            } else {
                starsData1.starMaterial.opacity = Math.min(1, starsData1.starMaterial.opacity + 0.01); // Fade in
                starsData2.starMaterial.opacity = Math.max(0, starsData2.starMaterial.opacity - 0.01); // Fade out
            }

            if (time % 2 < 1) {
                starsData4.starMaterial.opacity = Math.max(0, starsData4.starMaterial.opacity - 0.01); // Fade out
                starsData3.starMaterial.opacity = Math.min(1, starsData3.starMaterial.opacity + 0.01); // Fade in
            } else {
                starsData4.starMaterial.opacity = Math.min(1, starsData4.starMaterial.opacity + 0.01); // Fade in
                starsData3.starMaterial.opacity = Math.max(0, starsData3.starMaterial.opacity - 0.01); // Fade out
            }


            // Rotar las galaxias
            scene.children.forEach((object) => {
                if (object.type === 'Points') {
                    object.rotation.z += 0.00001;
                }
            });

            time += 0.01;

            renderer.render(scene, camera);
        }

        animate();

        // Limpiar el renderer y la escena cuando el componente se desmonta o cambia de ruta
        return () => {
            renderer.dispose();
            scene.clear();
        };
    }, []);

    const handleGalaxyClick = (index) => {
        switch (index) {
            case 0:
                navigate('/peligrosocialjovenes');
                break;
            case 1:
                navigate('/Peligro_Digitales_Jovenes');
                break;
            case 2:
                navigate('/Peligro_Fisica_Jovenes');
                break;
            case 3:
                navigate('/Peligro_Mental_Jovenes');
                break;
            default:
                break;
        }
    };

    return (
        <div>
            <h1 style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                zIndex: 10,
                fontSize: '24px',
            }}>
                Bienvenidos a la sección de Jovenes
            </h1>

            <div style={{
                position: 'absolute',
                top: '0',
                left: '20%',
                bottom: '-32%',
                transform: 'translateX(-50%)',
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <button onClick={() => handleGalaxyClick(0)} style={{ padding: '10px', backgroundColor: '#000', color: 'white', borderRadius: '5px', margin: '10px' }}>
                    Galaxia 1
                </button>
            </div>

            <div style={{
                position: 'absolute',
                top: '0',
                left: '80%',
                bottom: '-32%',
                transform: 'translateX(-50%)',
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <button onClick={() => handleGalaxyClick(1)} style={{ padding: '10px', backgroundColor: '#000', color: 'white', borderRadius: '5px', margin: '10px' }}>
                    Galaxia 2
                </button>
            </div>

            <div style={{
                position: 'absolute',
                top: '0',
                left: '50%',
                bottom: '-80%',
                transform: 'translateX(-50%)',
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <button onClick={() => handleGalaxyClick(2)} style={{ padding: '10px', backgroundColor: '#000', color: 'white', borderRadius: '5px', margin: '10px' }}>
                    Galaxia 3
                </button>
            </div>

            <div style={{
                position: 'absolute',
                top: '0',
                left: '50%',
                bottom: '15%',
                transform: 'translateX(-50%)',
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <button onClick={() => handleGalaxyClick(3)} style={{ padding: '10px', backgroundColor: '#000', color: 'white', borderRadius: '5px', margin: '10px' }}>
                    Galaxia 4
                </button>
            </div>
        </div>
    );
}
