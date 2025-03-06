import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PCP from './pages/PCP/PCP';
import PDP from './pages/PDP/PDP';
import Home from './pages/Home/Home';
import Wedding from './pages/PCP/vessels';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Wedding />} />
        <Route path="/" element={<Home />} />
        <Route path="/pdp" element={<PDP />} />
        <Route path="/pcp" element={<PCP />} />
      </Routes>
    </Router>
  );
}

export default App;
