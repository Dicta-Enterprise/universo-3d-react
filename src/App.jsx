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
import Planeta1Comp from './pages/galaxias/SaludSocial/Planeta1Comp';
import Planeta2Com from './pages/galaxias/SaludSocial/Planeta2Com';
import Planeta3Emo from './pages/galaxias/SaludSocial/Planeta3Emo';
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
import Planeta1Man from './pages/galaxias/SaludFisica/Planeta1Man';
import Planeta2Lev from './pages/galaxias/SaludFisica/Planeta2Lev';
import Planeta3Ver from './pages/galaxias/SaludFisica/Planeta3Ver';
import Planeta4Bio from './pages/galaxias/SaludFisica/Planeta4Bio';
import Planeta5Add from './pages/galaxias/SaludFisica/Planeta5Add';
import Planeta6Ele from './pages/galaxias/SaludFisica/Planeta6Ele';
import Planeta7Mel from './pages/galaxias/SaludFisica/Planeta7Mel';
import Planeta8Aud from './pages/galaxias/SaludFisica/Planeta8Aud';
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

                <Route path="/ninos/salud_social/planeta_kio" element={<Planeta1Comp />} />
                <Route path="/ninos/salud_social/planeta_mer" element={<Planeta2Com />} />
                <Route path="/ninos/salud_social/planeta_ven" element={<Planeta3Emo />} />
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

                <Route path="/ninos/salud_fisica/planeta_man" element={<Planeta1Man />} />
                <Route path="/ninos/salud_fisica/planeta_lev" element={<Planeta2Lev />} />
                <Route path="/ninos/salud_fisica/planeta_ver" element={<Planeta3Ver />} />
                <Route path="/ninos/salud_fisica/planeta_bio" element={<Planeta4Bio />} />
                <Route path="/ninos/salud_fisica/planeta_add" element={<Planeta5Add />} />
                <Route path="/ninos/salud_fisica/planeta_ele" element={<Planeta6Ele />} />
                <Route path="/ninos/salud_fisica/planeta_mel" element={<Planeta7Mel />} />
                <Route path="/ninos/salud_fisica/planeta_aud" element={<Planeta8Aud />} />


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