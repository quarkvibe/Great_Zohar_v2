import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRound, MapPin, Clock, Sparkles, Heart, Zap } from 'lucide-react';
import { useZohar } from '../context/ZoharContext';
import ProgressIndicator from './ProgressIndicator';

const ConsultationChamber: React.FC = () => {
  const navigate = useNavigate();
  const { userData, updateUserData, generateVision } = useZohar();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const psychometricQuestions = [
    "What draws your attention most often in your day-to-day life?",
    "How do you typically react when faced with unexpected changes?",
    "What lingering concern keeps you awake at night?"
  ];

  const domainOptions = [
    { value: 'general', label: 'General Life Path', icon: <Sparkles /> },
    { value: 'relationships', label: 'Relationships & Connections', icon: <Heart /> },
    { value: 'career', label: 'Career & Purpose', icon: <Zap /> },
    { value: 'personal', label: 'Personal Growth', icon: <UserRound /> }
  ];

  const timePeriodOptions = [
    { value: '1', label: '1 Year' },
    { value: '5', label: '5 Years' },
    { value: '10', label: '10 Years' }
  ];

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      await generateVision();
      navigate('/vision');
    } catch (error) {
      console.error('Error generating vision:', error);
      setIsProcessing(false);
    }
  };

  const updatePsychometricAnswer = (index: number, value: string) => {
    const newAnswers = [...userData.psychometricAnswers];
    newAnswers[index] = value;
    updateUserData({ psychometricAnswers: newAnswers });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black opacity-50"></div>
      
      <div className="w-full max-w-2xl z-10">
        <h1 className="text-3xl md:text-4xl font-enigma text-mystical-gold text-center mb-6">
          The Consultation Chamber
        </h1>
        
        <ProgressIndicator currentStep={currentStep} totalSteps={4} />
        
        <div className="bg-midnight-blue/50 backdrop-blur-md rounded-lg p-6 mt-6 shadow-glow border border-deep-purple">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 0 && (
              <div className="space-y-4 transition-all duration-500">
                <h2 className="text-2xl font-enigma text-carnival-red mb-4">Your Essence</h2>
                <p className="text-parchment/80 mb-6">
                  Share the foundation of your being with The Great Zohar.
                </p>
                
                <div className="space-y-4">
                  <div className="relative">
                    <label htmlFor="name" className="block text-parchment/80 mb-2 text-sm">
                      Your Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        value={userData.name}
                        onChange={(e) => updateUserData({ name: e.target.value })}
                        className="w-full bg-deep-purple/50 border border-midnight-blue/50 rounded-md p-3 pl-10 text-parchment focus:outline-none focus:ring-2 focus:ring-carnival-red/50"
                        required
                      />
                      <UserRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-carnival-red/70 w-5 h-5" />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label htmlFor="age" className="block text-parchment/80 mb-2 text-sm">
                      Your Age
                    </label>
                    <input
                      type="number"
                      id="age"
                      min="18"
                      max="120"
                      value={userData.age}
                      onChange={(e) => updateUserData({ age: e.target.value })}
                      className="w-full bg-deep-purple/50 border border-midnight-blue/50 rounded-md p-3 text-parchment focus:outline-none focus:ring-2 focus:ring-carnival-red/50"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <label htmlFor="location" className="block text-parchment/80 mb-2 text-sm">
                      Your Location
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="location"
                        value={userData.location}
                        onChange={(e) => updateUserData({ location: e.target.value })}
                        className="w-full bg-deep-purple/50 border border-midnight-blue/50 rounded-md p-3 pl-10 text-parchment focus:outline-none focus:ring-2 focus:ring-carnival-red/50"
                        required
                      />
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-carnival-red/70 w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Time Period and Domain */}
            {currentStep === 1 && (
              <div className="space-y-4 transition-all duration-500">
                <h2 className="text-2xl font-enigma text-carnival-red mb-4">Vision Parameters</h2>
                <p className="text-parchment/80 mb-6">
                  Direct The Great Zohar's gaze to the desired time and domain.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-parchment/80 mb-3 text-sm">
                      Time Horizon
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {timePeriodOptions.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          className={`flex items-center justify-center p-3 rounded-md transition-all ${
                            userData.timePeriod === option.value
                              ? 'bg-carnival-red/80 text-parchment'
                              : 'bg-deep-purple/50 text-parchment/70 hover:bg-deep-purple'
                          }`}
                          onClick={() => updateUserData({ timePeriod: option.value })}
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-parchment/80 mb-3 text-sm">
                      Life Domain
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {domainOptions.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          className={`flex items-center justify-center p-3 rounded-md transition-all ${
                            userData.lifeDomain === option.value
                              ? 'bg-carnival-red/80 text-parchment'
                              : 'bg-deep-purple/50 text-parchment/70 hover:bg-deep-purple'
                          }`}
                          onClick={() => updateUserData({ lifeDomain: option.value })}
                        >
                          <span className="mr-2">{option.icon}</span>
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Psychometric Questions */}
            {currentStep === 2 && (
              <div className="space-y-4 transition-all duration-500">
                <h2 className="text-2xl font-enigma text-carnival-red mb-4">Inner Revelations</h2>
                <p className="text-parchment/80 mb-6">
                  Allow The Great Zohar to glimpse the patterns of your soul.
                </p>
                
                <div className="space-y-6">
                  {psychometricQuestions.map((question, index) => (
                    <div key={index} className="space-y-2">
                      <label className="block text-parchment/80 text-sm">
                        {question}
                      </label>
                      <textarea
                        value={userData.psychometricAnswers[index]}
                        onChange={(e) => updatePsychometricAnswer(index, e.target.value)}
                        className="w-full bg-deep-purple/50 border border-midnight-blue/50 rounded-md p-3 text-parchment focus:outline-none focus:ring-2 focus:ring-carnival-red/50 min-h-[80px]"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Step 4: Destiny Seed */}
            {currentStep === 3 && (
              <div className="space-y-4 transition-all duration-500">
                <h2 className="text-2xl font-enigma text-carnival-red mb-4">Destiny Seed</h2>
                <p className="text-parchment/80 mb-6">
                  What concept represents what you most desire or fear? This will become the focal point of your vision.
                </p>
                
                <div className="space-y-4">
                  <textarea
                    value={userData.destinySeed}
                    onChange={(e) => updateUserData({ destinySeed: e.target.value })}
                    className="w-full bg-deep-purple/50 border border-midnight-blue/50 rounded-md p-3 text-parchment focus:outline-none focus:ring-2 focus:ring-carnival-red/50 min-h-[100px]"
                    placeholder="Freedom, Connection, Legacy, etc."
                    required
                  />
                </div>
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-5 py-2 bg-midnight-blue/80 rounded-md text-parchment/80 hover:bg-midnight-blue transition-colors"
                >
                  Previous
                </button>
              ) : (
                <div></div>
              )}
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-5 py-2 bg-carnival-red/80 rounded-md text-parchment hover:bg-carnival-red transition-colors"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`px-5 py-2 rounded-md text-parchment transition-colors ${
                    isProcessing 
                      ? 'bg-carnival-red/50 cursor-not-allowed' 
                      : 'bg-carnival-red/80 hover:bg-carnival-red'
                  }`}
                >
                  {isProcessing ? 'Consulting the Void...' : 'Weave My Destiny'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConsultationChamber;