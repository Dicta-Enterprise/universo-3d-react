import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import PlanetaKio from './pages/galaxias/SaludSocial/PlanetaKio';
import PlanetaMer from './pages/galaxias/SaludSocial/PlanetaMer';
import PlanetaVen from './pages/galaxias/SaludSocial/PlanetaVen';
import PlanetaKioSM from './pages/galaxias/SaludMental/PlanetaKioSM';
import PlanetaMerSM from './pages/galaxias/SaludMental/PlanetaMerSM';
import PlanetaVenSM from './pages/galaxias/SaludMental/PlanetaVenSM';
import PlanetaKioSF from './pages/galaxias/SaludFisica/PlanetaKioSF';
import PlanetaMerSF from './pages/galaxias/SaludFisica/PlanetaMerSF';
import PlanetaVenSF from './pages/galaxias/SaludFisica/PlanetaVenSF';
import PlanetaKioPD from './pages/galaxias/PeligrosDigitales/PlanetaKioPD';
import PlanetaMerPD from './pages/galaxias/PeligrosDigitales/PlanetaMerPD';
import PlanetaVenPD from './pages/galaxias/PeligrosDigitales/PlanetaVenPD';


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
                <Route path="/jovenes/salud_social" element={<SaludSocialJovenes />} />
                <Route path="/jovenes/salud_mental" element={<SaludMentalJovenes />} />
                <Route path="/jovenes/salud_fisica" element={<SaludFisicaJovenes />} />
                <Route path="/jovenes/peligros_digitales" element={<PeligrosDigitalesJovenes />} />
                <Route path="/padres/salud_social" element={<SaludSocialPadres />} />
                <Route path="/padres/salud_mental" element={<SaludMentalPadres />} />
                <Route path="/padres/salud_fisica" element={<SaludFisicaPadres />} />
                <Route path="/padres/peligros_digitales" element={<PeligrosDigitalesPadres />} />
                <Route path="/ninos/peligros_digitales" element={<PeligrosDigitales />} />

                <Route path="/ninos/salud_social/planeta_kio" element={<PlanetaKio />} />
                <Route path="/ninos/salud_social/planeta_mer" element={<PlanetaMer />} />
                <Route path="/ninos/salud_social/planeta_ven" element={<PlanetaVen />} />

                <Route path="/ninos/salud_mental/planeta_kio" element={<PlanetaKioSM />} />
                <Route path="/ninos/salud_mental/planeta_mer" element={<PlanetaMerSM />} />
                <Route path="/ninos/salud_mental/planeta_ven" element={<PlanetaVenSM />} />

                <Route path="/ninos/salud_fisica/planeta_kio" element={<PlanetaKioSF />} />
                <Route path="/ninos/salud_fisica/planeta_mer" element={<PlanetaMerSF />} />
                <Route path="/ninos/salud_fisica/planeta_ven" element={<PlanetaVenSF />} />

                <Route path="/ninos/peligros_digitales/planeta_kio" element={<PlanetaKioPD />} />
                <Route path="/ninos/peligros_digitales/planeta_mer" element={<PlanetaMerPD />} />
                <Route path="/ninos/peligros_digitales/planeta_ven" element={<PlanetaVenPD />} />

                          



            </Routes>
        </Router>
    );
}

export default App;