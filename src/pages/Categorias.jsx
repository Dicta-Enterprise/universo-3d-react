import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchGalaxiasDeCategoria } from "../data/galaxias";
import { fetchCategoria } from "../data/categorias";
import Ninos from '../pages/galaxias/GalaxiaEjemplo/GalaxiasNJP/Ninos'
import Jovenes from '../pages/galaxias/GalaxiaEjemplo/GalaxiasNJP/Jovenes'
import Padres from '../pages/galaxias/GalaxiaEjemplo/GalaxiasNJP/Padres'

function Categorias() {
  const { id } = useParams();

  const [galaxias, setGalaxias] = useState([])
  const [categoria, setCategoria] = useState()

  useEffect(() => {
    fetchGalaxiasDeCategoria(id).then((res) => {
      console.log("resultado");
      console.log(res);
      //setColor(res.color)
      setGalaxias(res)
        fetchCategoria(res[0].categoriaId).then(resCat => {
            setCategoria(resCat)
        })

    });
  }, []);

  if(categoria){
    switch(categoria.nombre){
        case "Niños":
            return <Ninos gals={galaxias}></Ninos>
        case "Jovenes":
            return <Jovenes gals={galaxias}></Jovenes>
        case "Padres":
            return <Padres gals={galaxias}></Padres>
        default:
            return <Jovenes gals={galaxias}></Jovenes>

      }
  }

  return <div>Categorias</div>;
}

export default Categorias;
