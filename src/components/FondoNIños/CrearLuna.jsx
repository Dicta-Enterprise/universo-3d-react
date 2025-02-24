import * as THREE from 'three';

export default function CrearLuna(recortepositionx){
    // Crear la esfera base (la luna)
    const geometriaLuna = new THREE.SphereGeometry(1, 32, 32);
    const materialLuna = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        emissive: 0x222222,
        roughness: 1,
        metalness: 0
    });
    const luna = new THREE.Mesh(geometriaLuna, materialLuna);

    // Crear la esfera de recorte principal (para hacer la forma de la luna creciente)
    const geometriaRecorte = new THREE.SphereGeometry(0.99, 32, 32);
    const materialRecorte = new THREE.MeshBasicMaterial({ color: 0x001833 });
    const recorte = new THREE.Mesh(geometriaRecorte, materialRecorte);
    recorte.position.x = recortepositionx;
    recorte.position.z = 0.1;
    
    // Grupo de la luna
    const grupoLuna = new THREE.Group();
    grupoLuna.add(luna);
    grupoLuna.add(recorte);

    return grupoLuna;
}