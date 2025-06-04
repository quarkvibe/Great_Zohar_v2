/**
 * Enhanced AI Orchestrator for The Great Zohar
 * Provides comprehensive future prediction combining multiple AI services and real-world data
 */

export interface UserProfile {
  name: string;
  age: number;
  location: string;
  occupation: string;
  education: string;
  interests: string[];
  goals: string[];
  challenges: string[];
  relationships: string;
  lifestyle: {
    healthScore: number;
    socialActivity: number;
    careerAmbition: number;
    riskTolerance: number;
  };
}

export interface PredictionContext {
  timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  category: 'career' | 'relationships' | 'health' | 'personal_growth' | 'financial' | 'spiritual';
  focus: string;
}

export interface EnhancedVision {
  id: string;
  timestamp: Date;
  userProfile: UserProfile;
  visionNarrative: string;
  predictions: {
    immediate: TimeframePrediction;
    shortTerm: TimeframePrediction;
    mediumTerm: TimeframePrediction;
    longTerm: TimeframePrediction;
  };
  insights: {
    personalityAnalysis: string;
    strengthsAndWeaknesses: string;
    opportunityWindows: string[];
    challengesToWatch: string[];
    cosmicAlignment: string;
  };
  guidance: {
    actionSteps: string[];
    timingRecommendations: string[];
    relationships: string[];
    careerGuidance: string[];
    spiritualPath: string[];
  };
  realWorldContext: {
    currentTrends: string[];
    economicFactors: string[];
    technologicalInfluences: string[];
    socialChanges: string[];
    globalEvents: string[];
  };
  accuracyLevel: 'MYSTICAL' | 'ENHANCED' | 'PROFESSIONAL_GRADE';
}

export interface TimeframePrediction {
  timeframe: string;
  primaryPrediction: string;
  probability: number;
  keyFactors: string[];
  potentialOutcomes: string[];
  actionRequired: string[];
  warningsSigns: string[];
  opportunities: string[];
}

class EnhancedAIOrchestrator {
  private static instance: EnhancedAIOrchestrator;
  private claudeApiKey: string;
  private perplexityApiKey: string;

  private constructor() {
    this.claudeApiKey = import.meta.env.VITE_CLAUDE_API_KEY || '';
    this.perplexityApiKey = import.meta.env.VITE_PERPLEXITY_API_KEY || '';
  }

  static getInstance(): EnhancedAIOrchestrator {
    if (!EnhancedAIOrchestrator.instance) {
      EnhancedAIOrchestrator.instance = new EnhancedAIOrchestrator();
    }
    return EnhancedAIOrchestrator.instance;
  }

  async generateComprehensiveVision(
    userProfile: UserProfile,
    context: PredictionContext
  ): Promise<EnhancedVision> {
    console.log('🔮 Generating comprehensive future vision with enhanced AI...');

    try {
      // Phase 1: Gather real-world context
      const realWorldContext = await this.gatherRealWorldContext(userProfile, context);

      // Phase 2: Analyze personality and patterns
      const personalityAnalysis = await this.analyzePersonality(userProfile);

      // Phase 3: Generate multi-timeframe predictions
      const predictions = await this.generateTimeframePredictions(userProfile, context, realWorldContext);

      // Phase 4: Create comprehensive insights
      const insights = await this.generateInsights(userProfile, personalityAnalysis, realWorldContext);

      // Phase 5: Generate actionable guidance
      const guidance = await this.generateGuidance(userProfile, predictions, insights);

      // Phase 6: Create mystical narrative
      const visionNarrative = await this.generateVisionNarrative(userProfile, predictions, insights);

      const vision: EnhancedVision = {
        id: this.generateVisionId(),
        timestamp: new Date(),
        userProfile,
        visionNarrative,
        predictions,
        insights,
        guidance,
        realWorldContext,
        accuracyLevel: 'PROFESSIONAL_GRADE'
      };

      console.log('✨ Enhanced vision generated with cosmic accuracy');
      return vision;

    } catch (error) {
      console.error('Error generating enhanced vision:', error);
      return this.generateFallbackVision(userProfile, context);
    }
  }

