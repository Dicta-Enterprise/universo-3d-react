import { useEffect } from 'react';
import * as THREE from 'three';
import CrearEstrellas3D from '../components/FondoJovenes/CrearEstrellas3D';
import crearLineaVertical from '../components/FondoJovenes/CrearLineaVerticalEstrella';
import crearCirculo from '../components/FondoJovenes/CrearCirculo';
import CreaCruzRedonda from '../components/FondoJovenes/CrearCruzRedonda';
import CrearTermometro from '../components/FondoJovenes/CrearTermometro';
import CrearNube from '../components/FondoJovenes/CrearNube';
import CrearLuna from '../components/FondoJovenes/CrearLuna';
import {nubeconfig, estrellasConfig, circulosConfig, crucesConfig, lineasConfig, TermometroConfig} from '../components/FondoJovenes/ArregloObjetos';

export default function Galaxias() {
    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);

        /*const spaceTexture = new THREE.TextureLoader().load('/assets/2k_stars.jpg');
        scene.background = spaceTexture;*/

        // Establecer el fondo de la escena
        //scene.background = new THREE.Color(0x000000);
        scene.background = new THREE.Color(0x001833);
        //scene.background = new THREE.Color(0x000c19);

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

        const pointLight3 = new THREE.PointLight(0xffffff, 1, 100);
        pointLight2.position.set(-60, -30, 30);
        scene.add(pointLight3);

        // Uso en la escena
        const lunaCreciente = CrearLuna(0.3);
        scene.add(lunaCreciente);
        lunaCreciente.position.set(-13,17,-10);

        const lunaCreciente2 = CrearLuna(0.05);
        scene.add(lunaCreciente2);
        lunaCreciente2.position.set(10,0,-10);
        lunaCreciente2.scale.set(1.5,1.5,1.5);
        
        const lunaCreciente3 = CrearLuna(0.4);
        scene.add(lunaCreciente3);
        lunaCreciente3.position.set(-20,-10,-10);
        lunaCreciente3.scale.set(0.8,0.8,0.8);

        const estrellas = [];
        const cruces = [];
        const termometros = [];
        const circulos = [];
        const nubes = [];
        const lineas = [];

        nubeconfig.forEach(config => {
            const nube = CrearNube();
            nube.position.set(config.x, config.y, config.z);
            nube.scale.set(config.escalado, config.escalado, config.escalado);
            scene.add(nube);
            nubes.push(nube);
        });

        // Crear y posicionar estrellas con colores fijos
        TermometroConfig.forEach(config => {
            const termometro = CrearTermometro();
            termometro.position.set(config.x, config.y, config.z);
            termometro.rotation.set(config.rotationx, config.rotationy, config.rotationz);
            termometro.scale.set(0.5,0.5,0.5);
        
            scene.add(termometro);
            termometros.push(termometro);

            // Animación de oscilación
            termometro.userData = { angle: Math.random() * Math.PI * 2 }; // Guardamos un ángulo inicial aleatorio

            const swingSpeed = 0.005; // Velocidad de oscilación

            termometro.animation = () => {
                termometro.userData.angle += swingSpeed; // Aumentamos el ángulo en cada frame
                termometro.rotation.z = Math.sin(termometro.userData.angle) * 0.2; // Aplicamos el movimiento de oscilación
            };
        });
        
        // Crear y posicionar estrellas con colores fijos
        estrellasConfig.forEach(config => {
            const estrella = CrearEstrellas3D(config.color)
            estrella.position.set(config.x, config.y, config.z);

            estrella.rotation.set(config.rotationX, config.rotationY, config.rotationZ);
            estrella.scale.set(config.escalado,config.escalado,config.escalado);

            scene.add(estrella);
            estrellas.push(estrella);
        });

        // Crear y agregar líneas a la escena
        lineasConfig.forEach((config) => {
            const linea = crearLineaVertical(config.altura);
            linea.position.set(config.x, config.y, config.z);
            scene.add(linea);
            lineas.push(linea);
            
        });

        // Crear y posicionar círculos con colores fijos
        circulosConfig.forEach(config => {
            const circulo = crearCirculo(config.color,config.radio);
            circulo.position.set(config.x, config.y, config.z);
            scene.add(circulo);
            circulos.push(circulo);
        });

        // Crear y posicionar cruces redondas con colores fijos
        crucesConfig.forEach(config => {
            const cruz = CreaCruzRedonda(config.color, config.altura, config.ancho, config.grosor);
            cruz.position.set(config.x, config.y, config.z);
            cruz.rotation.set(config.rotx, config.roty, config.rotz);
            scene.add(cruz);
            cruces.push(cruz);
        });

        // ------------------- Galaxia

        /*const galaxies = [];
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
        });*/

        camera.position.set(0, 0, 18);

        /*const moveToGalaxy = (galaxy, title, url) => {
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

        renderer.domElement.addEventListener('click', onClick);*/

        let velocidadMovimiento = 0.00003; // Velocidad de la oscilación
        let rangoOscilacion = 25; // El rango máximo de oscilación en el eje X
        
        // Función para actualizar la velocidad y el rango de oscilación en función del tamaño de la pantalla
        const actualizarParametrosAnimacion = () => {
            const isMobile = window.innerWidth < 768;

            // Ajustar la velocidad y el rango de oscilación para pantallas pequeñas (móviles)
            if (isMobile) {
                velocidadMovimiento = 0.00005;  // Menor velocidad en móviles
                rangoOscilacion = 5;            // Menor rango en móviles
            } else {
                velocidadMovimiento = 0.00005;  // Velocidad normal en pantallas grandes
                rangoOscilacion = 25;            // Rango normal en pantallas grandes
            }
        };

        // Creamos las nubes con direcciones iniciales
        nubes.forEach((nube, index) => {
            // Asignamos la dirección de inicio a cada nube
            nube.direccion = (index % 2 === 0) ? -1 : 1;  // Primera nube izquierda (-1), segunda nube derecha (+1)
        });

        function moverNubes() {
            nubes.forEach(nube => {
                // Usamos Math.sin para crear un movimiento oscilante
                let posicionX = rangoOscilacion * Math.sin(velocidadMovimiento * performance.now());
        
                // Modificamos la dirección de la nube según la asignada
                nube.position.x = posicionX * nube.direccion;
            });
        }

        // Función para manejar el redimensionamiento de la ventana
        const onWindowResizeNube = () => {
            // Determina si es una pantalla pequeña (móvil)
            const isMobile = window.innerWidth < 768;
            
            // Ajustar escala de las nubes según el tamaño de la pantalla
            nubeconfig.forEach((config, index) => {
                const nube = nubes[index];
                
                // Si es móvil, reducimos la escala de la primera y segunda nube
                if (isMobile) {
                    if (index === 0) {
                        nube.scale.set(0.4, 0.4, 0.4); // Primera nube más pequeña
                    } else {
                        nube.scale.set(0.2, 0.2, 0.2); // Segunda nube más pequeña
                    }
                } else {
                    // Si es una pantalla grande, mantenemos el escalado original
                    nube.scale.set(config.escalado, config.escalado, config.escalado);
                }
            });

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        const onWindowResizeEstrella = () => {
            // Determina si es una pantalla pequeña (móvil)
            const isMobile = window.innerWidth < 768;
            
            // Ajustar escala de las nubes según el tamaño de la pantalla
            estrellasConfig.forEach((config, index) => {
                const estrella = estrellas[index];
                
                // Si es móvil, reducimos la escala de la primera y segunda nube
                if (isMobile) {
                    if (index <= 19) {
                        estrella.position.set(config.responsiveposicionx, config.responsiveposiciony, config.z);
                        estrella.scale.set(config.escalado/1.7,config.escalado/1.7,config.escalado/1.7);
                    }
                } else {
                    // Si es una pantalla grande, mantenemos el escalado original
                    estrella.position.set(config.x, config.y, config.z);
                    estrella.scale.set(config.escalado,config.escalado,config.escalado);
                }
            });
        };

        const onWindowResizeLineas = () => {
            // Determina si es una pantalla pequeña (móvil)
            const isMobile = window.innerWidth < 768;
            
            // Ajustar escala de las nubes según el tamaño de la pantalla
            lineasConfig.forEach((config, index) => {
                const linea = lineas[index];
                
                // Si es móvil, reducimos la escala de la primera y segunda nube
                if (isMobile) {
                    if (index <= 19) {
                        linea.position.set(config.responsiveposicionx, config.responsiveposiciony, config.z);
                    }
                } else {
                    // Si es una pantalla grande, mantenemos el escalado original
                    linea.position.set(config.x, config.y, config.z);
                }
            });
        };

        const onWindowResizeTermometro = () => {
            // Determina si es una pantalla pequeña (móvil)
            const isMobile = window.innerWidth < 768;
            
            // Ajustar escala de las nubes según el tamaño de la pantalla
            TermometroConfig.forEach((config, index) => {
                const termometro = termometros[index];
                
                // Si es móvil, reducimos la escala de la primera y segunda nube
                if (isMobile) {
                    if (index <= 19) {
                        termometro.position.set(config.responsiveposicionx, config.responsiveposiciony, config.z);
                    }
                } else {
                    // Si es una pantalla grande, mantenemos el escalado original
                    termometro.position.set(config.x, config.y, config.z);
                }
            });
        };

        const onWindowResizeCruces = () => {
            // Determina si es una pantalla pequeña (móvil)
            const isMobile = window.innerWidth < 768;
            
            // Ajustar escala de las nubes según el tamaño de la pantalla
            crucesConfig.forEach((config, index) => {
                const cruz = cruces[index];
                
                // Si es móvil, reducimos la escala de la primera y segunda nube
                if (isMobile) {
                    if (index <= 19) {
                        cruz.position.set(config.responsiveposicionx, config.responsiveposiciony, config.z);
                        cruz.scale.set(0.7,0.7,0.7);
                    }
                } else {
                    // Si es una pantalla grande, mantenemos el escalado original
                    cruz.position.set(config.x, config.y, config.z);
                    cruz.scale.set(1,1,1);
                }
            });
        };

        const onWindowResizeLuna = () => {
            const isMobile = window.innerWidth < 768;
            
            lunaCreciente.position.set(isMobile ? -10 : -13, isMobile ? 15 : 17, -10);
            lunaCreciente.scale.set(isMobile ? 0.7 : 1, isMobile ? 0.7 : 1, isMobile ? 0.7 : 1);
            lunaCreciente2.position.set(isMobile ? 6 : 10, isMobile ? 0 : 0, -10);
            lunaCreciente2.scale.set(isMobile ? 1.2 : 1.5, isMobile ? 1.2 : 1.5, isMobile ? 1.2 : 1.5);
            lunaCreciente3.position.set(isMobile ? -10 : -20, isMobile ? -6 : -10, -10);
            lunaCreciente3.scale.set(isMobile ? 0.6 : 0.8, isMobile ? 0.6 : 0.8, isMobile ? 0.6 : 0.8);
        };

        const onWindowResizeCirculos = () => {
            // Determina si es una pantalla pequeña (móvil)
            const isMobile = window.innerWidth < 768;
            
            // Ajustar escala de las nubes según el tamaño de la pantalla
            circulosConfig.forEach((config, index) => {
                const circulo = circulos[index];
                
                // Si es móvil, reducimos la escala de la primera y segunda nube
                if (isMobile) {
                    if (index <= circulos.length - 1) {
                        circulo.position.set(config.responsiveposicionx, config.responsiveposiciony, config.z);
                        circulo.scale.set(0.5,0.5,0.5);
                    }
                } else {
                    // Si es una pantalla grande, mantenemos el escalado original
                    circulo.position.set(config.x, config.y, config.z);
                    circulo.scale.set(1,1,1);
                }
            });
        };

        // Escuchar el evento de redimensionamiento de la ventana
        window.addEventListener('resize', onWindowResizeNube);
        window.addEventListener('resize', actualizarParametrosAnimacion);
        window.addEventListener('resize', onWindowResizeEstrella);
        window.addEventListener('resize', onWindowResizeLineas);
        window.addEventListener('resize', onWindowResizeTermometro);
        window.addEventListener('resize', onWindowResizeCruces);
        window.addEventListener('resize', onWindowResizeLuna);
        window.addEventListener('resize', onWindowResizeCirculos);
        
        onWindowResizeNube();
        actualizarParametrosAnimacion();
        onWindowResizeEstrella();
        onWindowResizeLineas();
        onWindowResizeTermometro();
        onWindowResizeCruces();
        onWindowResizeLuna();
        onWindowResizeCirculos();

        let time = 0;
        let scaleDirection = 1; // 1 para agrandar, -1 para achicar
        let scaleSpeed = 0.002; // Velocidad de cambio de escala
        let minScale = 0.3; // Límite de escala mínimo

        const animate = () => {
            requestAnimationFrame(animate);
            
            let scaleLimit = window.innerWidth < 768 ? 0.7 : 1.5; // Límite de escala máximo
            
            time += 0.02;
            console.log(time);

            /*galaxies.forEach((galaxy, index) => {
                const speed = 0.0002 + index * 0.0002;//velocidad del giro de animacion
                galaxy.rotation.y += speed;
            });*/
            
            cruces.forEach(cruz => {
                cruz.rotation.z += 0.005;  // Rotación en el eje X
            });

            const tiempoBase = Date.now() * 0.001;

            estrellas.forEach((estrella, index) => {
                const velocidad = 1; // Ajusta la velocidad del rebote
                const amplitud = 0.03; // Ajusta la altura del rebote
                const tiempo = tiempoBase + index * 0.3; // Desfase entre estrellas
                

                estrella.position.y += Math.cos(tiempo * velocidad) * amplitud * 0.5 ;
                estrella.rotation.z += 0.005; // Rotación continua
            });

            circulos.forEach((circulo, index) => {
                const velocidad = 0.5; // Ajusta la velocidad del rebote
                const amplitud = 0.01; // Ajusta la altura del rebote
                const tiempo = tiempoBase + index * 0.3; // Desfase entre círculos
            
            
                circulo.position.y += Math.cos(tiempo * velocidad) * amplitud;
            
                // Efecto de escala pulsante
                if (scaleDirection === 1) {
                    circulo.scale.set(
                        circulo.scale.x + scaleSpeed,
                        circulo.scale.y + scaleSpeed,
                        circulo.scale.z + scaleSpeed
                    );
                } else {
                    circulo.scale.set(
                        circulo.scale.x - scaleSpeed,
                        circulo.scale.y - scaleSpeed,
                        circulo.scale.z - scaleSpeed
                    );
                }
            
                if (circulo.scale.x >= scaleLimit || circulo.scale.x <= minScale) {
                    scaleDirection *= -1;
                }
            });

            termometros.forEach(termometro => {
                termometro.animation(); // Llamamos a la animación de cada termómetro
            });

            moverNubes();
            
            renderer.render(scene, camera);
        };
        
        animate();

        return () => {
            window.removeEventListener('resize', onWindowResize);
            renderer.dispose();
            document.body.removeChild(renderer.domElement);
            //centralDiv.remove();
        };
    }, []);

    return null;
}
