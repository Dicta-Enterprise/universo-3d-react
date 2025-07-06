import * as THREE from 'three';

export default function CreaCruzRedonda(color, altura = 4, ancho = 2, grosor = 0.1){
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