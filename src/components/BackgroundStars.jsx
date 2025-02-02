import { useEffect } from 'react';
import * as THREE from 'three';

const Stars = ({ title }) => {
    useEffect(() => {
        // Evitar el desplazamiento
        document.body.style.overflow = 'hidden';
    
        // Crear la escena y la cámara
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
    
        // Establecer el fondo de la escena
        scene.background = new THREE.Color(0x000000);

        // -------------------------

        // Agregar 2 luz ambiental y una luz puntual
        const ambientLight = new THREE.AmbientLight(0x404040, 2); // Luz suave
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(50, 0, 30);
        scene.add(pointLight);

        const pointLight2 = new THREE.PointLight(0xffffff, 1, 100);
        pointLight2.position.set(-50, 0, 30);
        scene.add(pointLight2);

        // Crear una estrella de 5 puntas
        function crearEstrella(color) {
            const shape = new THREE.Shape();
            const radioExterior = 2;
            const radioInterior = 1.1;
            const numPuntas = 5;
            const anguloPaso = Math.PI / numPuntas;
            const suavizado = 0.3; // Controla qué tan redondeadas son las puntas 0.4

            for (let i = 0; i <= numPuntas * 2; i++) {
                const angulo = i * anguloPaso;
                const radio = i % 2 === 0 ? radioExterior : radioInterior;
                const x = radio * Math.cos(angulo);
                const y = radio * Math.sin(angulo);

                if (i === 0) {
                    shape.moveTo(x, y);
                } else {
                    // Calculamos el punto de control para suavizar la curva
                    const anguloPrevio = (i - 1) * anguloPaso;
                    const radioPrevio = (i - 1) % 2 === 0 ? radioExterior : radioInterior;
                    const xPrev = radioPrevio * Math.cos(anguloPrevio);
                    const yPrev = radioPrevio * Math.sin(anguloPrevio);

                    const anguloCentro = (anguloPrevio + angulo) / 2;
                    const radioCentro = (radio + radioPrevio) / 2 + suavizado;
                    const xCentro = radioCentro * Math.cos(anguloCentro);
                    const yCentro = radioCentro * Math.sin(anguloCentro);

                    shape.quadraticCurveTo(xCentro, yCentro, x, y);
                }
            }
            shape.closePath();

            const geometry = new THREE.ExtrudeGeometry(shape, {
                depth: 0.5,
                bevelEnabled: true,
                bevelSize: 0.2,
                bevelThickness: 0.3,
            });

            const material = new THREE.MeshStandardMaterial({ 
                color: color, 
                metalness: 0.2, 
                roughness: 0.3 
            });

            return new THREE.Mesh(geometry, material);
        }

        // Función para crear una línea vertical
        function crearLineaVertical() {
            const geometry = new THREE.CylinderGeometry(0.08, 0.08, 10, 32);
            const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
            const linea = new THREE.Mesh(geometry, material);
            linea.rotation.x = Math.PI;
            return linea;
        }

         // Función para crear un círculo
         function crearCirculo(color, radio = 1) {
            const geometry = new THREE.CircleGeometry(radio, 32);
            const material = new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide });
            const circulo = new THREE.Mesh(geometry, material);
            return circulo;
        }

        // Función para crear una cruz redonda
        function crearCruzRedonda(color, altura = 4, ancho = 2, grosor = 0.2) {
            // Crear el brazo vertical
            const brazoVertical = new THREE.Mesh(
                new THREE.CylinderGeometry(grosor, grosor, altura, 32),
                new THREE.MeshStandardMaterial({ color: color })
            );

            // Crear el brazo horizontal
            const brazoHorizontal = new THREE.Mesh(
                new THREE.CylinderGeometry(grosor, grosor, ancho, 32),
                new THREE.MeshStandardMaterial({ color: color })
            );
            brazoHorizontal.rotation.z = Math.PI / 2; // Rotar 90 grados

            // Crear una esfera en la intersección
            const esfera = new THREE.Mesh(
                new THREE.SphereGeometry(grosor * 1.5, 32, 32),
                new THREE.MeshStandardMaterial({ color: color })
            );

            // Agrupar los elementos de la cruz
            const cruz = new THREE.Group();
            cruz.add(brazoVertical);
            cruz.add(brazoHorizontal);
            cruz.add(esfera);

            return cruz;
        }
        
        // Definir posiciones y colores
        const estrellasConfig = [
            { x: -50, y: 10, z: -30, color: 0xff0000 }, // Rojo
            { x: 50, y: 15, z: -30, color: 0xffff00 }, // Amarillo
            { x: 5, y: 20, z: -30, color: 0x0000ff }, // Azul
            { x: 70, y: 0, z: -30, color: 0xff00ff }, // Amarillo
            { x: 20, y: -5, z: -30, color: 0xff00ff }, // Magenta
            { x: -66, y: 25, z: -30, color: 0xff8800 }, // Naranja
            { x: 55, y: -20, z: -30, color: 0xff8800 }, // Naranja
            { x: -45, y: -20, z: -30, color: 0xffff00 }, // Magenta
            { x: 30, y: -20, z: -30, color: 0xff0000 }, // Rojo
            { x: -25, y: -5, z: -30, color: 0xff8800 }, // Naranja
            { x: 5, y: 0, z: -30, color: 0xff0000 }, // Rojo
            { x: -5, y: -23, z: -30, color: 0x0000ff }, // Azul
            { x: -25, y: 28, z: -30, color: 0x0000ff } // Azul
        ];
        
        // Definir posiciones y colores para círculos
        const circulosConfig = [
            { x: -30, y: 0, z: -20, color: 0xff0000, radio: 0.5 }, // Rojo
            { x: 30, y: 10, z: -20, color: 0x00ff00, radio: 1 }, // Verde
            { x: 0, y: -15, z: -20, color: 0x0000ff, radio: 0.5 }, // Azul
            { x: -55, y: -10, z: -20, color: 0xffff00, radio: 1 }, // Amarillo
            { x: 60, y: 20, z: -20, color: 0xff00ff, radio: 1 }, // Magenta
            { x: 40, y: 25, z: -20, color: 0xff00ff, radio: 0.5 }, // Magenta
            { x: -40, y: 25, z: -20, color: 0xffff00, radio: 1 }, // Amarillo
        ];

        const crucesConfig = [
            { x: -10, y: 0, z: -20, color: 0xff0000, altura: 3, ancho: 2, grosor: 0.2 }, // Rojo
            { x: 10, y: 10, z: -20, color: 0x00ff00, altura: 3, ancho: 2, grosor: 0.2 }, // Verde
            { x: 0, y: -10, z: -20, color: 0x0000ff, altura: 3, ancho: 2, grosor: 0.2 }, // Azul
            { x: -20, y: 10, z: -20, color: 0xffff00, altura: 3, ancho: 2, grosor: 0.2 }, // Amarillo
            { x: 20, y: -20, z: -20, color: 0xff00ff, altura: 3, ancho: 2, grosor: 0.2 }, // Magenta
            { x: 35, y: 0, z: -20, color: 0xff00ff, altura: 3, ancho: 2, grosor: 0.2 }, // Magenta
            { x: -50, y: -0, z: -20, color: 0x0000ff, altura: 3, ancho: 2, grosor: 0.2 }, // Azul
        ];

        const estrellas = [];
        const circulos = [];
        const cruces = [];

        // Crear y posicionar estrellas con colores fijos
        estrellasConfig.forEach(config => {
            const estrella = crearEstrella(config.color);
            estrella.position.set(config.x, config.y, config.z);

            const linea = crearLineaVertical();
            linea.position.set(config.x, config.y + 4, config.z);
            estrella.lookAt(camera.position);
        
            scene.add(estrella);
            scene.add(linea);

            estrellas.push(estrella);
        });

        // Crear y posicionar círculos con colores fijos
        circulosConfig.forEach(config => {
            const circulo = crearCirculo(config.color, config.radio);
            circulo.position.set(config.x, config.y, config.z);
            scene.add(circulo);
            circulos.push(circulo);
        });

        // Crear y posicionar cruces redondas con colores fijos
        crucesConfig.forEach(config => {
            const cruz = crearCruzRedonda(config.color, config.altura, config.ancho, config.grosor);
            cruz.position.set(config.x, config.y, config.z);
            scene.add(cruz);
            cruces.push(cruz);
        });

        camera.position.z = 20;

        // Crear el ciclo de animación
        const animate = () => {
            requestAnimationFrame(animate);

            renderer.render(scene, camera);
        };
    
        animate();
    
        // Establecer la posición de la cámara
        camera.position.z = 20;
    
        // Limpiar el renderer y la escena cuando el componente se desmonte
        return () => {
            renderer.dispose();
            scene.clear();
        };
    }, []);

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
            {title}
        </h1>
    </div>
    );
};

export default Stars;

