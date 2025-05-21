import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useZohar } from '../context/ZoharContext';
import { Calendar, Clock, User, MapPin, ArrowLeft } from 'lucide-react';

type SavedVision = {
  id: string;
  date: Date;
  mainVision: string;
  branchingVision: string;
  userData: {
    name: string;
    age: string;
    location: string;
    timePeriod: string;
    lifeDomain: string;
  };
};

const SavedVisions: React.FC = () => {
  const navigate = useNavigate();
  const { savedVisions, setCurrentVision } = useZohar();
  const [localVisions, setLocalVisions] = useState<SavedVision[]>([]);
  
  useEffect(() => {
    // Try to get visions from localStorage as well
    try {
      const storedVisions = localStorage.getItem('savedVisions');
      if (storedVisions) {
        const parsedVisions = JSON.parse(storedVisions);
        // Convert string dates back to Date objects
        const formattedVisions = parsedVisions.map((vision: any) => ({
          ...vision,
          date: new Date(vision.date)
        }));
        setLocalVisions(formattedVisions);
      } else {
        setLocalVisions(savedVisions);
      }
    } catch (error) {
      console.error('Error loading saved visions:', error);
      setLocalVisions(savedVisions);
    }
  }, [savedVisions]);
  
  const viewVision = (vision: SavedVision) => {
    setCurrentVision(vision);
    navigate('/vision');
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Get preview of vision text
  const getVisionPreview = (text: string, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 relative">
      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black opacity-70"></div>
      
      <div className="w-full max-w-4xl z-10">
        <header className="mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-parchment/70 hover:text-carnival-red transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Return to Entrance
          </button>
          
          <h1 className="text-3xl md:text-4xl font-enigma text-mystical-gold">
            Your Archived Destinies
          </h1>
          <p className="text-parchment/70 mt-2">
            Review the paths Zohar has revealed to you.
          </p>
        </header>
        
        {localVisions.length === 0 ? (
          <div className="bg-midnight-blue/30 backdrop-blur-md rounded-lg p-8 text-center">
            <p className="text-parchment/80 text-lg">
              You have no saved visions yet.
            </p>
            <button 
              onClick={() => navigate('/consultation')}
              className="mt-4 px-5 py-3 bg-carnival-red/80 rounded-md text-parchment hover:bg-carnival-red transition-colors"
            >
              Consult The Great Zohar
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {localVisions.map(vision => (
              <div 
                key={vision.id}
                className="bg-midnight-blue/30 backdrop-blur-md rounded-lg border border-deep-purple/50 overflow-hidden transition-all hover:shadow-glow hover:border-carnival-red/30 cursor-pointer"
                onClick={() => viewVision(vision)}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-carnival-red/80 mr-2" />
                      <span className="text-parchment/70 text-sm">
                        {formatDate(vision.date)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-carnival-red/80 mr-1" />
                      <span className="text-parchment/70 text-sm">
                        {vision.userData.timePeriod} years
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <User className="w-4 h-4 text-mystical-gold/80 mr-2" />
                    <span className="text-parchment font-medium">{vision.userData.name}</span>
                    <span className="mx-2 text-parchment/30">•</span>
                    <MapPin className="w-4 h-4 text-mystical-gold/80 mr-1" />
                    <span className="text-parchment/80 text-sm">{vision.userData.location}</span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-carnival-red text-xs mb-1">VISION GLIMPSE</div>
                    <p className="text-parchment/90 italic">
                      {getVisionPreview(vision.mainVision)}
                    </p>
                  </div>
                  
                  <button className="w-full mt-2 py-2 bg-deep-purple/50 hover:bg-deep-purple rounded text-parchment/80 text-sm transition-colors">
                    View Complete Vision
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedVisions;