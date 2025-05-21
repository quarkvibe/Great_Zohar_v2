import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useZohar } from '../context/ZoharContext';
import { Award, Share2, BookmarkPlus, Sparkles } from 'lucide-react';

const VisionReveal: React.FC = () => {
  const navigate = useNavigate();
  const { currentVision, saveVision } = useZohar();
  const [showBranching, setShowBranching] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [displayedText, setDisplayedText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  
  const mainVisionText = currentVision?.mainVision || '';
  const branchingVisionText = currentVision?.branchingVision || '';
  const typingSpeed = 20; // ms per character
  
  const visionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // If no vision exists, redirect to consultation
    if (!currentVision) {
      navigate('/consultation');
      return;
    }
    
    // Start the typewriter effect for the main vision
    if (showBranching) {
      setDisplayedText(branchingVisionText);
      setIsTyping(false);
    } else {
      setIsTyping(true);
      setCurrentTextIndex(0);
      setDisplayedText('');
    }
  }, [currentVision, navigate, showBranching, branchingVisionText]);
  
  useEffect(() => {
    if (!isTyping || !mainVisionText || showBranching) return;
    
    // Typewriter effect
    const timer = setTimeout(() => {
      if (currentTextIndex < mainVisionText.length) {
        setDisplayedText(prev => prev + mainVisionText[currentTextIndex]);
        setCurrentTextIndex(prev => prev + 1);
      } else {
        setIsTyping(false);
      }
    }, typingSpeed);
    
    return () => clearTimeout(timer);
  }, [currentTextIndex, isTyping, mainVisionText, showBranching]);
  
  const handleSaveVision = () => {
    if (currentVision && !isSaved) {
      saveVision(currentVision);
      setIsSaved(true);
      
      // Show confirmation briefly
      setTimeout(() => setIsSaved(false), 2000);
    }
  };
  
  const handleShareVision = () => {
    setShowShareTooltip(true);
    
    // Simulate copy to clipboard
    navigator.clipboard.writeText(
      `Future Vision from The Great Zohar: ${mainVisionText.substring(0, 100)}... Visit to get your own vision!`
    ).catch(err => console.error('Failed to copy text: ', err));
    
    // Hide tooltip after delay
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  const toggleVisionView = () => {
    setShowBranching(!showBranching);
  };
  
  // Format text with paragraph breaks
  const formattedText = displayedText.split('\n\n').map((paragraph, index) => (
    <p key={index} className="mb-4">{paragraph}</p>
  ));
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 pt-16 md:p-10 relative overflow-hidden">
      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black opacity-70"></div>
      
      <div className="w-full max-w-3xl z-10">
        <header className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="h-[1px] bg-carnival-red/50 w-16"></div>
            <h1 className="text-3xl md:text-4xl font-enigma text-mystical-gold px-4">
              {showBranching ? 'Alternate Path' : 'The Vision'}
            </h1>
            <div className="h-[1px] bg-carnival-red/50 w-16"></div>
          </div>
          
          {currentVision && (
            <p className="text-parchment/70 italic">
              For {currentVision.userData.name}, {currentVision.userData.timePeriod} years hence
            </p>
          )}
        </header>
        
        <div 
          ref={visionRef}
          className="bg-midnight-blue/30 backdrop-blur-md rounded-lg p-6 md:p-8 shadow-glow border border-deep-purple mb-6 min-h-[40vh] relative"
        >
          {/* Subtle floating sparks */}
          <div className="absolute top-0 right-0 p-4 opacity-30">
            <Sparkles className="w-6 h-6 text-mystical-gold animate-pulse" />
          </div>
          <div className="absolute bottom-0 left-0 p-4 opacity-30">
            <Sparkles className="w-4 h-4 text-mystical-gold animate-float" />
          </div>
          
          {/* Vision text */}
          <div className="font-prophecy text-parchment text-lg leading-relaxed">
            {formattedText}
            {isTyping && <span className="cursor inline-block w-2 h-5 bg-carnival-red ml-1 animate-blink"></span>}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={toggleVisionView}
            className="flex items-center px-5 py-3 rounded-md bg-deep-purple hover:bg-deep-purple/80 text-parchment transition-colors"
          >
            <Award className="w-5 h-5 mr-2" />
            {showBranching ? 'View Original Path' : 'View Alternate Path'}
          </button>
          
          <button
            onClick={handleSaveVision}
            className={`flex items-center px-5 py-3 rounded-md text-parchment transition-colors ${
              isSaved ? 'bg-mystical-gold' : 'bg-midnight-blue hover:bg-midnight-blue/80'
            }`}
          >
            <BookmarkPlus className="w-5 h-5 mr-2" />
            {isSaved ? 'Vision Saved!' : 'Save Vision'}
          </button>
          
          <div className="relative">
            <button
              onClick={handleShareVision}
              className="flex items-center px-5 py-3 rounded-md bg-carnival-red/80 hover:bg-carnival-red text-parchment transition-colors"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Vision
            </button>
            
            {showShareTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-mystical-gold text-midnight-blue text-sm rounded whitespace-nowrap">
                Copied to clipboard!
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/consultation')}
            className="text-parchment/70 hover:text-carnival-red transition-colors text-sm underline"
          >
            Return to the Consultation Chamber
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisionReveal;