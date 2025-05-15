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
import Planeta4Amo from './pages/galaxias/SaludSocial/Planeta4Amo';
import Planeta5Sexu from './pages/galaxias/SaludSocial/Planeta5Sexu';
import Planeta6For from './pages/galaxias/SaludSocial/Planeta6For';
import Planeta7Util from './pages/galaxias/SaludSocial/Planeta7Util';
import Planeta8Pro from './pages/galaxias/SaludSocial/Planeta8Pro';
import Planeta9Sen from './pages/galaxias/SaludSocial/Planeta9Sen';
import Planeta10Dir from './pages/galaxias/SaludSocial/Planeta10Dir';
import Planeta11Kri from './pages/galaxias/SaludSocial/Planeta11Kri';
import Planeta12Moy from './pages/galaxias/SaludSocial/Planeta12Moy';
import PlanetaKioSM from './pages/galaxias/SaludMental/PlanetaKioSM';
import PlanetaMerSM from './pages/galaxias/SaludMental/PlanetaMerSM';
import PlanetaVenSM from './pages/galaxias/SaludMental/PlanetaVenSM';
import PlanetaKioSF from './pages/galaxias/SaludFisica/PlanetaKioSF';
import PlanetaMerSF from './pages/galaxias/SaludFisica/PlanetaMerSF';
import PlanetaVenSF from './pages/galaxias/SaludFisica/PlanetaVenSF';
import PlanetaKioPD from './pages/galaxias/PeligrosDigitales/PlanetaKioPD';
import PlanetaMerPD from './pages/galaxias/PeligrosDigitales/PlanetaMerPD';
import PlanetaVenPD from './pages/galaxias/PeligrosDigitales/PlanetaVenPD';
import PlanetaKioPadresSS from './pages/galaxias/SaludSocialPadres/PlanetaKioPadresSS';
import PlanetaMerPadresSS from './pages/galaxias/SaludSocialPadres/PlanetaMerPadresSS';
import PlanetaVenPadresSS from './pages/galaxias/SaludSocialPadres/PlanetaVenPadresSS';

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
                <Route path="/ninos/salud_social/planeta_amo" element={<Planeta4Amo />} />
                <Route path="/ninos/salud_social/planeta_sexu" element={<Planeta5Sexu />} />
                <Route path="/ninos/salud_social/planeta_for" element={<Planeta6For />} />
                <Route path="/ninos/salud_social/planeta_util" element={<Planeta7Util />} />
                <Route path="/ninos/salud_social/planeta_pro" element={<Planeta8Pro />} />
                <Route path="/ninos/salud_social/planeta_sen" element={<Planeta9Sen />} />
                <Route path="/ninos/salud_social/planeta_dir" element={<Planeta10Dir />} />
                <Route path="/ninos/salud_social/planeta_kri" element={<Planeta11Kri />} />
                <Route path="/ninos/salud_social/planeta_moy" element={<Planeta12Moy />} />

                <Route path="/ninos/salud_mental/planeta_kio" element={<PlanetaKioSM />} />
                <Route path="/ninos/salud_mental/planeta_mer" element={<PlanetaMerSM />} />
                <Route path="/ninos/salud_mental/planeta_ven" element={<PlanetaVenSM />} />

                <Route path="/ninos/salud_fisica/planeta_kio" element={<PlanetaKioSF />} />
                <Route path="/ninos/salud_fisica/planeta_mer" element={<PlanetaMerSF />} />
                <Route path="/ninos/salud_fisica/planeta_ven" element={<PlanetaVenSF />} />

                <Route path="/ninos/peligros_digitales/planeta_kio" element={<PlanetaKioPD />} />
                <Route path="/ninos/peligros_digitales/planeta_mer" element={<PlanetaMerPD />} />
                <Route path="/ninos/peligros_digitales/planeta_ven" element={<PlanetaVenPD />} />






                <Route path="/padres/salud_social/planeta_kio" element={<PlanetaKioPadresSS />} />
                <Route path="/padres/salud_social/planeta_mer" element={<PlanetaMerPadresSS />} />
                <Route path="/padres/salud_social/planeta_ven" element={<PlanetaVenPadresSS />} />




            </Routes>
        </Router>
    );
}

export default App;