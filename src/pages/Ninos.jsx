import { useEffect, useState } from 'react';
import * as THREE from 'three';

export default function Galaxias() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);

        const spaceTexture = new THREE.TextureLoader().load('/assets/2k_stars.jpg');
        scene.background = spaceTexture;

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
        const galaxyPositionsPC = [
            new THREE.Vector3(-13, 1, 0),
            new THREE.Vector3(13, 1, 0),
            new THREE.Vector3(0, -7, 0),
            new THREE.Vector3(0, 10, 0),
        ];
        const galaxyPositionsMobile = [
            new THREE.Vector3(0, 10, 0),
            new THREE.Vector3(0, 3, 0),
            new THREE.Vector3(0, -4, 0),
            new THREE.Vector3(0, -11, 0),
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
        centralDiv.style.border = '2px solid transparent'; // Inicialmente sin borde
        document.body.appendChild(centralDiv);

        const centralText = document.createElement('p');
        centralText.textContent = "¿A dónde vamos a ir hoy? <> (Seleccione una de las siguientes galaxias)";
        centralDiv.appendChild(centralText);

        // Crear botón de confirmar
        const confirmButton = document.createElement('button');
        confirmButton.textContent = "Confirmar";
        confirmButton.style.marginTop = '10px';
        confirmButton.style.padding = '12px 25px';
        confirmButton.style.backgroundColor = '#4CAF50'; // Color
        confirmButton.style.color = 'white';
        confirmButton.style.border = 'none';
        confirmButton.style.borderRadius = '8px';
        confirmButton.style.cursor = 'pointer';
        confirmButton.style.fontSize = '16px';
        confirmButton.style.fontWeight = 'bold';
        confirmButton.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)'; // Sombra
        confirmButton.style.transition = 'all 0.3s ease'; // Trans
        confirmButton.style.display = 'none';

        // Efecto hover con filtro de brillo
        confirmButton.addEventListener('mouseenter', () => {
            confirmButton.style.filter = 'brightness(0.9)'; // Oscurecer ligeramente el botón
            confirmButton.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.2)'; // Sombra más pronunciada
            confirmButton.style.transform = 'scale(1.05)'; // Ligeramente más grande
        });

        confirmButton.addEventListener('mouseleave', () => {
            confirmButton.style.filter = 'brightness(1)'; // Restablecer el brillo
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

        const updateGalaxyPositions = () => {
            const positions = isMobile ? galaxyPositionsMobile : galaxyPositionsPC;
            galaxies.forEach((galaxy, index) => {
                galaxy.position.copy(positions[index]);
            });
        };

        galaxyPositionsPC.forEach((pos, index) => {
            const colors = ['#ff0000', '#9d4edd', '#0cb7f2', '#00ff00'];
            const rotations = [
                { x: Math.PI / 3.5, y: 0, z: 0 },//rojo
                { x: Math.PI / 5, y: 0, z: 0 },//morado
                { x: Math.PI / 10, y: 0, z: 0 },//celeste
                { x: Math.PI / 20, y: 0, z: 0 },//verde
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
                    galaxyMaterials[galaxyIndex].color.setHex(0xffffff);

                    centralText.textContent = `Iremos a ${galaxyTitles[galaxyIndex]}, ¿Correcto?`;
                    confirmButton.style.display = 'block';

                    // Cambiar el borde del div central y el color del botón al color de la galaxia seleccionada
                    const colors = ['#ff0000', '#9d4edd', '#0cb7f2', '#00ff00'];
                    centralDiv.style.border = `2px solid ${colors[galaxyIndex]}`;
                    confirmButton.style.backgroundColor = colors[galaxyIndex]; // Cambiar color del botón
                }
            } else {
                // Si no se selecciona ninguna galaxia, restablecer el borde y el color del botón
                centralDiv.style.border = '2px solid transparent';
                confirmButton.style.backgroundColor = '#4CAF50'; // Volver al color original del botón
                confirmButton.style.display = 'none'; // Ocultar el botón
            }
        };

        confirmButton.addEventListener('click', () => {
            if (selectedGalaxyIndex !== -1) {
                moveToGalaxy(galaxies[selectedGalaxyIndex], galaxyTitles[selectedGalaxyIndex], galaxyUrls[selectedGalaxyIndex]);
            }
        });

        renderer.domElement.addEventListener('click', onClick);

        const animate = () => {
            requestAnimationFrame(animate);
            galaxies.forEach((galaxy, index) => {
                const speed = 0.0002 + index * 0.0002; // Velocidad del giro de animación
                galaxy.rotation.y += speed;
            });
            renderer.render(scene, camera);
        };
        animate();

        updateGalaxyPositions();

        // Crear botón de regresar
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

        const backButton = createButton('← Regresar', () => {
            window.history.back();
        });
        
        backButton.style.position = 'absolute';
        backButton.style.left = '20px';
        backButton.style.top = '20px'; 
        backButton.style.zIndex = '1000'; // para que el boton este por encima de todo
        
        document.body.appendChild(backButton);

        return () => {
            renderer.dispose();
            document.body.removeChild(renderer.domElement);
            centralDiv.remove();
            backButton.remove();
        };
    }, [isMobile]);

    return null;
}