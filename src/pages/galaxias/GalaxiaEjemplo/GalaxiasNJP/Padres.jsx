import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

import FondoAdultos from '../Fondos/FondoAdultos';
import GeneradorGalaxias from '../componentes/GeneradorGalaxias';
import TarjetaConfirmacion from '../ui/Tarjeta';
import BotonAtras from '../ui/BotonAtras';

export default function Padres(gals) {
  const containerRef = useRef();
  const cameraRef = useRef();
  const objetosAnimables = useRef([]);
  const navigate = useNavigate();
  const [selectedGalaxy, setSelectedGalaxy] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const isAnimatingRef = useRef(false);

  const [cont, setCont] = useState(0); // Estado para mostrar la tarjeta

  
  var init_backup;
  var lowestGalaxy = 0;

  const onSeleccion = (id,nombre, descripcion) => {
    setSelectedGalaxy({
      title: `¿Ir a la galaxia de ${nombre.replace("-", " ")}?`,
      descripcion,
      id,
    });
    setShowCard(true); // Mostrar la tarjeta de confirmación directamente
  };

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 20);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    const onSeleccion = (id,nombre) => {
      setSelectedGalaxy({
        title: `¿Ir a la galaxia de ${nombre.replace("-", " ")}?`,
        id,
      });
      setShowCard(true);
    };

    // 🪐 Agregar fondo + galaxias
    const fondo = FondoAdultos(scene);
    const galaxias = GeneradorGalaxias({ definiciones:gals, scene, grupo: 'adultos', onSeleccion });
    objetosAnimables.current = [...fondo, ...galaxias];
    setCont(prev => prev++);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.domElement.addEventListener('click', (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        intersects[0].object.userData?.onClick?.();
      } else {
        setSelectedGalaxy(null);
        setShowCard(false);
      }
    });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      var galsR = objetosAnimables.current.filter((c) => {
        if (c) {
          return c.type == "Points";
        }
      });
      galsR.map((g,i) => {
        const def_pos = () => {
          if (lowestGalaxy > galsR[i].position.y) {
            lowestGalaxy = galsR[i].position.y;
            console.log("cambiando altura");
            document
              .getElementsByTagName("body")[0]
              .setAttribute(
                "style",
                "height:" + (80.51 * Math.pow(Math.E,0.032*-lowestGalaxy)) + "vh !important"
              );
            console.log("lowest: " + lowestGalaxy);
            console.log(document.getElementsByTagName("body")[0].style);
          }
        }
        if(window.innerWidth < 1000){
          if(window.innerWidth < 650){
            //tamaño cel
            galsR[i].position.x = 0
            galsR[i].position.y = -24 * i - 14
            init_backup[i] = -24 * i - 14
            requestAnimationFrame(animacion);
            def_pos()
            return;
          }
          //tamaño tablet
          galsR[i].position.x = i % 2 == 0?-6:6;
          galsR[i].position.y = -20 * i - 12
          init_backup[i] = -20 * i - 12
          requestAnimationFrame(animacion);
          def_pos()
          return;
        }
        //tamaño pc
        /*
        galsR[i].position.x = gals.gals[i].posicion.x;
        galsR[i].position.y = gals.gals[i].posicion.y;
        init_backup[i] = gals.gals[i].posicion.y;
        requestAnimationFrame(animacion);
        def_pos()
        */
        galsR[i].position.x = i % 2 == 0?-10:10;
        galsR[i].position.y = -20 * i - 11.5
        init_backup[i] = -20 * i - 11.5
        requestAnimationFrame(animacion);
        def_pos()
        
        //console.log("resssssss")
        //console.log(g.position)
      })
    };
    window.addEventListener('resize', handleResize);

    const animacion = () => {
      requestAnimationFrame(animacion);
      renderer.render(scene, camera);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      objetosAnimables.current.forEach((obj) => obj.userData?.animar?.());
      renderer.render(scene, camera);
    };
    animate();

    const resize_height = () => {
      init_backup = init_backup.map((c) => {
        if (c.position) {
          if (lowestGalaxy > c.position.y) {
            lowestGalaxy = c.position.y;
            console.log("cambiando altura");
            document
              .getElementsByTagName("body")[0]
              .setAttribute(
                "style",
                "height:" + (80.51 * Math.pow(Math.E,0.0333*-lowestGalaxy)) + "vh !important"
              );
            console.log("lowest: " + lowestGalaxy);
            console.log(document.getElementsByTagName("body")[0].style);
          }
          return c.position.y;
        }
      });
      //if(objetosAnimables.current[5])
      console.log(init_backup);
    }


    if (cont == 0) {
      console.log(objetosAnimables.current);
      init_backup = objetosAnimables.current.filter((c) => {
        if (c) {
          return c.type == "Points";
        }
      });
  
      resize_height()
    }
    window.addEventListener("scroll", () => {
      //console.log("scroll en generadorgalaxias")
      //console.log(window.scrollY)
      objetosAnimables.current
        .filter((c) => {
          if (c) {
            return c.type == "Points";
          }
        })
        .forEach((obj, idx) => {
          if (obj) {
            //console.log(init_backup[0]["position"].y)
            if (obj.type == "Points" && init_backup[idx] != undefined) {
              obj.position.y = init_backup[idx] + window.scrollY/-lowestGalaxy;
            }
          }
        });
    });

    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleConfirm = () => {
    if (!selectedGalaxy || isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const tema = selectedGalaxy.id;
    const destino = `/galaxia/padres/${tema}`;
    const camera = cameraRef.current;
    const start = camera.position.clone();
    const end = new THREE.Vector3(0, 0, 5);
    let t = 0;

    const animar = () => {
      t += 0.02;
      camera.position.lerpVectors(start, end, t);
      camera.lookAt(0, 0, 0);
      if (t < 1) {
        requestAnimationFrame(animar);
      } else {
        navigate(destino);
      }
    };
    animar();
    setShowCard(false);
  };

  const handleClose = () => {
    setShowCard(false);
  };

  return (
    <>
      {/* Mostrar tarjeta solo si una galaxia está seleccionada */}
      {showCard && selectedGalaxy && (
        <TarjetaConfirmacion
          title={selectedGalaxy.title}
          onConfirm={handleConfirm}
          onClose={handleClose}
        />
      )}
      <BotonAtras color="#ffffff" />
      <section style={{color:"white",position:"relative", zIndex:999, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"end", width:"100%", height:(window.innerWidth < 650?"90":"80")+"vh", boxSizing:"border-box", textAlign:"center"}}>
            <h1 className='titulo-grande anim-entry' style={{margin:"0 5rem"}}>EXPLORA LAS 4 GALAXIAS DE SEGURIDAD EN LÍNEA</h1>
            <p className='quicksand text-responsive' style={{margin:(window.innerWidth < 420?"0rem 1rem 10rem 1rem":"5rem"), fontSize:"1.5rem",position:"relative", zIndex:999,color:"white", textAlign:"center", textShadow:"0 0 20px black"}}>Identifica los peligros y las áreas clave para proteger a tu hijo en el mundo digital</p>
        </section>
        <section style={{position:"relative", width:"100vw",display:"flex", flexDirection:"column",alignItems:"center",justifyContent:"center", gap:"65rem", marginTop:"35rem", zIndex:"999"}}>
        {gals?.gals?.map((g,i) => (
          <div className="galaxy-info texts-blacker" key={i} style={{position:"relative", width:"50%",marginLeft:(i%2==0?"auto":"0"),marginRight:(i%2==1?"auto":"0"),display:"flex", flexDirection:"column",alignItems:"center",justifyContent:"center", padding:"2rem 3rem", boxSizing:"border-box"}}>
            <h2 style={{position:"relative", color:"white", fontSize:"40px"}}>{g.nombre}</h2>
            <p style={{position:"relative", color:"white", fontSize:"28px"}}>{g.descripcion}</p>
            <button className="btn-galaxia" style={{backgroundColor:g.color, color:"white"}} onClick={() => onSeleccion(g.id,g.nombre,g.descripcion)}>¡Quiero saber más!</button>
          </div>
        ))}
      </section>
      <div ref={containerRef} />
    </>
  );
}