import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Ninos from './pages/Ninos';
import Jovenes from './pages/Galaxia';
import Padres from './pages/Padres';
import SaludSocial from './pages/galaxias/SaludSocial';
import SaludMental from './pages/galaxias/SaludMental';
import SaludFisica from './pages/galaxias/SaludFisica';
import PeligrosDigitales from './pages/galaxias/PeligrosDigitales';

import PlanetaKio from './pages/galaxias/SaludSocial/PlanetaKio';
import PlanetaMer from './pages/galaxias/SaludSocial/PlanetaMer';
import PlanetaVen from './pages/galaxias/SaludSocial/PlanetaVen';

import Carrito from './pages/Carrito';

//import Carrito from './pages/Pagos.html';

//import Comprar from './pages/galaxias/SaludSocial/compra.html';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ninos" element={<Ninos />} />
                <Route path="/jovenes" element={<Jovenes />} />
                <Route path="/padres" element={<Padres />} />
                <Route path="/ninos/salud_social" element={<SaludSocial />} />
                <Route path="/ninos/salud_mental" element={<SaludMental />} />
                <Route path="/ninos/salud_fisica" element={<SaludFisica />} />
                <Route path="/ninos/peligros_digitales" element={<PeligrosDigitales />} />

                <Route path="/ninos/salud_social/planeta_kio" element={<PlanetaKio />} />
                <Route path="/ninos/salud_social/planeta_mer" element={<PlanetaMer />} />
                <Route path="/ninos/salud_social/planeta_ven" element={<PlanetaVen />} />

                <Route path="/carrito" element={<Carrito />} />



            </Routes>
        </Router>
    );
}

export default App;