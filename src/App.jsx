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
            </Routes>
        </Router>
    );
}

export default App;