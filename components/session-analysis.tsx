"use client"

// Enhanced Session Analysis Component
// Provides detailed, structured analysis for physiotherapy sessions

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock, 
  Activity, 
  Award, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Share2
} from 'lucide-react';
import { ExerciseSession } from '@/lib/progress-tracker';
import { ExerciseFeedback } from '@/lib/pose-analysis';

export interface DetailedAnalysis {
  sessionId: string;
  exerciseName: string;
  overallPerformance: {
    score: number;
    grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
    improvement: number; // percentage change from previous session
    consistency: number; // 0-100, how consistent the performance was
  };
  biomechanicalAnalysis: {
    jointAccuracy: { [joint: string]: JointAnalysis };
    movementQuality: MovementQuality;
    compensationPatterns: CompensationPattern[];
    symmetryAnalysis: SymmetryAnalysis;
  };
  temporalAnalysis: {
    phaseTimings: PhaseTimingAnalysis[];
    movementVelocity: VelocityAnalysis;
    restPeriods: RestPeriodAnalysis;
    fatigueLevels: FatigueAnalysis[];
  };
  progressIndicators: {
    strengthGains: StrengthProgress;
    rangeOfMotion: ROMProgress;
    endurance: EnduranceProgress;
    coordination: CoordinationProgress;
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    exerciseModifications: ExerciseModification[];
  };
  riskAssessment: {
    injuryRisk: 'low' | 'moderate' | 'high';
    riskFactors: string[];
    preventiveMeasures: string[];
  };
  comparisonData: {
    previousSessions: SessionComparison[];
    populationNorms: PopulationComparison;
    personalBests: PersonalBestComparison;
  };
}

export interface JointAnalysis {
  joint: string;
  averageAccuracy: number;
  rangeAchieved: { min: number; max: number };
  targetRange: { min: number; max: number };
  consistency: number;
  improvements: string[];
  concerns: string[];
}

export interface MovementQuality {
  smoothness: number; // 0-100
  control: number; // 0-100
  timing: number; // 0-100
  coordination: number; // 0-100
  overallQuality: number;
}

export interface CompensationPattern {
  pattern: string;
  severity: 'mild' | 'moderate' | 'severe';
  affectedJoints: string[];
  description: string;
  correctionStrategy: string;
}

export interface SymmetryAnalysis {
  leftRightSymmetry: number; // 0-100, 100 being perfect symmetry
  asymmetricJoints: string[];
  dominantSide: 'left' | 'right' | 'balanced';
  recommendations: string[];
}

export interface PhaseTimingAnalysis {
  phase: string;
  averageDuration: number;
  targetDuration: number;
  consistency: number;
  efficiency: number;
}

export interface VelocityAnalysis {
  averageVelocity: number;
  peakVelocity: number;
  velocityConsistency: number;
  optimalVelocityRange: { min: number; max: number };
}

export interface RestPeriodAnalysis {
  averageRestTime: number;
  recommendedRestTime: number;
  recoveryEfficiency: number;
}

export interface FatigueAnalysis {
  timePoint: number; // minutes into session
  fatigueLevel: number; // 0-100
  performanceDecline: number; // percentage
  affectedMovements: string[];
}

export interface StrengthProgress {
  currentLevel: number;
  previousLevel: number;
  improvement: number;
  targetLevel: number;
  progressToTarget: number;
}

export interface ROMProgress {
  joint: string;
  currentROM: number;
  previousROM: number;
  improvement: number;
  targetROM: number;
  progressToTarget: number;
}

export interface EnduranceProgress {
  currentEndurance: number; // time in seconds
  previousEndurance: number;
  improvement: number;
  targetEndurance: number;
  progressToTarget: number;
}

export interface CoordinationProgress {
  currentScore: number;
  previousScore: number;
  improvement: number;
  targetScore: number;
  progressToTarget: number;
}

export interface ExerciseModification {
  type: 'progression' | 'regression' | 'variation';
  description: string;
  reason: string;
  expectedBenefit: string;
}

