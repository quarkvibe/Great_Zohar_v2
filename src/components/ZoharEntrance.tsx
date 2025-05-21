import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Eye, Italic as Crystal } from 'lucide-react';
import BackgroundParticles from './BackgroundParticles';

const ZoharEntrance: React.FC = () => {
  const navigate = useNavigate();
  const [isRevealed, setIsRevealed] = useState(false);
  
  useEffect(() => {
    // Dramatic reveal effect
    setTimeout(() => setIsRevealed(true), 800);
  }, []);

  const handleEnter = () => {
    navigate('/consultation');
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <BackgroundParticles />
      
      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black opacity-70"></div>
      
      <div className={`relative z-10 flex flex-col items-center max-w-3xl px-6 py-12 transition-all duration-1000 ${
        isRevealed ? 'opacity-100 transform-none' : 'opacity-0 translate-y-10'
      }`}>
        <Crystal 
          className="mb-6 text-mystical-gold w-16 h-16 animate-float" 
          strokeWidth={1.5} 
        />
        
        <h1 className="mb-4 text-5xl md:text-7xl text-center font-enigma text-mystical-gold tracking-wider">
          The Great Zohar
        </h1>
        
        <h2 className="mb-8 text-xl md:text-2xl text-center font-prophecy italic text-parchment opacity-80">
          Destiny Weaver of the Dark Carnival
        </h2>
        
        <p className="mb-10 text-lg text-center leading-relaxed max-w-2xl">
          Enter the mystic realm where futures are unraveled and destinies revealed. 
          The Great Zohar awaits to weave a vision of your potential paths, 
          illuminating what might be and what could come to pass.
        </p>
        
        <button 
          onClick={handleEnter}
          className="group relative flex items-center px-10 py-4 rounded-full bg-carnival-red text-parchment font-enigma text-xl tracking-wider overflow-hidden transition-all hover:shadow-glow"
        >
          <span className="relative z-10 flex items-center space-x-2">
            <span>Enter the Consultation Chamber</span>
            <Eye className="w-5 h-5 ml-2 transition-transform group-hover:scale-110" />
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-carnival-red to-mystical-gold opacity-0 group-hover:opacity-80 transition-opacity duration-500"></span>
        </button>
        
        <div className="mt-12 flex items-center">
          <Sparkles className="w-4 h-4 text-mystical-gold animate-pulse" />
          <p className="mx-2 text-sm opacity-70 italic">Destinies revealed, futures unfurled</p>
          <Sparkles className="w-4 h-4 text-mystical-gold animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ZoharEntrance;