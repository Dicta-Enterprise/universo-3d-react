import * as THREE from 'three';

export default function CrearEstrellas3D(color){
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
        depth: 0.3,
        bevelEnabled: true,
        bevelSize: 0.2,
        bevelThickness: 0.3,
    });

    const material = new THREE.MeshStandardMaterial({ 
        color: color,
        emissive: color,
        emissiveIntensity: 0, 
        metalness: 0, 
        roughness: 0 
    });

    return new THREE.Mesh(geometry, material);
}