import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserData = {
  name: string;
  age: string;
  location: string;
  timePeriod: string;
  lifeDomain: string;
  psychometricAnswers: string[];
  destinySeed: string;
};

type Vision = {
  id: string;
  date: Date;
  mainVision: string;
  branchingVision: string;
  userData: UserData;
};

interface ZoharContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  currentVision: Vision | null;
  setCurrentVision: (vision: Vision) => void;
  savedVisions: Vision[];
  saveVision: (vision: Vision) => void;
  generateVision: () => Promise<Vision>;
  isGeneratingVision: boolean;
}

const defaultUserData: UserData = {
  name: '',
  age: '',
  location: '',
  timePeriod: '1',
  lifeDomain: 'general',
  psychometricAnswers: ['', '', ''],
  destinySeed: '',
};

const ZoharContext = createContext<ZoharContextType | undefined>(undefined);

export const ZoharProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [currentVision, setCurrentVision] = useState<Vision | null>(null);
  const [savedVisions, setSavedVisions] = useState<Vision[]>([]);
  const [isGeneratingVision, setIsGeneratingVision] = useState(false);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const saveVision = (vision: Vision) => {
    setSavedVisions(prev => [vision, ...prev]);
    localStorage.setItem('savedVisions', JSON.stringify([vision, ...savedVisions]));
  };

  // This function simulates generating a vision
  const generateVision = async (): Promise<Vision> => {
    setIsGeneratingVision(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mainVisionText = generateMainVision(userData);
    const branchingVisionText = generateBranchingVision(userData);
    
    const newVision: Vision = {
      id: Date.now().toString(),
      date: new Date(),
      mainVision: mainVisionText,
      branchingVision: branchingVisionText,
      userData: { ...userData }
    };
    
    setCurrentVision(newVision);
    setIsGeneratingVision(false);
    return newVision;
  };

  return (
    <ZoharContext.Provider value={{
      userData,
      updateUserData,
      currentVision,
      setCurrentVision,
      savedVisions,
      saveVision,
      generateVision,
      isGeneratingVision
    }}>
      {children}
    </ZoharContext.Provider>
  );
};

export const useZohar = () => {
  const context = useContext(ZoharContext);
  if (context === undefined) {
    throw new Error('useZohar must be used within a ZoharProvider');
  }
  return context;
};

// Helper functions for generating visions
function generateMainVision(userData: UserData): string {
  const { name, age, location, timePeriod, lifeDomain, destinySeed } = userData;
  
  // Template for main vision based on user data
  return `The threads of time unravel before The Great Zohar's gaze, revealing a path for ${name} that winds through shadow and light. ${timePeriod} years hence, you stand at the threshold of a significant transition in your ${lifeDomain}. The carnival lights flicker across your face, now marked by experiences that have both hardened and softened your features.

In this future, your pursuit of ${destinySeed} has led you to unexpected shores. You've established yourself in a role that balances creativity with structure, something you once thought impossible. The connections you've forged with three key individuals – a mentor with silver-streaked hair, a partner whose laughter echoes your own, and a rival whose challenges have shaped your growth – have become the constellation by which you navigate your journey. A decision awaits you regarding an opportunity that appears suddenly, like a door materializing in the carnival mist.

The Great Zohar perceives a moment of pivotal significance approximately ${parseInt(timePeriod) - 1} years from now, when you will face a choice between security and potential. The path you choose will determine whether your relationship with ${destinySeed} transforms from pursuit to embodiment. Your tendency to ${userData.psychometricAnswers[0]} will serve you well, though the carnival whispers that learning to ${userData.psychometricAnswers[1]} differently may unlock doors currently hidden from view.

From the shadows between the tents, where the music of the Dark Carnival grows most haunting, Zohar glimpses a truth you have yet to acknowledge: your fear of ${userData.psychometricAnswers[2]} has become both shield and cage. When you finally release this fear – and you will – the metamorphosis will ripple through every aspect of your existence. The mirror maze reflects not just who you are, but all you might become.`;
}

function generateBranchingVision(userData: UserData): string {
  const { name, timePeriod, lifeDomain, destinySeed } = userData;
  
  // Template for branching vision
  return `Yet the Dark Carnival contains many paths, and Zohar's gaze shifts to reveal an alternate thread of possibility. In this reflection, ${name}, you choose differently when the crossroads appears. Rather than embracing the known, you step into the mist, following whispers that lead away from established patterns.

This path leads to a life where ${destinySeed} manifests not as you expected, but in forms more primal and true. Your ${lifeDomain} transforms through a chance encounter with someone who recognizes in you what you have not seen in yourself. The carnival lights reveal both shadow and brilliance in this future – greater challenges, yes, but also moments of joy so intense they burn like stars against the night. Zohar sees you standing beneath different skies, your laughter carrying notes of both wisdom and wonder that your present self would find both familiar and strange.`;
}