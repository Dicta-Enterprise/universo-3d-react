import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import BackButton from '../components/BackButton';
import ThreeScene from '../components/Landing/ThreeScene';
import MainContent from '../components/Landing/MainContent';
import ResizeHandler from '../components/Landing/ResizeHandler';

const BACKEND_URL = import.meta.env.VITE_BACKEND_NEST_API_URL;

export default function Planeta() {
    const { id } = useParams();

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showCarousel, setShowCarousel] = useState(false);

    const [planeta, setPlaneta] = useState();
    const [planetaLoaded, setPlanetaLoaded] = useState(false);
    const [textures, setTextures] = useState([]);
    const [planetUrls, setPlanetUrls] = useState([]);
    
    function cargarTexturasYUrls(galaxiaID,plt){

        const planetas_galaxia = fetch(BACKEND_URL+"planetas?galaxiaId="+galaxiaID)//peticion al back
        const dataPromesa = planetas_galaxia.then(res => res.json())
        dataPromesa.then(plans => {
            
            if(!plans.data.isSuccess){//en caso de error del backend o mala peticion
                
                return;
            }
            plans.data._value.map(planeta_ => {

                if(plt == undefined || planeta_ == undefined) return;
                console.log("planeta_")
                console.log(planeta_)
                var repetido = false;
                planetUrls.map(url => {
                    console.log("comparando")
                    console.log(url)
                    console.log("/planeta/"+planeta_.id)
                    if(url == "/planeta/"+planeta_.id) repetido = true;
                })
                if(plt.id != planeta_.id && !repetido){//no agrego la textura y url del planeta seleccionado porque ya se agregó antes
                    setTextures(prev => [...prev, planeta_.textura])
                    setPlanetUrls(prev => [...prev, "/planeta/"+planeta_.id])
                    console.log("-----count------------")
                    console.log(planeta_.id)

                }
                
            })
            
        })
    }

    const handleComprarClick = () => {
        console.log("Botón Comprar clickeado");
    };

    useEffect(() => {
        console.log("sdasdasdas")

        const promesaPeticion = fetch(BACKEND_URL+"planetas/"+id)//peticion al back para el planeta actual
        const dataPromesa = promesaPeticion.then(res => res.json())
        dataPromesa.then(plan => {
            
            if(!plan.data.isSuccess){//en caso de error del backend o mala peticion
                
                return;
            }
            console.log("planetaaaa")
            console.log(plan.data._value)
            setPlaneta(plan.data._value)
            setPlanetaLoaded(true);
            cargarTexturasYUrls(plan.data._value.galaxiaId,plan.data._value)
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
                        {planetUrls.length == 0?planetUrls[0] = "/planeta/"+planeta.id:""/* En un principio esto cargará sin urls, por lo que le agrego la url del planeta actual */}
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