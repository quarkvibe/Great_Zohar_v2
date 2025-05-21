import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ZoharEntrance from './components/ZoharEntrance';
import ConsultationChamber from './components/ConsultationChamber';
import VisionReveal from './components/VisionReveal';
import SavedVisions from './components/SavedVisions';
import { ZoharProvider } from './context/ZoharContext';

function App() {
  return (
    <ZoharProvider>
      <Router>
        <div className="min-h-screen bg-deep-purple text-parchment font-prophecy">
          <Routes>
            <Route path="/" element={<ZoharEntrance />} />
            <Route path="/consultation" element={<ConsultationChamber />} />
            <Route path="/vision" element={<VisionReveal />} />
            <Route path="/saved-visions" element={<SavedVisions />} />
          </Routes>
        </div>
      </Router>
    </ZoharProvider>
  );
}

export default App;