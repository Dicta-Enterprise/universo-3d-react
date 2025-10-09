import * as THREE from 'three';
import galaxiasData from '../../../../data/DataGalaxia'; // Ajusta la ruta si es necesario

/**
 * Genera galaxias de partículas con rotaciones independientes para cada una.
 * @param {Object} props
 * @param {THREE.Scene} props.scene - La escena 3D donde insertar las galaxias.
 * @param {Array} [props.definiciones] - Opcional: definiciones externas de galaxias.
 * @param {string} props.grupo - Grupo actual (niños, jóvenes, adultos).
 * @param {function} props.onSeleccion - Función callback cuando se hace clic en una galaxia.
 * @returns {THREE.Points[]} Lista de objetos animables (galaxias)
 */

function generarGalaxiaOriginal(angle,r,spread){
  const x = Math.cos(angle) * r + (Math.random() - 0.5) * spread;
  const y = Math.sin(angle) * r + (Math.random() - 0.5) * spread;
  const z = (Math.random() - 0.5) * spread;
  return {x,y,z}
}
/*
function generarGalaxiaS(angle,r,spread){
  const x = Math.cos(angle) + (Math.random() - 0.5) * spread;
  const y = 10+(Math.sin(angle/10)*20-20*(1/(1+Math.pow(Math.E,-2*(x-9*x/2+20))))) ;
  const z = (Math.random() - 0.5) * spread;
  return {x,y,z}
}
*/
function generarGalaxiaContorno(angle,r,spread,sign){
  var x = -Math.cos(sign * angle) * r + (Math.random() - 0.5) * spread;
  var y = -Math.sin(sign * angle) * r + (Math.random() - 0.5) * spread;
  if(sign == -1){
    var x = 30- Math.cos(angle) * r + (Math.random() - 0.5) * spread;
    var y = 30-Math.sin(angle) * r + (Math.random() - 0.5) * spread;
  }
  const z = (Math.random() - 0.5) * spread;
  return {x,y,z}
}
function generarGalaxiaArana(angle,r,spread,sign){
  var x = Math.tan(angle) + (Math.random() - 0.5) * spread*1;
  var y = Math.sin(angle)*r + (Math.random() - 0.5) * spread*1;
  x = Math.abs(x) < 5?x:Math.cos(angle) + (Math.random() - 0.5) * spread*1;
  var z = (Math.random() - 0.5) * spread*2;
  return {x,y,z}
}

/*
function generarGalaxiaEse(angle,r,spread,sign){
  var x = -Math.cos(sign * angle) * r + (Math.random() - 0.5) * spread;
  var y = -Math.sin(sign * angle) * r + (Math.random() - 0.5) * spread;
  if(sign == -1){
    var x = Math.cos(angle*2)/Math.sin(angle/10) * r*2 + (Math.random() - 0.5) * spread;
    var y = Math.sin(angle*2)/2 * r*5 + (Math.random() - 0.5) * spread;
  }
  const z = (Math.random() - 0.5) * spread;
  return {x,y,z}
}
*/

export default function GeneradorGalaxias({ scene, definiciones, grupo, onSeleccion }) {
  const galaxias = [];

  // Usa las definiciones externas si existen, si no las internas (filtrando solo las activas)
  const defs = definiciones.gals.filter(g => g.estado);
  var counter = 0;

  defs.forEach(({ id, nombre, color, posicion, rotacion }) => {
    const particles = 9000;
    const radius = 5;
    const spread = 0.5;

    const positions = new Float32Array(particles * 3);
    const colors = new Float32Array(particles * 3);
    const baseColor = new THREE.Color(color);
    const alt = Math.random() * 2;


    for (let i = 0; i < particles; i++) {
      const i3 = i * 3;
      const r = (i / particles) * radius;
      const angle = r * 5;


      var gal_pos = {x:0,y:0,z:0}


      switch(Math.round(alt)){
        case 0:
          gal_pos = generarGalaxiaContorno(angle,r,spread,(i / particles) < 0.5?-1:1);//,(i / particles) < 0.5?-1:1
          break;
        case 1:
          gal_pos = generarGalaxiaOriginal(angle,r,spread);//,(i / particles) < 0.5?-1:1
          break;
        case 2:
          gal_pos = generarGalaxiaArana(angle,r,spread,(i / particles) < 0.5?-1:1);//,(i / particles) < 0.5?-1:1
          break;
      }


      positions[i3] = gal_pos.x;
      positions[i3 + 1] = gal_pos.y;
      positions[i3 + 2] = gal_pos.z;

      const variation = Math.random() * 0.3 - 0.15;
      const adjustedColor = baseColor.clone().offsetHSL(0, 0, variation);

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
    
    galaxy.position.set(posicion.x,posicion.y,posicion.z);
    //galaxy.position.set(0,-7,5);
    galaxy.rotation.set(rotacion.x,rotacion.y,rotacion.z);

    galaxy.userData = {
      animar: () => {
        galaxy.rotation.z += 0.0015;
      },
      onClick: () => {
        onSeleccion(id,nombre);
      },
    };

    scene.add(galaxy);
    galaxias.push(galaxy);
  });

  console.log("galaxias")
  console.log(galaxias)

  return galaxias;
}