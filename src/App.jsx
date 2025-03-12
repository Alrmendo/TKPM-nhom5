import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PDP from './pages/PDP/PDP';
import Home from './pages/Home/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/" element={<PDP />} />
      </Routes>
    </Router>
  );
}

export default App;
