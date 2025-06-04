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

// Claude API key from environment variables
const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY || '';
const API_ENDPOINT = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-3-opus-20240229';

export const ZoharProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [currentVision, setCurrentVision] = useState<Vision | null>(null);
  const [savedVisions, setSavedVisions] = useState<Vision[]>(() => {
    try {
      const saved = localStorage.getItem('savedVisions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isGeneratingVision, setIsGeneratingVision] = useState(false);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const saveVision = (vision: Vision) => {
    setSavedVisions(prev => [vision, ...prev]);
    localStorage.setItem('savedVisions', JSON.stringify([vision, ...savedVisions]));
  };

  // Generate a vision using the Claude API
  const generateVision = async (): Promise<Vision> => {
    setIsGeneratingVision(true);
    
    if (!API_KEY) {
      throw new Error('No Claude API key found. Please set VITE_CLAUDE_API_KEY in your environment.');
    }
    
    try {
      // Build the system prompt for The Great Zohar
      const systemPrompt = `
        You are The Great Zohar, a mysterious fortune teller at The Dark Carnival.
        You create personalized destiny visions in a mystical, poetic style.
        Speak with authority about cosmic forces, destiny, and the carnival's mystical powers.
        Be dramatic, mysterious, and intriguing, using elegant language and ominous undertones.
        
        Create two detailed visions for the user. Format your response EXACTLY as follows:

        MAIN VISION:
        [Write a detailed primary vision of their future - 2-3 paragraphs]

        BRANCHING VISION:
        [Write an alternate possibility that could occur if they make different choices - 2-3 paragraphs]
        
        Both visions should:
        - Be written in second person ("you")
        - Reference the Dark Carnival's mystical atmosphere (shadows, mists, ancient powers, carnival lights)
        - Incorporate ALL the user's personal details meaningfully
        - Be specific and vivid, with rich sensory details
        - Include both positive outcomes and challenges to overcome
        - Be mysterious yet hopeful, with elements of wonder
        - Each vision should be substantial (150-200 words)
        
        Use the exact headers "MAIN VISION:" and "BRANCHING VISION:" to separate the sections clearly.
        Make the visions feel authentic to carnival mysticism with references to threads of fate, cosmic energies, and carnival magic.
      `;
      
      // Create a rich user prompt based on user data
      const domainContext = {
        general: "their overall life journey and spiritual path",
        relationships: "their connections with others, love, and interpersonal bonds",
        career: "their professional calling, purpose, and worldly achievements", 
        personal: "their inner growth, self-discovery, and personal transformation"
      };

      const userPrompt = `
        Generate a personalized future vision for a person with these details:
        
        SEEKER PROFILE:
        - Name: ${userData.name || "Anonymous Seeker"}
        - Age: ${userData.age || "Unknown"} years old
        - Location: ${userData.location || "Unknown lands"}
        - Vision Scope: ${userData.timePeriod} years into the future
        - Primary Focus: ${domainContext[userData.lifeDomain as keyof typeof domainContext] || userData.lifeDomain}
        
        PSYCHOMETRIC INSIGHTS:
        1. What draws their attention: "${userData.psychometricAnswers[0] || 'Unknown patterns'}"
        2. How they handle change: "${userData.psychometricAnswers[1] || 'Unknown adaptability'}"
        3. Their deepest concern: "${userData.psychometricAnswers[2] || 'Unknown fears'}"
        
        DESTINY SEED:
        Their core aspiration or fear: "${userData.destinySeed || 'Seeking their true path'}"
        
        Weave these personal elements into both visions, making each vision feel uniquely crafted for this individual.
        The visions should feel like they truly know this person and their inner world.
      `;
      
      // Make request to Claude API
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: userPrompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7,
          model: MODEL
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Claude API Error:', response.status, errorText);
        
        // Provide helpful error messages
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your VITE_CLAUDE_API_KEY environment variable.');
        } else if (response.status === 429) {
          throw new Error('API rate limit exceeded. Please try again in a moment.');
        } else if (response.status >= 500) {
          throw new Error('The vision servers are currently overwhelmed. Please try again shortly.');
        } else {
          throw new Error(`The cosmic energies are disrupted (Error ${response.status}). Please try again.`);
        }
      }
      
      const data = await response.json();
      
      // Extract the text content from the response
      const visionText = data.content
        ?.filter((item: any) => item.type === 'text')
        ?.map((item: any) => item.text)
        ?.join('') || '';
      
      if (!visionText.trim()) {
        throw new Error('The cosmic visions are unclear. Please try again with different details.');
      }
      
      // Parse the visions
      const { mainVision, branchingVision } = parseVisions(visionText);
      
      // Validate that we have substantial content
      if (mainVision.length < 50 || branchingVision.length < 50) {
        console.warn('Generated visions are too short, using fallback content');
      }
      
      // Create the vision object
      const newVision: Vision = {
        id: Date.now().toString(),
        date: new Date(),
        mainVision,
        branchingVision,
        userData: { ...userData }
      };
      
      setCurrentVision(newVision);
      return newVision;
    } catch (error) {
      console.error('Error generating vision:', error);
      
      // Create a fallback vision if API fails
      if (error instanceof Error && error.message.includes('API')) {
        throw error; // Re-throw API errors to show to user
      } else {
        // For other errors, provide a mystical fallback
        const fallbackVision: Vision = {
          id: Date.now().toString(),
          date: new Date(),
          mainVision: `The mists of the Dark Carnival swirl around you, ${userData.name}, concealing and revealing in equal measure. In the coming ${userData.timePeriod} years, the cosmic threads align to guide you toward your destiny. Your path illuminates with the glow of carnival lights, beckoning you toward transformation and discovery. The energies speak of challenges that will forge your spirit stronger, and opportunities that await your courage to seize them.`,
          branchingVision: `Yet the carnival holds multiple paths for you, dear seeker. Should you choose differently, alternative threads of fate unfurl before you. The cosmic forces whisper of another destiny - one where your ${userData.destinySeed} takes a different form, where the choices you make today ripple through time in unexpected ways. This path too holds wonder and challenge, shaped by your will and the ancient powers that guide us all.`,
          userData: { ...userData }
        };
        
        setCurrentVision(fallbackVision);
        return fallbackVision;
      }
    } finally {
      setIsGeneratingVision(false);
    }
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

// Helper function to parse visions from Claude's response
function parseVisions(text: string): { mainVision: string; branchingVision: string } {
  // Clean up the text
  const cleanText = text.trim();
  
  // Default values
  let mainVision = '';
  let branchingVision = '';
  
  // Enhanced markers for better parsing
  const mainVisionMarkers = [
    'MAIN VISION',
    'PRIMARY VISION',
    'Main Path',
    'Primary Future',
    'First Vision',
    'The Primary Path'
  ];
  
  const branchingVisionMarkers = [
    'BRANCHING VISION',
    'ALTERNATIVE VISION',
    'Alternative Path',
    'Alternate Future',
    'Second Vision',
    'Yet the Dark Carnival',
    'But should you',
    'However, the threads',
    'Alternative Path'
  ];
  
  // Try to find clear section markers first
  for (const marker of mainVisionMarkers) {
    const regex = new RegExp(`${marker}[:\\s]*([\\s\\S]*?)(?=${branchingVisionMarkers.join('|')}|$)`, 'i');
    const match = cleanText.match(regex);
    if (match && match[1] && match[1].trim().length > 50) {
      mainVision = match[1].trim();
      break;
    }
  }
  
  for (const marker of branchingVisionMarkers) {
    const regex = new RegExp(`${marker}[:\\s]*([\\s\\S]*)`, 'i');
    const match = cleanText.match(regex);
    if (match && match[1] && match[1].trim().length > 50) {
      branchingVision = match[1].trim();
      break;
    }
  }
  
  // Enhanced fallback parsing
  if (!mainVision || !branchingVision) {
    // Look for paragraph breaks and natural division points
    const sections = cleanText.split(/\n\s*\n/).filter(section => section.trim().length > 30);
    
    if (sections.length >= 2) {
      // Find the natural midpoint, favoring slightly longer first section
      const totalLength = sections.join('').length;
      let currentLength = 0;
      let splitIndex = Math.floor(sections.length / 2);
      
      for (let i = 0; i < sections.length; i++) {
        currentLength += sections[i].length;
        if (currentLength >= totalLength * 0.45) {
          splitIndex = i + 1;
          break;
        }
      }
      
      mainVision = sections.slice(0, splitIndex).join('\n\n').trim();
      branchingVision = sections.slice(splitIndex).join('\n\n').trim();
    } else if (sections.length === 1) {
      // Single block - split by sentences
      const sentences = sections[0].split(/[.!?]+/).filter(s => s.trim().length > 10);
      const midpoint = Math.ceil(sentences.length / 2);
      
      mainVision = sentences.slice(0, midpoint).join('. ').trim() + '.';
      branchingVision = sentences.slice(midpoint).join('. ').trim() + '.';
    }
  }
  
  // Ensure both visions have content
  if (!mainVision) {
    mainVision = "The carnival's mists swirl, revealing your destined path...";
  }
  if (!branchingVision) {
    branchingVision = "Yet alternative threads of fate await your choosing...";
  }
  
  return { 
    mainVision: mainVision.trim(), 
    branchingVision: branchingVision.trim() 
  };
}