export interface SessionComparison {
  sessionDate: Date;
  score: number;
  improvement: number;
  keyChanges: string[];
}

export interface PopulationComparison {
  percentile: number;
  ageGroup: string;
  conditionGroup: string;
  comparisonMetrics: { [metric: string]: number };
}

export interface PersonalBestComparison {
  metric: string;
  currentValue: number;
  bestValue: number;
  dateAchieved: Date;
  improvementNeeded: number;
}

export interface SessionAnalysisProps {
  session: ExerciseSession;
  previousSessions?: ExerciseSession[];
  onClose?: () => void;
  onExportReport?: (analysis: DetailedAnalysis) => void;
}

const SessionAnalysisComponent: React.FC<SessionAnalysisProps> = ({
  session,
  previousSessions = [],
  onClose,
  onExportReport
}) => {
  const [analysis, setAnalysis] = useState<DetailedAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    generateDetailedAnalysis();
  }, [session]);

  const generateDetailedAnalysis = async () => {
    setLoading(true);
    
    try {
      // Simulate analysis generation (replace with actual analysis logic)
      const detailedAnalysis = await performComprehensiveAnalysis(session, previousSessions);
      setAnalysis(detailedAnalysis);
    } catch (error) {
      console.error('Failed to generate analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const performComprehensiveAnalysis = async (
    currentSession: ExerciseSession,
    historicalSessions: ExerciseSession[]
  ): Promise<DetailedAnalysis> => {
    // Calculate overall performance
    const overallPerformance = calculateOverallPerformance(currentSession, historicalSessions);
    
    // Analyze biomechanics
    const biomechanicalAnalysis = analyzeBiomechanics(currentSession);
    
    // Temporal analysis
    const temporalAnalysis = analyzeTemporalPatterns(currentSession);
    
    // Progress indicators
    const progressIndicators = calculateProgressIndicators(currentSession, historicalSessions);
    
    // Generate recommendations
    const recommendations = generateRecommendations(currentSession, biomechanicalAnalysis);
    
    // Risk assessment
    const riskAssessment = assessRisks(currentSession, biomechanicalAnalysis);
    
    // Comparison data
    const comparisonData = generateComparisonData(currentSession, historicalSessions);

    return {
      sessionId: currentSession.id,
      exerciseName: currentSession.exerciseName,
      overallPerformance,
      biomechanicalAnalysis,
      temporalAnalysis,
      progressIndicators,
      recommendations,
      riskAssessment,
      comparisonData
    };
  };

  const calculateOverallPerformance = (session: ExerciseSession, history: ExerciseSession[]) => {
    const score = session.averageScore;
    const grade = getGrade(score);
    const improvement = history.length > 0 ? 
      ((score - history[history.length - 1].averageScore) / history[history.length - 1].averageScore) * 100 : 0;
    const consistency = calculateConsistency(session.feedback);

    return { score, grade, improvement, consistency };
  };

  const getGrade = (score: number): 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F' => {
    if (score >= 97) return 'A+';
    if (score >= 93) return 'A';
    if (score >= 87) return 'B+';
    if (score >= 83) return 'B';
    if (score >= 77) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const calculateConsistency = (feedback: ExerciseFeedback[]): number => {
    if (feedback.length === 0) return 0;
    const scores = feedback.map(f => f.overallScore);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);
    return Math.max(0, 100 - (standardDeviation * 2)); // Convert to 0-100 scale
  };

  const analyzeBiomechanics = (session: ExerciseSession) => {
    // Mock biomechanical analysis
    const jointAccuracy: { [joint: string]: JointAnalysis } = {
      'shoulder': {
        joint: 'shoulder',
        averageAccuracy: 85,
        rangeAchieved: { min: 45, max: 165 },
        targetRange: { min: 30, max: 180 },
        consistency: 78,
        improvements: ['Better range of motion', 'Improved stability'],
        concerns: ['Slight compensation in late phases']
      },
      'elbow': {
        joint: 'elbow',
        averageAccuracy: 92,
        rangeAchieved: { min: 15, max: 145 },
        targetRange: { min: 0, max: 150 },
        consistency: 88,
        improvements: ['Excellent control throughout range'],
        concerns: []
      }
    };

    const movementQuality: MovementQuality = {
      smoothness: 82,
      control: 88,
      timing: 75,
      coordination: 80,
      overallQuality: 81
    };

    const compensationPatterns: CompensationPattern[] = [
      {
        pattern: 'Shoulder elevation during arm raise',
        severity: 'mild',
        affectedJoints: ['shoulder', 'neck'],
        description: 'Slight elevation of shoulder blade during arm elevation phases',
        correctionStrategy: 'Focus on scapular depression and retraction cues'
      }
    ];

    const symmetryAnalysis: SymmetryAnalysis = {
      leftRightSymmetry: 87,
      asymmetricJoints: ['shoulder'],
      dominantSide: 'right',
      recommendations: ['Include unilateral strengthening for left side']
    };

    return {
      jointAccuracy,
      movementQuality,
      compensationPatterns,
      symmetryAnalysis
    };
  };

  const analyzeTemporalPatterns = (session: ExerciseSession) => {
    const phaseTimings: PhaseTimingAnalysis[] = [
      {
        phase: 'Concentric',
        averageDuration: 2.1,
        targetDuration: 2.0,
        consistency: 85,
        efficiency: 88
      },
      {
        phase: 'Eccentric',
        averageDuration: 3.2,
        targetDuration: 3.0,
        consistency: 78,
        efficiency: 82
      }
    ];

    const movementVelocity: VelocityAnalysis = {
      averageVelocity: 45, // degrees per second
      peakVelocity: 78,
      velocityConsistency: 82,
      optimalVelocityRange: { min: 40, max: 60 }
    };

    const restPeriods: RestPeriodAnalysis = {
      averageRestTime: 45,
      recommendedRestTime: 60,
      recoveryEfficiency: 75
    };

    const fatigueLevels: FatigueAnalysis[] = [
      {
        timePoint: 5,
        fatigueLevel: 15,
        performanceDecline: 5,
        affectedMovements: []
      },
      {
        timePoint: 10,
        fatigueLevel: 35,
        performanceDecline: 12,
        affectedMovements: ['shoulder flexion']
      }
    ];

    return {
      phaseTimings,
      movementVelocity,
      restPeriods,
      fatigueLevels
    };
  };

  const calculateProgressIndicators = (session: ExerciseSession, history: ExerciseSession[]) => {
    const previousSession = history.length > 0 ? history[history.length - 1] : null;
    
    const strengthGains: StrengthProgress = {
      currentLevel: session.averageScore,
      previousLevel: previousSession?.averageScore || 0,
      improvement: previousSession ? 
        ((session.averageScore - previousSession.averageScore) / previousSession.averageScore) * 100 : 0,
      targetLevel: 90,
      progressToTarget: (session.averageScore / 90) * 100
    };

    const rangeOfMotion: ROMProgress = {
      joint: 'shoulder',
      currentROM: 165,
      previousROM: previousSession ? 160 : 0,
      improvement: 5,
      targetROM: 180,
      progressToTarget: (165 / 180) * 100
    };

    const endurance: EnduranceProgress = {
      currentEndurance: session.duration,
      previousEndurance: previousSession?.duration || 0,
      improvement: previousSession ? session.duration - previousSession.duration : 0,
      targetEndurance: 900, // 15 minutes
      progressToTarget: (session.duration / 900) * 100
    };

    const coordination: CoordinationProgress = {
      currentScore: 82,
      previousScore: previousSession ? 78 : 0,
      improvement: 4,
      targetScore: 90,
      progressToTarget: (82 / 90) * 100
    };

    return {
      strengthGains,
      rangeOfMotion,
      endurance,
      coordination
    };
  };

  const generateRecommendations = (session: ExerciseSession, biomechanics: any) => {
    const immediate = [
      'Focus on maintaining scapular stability during arm elevation',
      'Increase rest periods between repetitions to 60 seconds',
      'Pay attention to movement velocity in eccentric phase'
    ];

    const shortTerm = [
      'Add scapular stabilization exercises to warm-up routine',
      'Progress to next difficulty level in 2-3 sessions',
      'Include unilateral strengthening for left side'
    ];

    const longTerm = [
      'Transition to functional movement patterns',
      'Integrate sport-specific movements',
      'Consider advanced proprioceptive challenges'
    ];

    const exerciseModifications: ExerciseModification[] = [
      {
        type: 'progression',
        description: 'Add light resistance (1-2 lbs)',
        reason: 'Consistent performance at current level',
        expectedBenefit: 'Increased strength and endurance'
      }
    ];

    return {
      immediate,
      shortTerm,
      longTerm,
      exerciseModifications
    };
  };

  const assessRisks = (session: ExerciseSession, biomechanics: any) => {
    return {
      injuryRisk: 'low' as const,
      riskFactors: [
        'Mild compensation pattern in shoulder',
        'Slightly reduced left-right symmetry'
      ],
      preventiveMeasures: [
        'Continue scapular stabilization focus',
        'Monitor fatigue levels',
        'Maintain proper warm-up routine'
      ]
    };
  };

  const generateComparisonData = (session: ExerciseSession, history: ExerciseSession[]) => {
    const previousSessions: SessionComparison[] = history.slice(-5).map(s => ({
      sessionDate: s.startTime,
      score: s.averageScore,
      improvement: 0, // Calculate based on previous session
      keyChanges: ['Improved consistency', 'Better range of motion']
    }));

    const populationNorms: PopulationComparison = {
      percentile: 75,
      ageGroup: '25-35',
      conditionGroup: 'Post-injury rehabilitation',
      comparisonMetrics: {
        'Average Score': 82,
        'Session Duration': 720,
        'Repetitions': 15
      }
    };

    const personalBests: PersonalBestComparison = {
      metric: 'Overall Score',
      currentValue: session.averageScore,
      bestValue: Math.max(...history.map(s => s.averageScore), session.averageScore),
      dateAchieved: new Date(),
      improvementNeeded: 0
    };

    return {
      previousSessions,
      populationNorms,
      personalBests
    };
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (improvement < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Target className="w-4 h-4 text-gray-600" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating detailed analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <p className="text-gray-600">Failed to generate analysis. Please try again.</p>
        <Button onClick={generateDetailedAnalysis} className="mt-4">
          Retry Analysis
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Session Analysis</h1>
          <p className="text-gray-300 mt-1">{analysis.exerciseName} - {new Date(session.startTime).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => onExportReport?.(analysis)}
            className="text-white border-white hover:bg-white hover:text-black"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button 
            variant="outline" 
            className="text-white border-white hover:bg-white hover:text-black"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button onClick={onClose} className="bg-[#014585] text-white hover:bg-[#013a70]">
            Close
          </Button>
        </div>
      </div>

      {/* Overall Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Overall Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(analysis.overallPerformance.score)}`}>
                {analysis.overallPerformance.score}%
              </div>
              <div className="text-2xl font-semibold text-gray-600 mt-1">
                Grade {analysis.overallPerformance.grade}
              </div>
              <p className="text-sm text-gray-500 mt-1">Overall Score</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                {getImprovementIcon(analysis.overallPerformance.improvement)}
                <span className={`text-2xl font-bold ${
                  analysis.overallPerformance.improvement > 0 ? 'text-green-600' : 
                  analysis.overallPerformance.improvement < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {analysis.overallPerformance.improvement > 0 ? '+' : ''}
                  {analysis.overallPerformance.improvement.toFixed(1)}%
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">vs Previous Session</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {analysis.overallPerformance.consistency}%
              </div>
              <p className="text-sm text-gray-500 mt-1">Consistency</p>
              <Progress value={analysis.overallPerformance.consistency} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {session.repetitions}
              </div>
              <p className="text-sm text-gray-500 mt-1">Repetitions</p>
              <p className="text-xs text-gray-400 mt-1">{formatDuration(session.duration)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 bg-[#014585]">
          <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white data-[state=active]:text-[#014585]">Overview</TabsTrigger>
          <TabsTrigger value="biomechanics" className="text-white data-[state=active]:bg-white data-[state=active]:text-[#014585]">Biomechanics</TabsTrigger>
          <TabsTrigger value="temporal" className="text-white data-[state=active]:bg-white data-[state=active]:text-[#014585]">Timing</TabsTrigger>
          <TabsTrigger value="progress" className="text-white data-[state=active]:bg-white data-[state=active]:text-[#014585]">Progress</TabsTrigger>
          <TabsTrigger value="recommendations" className="text-white data-[state=active]:bg-white data-[state=active]:text-[#014585]">Recommendations</TabsTrigger>
          <TabsTrigger value="comparison" className="text-white data-[state=active]:bg-white data-[state=active]:text-[#014585]">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Movement Quality */}
            <Card>
              <CardHeader>
                <CardTitle>Movement Quality Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries({
                  'Smoothness': analysis.biomechanicalAnalysis.movementQuality.smoothness,
                  'Control': analysis.biomechanicalAnalysis.movementQuality.control,
                  'Timing': analysis.biomechanicalAnalysis.movementQuality.timing,
                  'Coordination': analysis.biomechanicalAnalysis.movementQuality.coordination
                }).map(([metric, value]) => (
                  <div key={metric}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{metric}</span>
                      <span className="font-semibold">{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={analysis.riskAssessment.injuryRisk === 'low' ? 'default' : 
                                  analysis.riskAssessment.injuryRisk === 'moderate' ? 'secondary' : 'destructive'}>
                      {analysis.riskAssessment.injuryRisk.toUpperCase()} RISK
                    </Badge>
                  </div>
                  
                  {analysis.riskAssessment.riskFactors.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Risk Factors:</h4>
                      <ul className="text-sm space-y-1">
                        {analysis.riskAssessment.riskFactors.map((factor, index) => (
                          <li key={index} className="text-gray-600">• {factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Preventive Measures:</h4>
                    <ul className="text-sm space-y-1">
                      {analysis.riskAssessment.preventiveMeasures.map((measure, index) => (
                        <li key={index} className="text-gray-600">• {measure}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="biomechanics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Joint Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Joint Accuracy Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(analysis.biomechanicalAnalysis.jointAccuracy).map(([joint, data]) => (
                  <div key={joint} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold capitalize">{data.joint}</h4>
                      <Badge variant="outline">{data.averageAccuracy}% accuracy</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Range Achieved</p>
                        <p className="font-semibold">{data.rangeAchieved.min}° - {data.rangeAchieved.max}°</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Target Range</p>
                        <p className="font-semibold">{data.targetRange.min}° - {data.targetRange.max}°</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Consistency</span>
                        <span>{data.consistency}%</span>
                      </div>
                      <Progress value={data.consistency} className="h-2" />
                    </div>
                    
                    {data.improvements.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-green-600 mb-1">Improvements:</p>
                        <ul className="text-xs space-y-1">
                          {data.improvements.map((improvement, index) => (
                            <li key={index} className="text-green-600">✓ {improvement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {data.concerns.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-yellow-600 mb-1">Areas for Focus:</p>
                        <ul className="text-xs space-y-1">
                          {data.concerns.map((concern, index) => (
                            <li key={index} className="text-yellow-600">⚠ {concern}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Compensation Patterns */}
            <Card>
              <CardHeader>
                <CardTitle>Compensation Patterns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.biomechanicalAnalysis.compensationPatterns.length > 0 ? (
                  analysis.biomechanicalAnalysis.compensationPatterns.map((pattern, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{pattern.pattern}</h4>
                        <Badge variant={pattern.severity === 'mild' ? 'default' : 
                                      pattern.severity === 'moderate' ? 'secondary' : 'destructive'}>
                          {pattern.severity}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{pattern.description}</p>
                      
                      <div className="text-sm">
                        <p className="font-medium mb-1">Affected Joints:</p>
                        <p className="text-gray-600">{pattern.affectedJoints.join(', ')}</p>
                      </div>
                      
                      <div className="mt-3 p-3 bg-blue-50 rounded">
                        <p className="text-sm font-medium text-blue-900 mb-1">Correction Strategy:</p>
                        <p className="text-sm text-blue-700">{pattern.correctionStrategy}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="text-green-600 font-semibold">No compensation patterns detected</p>
                    <p className="text-sm text-gray-600">Excellent movement quality maintained throughout session</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="temporal" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Phase Timing */}
            <Card>
              <CardHeader>
                <CardTitle>Phase Timing Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.temporalAnalysis.phaseTimings.map((phase, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{phase.phase} Phase</h4>
                      <Badge variant="outline">{phase.efficiency}% efficient</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Average Duration</p>
                        <p className="font-semibold">{phase.averageDuration}s</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Target Duration</p>
                        <p className="font-semibold">{phase.targetDuration}s</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Consistency</span>
                        <span>{phase.consistency}%</span>
                      </div>
                      <Progress value={phase.consistency} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Fatigue Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Fatigue Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.temporalAnalysis.fatigueLevels.map((fatigue, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-semibold">{fatigue.timePoint} minutes</p>
                        <p className="text-sm text-gray-600">
                          {fatigue.performanceDecline}% performance decline
                        </p>
                        {fatigue.affectedMovements.length > 0 && (
                          <p className="text-xs text-yellow-600">
                            Affected: {fatigue.affectedMovements.join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          fatigue.fatigueLevel < 30 ? 'text-green-600' :
                          fatigue.fatigueLevel < 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {fatigue.fatigueLevel}%
                        </div>
                        <p className="text-xs text-gray-500">fatigue level</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strength Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Indicators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries({
                  'Strength': analysis.progressIndicators.strengthGains,
                  'Endurance': analysis.progressIndicators.endurance,
                  'Coordination': analysis.progressIndicators.coordination
                }).map(([metric, data]) => (
                  <div key={metric} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">{metric}</h4>
                      <div className="flex items-center gap-1">
                        {getImprovementIcon(data.improvement)}
                        <span className={`font-semibold ${
                          data.improvement > 0 ? 'text-green-600' : 
                          data.improvement < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {data.improvement > 0 ? '+' : ''}{data.improvement.toFixed(1)}
                          {metric === 'Endurance' ? 's' : metric === 'Strength' || metric === 'Coordination' ? '%' : ''}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                      <div className="text-center">
                        <p className="text-gray-600">Previous</p>
                        <p className="font-semibold">
                          {metric === 'Endurance' ? formatDuration(data.previousLevel || data.previousEndurance || data.previousScore) : 
                           (data.previousLevel || data.previousEndurance || data.previousScore).toFixed(1)}
                          {metric === 'Endurance' ? '' : metric === 'Strength' || metric === 'Coordination' ? '%' : ''}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Current</p>
                        <p className="font-semibold">
                          {metric === 'Endurance' ? formatDuration(data.currentLevel || data.currentEndurance || data.currentScore) : 
                           (data.currentLevel || data.currentEndurance || data.currentScore).toFixed(1)}
                          {metric === 'Endurance' ? '' : metric === 'Strength' || metric === 'Coordination' ? '%' : ''}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Target</p>
                        <p className="font-semibold">
                          {metric === 'Endurance' ? formatDuration(data.targetLevel || data.targetEndurance || data.targetScore) : 
                           (data.targetLevel || data.targetEndurance || data.targetScore).toFixed(1)}
                          {metric === 'Endurance' ? '' : metric === 'Strength' || metric === 'Coordination' ? '%' : ''}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress to Target</span>
                        <span>{data.progressToTarget.toFixed(1)}%</span>
                      </div>
                      <Progress value={data.progressToTarget} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Range of Motion */}
            <Card>
              <CardHeader>
                <CardTitle>Range of Motion Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold capitalize">{analysis.progressIndicators.rangeOfMotion.joint}</h4>
                    <div className="flex items-center gap-1">
                      {getImprovementIcon(analysis.progressIndicators.rangeOfMotion.improvement)}
                      <span className={`font-semibold ${
                        analysis.progressIndicators.rangeOfMotion.improvement > 0 ? 'text-green-600' : 
                        analysis.progressIndicators.rangeOfMotion.improvement < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {analysis.progressIndicators.rangeOfMotion.improvement > 0 ? '+' : ''}
                        {analysis.progressIndicators.rangeOfMotion.improvement}°
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                    <div className="text-center">
                      <p className="text-gray-600">Previous</p>
                      <p className="font-semibold">{analysis.progressIndicators.rangeOfMotion.previousROM}°</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Current</p>
                      <p className="font-semibold">{analysis.progressIndicators.rangeOfMotion.currentROM}°</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Target</p>
                      <p className="font-semibold">{analysis.progressIndicators.rangeOfMotion.targetROM}°</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress to Target</span>
                      <span>{analysis.progressIndicators.rangeOfMotion.progressToTarget.toFixed(1)}%</span>
                    </div>
                    <Progress value={analysis.progressIndicators.rangeOfMotion.progressToTarget} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Immediate Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Immediate Focus Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.recommendations.immediate.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Short-term Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-yellow-600">Short-term Goals (1-2 weeks)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.recommendations.shortTerm.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Long-term Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Long-term Objectives (1+ months)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.recommendations.longTerm.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Exercise Modifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Exercise Modifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.recommendations.exerciseModifications.map((mod, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={mod.type === 'progression' ? 'default' : 
                                    mod.type === 'regression' ? 'secondary' : 'outline'}>
                        {mod.type}
                      </Badge>
                      <h4 className="font-semibold">{mod.description}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{mod.reason}</p>
                    <div className="p-2 bg-blue-50 rounded">
                      <p className="text-sm text-blue-700">
                        <strong>Expected Benefit:</strong> {mod.expectedBenefit}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Session History */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Session Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.comparisonData.previousSessions.map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-semibold">{session.sessionDate.toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">
                          {session.keyChanges.join(', ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${getScoreColor(session.score)}`}>
                          {session.score}%
                        </div>
                        {session.improvement !== 0 && (
                          <div className={`text-sm ${
                            session.improvement > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {session.improvement > 0 ? '+' : ''}{session.improvement.toFixed(1)}%
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Population Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Population Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {analysis.comparisonData.populationNorms.percentile}th
                    </div>
                    <p className="text-sm text-gray-600">Percentile</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {analysis.comparisonData.populationNorms.ageGroup} • {analysis.comparisonData.populationNorms.conditionGroup}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    {Object.entries(analysis.comparisonData.populationNorms.comparisonMetrics).map(([metric, value]) => (
                      <div key={metric} className="flex justify-between items-center">
                        <span className="text-sm">{metric}</span>
                        <span className="font-semibold">
                          {metric.includes('Duration') ? formatDuration(value) : 
                           metric.includes('Score') ? `${value}%` : value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Best */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Best Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">{analysis.comparisonData.personalBests.metric}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 text-sm">Current</p>
                        <p className="text-xl font-bold">
                          {analysis.comparisonData.personalBests.currentValue}
                          {analysis.comparisonData.personalBests.metric.includes('Score') ? '%' : ''}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Personal Best</p>
                        <p className="text-xl font-bold text-green-600">
                          {analysis.comparisonData.personalBests.bestValue}
                          {analysis.comparisonData.personalBests.metric.includes('Score') ? '%' : ''}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Best achieved on {analysis.comparisonData.personalBests.dateAchieved.toLocaleDateString()}
                    </p>
                  </div>
                  
                  {analysis.comparisonData.personalBests.improvementNeeded > 0 && (
                    <Alert>
                      <AlertDescription>
                        You need {analysis.comparisonData.personalBests.improvementNeeded.toFixed(1)}
                        {analysis.comparisonData.personalBests.metric.includes('Score') ? '%' : ''} more to beat your personal best!
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SessionAnalysisComponent;