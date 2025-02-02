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
            const radioInterior = 1.2;
            const numPuntas = 5;
            const anguloPaso = Math.PI / numPuntas;
            const suavizado = 0.2; // Controla qué tan redondeadas son las puntas 0.4

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
                metalness: 0, 
                roughness: 0 
            });

            return new THREE.Mesh(geometry, material);
        }

        // Función para crear una línea vertical
        function crearLineaVertical(altura) {
            const geometry = new THREE.CylinderGeometry(0.05, 0.05, altura, 32);
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    color: { value: new THREE.Color(0xffffff) },
                    opacityStart: { value: 1.0 },  // Opacidad en la base
                    opacityEnd: { value: 0.0 }     // Opacidad en el otro extremo
                },
                vertexShader: `
                    varying float vPositionY;
                    void main() {
                        vPositionY = position.y;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 color;
                    uniform float opacityStart;
                    uniform float opacityEnd;
                    varying float vPositionY;

                    void main() {
                        float opacity = mix(opacityStart, opacityEnd, (vPositionY + 5.0) / 10.0); 
                        gl_FragColor = vec4(color, opacity);
                    }
                `,
                transparent: true
            });
            
            
            const linea = new THREE.Mesh(geometry, material);
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
        function crearCruzRedonda(color, altura = 4, ancho = 2, grosor = 0.1) {
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
        
        // Definir posiciones y colores de las estrellas
        const estrellasConfig = [
            { x: -70, y: 10, z: -30, color: 0XFADC00, rotX: 0, rotY: Math.PI / 8, rotZ: Math.PI / 2 },
            { x: -55, y: 15, z: -30, color: 0xFADC00, rotX: 0, rotY: Math.PI / 10, rotZ: Math.PI / 2 },
            { x: -35, y: 20, z: -30, color: 0xFADC00, rotX: 0, rotY: Math.PI, rotZ: Math.PI / 2},
            { x: 35, y: 20, z: -30, color: 0xFADC00, rotX: 0, rotY: - Math.PI / 6, rotZ: Math.PI / 2},
            { x: 55, y: 15, z: -30, color: 0xFADC00, rotX: 0, rotY: 3 * Math.PI / 4, rotZ: Math.PI / 2 },
            { x: 70, y: 10, z: -30, color: 0xFADC00, rotX: 0, rotY: 3 * Math.PI / 3.5, rotZ: Math.PI / 2 },
            /*{ x: 55, y: -20, z: -30, color: 0xff8800 }, // Naranja
            { x: -45, y: -20, z: -30, color: 0xffff00 }, // Magenta
            { x: 30, y: -20, z: -30, color: 0xff0000 }, // Rojo
            { x: -25, y: -5, z: -30, color: 0xff8800 }, // Naranja
            { x: 5, y: 0, z: -30, color: 0xff0000 }, // Rojo
            { x: -5, y: -23, z: -30, color: 0x0000ff }, // Azul
            { x: -25, y: 28, z: -30, color: 0x0000ff }*/ // Azul
        ];
        
        // Definir posiciones y colores para círculos
        const circulosConfig = [
            { x: -60, y: 20, z: -20, color: 0x47FCED, radio: 0.3 },
            { x: -55, y: 0, z: -20, color: 0x47FCED, radio: 0.3 },
            { x: -40, y: 25, z: -20, color: 0x47FCED, radio: 0.3 },
            { x: -40, y: -18, z: -20, color: 0x47FCED, radio: 0.3 },
            { x: -20, y: -15, z: -20, color: 0x47FCED, radio: 0.3 },
            { x: -20, y: 15, z: -20, color: 0x47FCED, radio: 0.3 },
            { x: 0, y: -28, z: -20, color: 0x47FCED, radio: 0.3},
            { x: 10, y: 26, z: -20, color: 0x47FCED, radio: 0.3},
            { x: 18, y: 20, z: -20, color: 0x47FCED, radio: 0.3},
            { x: 30, y: -25, z: -20, color: 0x47FCED, radio: 0.3 },
            { x: 40, y: -10, z: -20, color: 0x47FCED, radio: 0.3 },
            { x: 40, y: 10, z: -20, color: 0x47FCED, radio: 0.3 },
            { x: 47, y: 25, z: -20, color: 0x47FCED, radio: 0.3 },
            { x: 60, y: 25, z: -20, color: 0x47FCED, radio: 0.3 },
            { x: 60, y: -25, z: -20, color: 0x47FCED, radio: 0.3 },
        ];

        const crucesConfig = [
            { x: -55, y: -25, z: -20, color: 0xFF5AAA, altura: 1.5, ancho: 1.5, grosor: 0.1 },
            { x: -40, y: -10, z: -20, color: 0x81E138, altura: 1.5, ancho: 1.5, grosor: 0.1 },
            { x: -30, y: 25, z: -20, color: 0x81E138, altura: 1.5, ancho: 1.5, grosor: 0.1 },
            { x: 20, y: -20, z: -20, color: 0x81E138, altura: 1.5, ancho: 1.5, grosor: 0.1 },
            { x: 28, y: 10, z: -20, color: 0x81E138, altura: 1.5, ancho: 1.5, grosor: 0.1 },
            { x: 35, y: 22, z: -20, color: 0xFF5AAA, altura: 1.5, ancho: 1.5, grosor: 0.1 },
            { x: 50, y: -25, z: -20, color: 0xFF5AAA, altura: 1.5, ancho: 1.5, grosor: 0.1 },
            { x: 60, y: 0, z: -20, color: 0xFF5AAA, altura: 1.5, ancho: 1.5, grosor: 0.1 },
        ];
        
        // Configuración de líneas con posición y rotación separadas
        const lineasConfig = [
            { x: -70, y: 28, z: -30, altura: 30},
            { x: -55, y: 32, z: -30, altura: 25},
            { x: -35, y: 32, z: -30, altura: 18},
            { x: 35, y: 32, z: -30, altura: 18},
            { x: 55, y: 32, z: -30, altura: 25},
            { x: 70, y: 28, z: -30, altura: 30},
        ];

        const estrellas = [];
        const circulos = [];
        const cruces = [];

        // Crear y posicionar estrellas con colores fijos
        estrellasConfig.forEach(config => {
            const estrella = crearEstrella(config.color);
            estrella.position.set(config.x, config.y, config.z);

            estrella.rotation.set(config.rotX, config.rotY, config.rotZ);
        
            scene.add(estrella);
            estrellas.push(estrella);
        });

        // Crear y agregar líneas a la escena
        lineasConfig.forEach((config) => {
            const linea = crearLineaVertical(config.altura);
            linea.position.set(config.x, config.y, config.z);
            scene.add(linea);
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

        // ------------------- Galaxia

        const galaxies = [];
        const galaxyMaterials = [];
        const galaxyTitles = [
            "Peligros de Salud Social [R]",
            "Peligros Digitales [M]",
            "Peligros de Salud Física [C]",
            "Peligros de Salud Mental [V]"
        ];
        const galaxyUrls = [
            "/ninos/salud_social",
            "/ninos/peligros_digitales",
            "/ninos/salud_fisica",
            "/ninos/salud_mental"
        ];
        const galaxyPositions = [
            new THREE.Vector3(-13, 1, 0),
            new THREE.Vector3(13, 1, 0),
            new THREE.Vector3(0, -7, 0),
            new THREE.Vector3(0, 10, 0),
        ];

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let isAnimating = false;

        // Crear contenedor de texto central
        const centralDiv = document.createElement('div');
        centralDiv.style.position = 'absolute';
        centralDiv.style.top = '50%';
        centralDiv.style.left = '50%';
        centralDiv.style.transform = 'translate(-50%, -50%)';
        centralDiv.style.color = 'white';
        centralDiv.style.fontSize = '24px';
        centralDiv.style.textAlign = 'center';
        centralDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        centralDiv.style.padding = '20px';
        centralDiv.style.borderRadius = '10px';
        centralDiv.style.display = 'flex';
        centralDiv.style.flexDirection = 'column';
        centralDiv.style.alignItems = 'center';
        centralDiv.style.width = '400px';
        document.body.appendChild(centralDiv);

        const centralText = document.createElement('p');
        centralText.textContent = "¿A dónde vamos a ir hoy? <> (Seleccione una de las siguientes galaxias)";
        centralDiv.appendChild(centralText);

        const confirmButton = document.createElement('button');
        confirmButton.textContent = "Confirmar";
        confirmButton.style.marginTop = '10px';
        confirmButton.style.padding = '12px 25px';
        confirmButton.style.backgroundColor = '#4CAF50'; // Un verde llamativo
        confirmButton.style.color = 'white';
        confirmButton.style.border = 'none';
        confirmButton.style.borderRadius = '8px'; // Bordes más redondeados
        confirmButton.style.cursor = 'pointer';
        confirmButton.style.fontSize = '16px';
        confirmButton.style.fontWeight = 'bold';
        confirmButton.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)'; // Sombra suave
        confirmButton.style.transition = 'all 0.3s ease'; // Transiciones suaves
        confirmButton.style.display = 'none';

        // Efecto hover
        confirmButton.addEventListener('mouseenter', () => {
            confirmButton.style.backgroundColor = '#45a049'; // Verde más oscuro
            confirmButton.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.2)'; // Sombra más pronunciada
            confirmButton.style.transform = 'scale(1.05)'; // Ligeramente más grande
        });

        confirmButton.addEventListener('mouseleave', () => {
            confirmButton.style.backgroundColor = '#4CAF50';
            confirmButton.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
            confirmButton.style.transform = 'scale(1)'; // Volver al tamaño original
        });

        centralDiv.appendChild(confirmButton);


        let selectedGalaxyIndex = -1;

        const createGalaxy = (position, baseColor, rotation = { x: 0, y: 0, z: 0 }) => {
            const particles = 10000;
            const spiralArms = 7;
            const radius = 5;
            const spread = 0.5;
            const positions = new Float32Array(particles * 3);
            const colors = new Float32Array(particles * 3);
            const color = new THREE.Color(baseColor);

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
            galaxy.position.copy(position);
            galaxy.rotation.set(rotation.x, rotation.y, rotation.z);

            scene.add(galaxy);
            galaxies.push(galaxy);
            galaxyMaterials.push(material);
        };

        galaxyPositions.forEach((pos, index) => {
            const colors = ['#ff0000', '#9d4edd', '#0cb7f2', '#00ff00'];
            const rotations = [
                { x: Math.PI / 5, y: 0, z: 0 },
                { x: Math.PI / 5, y: 0, z: 0 },
                { x: Math.PI / 17, y: 0, z: 0 },
                { x: Math.PI / 3, y: 0, z: 0 },
            ];
            createGalaxy(pos, colors[index], rotations[index]);
        });

        camera.position.set(0, 0, 18);

        const moveToGalaxy = (galaxy, title, url) => {
            if (isAnimating) return;
            isAnimating = true;

            const duration = 1.5;
            const distance = 9;
            const direction = new THREE.Vector3().subVectors(camera.position, galaxy.position).normalize();
            const targetPosition = new THREE.Vector3().copy(galaxy.position).add(direction.multiplyScalar(distance));
            const startPosition = new THREE.Vector3().copy(camera.position);
            let elapsed = 0;

            const animateMove = () => {
                elapsed += 0.01;
                const t = Math.min(elapsed / duration, 1);

                camera.position.lerpVectors(startPosition, targetPosition, t);
                camera.lookAt(galaxy.position);

                if (t < 1) {
                    requestAnimationFrame(animateMove);
                } else {
                    window.location.href = url;
                }
            };

            animateMove();
        };

        const onClick = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(galaxies);

            galaxyMaterials.forEach((material) => {
                material.size = 0.05;
                material.color.setHex(0xffffff);
            });

            if (intersects.length > 0) {
                const targetGalaxy = intersects[0].object;
                const galaxyIndex = galaxies.indexOf(targetGalaxy);

                if (galaxyIndex !== -1) {
                    selectedGalaxyIndex = galaxyIndex;

                    galaxyMaterials[galaxyIndex].size = 0.1;
                    galaxyMaterials[galaxyIndex].color.setHex(0xffffff);// 

                    centralText.textContent = `Iremos a ${galaxyTitles[galaxyIndex]}, ¿Correcto?`;
                    confirmButton.style.display = 'block';
                }
            }
        };

        confirmButton.addEventListener('click', () => {
            if (selectedGalaxyIndex !== -1) {
                moveToGalaxy(galaxies[selectedGalaxyIndex], galaxyTitles[selectedGalaxyIndex], galaxyUrls[selectedGalaxyIndex]);
            }
        });

        renderer.domElement.addEventListener('click', onClick);
        
        // -------------------
        camera.position.z = 20;

        
        // Crear el ciclo de animación
        const animate = () => {
            requestAnimationFrame(animate);
            galaxies.forEach((galaxy, index) => {
                const speed = 0.0002 + index * 0.0002;//velocidad del giro de animacion
                galaxy.rotation.y += speed;
            });
            renderer.render(scene, camera);
        };
    
        animate();
    
        // Establecer la posición de la cámara
        camera.position.z = 20;
    
        // Limpiar el renderer y la escena cuando el componente se desmonte
        return () => {
            renderer.dispose();
            scene.clear();
            document.body.removeChild(renderer.domElement);
            centralDiv.remove();
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

