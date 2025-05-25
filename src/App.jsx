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
import Planeta1Cons from './pages/galaxias/SaludMental/Planeta1Cons';
import Planeta2Ima from './pages/galaxias/SaludMental/Planeta2Ima';
import Planeta3Suf from './pages/galaxias/SaludMental/Planeta3Suf';
import Planeta4Cen from './pages/galaxias/SaludMental/Planeta4Cen';
import Planeta5Eue from './pages/galaxias/SaludMental/Planeta5Eue';
import Planeta6Pra from './pages/galaxias/SaludMental/Planeta6Pra';
import Planeta7Aes from './pages/galaxias/SaludMental/Planeta7Aes';
import Planeta8Ina from './pages/galaxias/SaludMental/Planeta8Ina';
import Planeta9Cer from './pages/galaxias/SaludMental/Planeta9Cer';
import Planeta10Mat from './pages/galaxias/SaludMental/Planeta10Mat';
import Planeta11Res from './pages/galaxias/SaludMental/Planeta11Res';
import Planeta12Abs from './pages/galaxias/SaludMental/Planeta12Abs';
import Planeta13Som from './pages/galaxias/SaludMental/Planeta13Som';
import Planeta14Act from './pages/galaxias/SaludMental/Planeta14Act';
import Planeta15Ali from './pages/galaxias/SaludMental/Planeta15Ali';
import Planeta1Man from './pages/galaxias/SaludFisica/Planeta1Man';
import Planeta2Lev from './pages/galaxias/SaludFisica/Planeta2Lev';
import Planeta3Ver from './pages/galaxias/SaludFisica/Planeta3Ver';
import Planeta4Bio from './pages/galaxias/SaludFisica/Planeta4Bio';
import Planeta5Add from './pages/galaxias/SaludFisica/Planeta5Add';
import Planeta6Ele from './pages/galaxias/SaludFisica/Planeta6Ele';
import Planeta7Mel from './pages/galaxias/SaludFisica/Planeta7Mel';
import Planeta8Aud from './pages/galaxias/SaludFisica/Planeta8Aud';
import Planeta1Kio from './pages/galaxias/PeligrosDigitales/Planeta1Kio';
import Planeta2 from './pages/galaxias/PeligrosDigitales/Planeta2';
import Planeta3 from './pages/galaxias/PeligrosDigitales/Planeta3';
import Planeta4 from './pages/galaxias/PeligrosDigitales/Planeta4';
import Planeta5 from './pages/galaxias/PeligrosDigitales/Planeta5';
import Planeta6Gra from './pages/galaxias/PeligrosDigitales/Planeta6Gra';
import Planeta7Sci from './pages/galaxias/PeligrosDigitales/Planeta7Sci';
import Planeta8Gau from './pages/galaxias/PeligrosDigitales/Planeta8Gau';
import Planeta9Pax from './pages/galaxias/PeligrosDigitales/Planeta9Pax';
import Planeta10Lib from './pages/galaxias/PeligrosDigitales/Planeta10Lib';
import Planeta11Rea from './pages/galaxias/PeligrosDigitales/Planeta11Rea';
import Planeta12Rep from './pages/galaxias/PeligrosDigitales/Planeta12Rep';
import Planeta13Pri from './pages/galaxias/PeligrosDigitales/Planeta13Pri';
import Planeta14Acc from './pages/galaxias/PeligrosDigitales/Planeta14Acc';
import Planeta15Tri from './pages/galaxias/PeligrosDigitales/Planeta15Tri';
import PlanetaKioPadresSS from './pages/galaxias/SaludSocialPadres/PlanetaKioPadresSS';
import PlanetaMerPadresSS from './pages/galaxias/SaludSocialPadres/PlanetaMerPadresSS';
import PlanetaVenPadresSS from './pages/galaxias/SaludSocialPadres/PlanetaVenPadresSS';
// Planeta Padres
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

                <Route path="/ninos/salud_social/planeta_comp" element={<Planeta1Comp />} />
                <Route path="/ninos/salud_social/planeta_com" element={<Planeta2Com />} />
                <Route path="/ninos/salud_social/planeta_emo" element={<Planeta3Emo />} />
                <Route path="/ninos/salud_social/planeta_amo" element={<Planeta4Amo />} />
                <Route path="/ninos/salud_social/planeta_sexu" element={<Planeta5Sexu />} />
                <Route path="/ninos/salud_social/planeta_for" element={<Planeta6For />} />
                <Route path="/ninos/salud_social/planeta_util" element={<Planeta7Util />} />
                <Route path="/ninos/salud_social/planeta_pro" element={<Planeta8Pro />} />
                <Route path="/ninos/salud_social/planeta_sen" element={<Planeta9Sen />} />
                <Route path="/ninos/salud_social/planeta_dir" element={<Planeta10Dir />} />
                <Route path="/ninos/salud_social/planeta_kri" element={<Planeta11Kri />} />
                <Route path="/ninos/salud_social/planeta_moy" element={<Planeta12Moy />} />

                <Route path="/ninos/salud_mental/planeta_cons" element={<Planeta1Cons />} />
                <Route path="/ninos/salud_mental/planeta_ima" element={<Planeta2Ima />} />
                <Route path="/ninos/salud_mental/planeta_suf" element={<Planeta3Suf />} />
                <Route path="/ninos/salud_mental/planeta_cen" element={<Planeta4Cen />} />
                <Route path="/ninos/salud_mental/planeta_eue" element={<Planeta5Eue />} />
                <Route path="/ninos/salud_mental/planeta_pra" element={<Planeta6Pra />} />
                <Route path="/ninos/salud_mental/planeta_aes" element={<Planeta7Aes />} />
                <Route path="/ninos/salud_mental/planeta_ina" element={<Planeta8Ina />} />
                <Route path="/ninos/salud_mental/planeta_cer" element={<Planeta9Cer />} />
                <Route path="/ninos/salud_mental/planeta_mat" element={<Planeta10Mat />} />
                <Route path="/ninos/salud_mental/planeta_res" element={<Planeta11Res />} />
                <Route path="/ninos/salud_mental/planeta_abs" element={<Planeta12Abs />} />
                <Route path="/ninos/salud_mental/planeta_som" element={<Planeta13Som />} />
                <Route path="/ninos/salud_mental/planeta_act" element={<Planeta14Act />} />
                <Route path="/ninos/salud_mental/planeta_ali" element={<Planeta15Ali />} />


                <Route path="/ninos/salud_fisica/planeta_man" element={<Planeta1Man />} />
                <Route path="/ninos/salud_fisica/planeta_lev" element={<Planeta2Lev />} />
                <Route path="/ninos/salud_fisica/planeta_ver" element={<Planeta3Ver />} />
                <Route path="/ninos/salud_fisica/planeta_bio" element={<Planeta4Bio />} />
                <Route path="/ninos/salud_fisica/planeta_add" element={<Planeta5Add />} />
                <Route path="/ninos/salud_fisica/planeta_ele" element={<Planeta6Ele />} />
                <Route path="/ninos/salud_fisica/planeta_mel" element={<Planeta7Mel />} />
                <Route path="/ninos/salud_fisica/planeta_aud" element={<Planeta8Aud />} />


                <Route path="/ninos/peligros_digitales/planeta_kio" element={<Planeta1Kio />} />
                <Route path="/ninos/peligros_digitales/planeta_2" element={<Planeta2 />} />
                <Route path="/ninos/peligros_digitales/planeta_3" element={<Planeta3 />} />
                <Route path="/ninos/peligros_digitales/planeta_4" element={<Planeta4 />} />
                <Route path="/ninos/peligros_digitales/planeta_5" element={<Planeta5 />} />
                <Route path="/ninos/peligros_digitales/planeta_gra" element={<Planeta6Gra />} />
                <Route path="/ninos/peligros_digitales/planeta_sci" element={<Planeta7Sci />} />
                <Route path="/ninos/peligros_digitales/planeta_gau" element={<Planeta8Gau />} />
                <Route path="/ninos/peligros_digitales/planeta_pax" element={<Planeta9Pax />} />
                <Route path="/ninos/peligros_digitales/planeta_lib" element={<Planeta10Lib />} />
                <Route path="/ninos/peligros_digitales/planeta_rea" element={<Planeta11Rea />} />
                <Route path="/ninos/peligros_digitales/planeta_rep" element={<Planeta12Rep />} />
                <Route path="/ninos/peligros_digitales/planeta_pri" element={<Planeta13Pri />} />
                <Route path="/ninos/peligros_digitales/planeta_acc" element={<Planeta14Acc />} />
                <Route path="/ninos/peligros_digitales/planeta_tri" element={<Planeta15Tri />} />



                {/* Rutas principales Planetas Jovenes  */}
                <Route path="/jovenes/salud_social/planeta_comp" element={<Planeta1Comp_jovenes/>} />|

                {/* Rutas principales Planetas Padres  */}
                {/* Salud_Social */}
                <Route path="/padres/salud_social/planeta_kio" element={<PlanetaKioPadresSS />} />
                <Route path="/padres/salud_social/planeta_mer" element={<PlanetaMerPadresSS />} />
                <Route path="/padres/salud_social/planeta_ven" element={<PlanetaVenPadresSS />} />
                <Route path="/padres/salud_social/planeta_companio" element={<PlanetaCompanio/>} />
                <Route path="/padres/salud_social/planeta_communi" element={<PlanetaCOMMUNIS/>} />
                <Route path="/padres/salud_social/planeta_emotion" element={<PlanetaEmotion/>} />
                <Route path="/padres/salud_social/planeta_amore" element={<PlanetaAmore/>} />
                <Route path="/padres/salud_social/planeta_sexus" element={<PlanetaSexus/>} />
                <Route path="/padres/salud_social/planeta_fors" element={<PlanetaFors/>} />
                <Route path="/padres/salud_social/planeta_utilus" element={<PlanetaUtilus/>} />
                <Route path="/padres/salud_social/planeta_propius" element={<PlanetaPropius/>} />
                <Route path="/padres/salud_social/planeta_sensus" element={<PlanetaSensus/>} />
                <Route path="/padres/salud_social/planeta_directus" element={<PlanetaDirectus/>} />
                <Route path="/padres/salud_social/planeta_kritikos" element={<PlanetaKritikos/>} />
                <Route path="/padres/salud_social/planeta_moysico" element={<PlanetaMoysico/>} />
                {/* Salud_Mental */}

                {/*  Fin de Rutas principales  Planetas Padres  */}



            </Routes>
        </Router>
    );
}

export default App;