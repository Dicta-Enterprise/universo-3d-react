import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import VolverARoles from '../components/VolverARoles';
import FondoUniverso from '../components/FondoUniverso';
import { reproducirClic, reproducirMagia } from '../components/sonidos';
import { crearLlegadaCohete } from '../components/llegadaCohete';
import { posicionesMovilFigma, orientarGalaxiaMovil } from '../components/disposicionMovil';
import ControlesSuperiores from '../components/ControlesSuperiores';
import { crearEtiquetasGalaxias } from '../components/etiquetasGalaxias';

// true cuando la página se cierra. Todos los bucles de animación y temporizadores de este archivo lo consultan y se
// detienen: como "Volver a roles" ya no recarga la página, nada puede quedar corriendo detrás de la pantalla siguiente.
let desmontado = false;
let temporizadorEntrada = null; // paso a la página de la galaxia elegida (se cancela al salir)

export default function Ninos() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const galaxiesRef = useRef([]); // Referencia para almacenar las galaxias
    const cameraRef = useRef(null); // Referencia para la cámara
    const isAnimatingRef = useRef(false); // Referencia para controlar la animación
    const llegadaRef = useRef(null);      // Llegada del cohete a esta galaxia (la usa handleConfirm)
    const etiquetasRef = useRef(null);    // Etiquetas verdes de las galaxias
    const entrarRef = useRef(null);       // handleConfirm, para llamarlo desde los clics del canvas y de las etiquetas

    useEffect(() => {
        const handleResize = () => {
            const newIsMobile = window.innerWidth < 768;
            setIsMobile(newIsMobile);
    
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        desmontado = false;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: el fondo lo pone <FondoUniverso />
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);
    
        cameraRef.current = camera;

        //---------------------------------------------------------
        //---------------------S O N I D O ------------------------
        //---------------------------------------------------------
        // (Audio: todos los sonidos pasan por components/sonidos.js, que respeta el silencio global)
    
        scene.background = null; // fondo oficial: <FondoUniverso /> (antes: color 0x001833)
        // -------------------------

        // Agregar 2 luz ambiental y una luz puntual
        const ambientLight = new THREE.AmbientLight(0x404040, 1.5); // Luz suave
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

        // (Fondo simplificado: se eliminaron lunas, nubes, estrellas, cruces, círculos, termómetros y líneas)

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
            new THREE.Vector3(0, 8, 0),
        ];
        // Móvil: distribución de Figma (Física arriba, Mental y Social en una fila, Peligros Digitales abajo).
        // Orden de esta página: [Social, Digitales, Física, Mental]. Ver components/disposicionMovil.js
        const disposicionMovil = posicionesMovilFigma({ fov: 75, distancia: 18, radio: 5 });
        const galaxyPositionsMobile = disposicionMovil.posiciones.map((p) => new THREE.Vector3(p.x, p.y, p.z));
    
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
    
        /*const createGalaxy = (position, baseColor, rotation = { x: 0, y: 0, z: 0 }) => {
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
        };*/

        const createGalaxy = (position, baseColor, rotation = { x: 0, y: 0, z: 0 }) => {
            const particles = 10000;
            const radius = 5;
            const spread = 0.5; // Reducir el spread para una línea más definida
            const positions = new Float32Array(particles * 3);
            const colors = new Float32Array(particles * 3);
            const color = new THREE.Color(baseColor);

            for (let i = 0; i < particles; i++) {
                const i3 = i * 3;
                const r = (i / particles) * radius; // Aumentar el radio gradualmente
                const angle = r * 5; // Aumentar el ángulo para crear una espiral

                const x = Math.cos(angle) * r + (Math.random() - 0.5) * spread;
                const y = Math.sin(angle) * r + (Math.random() - 0.5) * spread;
                const z = (Math.random() - 0.5) * spread;

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
    
        // Posicionar las galaxias según el tamaño de la pantalla inicial
        const initialPositions = isMobile ? galaxyPositionsMobile : galaxyPositionsPC;
        const colors = ['#FE797B', '#A587CA', '#36CEDC', '#8FE968'];

        function obtenerRotacionResponsive(){
            if (isMobile){
                return [
                    { x: Math.PI / 1.3, y: 0, z: 0 },
                    { x: Math.PI / 2, y: 0, z: 0 },
                    { x: Math.PI / 4, y: 0, z: 0 },
                    { x: Math.PI / 2, y: 0, z: 0 },
                ];
            }
            else{
                return [
                    { x: Math.PI / 2.4, y: 0, z: 0},
                    { x: Math.PI / 2.4, y: 0, z: 0 },
                    { x: Math.PI / 4, y: 0, z: 0 },
                    { x: Math.PI / 2, y: 0, z: 0 },
                ];
            }
        };

        const rotations = obtenerRotacionResponsive();

        const updateGalaxyRotations = () => {
            const newRotations = obtenerRotacionResponsive();
            galaxies.forEach((galaxy, index) => {
                galaxy.rotation.set(newRotations[index].x, newRotations[index].y, newRotations[index].z);
            });
        };

        initialPositions.forEach((pos, index) => {
            createGalaxy(pos, colors[index], rotations[index]);
        });
        // En móvil se escalan para que las dos de la fila central quepan una junto a la otra
        if (isMobile) galaxies.forEach((galaxy) => galaxy.scale.setScalar(disposicionMovil.escala));

        // Escuchar cambios de tamaño de ventana y actualizar rotación
        window.addEventListener('resize', updateGalaxyRotations);

        /*initialPositions.forEach((pos, index) => {
            const rotations = [
                { x: 0.8 * Math.PI, y: 0, z: 0 }, //rojo
                { x: Math.PI / 2.5, y: 0, z: 0 }, //morado
                { x: Math.PI / 4, y: 0, z: 0 }, //celeste
                { x: -1.5 * Math.PI, y: 0, z: 0 }, //verde
            ];
            createGalaxy(pos, colors[index], rotations[index]);
        });*/
    
        galaxiesRef.current = galaxies;
    
        camera.position.set(0, 0, 18);

        // Llegada del cohete: oscuridad -> aproximación -> destello -> órbita (ver components/llegadaCohete.js)
        const llegada = crearLlegadaCohete({ scene, camera, getGalaxias: () => galaxies });
        llegadaRef.current = llegada;
        // Etiquetas de las galaxias (Figma). Pulsar una galaxia o su etiqueta inicia directamente la animación de entrada.
        const etiquetas = crearEtiquetasGalaxias({
            camera,
            getGalaxias: () => galaxies,
            puedeMostrar: () => llegada.puedeElegir(),
            onElegir: (i) => { if (entrarRef.current) entrarRef.current({ title: galaxyTitles[i], url: galaxyUrls[i], index: i }); },
        });
        etiquetasRef.current = etiquetas;
        // En móvil, al cambiar el tamaño de la ventana las galaxias se recolocan con la distribución de Figma
        const reposicionarMovil = () => {
            if (window.innerWidth >= 768) return;
            const d = posicionesMovilFigma({ fov: 75, distancia: 18, radio: 5 });
            galaxies.forEach((galaxy, i) => {
                galaxy.position.set(d.posiciones[i].x, d.posiciones[i].y, d.posiciones[i].z);
                galaxy.scale.setScalar(d.escala);
                orientarGalaxiaMovil(galaxy, camera, 'z');
            });
        };
        window.addEventListener('resize', reposicionarMovil);
        // En móvil cada galaxia se orienta para verse con la proporción ovalada de la galaxia morada de referencia
        if (isMobile) galaxies.forEach((galaxy) => orientarGalaxiaMovil(galaxy, camera, 'z'));
    
        const onClick = (event) => {
            if (!llegada.puedeElegir()) return; // todavía llegando desde la oscuridad
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
                    galaxyMaterials[galaxyIndex].size = 0.1;
                    galaxyMaterials[galaxyIndex].color.setHex(0xffffff);
    
                    // Sin cuadro de confirmación: elegir la galaxia inicia directamente la animación de entrada
                    reproducirClic(); // ABRIR-BOTON.wav
                    if (entrarRef.current) {
                        entrarRef.current({ title: galaxyTitles[galaxyIndex], url: galaxyUrls[galaxyIndex], index: galaxyIndex });
                    }
                }
            }
        };
    
        renderer.domElement.addEventListener('click', onClick);
        
        // Ajuste de cámara y renderer al tamaño de la ventana
        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', onWindowResize);
        onWindowResize();

        const animate = () => {
            if (desmontado) return;
            requestAnimationFrame(animate);
            galaxies.forEach((galaxy, index) => {
                const speed = 0.0002 + index * 0.0002;
                galaxy.rotation.z += speed;
            });

            llegada.actualizar();
            etiquetas.actualizar();
            renderer.render(scene, camera);
            
        };
        animate();
    
        return () => {
            desmontado = true;
            clearTimeout(temporizadorEntrada);
            llegada.dispose();
            etiquetas.dispose();
            llegadaRef.current = null;
            etiquetasRef.current = null;
            window.removeEventListener('resize', reposicionarMovil);
            window.removeEventListener('resize', onWindowResize);
            window.removeEventListener('resize', updateGalaxyRotations);
            renderer.dispose();
            document.body.removeChild(renderer.domElement);
        };
    }, [isMobile]);

    // Esta página es una sola pantalla fija: sin scroll (ver .pagina-sin-scroll en styles.css).
    // Se activa al entrar y se quita al salir, para no afectar a las demás rutas.
    useEffect(() => {
        const html = document.documentElement;
        const body = document.body;
        html.classList.add('pagina-sin-scroll');
        body.classList.add('pagina-sin-scroll');
        window.scrollTo(0, 0);
        return () => {
            html.classList.remove('pagina-sin-scroll');
            body.classList.remove('pagina-sin-scroll');
        };
    }, []);

    // Animación de entrada de siempre (acercamiento de cámara + sonido) y paso a la página de la galaxia elegida.
    // Antes la lanzaba el botón "Confirmar" del cuadro central; ahora la lanza directamente el clic en la galaxia.
    const handleConfirm = (seleccion) => {
        if (seleccion && !isAnimatingRef.current) {
            const selectedGalaxyIndex = seleccion.index;
            const galaxy = galaxiesRef.current[selectedGalaxyIndex];
            const url = seleccion.url;
            if (etiquetasRef.current) etiquetasRef.current.bloquear(); // ya no se aceptan más elecciones

            // Iniciar la animación de acercamiento
            isAnimatingRef.current = true;
            if (llegadaRef.current) llegadaRef.current.entrarEnGalaxia(galaxy); // el cohete entra en la galaxia elegida

            reproducirMagia(); // magic.mp3 al confirmar la galaxia

            const duration = 0.9; // Duración de la animación
            const distance = 9; // Distancia a la que se acerca la cámara
            const direction = new THREE.Vector3().subVectors(cameraRef.current.position, galaxy.position).normalize();
            const targetPosition = new THREE.Vector3().copy(galaxy.position).add(direction.multiplyScalar(distance));
            const startPosition = new THREE.Vector3().copy(cameraRef.current.position);
            let elapsed = 0;
            let ultimoT = performance.now();   // el avance depende del TIEMPO real, no de los frames (en pantallas de 30 fps duraba el doble)

            const animateMove = () => {
                const ahoraT = performance.now();
                elapsed += Math.min((ahoraT - ultimoT) / 1000, 0.05);
                ultimoT = ahoraT;
                const t = Math.min(elapsed / duration, 1);

                // ANIMACION DE ACERCAMINETO DE GALAXIA
                cameraRef.current.position.lerpVectors(startPosition, targetPosition, t);
                cameraRef.current.lookAt(galaxy.position);

                if (t < 1) {
                    if (!desmontado) requestAnimationFrame(animateMove);
                } else {
                    temporizadorEntrada = setTimeout(() => {
                        if (!desmontado) window.location.href = url;
                    }, 150);// pausa final antes de cambiar de página (antes 1000 ms)
                }
            };

            animateMove();
        }
    };

    entrarRef.current = handleConfirm;

    return (
        <>
            <FondoUniverso />
            <ControlesSuperiores />
            <VolverARoles />
        </>
    );
}