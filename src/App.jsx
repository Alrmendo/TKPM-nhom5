import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PDP from './pages/PDP/PDP';
import Home from './pages/Home/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PDP />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
