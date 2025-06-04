import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  Target, 
  AlertTriangle,
  Brain,
  Activity,
  Users,
  TrendingUp,
  Zap,
  Eye,
  Crystal,
  Sparkles
} from 'lucide-react';
import { UserProfile, PredictionContext } from '../services/enhanced-ai-orchestrator';
import BackgroundParticles from './BackgroundParticles';

interface FormStage {
  stage: 'basic' | 'lifestyle' | 'goals' | 'prediction' | 'analyzing';
  progress: number;
}

const EnhancedConsultationChamber: React.FC = () => {
  const navigate = useNavigate();
  const [formStage, setFormStage] = useState<FormStage>({ stage: 'basic', progress: 0 });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Form data
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    age: '',
    location: '',
    occupation: '',
    education: ''
  });

  const [lifestyle, setLifestyle] = useState({
    healthScore: 5,
    socialActivity: 5,
    careerAmbition: 5,
    riskTolerance: 5
  });

  const [goalsAndChallenges, setGoalsAndChallenges] = useState({
    interests: [] as string[],
    goals: [] as string[],
    challenges: [] as string[],
    relationships: ''
  });

  const [predictionContext, setPredictionContext] = useState<PredictionContext>({
    timeframe: 'medium_term',
    category: 'career',
    focus: ''
  });

  // Available options
  const interestOptions = [
    'Technology', 'Arts & Culture', 'Health & Fitness', 'Travel', 'Business',
    'Science', 'Education', 'Sports', 'Music', 'Writing', 'Photography',
    'Gaming', 'Cooking', 'Gardening', 'Reading', 'Fashion', 'Politics'
  ];

  const goalOptions = [
    'Career advancement', 'Financial security', 'Start a business', 'Learn new skills',
    'Improve relationships', 'Travel the world', 'Write a book', 'Get healthier',
    'Buy a home', 'Start a family', 'Change careers', 'Retire early',
    'Make a difference', 'Find love', 'Gain recognition', 'Achieve balance'
  ];

  const challengeOptions = [
    'Work-life balance', 'Financial stress', 'Career uncertainty', 'Relationship issues',
    'Health concerns', 'Time management', 'Self-doubt', 'Decision making',
    'Communication skills', 'Leadership abilities', 'Technical skills', 'Networking',
    'Creative blocks', 'Motivation', 'Anxiety', 'Change adaptation'
  ];

  const handleBasicNext = () => {
    if (basicInfo.name && basicInfo.age && basicInfo.location && basicInfo.occupation) {
      setFormStage({ stage: 'lifestyle', progress: 25 });
    }
  };

  const handleLifestyleNext = () => {
    setFormStage({ stage: 'goals', progress: 50 });
  };

  const handleGoalsNext = () => {
    if (goalsAndChallenges.interests.length > 0 && goalsAndChallenges.goals.length > 0) {
      setFormStage({ stage: 'prediction', progress: 75 });
    }
  };

  const handleBeginAnalysis = () => {
    if (predictionContext.focus.trim()) {
      setFormStage({ stage: 'analyzing', progress: 100 });
      setIsAnalyzing(true);
      
      // Prepare user profile
      const userProfile: UserProfile = {
        name: basicInfo.name,
        age: parseInt(basicInfo.age),
        location: basicInfo.location,
        occupation: basicInfo.occupation,
        education: basicInfo.education,
        interests: goalsAndChallenges.interests,
        goals: goalsAndChallenges.goals,
        challenges: goalsAndChallenges.challenges,
        relationships: goalsAndChallenges.relationships,
        lifestyle: lifestyle
      };

      // Store data and navigate to vision
      localStorage.setItem('zoharUserProfile', JSON.stringify(userProfile));
      localStorage.setItem('zoharPredictionContext', JSON.stringify(predictionContext));
      
      // Simulate processing time then navigate
      setTimeout(() => {
        navigate('/vision');
      }, 3000);
    }
  };

  const toggleArrayItem = (array: string[], item: string, setter: (items: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const renderBasicInfo = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <Crystal className="mx-auto mb-4 text-mystical-gold w-12 h-12" />
        <h2 className="text-2xl font-enigma text-mystical-gold mb-2">
          Share Your Essence
        </h2>
        <p className="text-parchment opacity-80">
          The Great Zohar must know your earthly form to divine your cosmic path
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center text-mystical-gold mb-2">
            <User className="w-4 h-4 mr-2" />
            Your Name
          </label>
          <input
            type="text"
            value={basicInfo.name}
            onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
            className="w-full p-3 bg-black/50 border border-mystical-gold/30 rounded-lg text-parchment placeholder-parchment/50 focus:border-mystical-gold focus:outline-none"
            placeholder="What do they call you?"
          />
        </div>

        <div>
          <label className="flex items-center text-mystical-gold mb-2">
            <Activity className="w-4 h-4 mr-2" />
            Your Age
          </label>
          <input
            type="number"
            value={basicInfo.age}
            onChange={(e) => setBasicInfo({ ...basicInfo, age: e.target.value })}
            className="w-full p-3 bg-black/50 border border-mystical-gold/30 rounded-lg text-parchment placeholder-parchment/50 focus:border-mystical-gold focus:outline-none"
            placeholder="Years of earthly experience"
            min="16"
            max="100"
          />
        </div>

        <div>
          <label className="flex items-center text-mystical-gold mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            Your Location
          </label>
          <input
            type="text"
            value={basicInfo.location}
            onChange={(e) => setBasicInfo({ ...basicInfo, location: e.target.value })}
            className="w-full p-3 bg-black/50 border border-mystical-gold/30 rounded-lg text-parchment placeholder-parchment/50 focus:border-mystical-gold focus:outline-none"
            placeholder="City, State/Province, Country"
          />
        </div>

        <div>
          <label className="flex items-center text-mystical-gold mb-2">
            <Briefcase className="w-4 h-4 mr-2" />
            Your Occupation
          </label>
          <input
            type="text"
            value={basicInfo.occupation}
            onChange={(e) => setBasicInfo({ ...basicInfo, occupation: e.target.value })}
            className="w-full p-3 bg-black/50 border border-mystical-gold/30 rounded-lg text-parchment placeholder-parchment/50 focus:border-mystical-gold focus:outline-none"
            placeholder="How do you serve the world?"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center text-mystical-gold mb-2">
            <GraduationCap className="w-4 h-4 mr-2" />
            Your Education
          </label>
          <input
            type="text"
            value={basicInfo.education}
            onChange={(e) => setBasicInfo({ ...basicInfo, education: e.target.value })}
            className="w-full p-3 bg-black/50 border border-mystical-gold/30 rounded-lg text-parchment placeholder-parchment/50 focus:border-mystical-gold focus:outline-none"
            placeholder="Highest level of formal learning"
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleBasicNext}
        disabled={!basicInfo.name || !basicInfo.age || !basicInfo.location || !basicInfo.occupation}
        className="w-full py-4 bg-gradient-to-r from-mystical-gold to-yellow-500 text-black font-enigma text-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue to Lifestyle Assessment
      </motion.button>
    </motion.div>
  );

  const renderLifestyle = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <Brain className="mx-auto mb-4 text-mystical-gold w-12 h-12" />
        <h2 className="text-2xl font-enigma text-mystical-gold mb-2">
          Reveal Your Patterns
        </h2>
        <p className="text-parchment opacity-80">
          The cosmos sees how you move through life's great dance
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(lifestyle).map(([key, value]) => {
          const labels = {
            healthScore: 'Health Consciousness',
            socialActivity: 'Social Energy',
            careerAmbition: 'Career Drive',
            riskTolerance: 'Adventure Spirit'
          };
          
          const descriptions = {
            healthScore: 'How much do you prioritize physical and mental wellness?',
            socialActivity: 'How often do you seek social connections and activities?',
            careerAmbition: 'How driven are you to advance professionally?',
            riskTolerance: 'How comfortable are you with uncertainty and risk?'
          };

          return (
            <div key={key} className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-mystical-gold font-semibold">
                    {labels[key as keyof typeof labels]}
                  </h3>
                  <p className="text-parchment/70 text-sm">
                    {descriptions[key as keyof typeof descriptions]}
                  </p>
                </div>
                <span className="text-mystical-gold font-bold text-xl">
                  {value}/10
                </span>
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={value}
                  onChange={(e) => setLifestyle({
                    ...lifestyle,
                    [key]: parseInt(e.target.value)
                  })}
                  className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-parchment/50 mt-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleLifestyleNext}
        className="w-full py-4 bg-gradient-to-r from-mystical-gold to-yellow-500 text-black font-enigma text-lg rounded-lg"
      >
        Continue to Goals & Aspirations
      </motion.button>
    </motion.div>
  );

  const renderGoals = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <Target className="mx-auto mb-4 text-mystical-gold w-12 h-12" />
        <h2 className="text-2xl font-enigma text-mystical-gold mb-2">
          Chart Your Desires
        </h2>
        <p className="text-parchment opacity-80">
          What calls to your soul? What shadows must you face?
        </p>
      </div>

      <div className="space-y-8">
        {/* Interests */}
        <div>
          <h3 className="text-mystical-gold font-semibold mb-3 flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            Your Interests (select 3-5)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {interestOptions.map(interest => (
              <motion.button
                key={interest}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleArrayItem(
                  goalsAndChallenges.interests, 
                  interest,
                  (items) => setGoalsAndChallenges({ ...goalsAndChallenges, interests: items })
                )}
                className={`p-3 rounded-lg border text-sm transition-all ${
                  goalsAndChallenges.interests.includes(interest)
                    ? 'bg-mystical-gold text-black border-mystical-gold'
                    : 'bg-black/30 text-parchment border-mystical-gold/30 hover:border-mystical-gold/60'
                }`}
              >
                {interest}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div>
          <h3 className="text-mystical-gold font-semibold mb-3 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Your Goals (select 3-5)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {goalOptions.map(goal => (
              <motion.button
                key={goal}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleArrayItem(
                  goalsAndChallenges.goals, 
                  goal,
                  (items) => setGoalsAndChallenges({ ...goalsAndChallenges, goals: items })
                )}
                className={`p-3 rounded-lg border text-sm transition-all ${
                  goalsAndChallenges.goals.includes(goal)
                    ? 'bg-mystical-gold text-black border-mystical-gold'
                    : 'bg-black/30 text-parchment border-mystical-gold/30 hover:border-mystical-gold/60'
                }`}
              >
                {goal}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Challenges */}
        <div>
          <h3 className="text-mystical-gold font-semibold mb-3 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Your Challenges (select 2-4)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {challengeOptions.map(challenge => (
              <motion.button
                key={challenge}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleArrayItem(
                  goalsAndChallenges.challenges, 
                  challenge,
                  (items) => setGoalsAndChallenges({ ...goalsAndChallenges, challenges: items })
                )}
                className={`p-3 rounded-lg border text-sm transition-all ${
                  goalsAndChallenges.challenges.includes(challenge)
                    ? 'bg-carnival-red text-parchment border-carnival-red'
                    : 'bg-black/30 text-parchment border-mystical-gold/30 hover:border-carnival-red/60'
                }`}
              >
                {challenge}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Relationships */}
        <div>
          <h3 className="text-mystical-gold font-semibold mb-3 flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            Relationship Status
          </h3>
          <textarea
            value={goalsAndChallenges.relationships}
            onChange={(e) => setGoalsAndChallenges({
              ...goalsAndChallenges,
              relationships: e.target.value
            })}
            className="w-full p-3 bg-black/50 border border-mystical-gold/30 rounded-lg text-parchment placeholder-parchment/50 focus:border-mystical-gold focus:outline-none"
            placeholder="Describe your current relationship status and what you seek..."
            rows={3}
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGoalsNext}
        disabled={goalsAndChallenges.interests.length === 0 || goalsAndChallenges.goals.length === 0}
        className="w-full py-4 bg-gradient-to-r from-mystical-gold to-yellow-500 text-black font-enigma text-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue to Prediction Focus
      </motion.button>
    </motion.div>
  );

  const renderPrediction = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <Eye className="mx-auto mb-4 text-mystical-gold w-12 h-12" />
        <h2 className="text-2xl font-enigma text-mystical-gold mb-2">
          Focus the Vision
        </h2>
        <p className="text-parchment opacity-80">
          What aspect of your destiny seeks illumination?
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-mystical-gold font-semibold mb-3 block">
            Primary Category
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(['career', 'relationships', 'health', 'personal_growth', 'financial', 'spiritual'] as const).map(category => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPredictionContext({ ...predictionContext, category })}
                className={`p-4 rounded-lg border text-center transition-all capitalize ${
                  predictionContext.category === category
                    ? 'bg-mystical-gold text-black border-mystical-gold'
                    : 'bg-black/30 text-parchment border-mystical-gold/30 hover:border-mystical-gold/60'
                }`}
              >
                {category.replace('_', ' ')}
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-mystical-gold font-semibold mb-3 block">
            Time Horizon
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {([
              { value: 'immediate', label: '3-6 months', desc: 'Near future' },
              { value: 'short_term', label: '1-2 years', desc: 'Short term' },
              { value: 'medium_term', label: '3-5 years', desc: 'Medium term' },
              { value: 'long_term', label: '7-10 years', desc: 'Long term' }
            ] as const).map(timeframe => (
              <motion.button
                key={timeframe.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPredictionContext({ ...predictionContext, timeframe: timeframe.value })}
                className={`p-4 rounded-lg border text-center transition-all ${
                  predictionContext.timeframe === timeframe.value
                    ? 'bg-mystical-gold text-black border-mystical-gold'
                    : 'bg-black/30 text-parchment border-mystical-gold/30 hover:border-mystical-gold/60'
                }`}
              >
                <div className="font-semibold">{timeframe.label}</div>
                <div className="text-xs opacity-70">{timeframe.desc}</div>
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-mystical-gold font-semibold mb-3 block">
            Specific Focus
          </label>
          <textarea
            value={predictionContext.focus}
            onChange={(e) => setPredictionContext({ ...predictionContext, focus: e.target.value })}
            className="w-full p-4 bg-black/50 border border-mystical-gold/30 rounded-lg text-parchment placeholder-parchment/50 focus:border-mystical-gold focus:outline-none"
            placeholder="What specific question or area would you like The Great Zohar to focus on? Be as detailed as possible..."
            rows={4}
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleBeginAnalysis}
        disabled={!predictionContext.focus.trim()}
        className="w-full py-4 bg-gradient-to-r from-carnival-red to-red-600 text-parchment font-enigma text-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <Zap className="w-5 h-5 mr-2" />
        Begin Cosmic Analysis
      </motion.button>
    </motion.div>
  );

  const renderAnalyzing = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center space-y-8"
    >
      <div className="space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="mx-auto w-24 h-24 border-4 border-mystical-gold/30 border-t-mystical-gold rounded-full"
        />
        
        <Crystal className="mx-auto text-mystical-gold w-16 h-16 animate-pulse" />
        
        <h2 className="text-3xl font-enigma text-mystical-gold">
          The Great Zohar Peers Through Time
        </h2>
        
        <div className="space-y-2 text-parchment opacity-80">
          <p>Consulting the cosmic algorithms...</p>
          <p>Analyzing global trends and patterns...</p>
          <p>Weaving your destiny from probability threads...</p>
          <p>The vision crystallizes in the mystical realm...</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundParticles />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-black/30 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-mystical-gold to-yellow-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${formStage.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="text-center mt-2 text-mystical-gold/70 text-sm">
            {formStage.progress}% Complete
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-black/60 backdrop-blur-sm rounded-2xl border border-mystical-gold/20 p-8">
          <AnimatePresence mode="wait">
            {formStage.stage === 'basic' && renderBasicInfo()}
            {formStage.stage === 'lifestyle' && renderLifestyle()}
            {formStage.stage === 'goals' && renderGoals()}
            {formStage.stage === 'prediction' && renderPrediction()}
            {formStage.stage === 'analyzing' && renderAnalyzing()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default EnhancedConsultationChamber;