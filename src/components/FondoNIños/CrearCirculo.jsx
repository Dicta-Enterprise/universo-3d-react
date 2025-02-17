import * as THREE from 'three';

export default function crearCirculo(color, radio = 1){
    const geometry = new THREE.CircleGeometry(radio, 32);
    const material = new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide });
    const circulo = new THREE.Mesh(geometry, material);
    return circulo;
}