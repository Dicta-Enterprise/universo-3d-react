import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import GalaxiaPorCategoria from './pages/galaxias/GalaxiaEjemplo/componentes/GalaxiaPorCategoria';
import Ninoss from './pages/galaxias/GalaxiaEjemplo/GalaxiasNJP/Ninos';
import Joveness from './pages/galaxias/GalaxiaEjemplo/GalaxiasNJP/Jovenes';
import Padress from './pages/galaxias/GalaxiaEjemplo/GalaxiasNJP/Padres';

import Home from './pages/Home';


import Planeta from './pages/planeta';

function App() {
    return (
        <Router>

                <Routes>

                <Route path="/planeta/:id" element={<Planeta />} />

                <Route path="/galaxia/ninos" element={<Ninoss />} />
                <Route path="/galaxia/jovenes" element={<Joveness />} />
                <Route path="/galaxia/padres" element={<Padress />} />
                {/* Rutas temáticas por grupo */}
                <Route path="/galaxia/:grupo/:tema" element={<GalaxiaPorCategoria />} />

                <Route path="/" element={<Home />} />
                

                {/* Rutas principales Planetas Jovenes  */}

                {/* Rutas principales Planetas Padres  */}
                {/* Salud_Social */}


                {/* Salud_Mental */}

                {/*  Fin de Rutas principales  Planetas Padres  */}



            </Routes>
        </Router>
    );
}

export default App;