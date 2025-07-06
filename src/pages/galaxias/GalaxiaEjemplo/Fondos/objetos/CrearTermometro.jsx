import * as THREE from 'three';

export default function CrearTermometro(){
    const material = new THREE.MeshStandardMaterial({ color: 0xA587CA, roughness: 0.5 });

    // Crear el cilindro (tubo del termómetro)
    const cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2.5, 32);
    const cylinder = new THREE.Mesh(cylinderGeometry, material);
    cylinder.position.y = 1.5; // Ajuste para que se vea en la parte superior

    // Crear la esfera (bulbo del termómetro)
    const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const sphere = new THREE.Mesh(sphereGeometry, material);
    sphere.position.y = 0; // Base del termómetro

    // Agregar objetos a la escena
    const Termometro = new THREE.Group();
    Termometro.add(cylinder);
    Termometro.add(sphere);

    return Termometro;
}