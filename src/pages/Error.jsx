import React from 'react'
import ThreeSceneBG from './galaxias/GalaxiaEjemplo/componentes/ThreeSceneBG'
import { useParams } from 'react-router-dom'

function Error() {
  const { msg } = useParams();

  return (
    <div style={{width:"100vw", height:"100vh", backgroundColor:"black", overflow:"hidden", position:"fixed", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
        <ThreeSceneBG textures={["/assets/caution-txt2.jpg"]}></ThreeSceneBG>
        <h2 style={{ textAlign: "center", color:"white" }} className='overlay-huge-title z-mid'>Página en mantenimiento</h2>
        {msg && <p className='texto-main z-mid quicksand' style={{color:"white", textShadow:"0 5px 100px 10px black", textAlign:"center"}}>{msg.replace("-"," ")}</p>}
        <p className='texto-main z-mid quicksand' style={{color:"white", textShadow:"0 5px 100px 10px black"}}>Por favor vuelva a la <a href='/' style={{color:"white", textDecoration:"underline", cursor:"pointer"}}>página principal</a></p>
    </div>
  )
}

export default Error