import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function Meteoritos({
  color,
  width = 1400,
  height = 900,
  modelo,
  pos = { x: 0, y: 0, z: -10 },
  scale = { x: 1, y: 1, z: 1 },
  rot = { x: 0, y: 0, z: 0 },
  intensidad_luz = 5,
  posAnim = { x: 0, y: -2, z: -3 },
  posAnimX = 0,
  posAnimY = 0,
  posAnimZ = 0,
  anim = {scroll: 0}
}) {
  const mountRef = useRef(null);
  useEffect(() => {
    const col = new THREE.Color(color);
    // Escena, cámara y renderizador
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 0);
    mountRef.current.appendChild(renderer.domElement);

    //loader
    const loader = new GLTFLoader();

    let model1;
    let model2;
    let model3;
    // Load a glTF resource
    // Cargar el modelo del meteorito
    loader.load(
      "/assets/meteor/scene.gltf",
      function (gltf) {
        model1 = gltf.scene;
        // Posición inicial del meteorito fuera de la cámara, en el lado izquierdo
        model1.position.set(pos.x, pos.y, pos.z); // Lejos de la cámara en Z
        model1.scale.set(scale.x, scale.y, scale.z);
        model1.rotation.set(rot.x, rot.y, rot.z);

        scene.add(model1);
      },
      function (xhr) {
        // Monitoreo del progreso de carga
        console.log((xhr.loaded / xhr.total) * 100 + "% cargado");
      },
      function (error) {
        // Muestra cualquier error que ocurra
        console.error("Error cargando el meteorito: ", error);
      }
    );
    loader.load(
      "/assets/meteor/scene.gltf",
      function (gltf) {
        model2 = gltf.scene;
        // Posición inicial del meteorito fuera de la cámara, en el lado izquierdo
        model2.position.set(pos.x, pos.y, pos.z); // Lejos de la cámara en Z
        model2.scale.set(scale.x, scale.y, scale.z);
        model2.rotation.set(rot.x, rot.y, rot.z);

        scene.add(model2);
      },
      function (xhr) {
        // Monitoreo del progreso de carga
        console.log((xhr.loaded / xhr.total) * 100 + "% cargado");
      },
      function (error) {
        // Muestra cualquier error que ocurra
        console.error("Error cargando el meteorito: ", error);
      }
    );
    loader.load(
      "/assets/meteor/scene.gltf",
      function (gltf) {
        model3 = gltf.scene;
        // Posición inicial del meteorito fuera de la cámara, en el lado izquierdo
        model3.position.set(pos.x, pos.y, pos.z); // Lejos de la cámara en Z
        model3.scale.set(scale.x, scale.y, scale.z);
        model3.rotation.set(rot.x, rot.y, rot.z);

        scene.add(model3);
      },
      function (xhr) {
        // Monitoreo del progreso de carga
        console.log((xhr.loaded / xhr.total) * 100 + "% cargado");
      },
      function (error) {
        // Muestra cualquier error que ocurra
        console.error("Error cargando el meteorito: ", error);
      }
    );
    let mixer;
    const clock = new THREE.Clock(); // To track time for animation updates

    function setupAnimation(model, animations) {
      mixer = new THREE.AnimationMixer(model);

      // Play all available animations
      animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
    }

    // Luz
    const pointLight = new THREE.PointLight(col, intensidad_luz, 50);
    pointLight.position.set(5, 4, 7);
    pointLight.shadow.intensity = 50;
    scene.add(pointLight);
  

    const directionalLight = new THREE.DirectionalLight(0x73c0ff, 6); // Aumenta la intensidad y el alcance
    directionalLight.position.set(-5, -1, 0); // Ubica la luz en una posición lejana y diagonal al planeta
    scene.add(directionalLight);
    /*
    // Luz ambiental para rellenar sombras
    const ambientLight = new THREE.AmbientLight(0x404040, 0.2); // Luz suave en todo el ambiente
    // scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x333333, 0.9); 
*/
    // Posición de la cámara
    camera.position.z = 0;

    // Animación
    const animate = () => {
      requestAnimationFrame(animate);
      if(model1){
        if(anim.scroll != 0){
          model1.position.x = ((-anim.scroll - 50)/20) + 10;//0.3
          model1.position.y = ((-anim.scroll - 50)/20) + 5;//0.1
          model1.position.z = ((anim.scroll - 50)/100) - 10;//0.1
          model1.rotation.z = (anim.scroll/20);//0.1
        }
      }
      if(model2){
        if(anim.scroll != 0){
          model2.position.x = ((-anim.scroll - 50)/10) + 10;//0.3
          model2.position.y = ((-anim.scroll - 50)/20) + 5;//0.1
          model2.scale.x = (-(anim.scroll - 200)/50);//0.1
          model2.scale.y = (-(anim.scroll - 200)/50);//0.1
          model2.rotation.z = (anim.scroll/20);//0.1

        }
      }
      if(model3){
        if(anim.scroll != 0){
          model3.position.x = ((-anim.scroll - 50)/50) + 10;//0.3
          model3.position.y = ((-anim.scroll - 50)/20) + 5;//0.1
          model3.position.z = ((anim.scroll - 50)/20) - 10;//0.1
          model3.scale.x = ((anim.scroll - 100)/70);//0.1
          model3.scale.y = ((anim.scroll - 100)/70);//0.1
          model3.rotation.z = (anim.scroll/20);//0.1

        }
      }

      anim.scroll = 0
      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }
      renderer.render(scene, camera);
      

    };
    animate();
  }, []);

  return (
    <div
      ref={mountRef}
      className="model-container"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );
}

export default Meteoritos;
