import * as THREE from 'three';
import { useEffect } from 'react';

const StarsScene = (scene) => {
    // Array para almacenar todas las estrellas
    const stars = [];
    
    // Función para crear estrellas con diferentes tamaños y posiciones
    function createStar(size, positionX, positionY, positionZ) {
        const shape = new THREE.Shape();
        shape.moveTo(0, size);
        shape.quadraticCurveTo(size * 0.15, size * 0.5, size * 0.3, size * 0.3);
        shape.quadraticCurveTo(size * 0.5, size * 0.15, size, 0);
        shape.quadraticCurveTo(size * 0.5, -size * 0.15, size * 0.3, -size * 0.3);
        shape.quadraticCurveTo(size * 0.15, -size * 0.5, 0, -size);
        shape.quadraticCurveTo(-size * 0.15, -size * 0.5, -size * 0.3, -size * 0.3);
        shape.quadraticCurveTo(-size * 0.5, -size * 0.15, -size, 0);
        shape.quadraticCurveTo(-size * 0.5, size * 0.15, -size * 0.3, size * 0.3);
        shape.quadraticCurveTo(-size * 0.15, size * 0.5, 0, size);

        const extrudeSettings = { depth: size * 0.2, bevelEnabled: false };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(0xFFD700) },   // Color dorado base
                edgeColor: { value: new THREE.Color(0x000000) }, // Bordes oscuros
                emissiveColor: { value: new THREE.Color(0xFFD700) }, // Color de emisión (brillo)
                emissiveIntensity: { value: 1.5 }, // Intensidad del brillo
            },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                uniform vec3 color;
                uniform vec3 edgeColor;
                uniform vec3 emissiveColor;
                uniform float emissiveIntensity;
                
                void main() {
                    float intensity = pow(2.0 - dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 2.0);
                    vec3 baseColor = mix(color, edgeColor, intensity);
                    
                    // Simulación de brillo: agrega el color de emisión basado en la intensidad
                    vec3 emissive = emissiveColor * emissiveIntensity;
        
                    gl_FragColor = vec4(baseColor + emissive, 1.0);
                }
            `
        });

        const star = new THREE.Mesh(geometry, material);
        star.position.set(positionX, positionY, positionZ);

        // Asignar una fase aleatoria para el efecto de pulsación (titileo)
        star.userData.phase = Math.random() * Math.PI * 2;

        scene.add(star);
        stars.push(star);
    }
    
    // Crear múltiples estrellas
    const starsData = [
        [0.8, 0, 0, -5], [0.3, 30, 13, -5], [0.5, 28, -12, -5], [0.8, 26, 7, -5],
        [0.6, 24, -5, -5], [0.8, 20, 0, -6], [0.6, 15, 8, -7], [0.9, 10, -8, -8],
        [0.6, 5, 15, -6], [0.6, 3, -5, -7], [0.6, 2, -13, -6], [0.5, 0, 8, -9],
        [0.6, -3, 18, -8], [0.4, -7, 10, -7], [0.8, -9, -12, -5], [0.9, -12, 10, -8],
        [1.0, -14, -1, -6], [0.9, -18, 15, -9], [0.4, -19, 3, -7], [0.4, -20, -12, -8],
        [0.6, -26, -4, -8], [0.5, -31, -15, -8], [0.9, -32, 10, -8], [0.6, -37, 1, -8]
    ];

    const starsDataResponsive = [
        [0.8, 0, 0, -5], [0.3, 10, 13, -5],[0.6, 10, 5, -5], [0.8, 8, 0, -6], 
        [0.6, 15, 8, -7], [0.9, 10, -8, -8], [0.6, 5, 15, -6], [0.6, 3, -5, -7], 
        [0.6, 2, -13, -6], [0.5, 0, 8, -9], [0.6, -3, 18, -8], [0.4, -7, 10, -7], 
        [0.8, -9, -12, -5], [0.9, -12, 10, -8], [1.0, -10, -1, -6], [0.9, -11, 17, -9],
        [0.6, -8, -6, -8],
    ];

    //starsData.forEach(star => createStar(...star));

    function ResponsiveStars() {
        // Eliminar estrellas existentes
        stars.forEach(star => scene.remove(star));
        stars.length = 0;  // Vaciar la lista de estrellas
    
        // Elegir el dataset según el tamaño de la pantalla
        const data = window.innerWidth <= 768 ? starsDataResponsive : starsData;
    
        // Crear nuevas estrellas
        data.forEach(star => createStar(...star));
    }
    
    useEffect(() => {
        ResponsiveStars();
        window.addEventListener('resize', ResponsiveStars);
        return () => window.removeEventListener('resize', ResponsiveStars);
    }, []);

    return stars;
};

export default StarsScene;