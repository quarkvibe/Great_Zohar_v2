import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crystal,
  Eye,
  Clock,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Users,
  Heart,
  Briefcase,
  Brain,
  Star,
  ChevronDown,
  ChevronRight,
  Save,
  Home,
  Zap,
  Globe,
  Target
} from 'lucide-react';
import { enhancedAI, EnhancedVision, UserProfile, PredictionContext } from '../services/enhanced-ai-orchestrator';
import BackgroundParticles from './BackgroundParticles';

const EnhancedVisionReveal: React.FC = () => {
  const navigate = useNavigate();
  const [vision, setVision] = useState<EnhancedVision | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [revealStage, setRevealStage] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['narrative']));
  
  useEffect(() => {
    generateVision();
  }, []);

  const generateVision = async () => {
    try {
      // Get stored user data
      const userProfileData = localStorage.getItem('zoharUserProfile');
      const predictionContextData = localStorage.getItem('zoharPredictionContext');
      
      if (!userProfileData || !predictionContextData) {
        navigate('/consultation');
        return;
      }

      const userProfile: UserProfile = JSON.parse(userProfileData);
      const predictionContext: PredictionContext = JSON.parse(predictionContextData);

      // Generate comprehensive vision
      const generatedVision = await enhancedAI.generateComprehensiveVision(userProfile, predictionContext);
      setVision(generatedVision);
      setIsGenerating(false);

      // Progressive reveal
      setTimeout(() => setRevealStage(1), 1000);
      setTimeout(() => setRevealStage(2), 2000);
      setTimeout(() => setRevealStage(3), 3000);

    } catch (error) {
      console.error('Error generating vision:', error);
      setIsGenerating(false);
      // Generate fallback vision
      setVision({
        id: 'fallback',
        timestamp: new Date(),
        userProfile: JSON.parse(localStorage.getItem('zoharUserProfile') || '{}'),
        visionNarrative: 'The cosmic veils shimmer with possibility. Your path ahead gleams with opportunity and growth, guided by the wisdom of experience and the courage to embrace change.',
        predictions: {
          immediate: {
            timeframe: 'next 3-6 months',
            primaryPrediction: 'A significant opportunity will present itself',
            probability: 75,
            keyFactors: ['Current momentum', 'Professional network'],
            potentialOutcomes: ['Career advancement', 'New connections'],
            actionRequired: ['Stay alert to opportunities'],
            warningsSigns: ['Hesitation when action is needed'],
            opportunities: ['Unexpected collaboration']
          },
          shortTerm: {
            timeframe: 'next 1-2 years',
            primaryPrediction: 'Your expertise will open new doors',
            probability: 80,
            keyFactors: ['Skill development', 'Market conditions'],
            potentialOutcomes: ['Leadership role', 'Recognition'],
            actionRequired: ['Develop new skills'],
            warningsSigns: ['Resistance to change'],
            opportunities: ['Industry evolution']
          },
          mediumTerm: {
            timeframe: 'next 3-5 years',
            primaryPrediction: 'Establishment as a respected authority',
            probability: 70,
            keyFactors: ['Consistent growth', 'Innovation'],
            potentialOutcomes: ['Thought leadership', 'Financial stability'],
            actionRequired: ['Share knowledge publicly'],
            warningsSigns: ['Staying in comfort zone'],
            opportunities: ['Speaking engagements']
          },
          longTerm: {
            timeframe: 'next 7-10 years',
            primaryPrediction: 'Your wisdom will guide others',
            probability: 65,
            keyFactors: ['Life experience', 'Professional legacy'],
            potentialOutcomes: ['Mentorship role', 'Independence'],
            actionRequired: ['Build lasting relationships'],
            warningsSigns: ['Losing connection with trends'],
            opportunities: ['Legacy building']
          }
        },
        insights: {
          personalityAnalysis: 'Your unique blend of analytical thinking and creative vision positions you for significant impact.',
          strengthsAndWeaknesses: 'Your greatest strength lies in adaptability. Watch for tendencies toward overthinking.',
          opportunityWindows: ['Spring 2025: Career breakthrough', 'Fall 2025: Leadership opportunity'],
          challengesToWatch: ['Work-life balance', 'Decision paralysis'],
          cosmicAlignment: 'Your path aligns with cycles of growth and transformation.'
        },
        guidance: {
          actionSteps: ['Network with industry leaders', 'Develop thought leadership content'],
          timingRecommendations: ['Make major moves in spring', 'Plan strategically in fall'],
          relationships: ['Strengthen key professional connections'],
          careerGuidance: ['Specialize in emerging technologies'],
          spiritualPath: ['Practice daily reflection', 'Connect with nature']
        },
        realWorldContext: {
          currentTrends: ['AI adoption in your field', 'Remote work evolution'],
          economicFactors: ['Technology sector growth', 'Skill-based hiring'],
          technologicalInfluences: ['Automation potential', 'Digital transformation'],
          socialChanges: ['Generational workforce shifts', 'Values-based employment'],
          globalEvents: ['Post-pandemic adaptations', 'Climate change responses']
        },
        accuracyLevel: 'MYSTICAL'
      });
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const saveVision = () => {
    if (vision) {
      const savedVisions = JSON.parse(localStorage.getItem('zoharSavedVisions') || '[]');
      savedVisions.unshift(vision);
      localStorage.setItem('zoharSavedVisions', JSON.stringify(savedVisions.slice(0, 10))); // Keep last 10
      alert('🔮 Vision saved to your mystical collection!');
    }
  };

  const renderGenerating = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center space-y-8 py-16"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="mx-auto w-32 h-32 border-4 border-mystical-gold/30 border-t-mystical-gold rounded-full"
      />
      
      <div className="space-y-4">
        <Crystal className="mx-auto text-mystical-gold w-20 h-20 animate-pulse" />
        <h1 className="text-4xl font-enigma text-mystical-gold">
          The Great Zohar Weaves Your Destiny
        </h1>
        <div className="space-y-2 text-parchment opacity-80 max-w-md mx-auto">
          <p>Analyzing cosmic patterns and earthly trends...</p>
          <p>Consulting the probability matrices...</p>
          <p>Weaving visions from the threads of possibility...</p>
        </div>
      </div>
    </motion.div>
  );

  const renderVision = () => {
    if (!vision) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-4"
        >
          <Eye className="mx-auto text-mystical-gold w-16 h-16" />
          <h1 className="text-4xl font-enigma text-mystical-gold">
            Your Cosmic Vision Revealed
          </h1>
          <div className="flex items-center justify-center space-x-4 text-parchment/70">
            <span>{vision.userProfile.name}</span>
            <span>•</span>
            <span>{vision.timestamp.toLocaleDateString()}</span>
            <span>•</span>
            <span className="text-mystical-gold">{vision.accuracyLevel}</span>
          </div>
        </motion.div>

        {/* Vision Narrative */}
        <CollapsibleSection
          title="🔮 The Mystical Vision"
          icon={<Crystal />}
          isExpanded={expandedSections.has('narrative')}
          onToggle={() => toggleSection('narrative')}
          delay={0.3}
        >
          <div className="text-parchment leading-relaxed text-lg italic bg-black/30 p-6 rounded-lg border border-mystical-gold/20">
            {vision.visionNarrative}
          </div>
        </CollapsibleSection>

        {/* Timeline Predictions */}
        <CollapsibleSection
          title="⏰ Timeline of Destiny"
          icon={<Clock />}
          isExpanded={expandedSections.has('predictions')}
          onToggle={() => toggleSection('predictions')}
          delay={0.4}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(vision.predictions).map(([key, prediction]) => (
              <motion.div
                key={key}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * Object.keys(vision.predictions).indexOf(key) }}
                className="bg-black/40 rounded-lg p-6 border border-mystical-gold/20 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-mystical-gold font-bold text-lg capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <span className="text-carnival-red font-bold">
                    {prediction.probability}%
                  </span>
                </div>
                
                <p className="text-parchment font-medium">
                  {prediction.primaryPrediction}
                </p>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="text-mystical-gold/80 font-semibold mb-1">Key Factors:</h4>
                    <ul className="text-parchment/80 space-y-1">
                      {prediction.keyFactors.map((factor, i) => (
                        <li key={i} className="flex items-start">
                          <Star className="w-3 h-3 text-mystical-gold mt-1 mr-2 flex-shrink-0" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-mystical-gold/80 font-semibold mb-1">Opportunities:</h4>
                    <ul className="text-parchment/80 space-y-1">
                      {prediction.opportunities.map((opp, i) => (
                        <li key={i} className="flex items-start">
                          <Lightbulb className="w-3 h-3 text-yellow-400 mt-1 mr-2 flex-shrink-0" />
                          {opp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Cosmic Insights */}
        <CollapsibleSection
          title="🧠 Cosmic Insights"
          icon={<Brain />}
          isExpanded={expandedSections.has('insights')}
          onToggle={() => toggleSection('insights')}
          delay={0.5}
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-mystical-gold font-bold mb-3 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Personality Analysis
              </h3>
              <p className="text-parchment leading-relaxed bg-black/30 p-4 rounded-lg">
                {vision.insights.personalityAnalysis}
              </p>
            </div>

            <div>
              <h3 className="text-mystical-gold font-bold mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Strengths & Growth Areas
              </h3>
              <p className="text-parchment leading-relaxed bg-black/30 p-4 rounded-lg">
                {vision.insights.strengthsAndWeaknesses}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-mystical-gold font-bold mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Opportunity Windows
                </h3>
                <ul className="space-y-2">
                  {vision.insights.opportunityWindows.map((window, i) => (
                    <li key={i} className="flex items-start bg-green-900/20 p-3 rounded-lg">
                      <Zap className="w-4 h-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-parchment">{window}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-mystical-gold font-bold mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Challenges to Watch
                </h3>
                <ul className="space-y-2">
                  {vision.insights.challengesToWatch.map((challenge, i) => (
                    <li key={i} className="flex items-start bg-red-900/20 p-3 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-parchment">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Sacred Guidance */}
        <CollapsibleSection
          title="🧭 Sacred Guidance"
          icon={<Star />}
          isExpanded={expandedSections.has('guidance')}
          onToggle={() => toggleSection('guidance')}
          delay={0.6}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-mystical-gold font-bold mb-3 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Action Steps
                </h3>
                <ul className="space-y-2">
                  {vision.guidance.actionSteps.map((step, i) => (
                    <li key={i} className="flex items-start bg-blue-900/20 p-3 rounded-lg">
                      <span className="bg-mystical-gold text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-parchment">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-mystical-gold font-bold mb-3 flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Relationships
                </h3>
                <ul className="space-y-2">
                  {vision.guidance.relationships.map((rel, i) => (
                    <li key={i} className="flex items-start">
                      <Heart className="w-4 h-4 text-pink-400 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-parchment">{rel}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-mystical-gold font-bold mb-3 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Career Guidance
                </h3>
                <ul className="space-y-2">
                  {vision.guidance.careerGuidance.map((guidance, i) => (
                    <li key={i} className="flex items-start">
                      <Briefcase className="w-4 h-4 text-blue-400 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-parchment">{guidance}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-mystical-gold font-bold mb-3 flex items-center">
                  <Crystal className="w-5 h-5 mr-2" />
                  Spiritual Path
                </h3>
                <ul className="space-y-2">
                  {vision.guidance.spiritualPath.map((path, i) => (
                    <li key={i} className="flex items-start">
                      <Crystal className="w-4 h-4 text-purple-400 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-parchment">{path}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Real World Context */}
        <CollapsibleSection
          title="🌍 Cosmic Context & Current Forces"
          icon={<Globe />}
          isExpanded={expandedSections.has('context')}
          onToggle={() => toggleSection('context')}
          delay={0.7}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Current Trends', items: vision.realWorldContext.currentTrends, color: 'blue' },
              { title: 'Economic Factors', items: vision.realWorldContext.economicFactors, color: 'green' },
              { title: 'Tech Influences', items: vision.realWorldContext.technologicalInfluences, color: 'purple' },
              { title: 'Social Changes', items: vision.realWorldContext.socialChanges, color: 'pink' },
              { title: 'Global Events', items: vision.realWorldContext.globalEvents, color: 'yellow' }
            ].map(category => (
              <div key={category.title} className="space-y-3">
                <h3 className="text-mystical-gold font-bold">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, i) => (
                    <li key={i} className={`text-sm text-parchment/80 bg-${category.color}-900/20 p-2 rounded`}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-4 pt-8 border-t border-mystical-gold/20"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={saveVision}
            className="bg-gradient-to-r from-mystical-gold to-yellow-500 text-black px-6 py-3 rounded-lg font-bold flex items-center"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Vision
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/consultation')}
            className="bg-gradient-to-r from-carnival-red to-red-600 text-parchment px-6 py-3 rounded-lg font-bold flex items-center"
          >
            <Eye className="w-5 h-5 mr-2" />
            New Vision
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-purple-600 to-purple-800 text-parchment px-6 py-3 rounded-lg font-bold flex items-center"
          >
            <Home className="w-5 h-5 mr-2" />
            Return Home
          </motion.button>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundParticles />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {isGenerating ? renderGenerating() : renderVision()}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Collapsible Section Component
interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  delay?: number;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  children,
  isExpanded,
  onToggle,
  delay = 0
}) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay }}
    className="bg-black/40 backdrop-blur-sm rounded-2xl border border-mystical-gold/20 overflow-hidden"
  >
    <button
      className="w-full p-6 text-left flex items-center justify-between hover:bg-mystical-gold/10 transition-colors"
      onClick={onToggle}
    >
      <div className="flex items-center text-mystical-gold font-bold text-xl">
        {icon}
        <span className="ml-3">{title}</span>
      </div>
      {isExpanded ? <ChevronDown /> : <ChevronRight />}
    </button>
    
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-mystical-gold/20"
        >
          <div className="p-6">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default EnhancedVisionReveal;