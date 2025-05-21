import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="w-full flex items-center justify-between px-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          {/* Step indicator */}
          <div className="flex flex-col items-center">
            <div 
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                index <= currentStep 
                  ? 'bg-carnival-red' 
                  : 'bg-midnight-blue border border-carnival-red/30'
              }`}
            >
              {index < currentStep ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-parchment" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className={`text-xs ${index === currentStep ? 'text-parchment' : 'text-parchment/50'}`}>
                  {index + 1}
                </span>
              )}
            </div>
            
            <span className={`text-xs mt-1 transition-all duration-300 ${
              index === currentStep ? 'text-mystical-gold' : 'text-parchment/50'
            }`}>
              {index === 0 && 'Essence'}
              {index === 1 && 'Parameters'}
              {index === 2 && 'Revelations'}
              {index === 3 && 'Seed'}
            </span>
          </div>
          
          {/* Connector between steps */}
          {index < totalSteps - 1 && (
            <div 
              className={`h-[2px] flex-1 transition-all duration-500 ${
                index < currentStep 
                  ? 'bg-carnival-red' 
                  : 'bg-midnight-blue/50'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressIndicator;