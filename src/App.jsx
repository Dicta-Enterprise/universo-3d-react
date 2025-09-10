import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import GalaxiaPorCategoria from './pages/galaxias/GalaxiaEjemplo/componentes/GalaxiaPorCategoria';
import Ninoss from './pages/galaxias/GalaxiaEjemplo/GalaxiasNJP/Ninos';
import Joveness from './pages/galaxias/GalaxiaEjemplo/GalaxiasNJP/Jovenes';
import Padress from './pages/galaxias/GalaxiaEjemplo/GalaxiasNJP/Padres';

import Home from './pages/Home';
import Ninos from './pages/Ninos';
import Jovenes from './pages/Jovenes';
import Padres from './pages/Padres';
import SaludSocial from './pages/galaxias/SaludSocial';
import SaludMental from './pages/galaxias/SaludMental';
import SaludFisica from './pages/galaxias/SaludFisica';
import PeligrosDigitales from './pages/galaxias/PeligrosDigitales';
import SaludSocialJovenes from './pages/galaxias/SaludSocialJovenes';
import SaludMentalJovenes from './pages/galaxias/SaludMentalJovenes';
import SaludFisicaJovenes from './pages/galaxias/SaludFisicaJovenes';
import PeligrosDigitalesJovenes from './pages/galaxias/PeligrosDigitalesJovenes';
import SaludSocialPadres from './pages/galaxias/SaludSocialPadres';
import SaludMentalPadres from './pages/galaxias/SaludMentalPadres';
import SaludFisicaPadres from './pages/galaxias/SaludFisicaPadres';
import PeligrosDigitalesPadres from './pages/galaxias/PeligrosDigitalesPadres';

//import PlanetaKioPadresSS from './pages/galaxias/SaludSocialPadres/PlanetaKioPadresSS';
//import PlanetaMerPadresSS from './pages/galaxias/SaludSocialPadres/PlanetaMerPadresSS';
//import PlanetaVenPadresSS from './pages/galaxias/SaludSocialPadres/PlanetaVenPadresSS';
// Planeta Padres

/*
import PlanetaCompanio from './pages/galaxias/SaludSocialPadres/Planeta-1';
import PlanetaCOMMUNIS from './pages/galaxias/SaludSocialPadres/Planeta-2';
import PlanetaEmotion from './pages/galaxias/SaludSocialPadres/Planeta-3'; 
import PlanetaAmore from './pages/galaxias/SaludSocialPadres/Planeta-4';
import PlanetaSexus from './pages/galaxias/SaludSocialPadres/Planeta-5';
import PlanetaFors from './pages/galaxias/SaludSocialPadres/Planeta-6';
import PlanetaUtilus from './pages/galaxias/SaludSocialPadres/Planeta-7';
import PlanetaPropius from './pages/galaxias/SaludSocialPadres/Planeta-8';
import PlanetaSensus from './pages/galaxias/SaludSocialPadres/Planeta-9';
import PlanetaDirectus from './pages/galaxias/SaludSocialPadres/Planeta-10';
import PlanetaKritikos from './pages/galaxias/SaludSocialPadres/Planeta-11';
import PlanetaMoysico from './pages/galaxias/SaludSocialPadres/Planeta-12';
import Planeta1Comp_jovenes from './pages/galaxias/SaludSocialJovenes/Planeta1Comp';
//Fin Planeta Padres

*/

import Planeta from './pages/planeta';
import RotatingPlanet from './components/LadingPageBORRAR/RotatingPlanet';

function App() {
    return (
        <Router>

                <Routes>

                <Route path="/prueba" element={<RotatingPlanet />} />
                <Route path="/planeta/:id" element={<Planeta />} />

                <Route path="/galaxia/ninos" element={<Ninoss />} />
                <Route path="/galaxia/jovenes" element={<Joveness />} />
                <Route path="/galaxia/padres" element={<Padress />} />
                {/* Rutas temáticas por grupo */}
                <Route path="/galaxia/:grupo/:tema" element={<GalaxiaPorCategoria />} />

                <Route path="/" element={<Home />} />
                <Route path="/ninos" element={<Ninos />} />
                <Route path="/jovenes" element={<Jovenes />} />
                <Route path="/padres" element={<Padres />} />
                <Route path="/ninos/salud_social" element={<SaludSocial />} />
                <Route path="/ninos/salud_mental" element={<SaludMental />} />
                <Route path="/ninos/salud_fisica" element={<SaludFisica />} />
                <Route path="/jovenes/salud_social" element={<SaludSocialJovenes />} />
                <Route path="/jovenes/salud_mental" element={<SaludMentalJovenes />} />
                <Route path="/jovenes/salud_fisica" element={<SaludFisicaJovenes />} />
                <Route path="/jovenes/peligros_digitales" element={<PeligrosDigitalesJovenes />} />
                <Route path="/padres/salud_social" element={<SaludSocialPadres />} />
                <Route path="/padres/salud_mental" element={<SaludMentalPadres />} />
                <Route path="/padres/salud_fisica" element={<SaludFisicaPadres />} />
                <Route path="/padres/peligros_digitales" element={<PeligrosDigitalesPadres />} />
                <Route path="/ninos/peligros_digitales" element={<PeligrosDigitales />} />

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