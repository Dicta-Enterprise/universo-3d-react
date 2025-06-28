// Ejemplo de AppRouter.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PadresRouter from "./pages/galaxias/Padres/PadresRouter";
// import NinosRouter from "./pages/galaxias/Ninos/NinosRouter"; // si tienes más galaxias

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/padres/*" element={<PadresRouter />} />
      {/* <Route path="/ninos/*" element={<NinosRouter />} /> */}
      <Route path="*" element={<div>Bienvenido al Universo 3D</div>} />
    </Routes>
  </Router>
);

export default AppRouter;