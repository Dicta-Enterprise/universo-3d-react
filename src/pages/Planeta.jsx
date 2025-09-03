import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import BackButton from '../components/BackButton';
import ThreeScene from '../components/Landing/ThreeScene';
import MainContent from '../components/Landing/MainContent';
import ResizeHandler from '../components/Landing/ResizeHandler';

export default function Planeta() {
    const { id } = useParams();

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showCarousel, setShowCarousel] = useState(false);

    const [planeta, setPlaneta] = useState();
    const [planetaLoaded, setPlanetaLoaded] = useState(false);
    const [textures, setTextures] = useState([]);
    const [planetUrls, setPlanetUrls] = useState([]);
    
    /*texturas...
        '/assets/2k_makemake_fictional.jpg',
        '/assets/2k_haumea_fictional.jpg',
        '/assets/earthx5400x2700.jpg',
        '/assets/2k_neptune.jpg',
        '/assets/2k_venus_surface.jpg',
        '/assets/2k_uranus.jpg',
        '/assets/2k_venus_atmosphere.jpg',
        '/assets/2k_earth_clouds.jpg',
        '/assets/2k_jupiter.jpg',
        '/assets/2k_mars.jpg',
        '/assets/textura blanco.jpg',
        '/assets/textura negro.jpg',
    */
   // URLs de los planetas
   
    /*planetUrls...
        '/ninos/salud_social/planeta_comp',
        '/ninos/salud_social/planeta_com',
        '/ninos/salud_social/planeta_emo',
        '/ninos/salud_social/planeta_amo',
        '/ninos/salud_social/planeta_sexu',
        '/ninos/salud_social/planeta_for',
        '/ninos/salud_social/planeta_util',
        '/ninos/salud_social/planeta_pro',
        '/ninos/salud_social/planeta_sen',
        '/ninos/salud_social/planeta_dir',
        '/ninos/salud_social/planeta_kri',
        '/ninos/salud_social/planeta_moy',
    */
    function cargarTexturasYUrls(galaxiaID){
        console.log("id galaxia: "+galaxiaID)

        const planetas_galaxia = fetch("http://localhost:5000/api/planetas?galaxiaId="+galaxiaID)//peticion al back
        const dataPromesa = planetas_galaxia.then(res => res.json())
        dataPromesa.then(plans => {
            
            if(!plans.data.isSuccess){//en caso de error del backend o mala peticion
                
                return;
            }
            console.log("planetas de esta galaxia txt")
            console.log(plans.data._value[0].planetaNombre)
            console.log(plans.data._value[1].planetaNombre)
            plans.data._value.map(planeta_ => {
                if(planeta == undefined || planeta_ == undefined) return;
                if(planeta.textura != planeta_.textura){//no agrego la textura y url del planeta seleccionado porque ya se agregó antes
                    setTextures(prev => [...prev, planeta_.textura])
                    setPlanetUrls(prev => [...prev, planeta_.url])
                }
                
            })
            
        })
    }

    const handleComprarClick = () => {
        console.log("Botón Comprar clickeado");
    };

    useEffect(() => {
        console.log("sdasdasdas")

        const promesaPeticion = fetch("http://localhost:5000/api/planetas/"+id)//peticion al back para el planeta actual
        const dataPromesa = promesaPeticion.then(res => res.json())
        dataPromesa.then(plan => {
            
            if(!plan.data.isSuccess){//en caso de error del backend o mala peticion
                
                return;
            }
            console.log("planetaaaa")
            console.log(plan.data._value)
            setPlaneta(plan.data._value)
            setPlanetaLoaded(true);
            cargarTexturasYUrls(plan.data._value.galaxiaId)
        })

        document.body.style.overflow = 'hidden';
        document.body.style.margin = '0';
        document.body.style.padding = '0';

        return () => {
            document.body.style.overflow = '';
            document.body.style.margin = '';
            document.body.style.padding = '';
        };
    }, [])
    

    return(
        <>
            {/*si e planeta ya cargó...*/planetaLoaded && 
                (
                    /*Si es para niños... */
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        minHeight: '100vh',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                    }}>
                        {textures.length == 0?textures[0] = planeta.textura:""/* En un principio esto cargará sin texturas, por lo que le agrego la textura del planeta actual */}
                        {planetUrls.length == 0?planetUrls[0] = planeta.url:""/* En un principio esto cargará sin urls, por lo que le agrego la url del planeta actual */}
                        <BackButton color="#FFFFFF" redirectUrl="/ninos/salud_social" background= {'none'}/>
                        <ThreeScene textures={textures} planetUrls={planetUrls} showCarousel={showCarousel} />
                        <MainContent
                            isMobile={isMobile}
                            onComprarClick={handleComprarClick}
                            planetaNombre={planeta.planetaNombre}
                            resumenCurso={planeta.resumenCurso}
                            beneficios={planeta.beneficios}
                            peligros={planeta.peligros}
                            imagenResumen={planeta.imagenResumen}
                            imagenBeneficios={planeta.imagenBeneficios}
                            setShowCarousel={setShowCarousel}
                        />
                        <ResizeHandler setIsMobile={setIsMobile} />
                    </div>
                )
            }
        </>
    )
}