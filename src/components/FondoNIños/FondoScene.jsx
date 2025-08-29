import { useEffect } from 'react';
import * as THREE from 'three';
import CrearEstrellas3D from '../FondoNiños/CrearEstrellas3D';
import crearLineaVertical from '../FondoNiños/CrearLineaVerticalEstrella';
import crearCirculo from '../FondoNiños/CrearCirculo';
import CreaCruzRedonda from '../FondoNiños/CrearCruzRedonda';
import CrearTermometro from '../FondoNiños/CrearTermometro';
import CrearNube from '../FondoNiños/CrearNube';
import CrearLuna from '../FondoNiños/CrearLuna';
import { nubeconfig, estrellasConfig, circulosConfig, crucesConfig, lineasConfig, TermometroConfig } from '../FondoNiños/ArregloObjetos';

const FondoScene = ({ scene, camera, renderer }) => {
    useEffect(() => {
        if (!scene || !camera || !renderer) return;

        scene.background = new THREE.Color(0x001833);

        // Agregar luces
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(50, 0, 30);
        scene.add(pointLight);

        const pointLight2 = new THREE.PointLight(0xffffff, 1, 100);
        pointLight2.position.set(-50, 0, 30);
        scene.add(pointLight2);

        const pointLight3 = new THREE.PointLight(0xffffff, 1, 100);
        pointLight3.position.set(-60, -30, 30);
        scene.add(pointLight3);

        // Crear y agregar objetos a la escena
        const lunaCreciente = CrearLuna(0.3);
        scene.add(lunaCreciente);
        lunaCreciente.position.set(-13, 17, -10);

        const lunaCreciente2 = CrearLuna(0.05);
        scene.add(lunaCreciente2);
        lunaCreciente2.position.set(10, 0, -10);
        lunaCreciente2.scale.set(1.5, 1.5, 1.5);

        const lunaCreciente3 = CrearLuna(0.4);
        scene.add(lunaCreciente3);
        lunaCreciente3.position.set(-20, -10, -10);
        lunaCreciente3.scale.set(0.8, 0.8, 0.8);

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

        TermometroConfig.forEach(config => {
            const termometro = CrearTermometro();
            termometro.position.set(config.x, config.y, config.z);
            termometro.rotation.set(config.rotationx, config.rotationy, config.rotationz);
            termometro.scale.set(0.5, 0.5, 0.5);
            scene.add(termometro);
            termometros.push(termometro);

            termometro.userData = { angle: Math.random() * Math.PI * 2 };
            const swingSpeed = 0.005;
            termometro.animation = () => {
                termometro.userData.angle += swingSpeed;
                termometro.rotation.z = Math.sin(termometro.userData.angle) * 0.2;
            };
        });

        estrellasConfig.forEach(config => {
            const estrella = CrearEstrellas3D(config.color);
            estrella.position.set(config.x, config.y, config.z);
            estrella.rotation.set(config.rotationX, config.rotationY, config.rotationZ);
            estrella.scale.set(config.escalado, config.escalado, config.escalado);
            scene.add(estrella);
            estrellas.push(estrella);
        });

        lineasConfig.forEach(config => {
            const linea = crearLineaVertical(config.altura);
            linea.position.set(config.x, config.y, config.z);
            scene.add(linea);
            lineas.push(linea);
        });

        circulosConfig.forEach(config => {
            const circulo = crearCirculo(config.color, config.radio);
            circulo.position.set(config.x, config.y, config.z);
            scene.add(circulo);
            circulos.push(circulo);
        });

        crucesConfig.forEach(config => {
            const cruz = CreaCruzRedonda(config.color, config.altura, config.ancho, config.grosor);
            cruz.position.set(config.x, config.y, config.z);
            cruz.rotation.set(config.rotx, config.roty, config.rotz);
            scene.add(cruz);
            cruces.push(cruz);
        });

        camera.position.set(0, 0, 18);

        let velocidadMovimiento = 0.00003;
        let rangoOscilacion = 25;

        const actualizarParametrosAnimacion = () => {
            const isMobile = window.innerWidth < 768;
            if (isMobile) {
                velocidadMovimiento = 0.00005;
                rangoOscilacion = 5;
            } else {
                velocidadMovimiento = 0.00005;
                rangoOscilacion = 25;
            }
        };

        nubes.forEach((nube, index) => {
            nube.direccion = (index % 2 === 0) ? -1 : 1;
        });

        function moverNubes() {
            nubes.forEach(nube => {
                let posicionX = rangoOscilacion * Math.sin(velocidadMovimiento * performance.now());
                nube.position.x = posicionX * nube.direccion;
            });
        }

        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', onWindowResize);

        const animate = () => {
            requestAnimationFrame(animate);

            cruces.forEach(cruz => {
                cruz.rotation.z += 0.005;
            });

            const tiempoBase = Date.now() * 0.001;

            estrellas.forEach((estrella, index) => {
                const velocidad = 1;
                const amplitud = 0.03;
                const tiempo = tiempoBase + index * 0.3;
                estrella.position.y += Math.cos(tiempo * velocidad) * amplitud * 0.5;
                estrella.rotation.z += 0.005;
            });

            circulos.forEach((circulo, index) => {
                const velocidad = 0.5;
                const amplitud = 0.01;
                const tiempo = tiempoBase + index * 0.3;
                circulo.position.y += Math.cos(tiempo * velocidad) * amplitud;
            });

            termometros.forEach(termometro => {
                termometro.animation();
            });

            moverNubes();
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            window.removeEventListener('resize', onWindowResize);
        };
    }, [scene, camera, renderer]);

    return null;
};

export default FondoScene;