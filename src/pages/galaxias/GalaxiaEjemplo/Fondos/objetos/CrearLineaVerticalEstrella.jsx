import * as THREE from 'three';

export default function crearLineaVertical(altura){
    const geometry = new THREE.CylinderGeometry(0.05, 0.05, altura, 32);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            color: { value: new THREE.Color(0xffffff) },
            opacityStart: { value: 1.0 },  // Opacidad en la base
            opacityEnd: { value: 0.0 }     // Opacidad en el otro extremo
        },
        vertexShader: `
            varying float vPositionY;
            void main() {
                vPositionY = position.y;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            uniform float opacityStart;
            uniform float opacityEnd;
            varying float vPositionY;

            void main() {
                float opacity = mix(opacityStart, opacityEnd, (vPositionY + 5.0) / 10.0); 
                gl_FragColor = vec4(color, opacity);
            }
        `,
        transparent: true
    });
    
    
    const linea = new THREE.Mesh(geometry, material);
    return linea;
}