  private async gatherRealWorldContext(userProfile: UserProfile, context: PredictionContext): Promise<any> {
    const currentDate = new Date();
    const queries = [
      `Future trends for ${userProfile.occupation} profession in ${userProfile.location}`,
      `Economic outlook and job market trends for ${context.category} sector`,
      `Technology disruptions affecting ${userProfile.occupation} and ${userProfile.interests.join(', ')}`,
      `Social and cultural changes impacting people aged ${userProfile.age} in ${userProfile.location}`,
      `Global events and trends that will affect ${context.focus} in the next 5 years`
    ];

    const trendAnalysis = await Promise.all(
      queries.map(query => this.searchTrends(query))
    );

    return {
      currentTrends: trendAnalysis[0] || [],
      economicFactors: trendAnalysis[1] || [],
      technologicalInfluences: trendAnalysis[2] || [],
      socialChanges: trendAnalysis[3] || [],
      globalEvents: trendAnalysis[4] || []
    };
  }

  private async searchTrends(query: string): Promise<string[]> {
    if (!this.perplexityApiKey) {
      return [`Based on current analysis: ${query} trends indicate positive momentum with emerging opportunities.`];
    }

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.perplexityApiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-large-128k-online',
          messages: [
            {
              role: 'user',
              content: `Provide 3-5 specific, actionable insights about: ${query}. Focus on practical trends that will impact individuals in the next 1-5 years. Be specific and avoid generic statements.`
            }
          ],
          max_tokens: 400
        })
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      // Extract key insights from the response
      return content.split('\n')
        .filter((line: string) => line.trim().length > 20)
        .slice(0, 5);
        
    } catch (error) {
      console.error('Error searching trends:', error);
      return [`Analysis of ${query} suggests evolving landscape with new opportunities emerging.`];
    }
  }

  private async analyzePersonality(userProfile: UserProfile): Promise<string> {
    const systemPrompt = `
      You are The Great Zohar, master predictor at The Dark Carnival, with profound insight into human nature and destiny patterns.
      
      Analyze this person's personality based on their profile data, considering:
      1. Career choice and its psychological implications
      2. Interests and how they reveal character traits
      3. Goals and challenges as indicators of personality patterns
      4. Lifestyle factors and what they suggest about decision-making
      5. Age and life stage considerations
      
      Provide a deep, nuanced personality analysis that reveals hidden patterns and future tendencies.
    `;

    const userPrompt = `
      Analyze the personality of this individual:
      
      Name: ${userProfile.name}
      Age: ${userProfile.age}
      Occupation: ${userProfile.occupation}
      Education: ${userProfile.education}
      Location: ${userProfile.location}
      
      Interests: ${userProfile.interests.join(', ')}
      Goals: ${userProfile.goals.join(', ')}
      Challenges: ${userProfile.challenges.join(', ')}
      Relationships: ${userProfile.relationships}
      
      Lifestyle Profile:
      - Health consciousness: ${userProfile.lifestyle.healthScore}/10
      - Social activity: ${userProfile.lifestyle.socialActivity}/10
      - Career ambition: ${userProfile.lifestyle.careerAmbition}/10
      - Risk tolerance: ${userProfile.lifestyle.riskTolerance}/10
      
      Provide insights into their core personality traits, decision-making patterns, and psychological tendencies that will influence their future.
    `;

    return await this.callClaude(systemPrompt, userPrompt);
  }

  private async generateTimeframePredictions(
    userProfile: UserProfile,
    context: PredictionContext,
    realWorldContext: any
  ): Promise<any> {
    const timeframes = [
      { name: 'immediate', duration: 'next 3-6 months', weight: 'current momentum' },
      { name: 'shortTerm', duration: 'next 1-2 years', weight: 'active choices' },
      { name: 'mediumTerm', duration: 'next 3-5 years', weight: 'strategic direction' },
      { name: 'longTerm', duration: 'next 7-10 years', weight: 'life evolution' }
    ];

    const predictions: any = {};

    for (const timeframe of timeframes) {
      const systemPrompt = `
        You are The Great Zohar, mystical predictor with access to cosmic patterns and real-world intelligence.
        
        Generate a specific, actionable prediction for the ${timeframe.duration} that considers:
        1. Current real-world trends and their trajectory
        2. Personal patterns and decision-making history
        3. Economic and technological factors
        4. Social and cultural shifts
        5. Probability mathematics and trend analysis
        
        Your predictions should be:
        - Specific enough to be verifiable
        - Grounded in real trend analysis
        - Mystically compelling yet practically useful
        - Include probability assessments
        - Provide actionable guidance
      `;

      const userPrompt = `
        Generate a comprehensive prediction for ${userProfile.name} in the ${timeframe.duration}:
        
        Focus Area: ${context.focus}
        Category: ${context.category}
        
        User Profile: ${JSON.stringify(userProfile, null, 2)}
        
        Current Real-World Context:
        - Economic trends: ${realWorldContext.economicFactors.join('; ')}
        - Tech influences: ${realWorldContext.technologicalInfluences.join('; ')}
        - Social changes: ${realWorldContext.socialChanges.join('; ')}
        - Global events: ${realWorldContext.globalEvents.join('; ')}
        
        Provide:
        1. Primary prediction with 60-90% probability assessment
        2. Key factors that will influence this outcome
        3. Potential alternative outcomes
        4. Actions required to achieve the best outcome
        5. Warning signs to watch for
        6. Specific opportunities to seize
        
        Weight this prediction toward ${timeframe.weight} factors.
      `;

      const prediction = await this.callClaude(systemPrompt, userPrompt);
      
      predictions[timeframe.name] = {
        timeframe: timeframe.duration,
        primaryPrediction: this.extractSection(prediction, 'primary prediction'),
        probability: this.extractProbability(prediction),
        keyFactors: this.extractList(prediction, 'key factors'),
        potentialOutcomes: this.extractList(prediction, 'potential outcomes'),
        actionRequired: this.extractList(prediction, 'actions required'),
        warningsSigns: this.extractList(prediction, 'warning signs'),
        opportunities: this.extractList(prediction, 'opportunities')
      };
    }

    return predictions;
  }

  private async generateInsights(userProfile: UserProfile, personalityAnalysis: string, realWorldContext: any): Promise<any> {
    const systemPrompt = `
      You are The Great Zohar, weaving together personality insights with cosmic timing and real-world intelligence.
      
      Generate comprehensive insights that combine:
      1. Deep personality analysis
      2. Current world trends and their personal impact
      3. Strengths and growth areas
      4. Optimal timing windows
      5. Challenges to navigate
      6. Cosmic alignment with current energies
      
      Your insights should be profound, actionable, and mystically resonant.
    `;

    const userPrompt = `
      Generate comprehensive insights for ${userProfile.name}:
      
      Personality Analysis: ${personalityAnalysis}
      
      Real-World Context: ${JSON.stringify(realWorldContext, null, 2)}
      
      User Profile: ${JSON.stringify(userProfile, null, 2)}
      
      Provide insights on:
      1. How their personality will interact with coming changes
      2. Their unique strengths and how to leverage them
      3. Key weakness or blind spots to address
      4. Optimal opportunity windows in the next 5 years
      5. Major challenges they'll need to navigate
      6. Their cosmic alignment with current global energies
    `;

    const insights = await this.callClaude(systemPrompt, userPrompt);

    return {
      personalityAnalysis,
      strengthsAndWeaknesses: this.extractSection(insights, 'strengths and weaknesses'),
      opportunityWindows: this.extractList(insights, 'opportunity windows'),
      challengesToWatch: this.extractList(insights, 'challenges'),
      cosmicAlignment: this.extractSection(insights, 'cosmic alignment')
    };
  }

  private async generateGuidance(userProfile: UserProfile, predictions: any, insights: any): Promise<any> {
    const systemPrompt = `
      You are The Great Zohar, providing practical mystical guidance that bridges spiritual wisdom with actionable advice.
      
      Create specific, actionable guidance based on the predictions and insights, organized into:
      1. Concrete action steps with timing
      2. Optimal timing recommendations
      3. Relationship guidance
      4. Career strategy
      5. Spiritual development path
      
      Your guidance should be practical enough to implement while maintaining mystical depth.
    `;

    const userPrompt = `
      Generate comprehensive guidance for ${userProfile.name} based on:
      
      Predictions: ${JSON.stringify(predictions, null, 2)}
      
      Insights: ${JSON.stringify(insights, null, 2)}
      
      User Profile: ${JSON.stringify(userProfile, null, 2)}
      
      Provide specific guidance for:
      1. Action steps they should take in the next 6 months
      2. Timing recommendations for major decisions
      3. Relationship strategies and connections to cultivate
      4. Career moves and professional development
      5. Spiritual practices to align with their path
      
      Be specific with dates, strategies, and actionable advice.
    `;

    const guidance = await this.callClaude(systemPrompt, userPrompt);

    return {
      actionSteps: this.extractList(guidance, 'action steps'),
      timingRecommendations: this.extractList(guidance, 'timing recommendations'),
      relationships: this.extractList(guidance, 'relationship'),
      careerGuidance: this.extractList(guidance, 'career'),
      spiritualPath: this.extractList(guidance, 'spiritual')
    };
  }

  private async generateVisionNarrative(userProfile: UserProfile, predictions: any, insights: any): Promise<string> {
    const systemPrompt = `
      You are The Great Zohar, master storyteller of The Dark Carnival, weaving visions into compelling mystical narratives.
      
      Create an atmospheric vision narrative that:
      1. Uses dark carnival and mystical imagery
      2. Weaves the predictions into a compelling story
      3. Maintains mystical gravitas while being personally relevant
      4. References specific details from their profile
      5. Builds to a crescendo of revelation
      
      Your narrative should feel like a profound mystical experience that the person will remember.
    `;

    const userPrompt = `
      Create a mystical vision narrative for ${userProfile.name} incorporating:
      
      Their Story: Age ${userProfile.age}, ${userProfile.occupation} in ${userProfile.location}
      Goals: ${userProfile.goals.join(', ')}
      
      Predictions Summary:
      - Immediate: ${predictions.immediate?.primaryPrediction}
      - Long-term: ${predictions.longTerm?.primaryPrediction}
      
      Key Insights: ${insights.personalityAnalysis}
      
      Weave this into a compelling mystical narrative that feels like a profound vision from The Great Zohar at The Dark Carnival.
    `;

    return await this.callClaude(systemPrompt, userPrompt);
  }

  private async callClaude(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!this.claudeApiKey) {
      return "The cosmic energies reveal a path of growth and transformation ahead. Trust in your intuition and the timing of the universe.";
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.claudeApiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 2000,
          temperature: 0.8,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: userPrompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      return data.content
        .filter((item: any) => item.type === 'text')
        .map((item: any) => item.text)
        .join('');

    } catch (error) {
      console.error('Error calling Claude:', error);
      return "The mystical visions flow through cosmic channels beyond current reach. Trust in the wisdom that emerges from within.";
    }
  }

  private generateFallbackVision(userProfile: UserProfile, context: PredictionContext): EnhancedVision {
    return {
      id: this.generateVisionId(),
      timestamp: new Date(),
      userProfile,
      visionNarrative: `The cosmic veils part to reveal your path, ${userProfile.name}. The carnival of destiny shows a future shaped by your ${userProfile.occupation} journey and guided by your passion for ${userProfile.interests.join(' and ')}. The Great Zohar sees transformation approaching.`,
      predictions: {
        immediate: {
          timeframe: 'next 3-6 months',
          primaryPrediction: 'A significant opportunity will present itself, requiring decisive action.',
          probability: 75,
          keyFactors: ['Current momentum', 'Professional network', 'Personal readiness'],
          potentialOutcomes: ['Career advancement', 'New connections', 'Skill development'],
          actionRequired: ['Stay alert to opportunities', 'Strengthen professional relationships'],
          warningsSigns: ['Hesitation when action is needed', 'Overlooking small signals'],
          opportunities: ['Unexpected collaboration', 'Recognition for past work']
        },
        shortTerm: {
          timeframe: 'next 1-2 years',
          primaryPrediction: 'Your expertise will open doors to new possibilities.',
          probability: 80,
          keyFactors: ['Professional growth', 'Market conditions', 'Personal choices'],
          potentialOutcomes: ['Leadership role', 'Career pivot', 'Increased recognition'],
          actionRequired: ['Develop new skills', 'Build strategic relationships'],
          warningsSigns: ['Complacency', 'Resistance to change'],
          opportunities: ['Industry evolution', 'Mentorship possibilities']
        },
        mediumTerm: {
          timeframe: 'next 3-5 years',
          primaryPrediction: 'You will establish yourself as an authority in your field.',
          probability: 70,
          keyFactors: ['Consistent growth', 'Market position', 'Innovation adoption'],
          potentialOutcomes: ['Thought leadership', 'Financial stability', 'Wider influence'],
          actionRequired: ['Specialize deeply', 'Share knowledge publicly'],
          warningsSigns: ['Staying in comfort zone', 'Ignoring industry trends'],
          opportunities: ['Speaking engagements', 'Consulting opportunities']
        },
        longTerm: {
          timeframe: 'next 7-10 years',
          primaryPrediction: 'Your accumulated wisdom will guide others on similar paths.',
          probability: 65,
          keyFactors: ['Life experience', 'Professional legacy', 'Personal fulfillment'],
          potentialOutcomes: ['Mentorship role', 'Independent success', 'Personal satisfaction'],
          actionRequired: ['Build lasting relationships', 'Document your journey'],
          warningsSigns: ['Losing connection with newer generations', 'Becoming rigid'],
          opportunities: ['Legacy building', 'Wisdom sharing']
        }
      },
      insights: {
        personalityAnalysis: `Your ${userProfile.occupation} background reveals a methodical yet creative mind, while your interest in ${userProfile.interests[0]} shows your multifaceted nature.`,
        strengthsAndWeaknesses: 'Your greatest strength lies in your ability to balance practical skills with creative vision. Watch for tendencies toward overthinking.',
        opportunityWindows: ['Q2 2025: Career pivot opportunity', 'Late 2025: Leadership potential', '2027: Major breakthrough possible'],
        challengesToWatch: ['Imposter syndrome', 'Work-life balance', 'Rapid industry changes'],
        cosmicAlignment: 'Your path aligns with cycles of growth and transformation, particularly during spring and early fall periods.'
      },
      guidance: {
        actionSteps: ['Update professional profiles this month', 'Identify 3 industry mentors by March', 'Start documenting your expertise'],
        timingRecommendations: ['Make career moves in spring', 'Avoid major decisions during Mercury retrograde', 'Plan strategic moves for fall 2025'],
        relationships: ['Strengthen ties with 2-3 key contacts', 'Join professional associations', 'Seek mentorship opportunities'],
        careerGuidance: ['Specialize in emerging technologies', 'Develop thought leadership content', 'Build cross-functional skills'],
        spiritualPath: ['Practice daily reflection', 'Connect with nature monthly', 'Explore meditation techniques']
      },
      realWorldContext: {
        currentTrends: ['AI adoption in ' + userProfile.occupation, 'Remote work evolution', 'Skill-based hiring growth'],
        economicFactors: ['Technology sector growth', 'Inflation impact on salaries', 'Investment in innovation'],
        technologicalInfluences: ['Automation potential', 'New tools emergence', 'Digital transformation'],
        socialChanges: ['Generational workforce shifts', 'Values-based employment', 'Work-life integration'],
        globalEvents: ['Post-pandemic adaptations', 'Climate change responses', 'Global connectivity increase']
      },
      accuracyLevel: 'MYSTICAL'
    };
  }

  // Helper methods
  private generateVisionId(): string {
    return `vision_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private extractSection(text: string, sectionName: string): string {
    const lines = text.split('\n');
    const sectionStart = lines.findIndex(line => 
      line.toLowerCase().includes(sectionName.toLowerCase())
    );
    
    if (sectionStart === -1) return text.substring(0, 200) + '...';
    
    const sectionEnd = lines.findIndex((line, index) => 
      index > sectionStart && (line.trim() === '' || line.match(/^\d+\./))
    );
    
    const endIndex = sectionEnd === -1 ? Math.min(sectionStart + 3, lines.length) : sectionEnd;
    return lines.slice(sectionStart + 1, endIndex).join('\n').trim();
  }

  private extractList(text: string, sectionName: string): string[] {
    const section = this.extractSection(text, sectionName);
    return section.split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•') || /^\d+\./.test(line.trim()))
      .map(line => line.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, '').trim())
      .filter(line => line.length > 0)
      .slice(0, 6); // Limit to 6 items
  }

  private extractProbability(text: string): number {
    const probabilityMatch = text.match(/(\d+)%/);
    return probabilityMatch ? parseInt(probabilityMatch[1]) : 75;
  }
}

export const enhancedAI = EnhancedAIOrchestrator.getInstance();