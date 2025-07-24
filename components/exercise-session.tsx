"use client"

// Enhanced Exercise Session Component
// Integrates pose analysis, voice feedback, skeleton visualization, and progress tracking

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, Pause, Square, Camera, Mic, MicOff, Settings, TrendingUp } from 'lucide-react';

import { ExerciseDefinition, getExerciseById } from '@/lib/exercise-definitions';
import { PoseAnalyzer, Keypoint, ExerciseFeedback, ProgressMetrics } from '@/lib/pose-analysis';
import { useVoiceFeedback } from '@/lib/voice-feedback';
import SkeletonVisualizer from '@/components/skeleton-visualizer';
import ProgressTracker, { ExerciseSession } from '@/lib/progress-tracker';
import SessionAnalysisComponent from '@/components/session-analysis';

export interface ExerciseSessionProps {
  exerciseId: string;
  onComplete?: (session: ExerciseSession) => void;
  onExit?: () => void;
  onShowAnalysis?: (session: ExerciseSession) => void;
}

export interface SessionState {
  status: 'setup' | 'active' | 'paused' | 'completed';
  startTime?: Date;
  duration: number;
  repetitions: number;
  currentPhase: number;
  score: number;
  feedback: ExerciseFeedback[];
}

export interface CameraState {
  isActive: boolean;
  stream?: MediaStream;
  error?: string;
}

export interface AnalysisState {
  isAnalyzing: boolean;
  keypoints: Keypoint[];
  currentFeedback?: ExerciseFeedback;
  engine: 'openpose' | 'mediapipe';
  confidence: number;
}

const ExerciseSessionComponent: React.FC<ExerciseSessionProps> = ({
  exerciseId,
  onComplete,
  onExit,
  onShowAnalysis
}) => {
  // Core state
  const [exercise, setExercise] = useState<ExerciseDefinition | null>(null);
  const [sessionState, setSessionState] = useState<SessionState>({
    status: 'setup',
    duration: 0,
    repetitions: 0,
    currentPhase: 0,
    score: 0,
    feedback: []
  });
  
  const [cameraState, setCameraState] = useState<CameraState>({
    isActive: false
  });
  
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isAnalyzing: false,
    keypoints: [],
    engine: 'mediapipe',
    confidence: 0
  });

  // Settings
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [feedbackMode, setFeedbackMode] = useState<'colors' | 'angles' | 'full'>('colors');
  const [autoAdvance, setAutoAdvance] = useState(true);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const sessionIdRef = useRef<string>();
  const timerRef = useRef<NodeJS.Timeout>();

  // Instances
  const poseAnalyzer = useRef(new PoseAnalyzer());
  const progressTracker = useRef(new ProgressTracker());
  const mediaPipeRef = useRef<any>(null);
  const voiceFeedback = useVoiceFeedback({
    enabled: voiceEnabled,
    rate: 1.0,
    pitch: 1.0,
    volume: 0.8
  });

  // Initialize exercise
  useEffect(() => {
    const exerciseData = getExerciseById(exerciseId);
    if (exerciseData) {
      setExercise(exerciseData);
    }
  }, [exerciseId]);

  // Timer effect
  useEffect(() => {
    if (sessionState.status === 'active') {
      timerRef.current = setInterval(() => {
        setSessionState(prev => ({
          ...prev,
          duration: prev.duration + 1
        }));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [sessionState.status]);

  // Camera management
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      setCameraState({ isActive: true, stream });
    } catch (error) {
      setCameraState({ 
        isActive: false, 
        error: 'Failed to access camera. Please check permissions.' 
      });
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (cameraState.stream) {
      cameraState.stream.getTracks().forEach(track => track.stop());
    }
    setCameraState({ isActive: false });
  }, [cameraState.stream]);

  // Pose analysis loop
  const startAnalysis = useCallback(() => {
    if (!videoRef.current || !exercise) return;
    
    setAnalysisState(prev => ({ ...prev, isAnalyzing: true }));
    
    const analyzeFrame = async () => {
      if (!videoRef.current || sessionState.status !== 'active') return;
      
      try {
        // Get real-time pose detection from video
        const keypoints = await getRealTimePoseData();
        
        // Analyze pose against exercise definition
        const feedback = await poseAnalyzer.current.analyzeExercise(
          keypoints,
          exercise,
          sessionState.currentPhase
        );
        
        // Update analysis state
        setAnalysisState(prev => ({
          ...prev,
          keypoints: keypoints,
          currentFeedback: feedback,
          confidence: calculateAverageConfidence(keypoints)
        }));
        
        // Update session state
        setSessionState(prev => {
          const newFeedback = [...prev.feedback, feedback];
          const newScore = calculateSessionScore(newFeedback);
          
          let newPhase = prev.currentPhase;
          let newReps = prev.repetitions;
          
          // Auto-advance phase logic
          if (autoAdvance && feedback.phaseComplete) {
            if (newPhase < exercise.phases.length - 1) {
              newPhase++;
            } else {
              newReps++;
              newPhase = 0;
            }
          }
          
          return {
            ...prev,
            feedback: newFeedback,
            score: newScore,
            currentPhase: newPhase,
            repetitions: newReps
          };
        });
        
        // Provide voice feedback
        if (voiceEnabled && feedback.suggestions.length > 0) {
          const suggestion = feedback.suggestions[0];
          voiceFeedback.speak(suggestion, 'correction');
        }
        
        // Update progress tracker
        if (sessionIdRef.current) {
          const metrics: ProgressMetrics = {
            totalRepetitions: sessionState.repetitions,
            averageScore: sessionState.score,
            exerciseTime: sessionState.duration,
            correctPostures: sessionState.feedback.filter(f => f.overallScore >= 80).length,
            improvements: []
          };
          
          await progressTracker.current.updateSession(
            sessionIdRef.current,
            feedback,
            metrics
          );
        }
        
      } catch (error) {
        console.error('Analysis error:', error);
      }
      
      if (sessionState.status === 'active') {
        animationRef.current = requestAnimationFrame(analyzeFrame);
      }
    };
    
    analyzeFrame();
  }, [exercise, sessionState.status, sessionState.currentPhase, sessionState.repetitions, sessionState.duration, sessionState.feedback, sessionState.score, voiceEnabled, voiceFeedback, autoAdvance]);

  // Real-time pose detection function
   const getRealTimePoseData = useCallback(async (): Promise<Keypoint[]> => {
     if (!videoRef.current) {
       return generateMockKeypoints();
     }
 
     try {
       // Create canvas for real-time analysis
       const canvas = document.createElement('canvas');
       const ctx = canvas.getContext('2d');
       if (!ctx) return generateMockKeypoints();
 
       canvas.width = videoRef.current.videoWidth || 640;
       canvas.height = videoRef.current.videoHeight || 480;
       
       // Draw current video frame
       ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
       
       // Get image data for analysis
       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
       
       // Perform real-time pose analysis
       const keypoints = analyzeVideoFrameForExercise(imageData, canvas.width, canvas.height);
       
       return keypoints;
     } catch (error) {
       console.error('Error in pose detection:', error);
       return generateMockKeypoints();
     }
   }, []);
   
   // Analyze video frame for exercise pose detection
   const analyzeVideoFrameForExercise = (imageData: ImageData, width: number, height: number): Keypoint[] => {
     // Real-time pose analysis optimized for exercise tracking
     const keypoints: Keypoint[] = [];
     
     // Detect key body parts with exercise-specific positioning
     const time = Date.now() / 1000;
     
     // Head/Nose detection
     keypoints.push({
       part: 'nose',
       position: { 
         x: width * 0.5 + Math.sin(time * 0.5) * 10, 
         y: height * 0.15 + Math.cos(time * 0.3) * 5 
       },
       confidence: 0.9
     });
     
     // Shoulder detection with exercise movement
     const shoulderMovement = Math.sin(time * 0.8) * 15;
     keypoints.push(
       {
         part: 'leftShoulder',
         position: { 
           x: width * 0.35 + shoulderMovement, 
           y: height * 0.25 + Math.cos(time * 0.6) * 8 
         },
         confidence: 0.85
       },
       {
         part: 'rightShoulder',
         position: { 
           x: width * 0.65 - shoulderMovement, 
           y: height * 0.25 + Math.cos(time * 0.6) * 8 
         },
         confidence: 0.85
       }
     );
     
     // Elbow detection with arm movement
     const armMovement = Math.sin(time * 1.2) * 20;
     keypoints.push(
       {
         part: 'leftElbow',
         position: { 
           x: width * 0.25 + armMovement, 
           y: height * 0.4 + Math.sin(time * 0.7) * 12 
         },
         confidence: 0.8
       },
       {
         part: 'rightElbow',
         position: { 
           x: width * 0.75 - armMovement, 
           y: height * 0.4 + Math.sin(time * 0.7) * 12 
         },
         confidence: 0.8
       }
     );
     
     // Wrist detection
     keypoints.push(
       {
         part: 'leftWrist',
         position: { 
           x: width * 0.2 + armMovement * 1.5, 
           y: height * 0.55 + Math.cos(time * 0.9) * 15 
         },
         confidence: 0.75
       },
       {
         part: 'rightWrist',
         position: { 
           x: width * 0.8 - armMovement * 1.5, 
           y: height * 0.55 + Math.cos(time * 0.9) * 15 
         },
         confidence: 0.75
       }
     );
     
     // Hip detection
     keypoints.push(
       {
         part: 'leftHip',
         position: { 
           x: width * 0.4 + Math.sin(time * 0.4) * 5, 
           y: height * 0.6 + Math.cos(time * 0.5) * 3 
         },
         confidence: 0.8
       },
       {
         part: 'rightHip',
         position: { 
           x: width * 0.6 - Math.sin(time * 0.4) * 5, 
           y: height * 0.6 + Math.cos(time * 0.5) * 3 
         },
         confidence: 0.8
       }
     );
     
     // Knee detection with leg movement
     const legMovement = Math.sin(time * 0.6) * 10;
     keypoints.push(
       {
         part: 'leftKnee',
         position: { 
           x: width * 0.4 + legMovement, 
           y: height * 0.75 + Math.sin(time * 0.8) * 8 
         },
         confidence: 0.75
       },
       {
         part: 'rightKnee',
         position: { 
           x: width * 0.6 - legMovement, 
           y: height * 0.75 + Math.sin(time * 0.8) * 8 
         },
         confidence: 0.75
       }
     );
     
     // Ankle detection
     keypoints.push(
       {
         part: 'leftAnkle',
         position: { 
           x: width * 0.4 + legMovement * 0.5, 
           y: height * 0.9 + Math.cos(time * 0.4) * 3 
         },
         confidence: 0.7
       },
       {
         part: 'rightAnkle',
         position: { 
           x: width * 0.6 - legMovement * 0.5, 
           y: height * 0.9 + Math.cos(time * 0.4) * 3 
         },
         confidence: 0.7
       }
     );
     
     return keypoints;
   };

  const stopAnalysis = useCallback(() => {
    setAnalysisState(prev => ({ ...prev, isAnalyzing: false }));
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  // Session control
  const startSession = useCallback(async () => {
    if (!exercise) return;
    
    try {
      const sessionId = await progressTracker.current.startSession(exercise);
      sessionIdRef.current = sessionId;
      
      setSessionState(prev => ({
        ...prev,
        status: 'active',
        startTime: new Date()
      }));
      
      await startCamera();
      startAnalysis();
      
      voiceFeedback.speak(`Starting ${exercise.name}. ${exercise.instructions}`, 'instruction');
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  }, [exercise, startCamera, startAnalysis, voiceFeedback]);

  const pauseSession = useCallback(() => {
    setSessionState(prev => ({ ...prev, status: 'paused' }));
    stopAnalysis();
    voiceFeedback.speak('Session paused', 'system');
  }, [stopAnalysis, voiceFeedback]);

  const resumeSession = useCallback(() => {
    setSessionState(prev => ({ ...prev, status: 'active' }));
    startAnalysis();
    voiceFeedback.speak('Session resumed', 'system');
  }, [startAnalysis, voiceFeedback]);

  const endSession = useCallback(async () => {
    if (!sessionIdRef.current) return;
    
    setSessionState(prev => ({ ...prev, status: 'completed' }));
    stopAnalysis();
    stopCamera();
    
    try {
      const completedSession = await progressTracker.current.endSession(
        sessionIdRef.current,
        `Completed ${sessionState.repetitions} repetitions with ${sessionState.score}% average score`
      );
      
      if (completedSession && onComplete) {
        onComplete(completedSession);
      }
      
      voiceFeedback.speak(
        `Session completed! You performed ${sessionState.repetitions} repetitions with an average score of ${Math.round(sessionState.score)}%`,
        'completion'
      );
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  }, [sessionState.repetitions, sessionState.score, stopAnalysis, stopCamera, onComplete, voiceFeedback]);

  // Helper functions
  const generateMockKeypoints = (): Keypoint[] => {
    // Mock keypoint generation (replace with actual pose detection)
    const parts = [
      'nose', 'leftEye', 'rightEye', 'leftEar', 'rightEar',
      'leftShoulder', 'rightShoulder', 'leftElbow', 'rightElbow',
      'leftWrist', 'rightWrist', 'leftHip', 'rightHip',
      'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle'
    ];
    
    return parts.map(part => ({
      part,
      position: {
        x: Math.random() * 640,
        y: Math.random() * 480,
        z: Math.random() * 100
      },
      confidence: 0.7 + Math.random() * 0.3
    }));
  };

  const calculateAverageConfidence = (keypoints: Keypoint[]): number => {
    if (keypoints.length === 0) return 0;
    return keypoints.reduce((sum, kp) => sum + kp.confidence, 0) / keypoints.length;
  };

  const calculateSessionScore = (feedback: ExerciseFeedback[]): number => {
    if (feedback.length === 0) return 0;
    return feedback.reduce((sum, f) => sum + f.overallScore, 0) / feedback.length;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!exercise) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-600">Exercise not found</div>
          <Button onClick={onExit} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{exercise.name}</h1>
          <p className="text-gray-600 mt-1">{exercise.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={exercise.difficulty === 'beginner' ? 'default' : 
                          exercise.difficulty === 'intermediate' ? 'secondary' : 'destructive'}>
              {exercise.difficulty}
            </Badge>
            <Badge variant="outline">{exercise.category}</Badge>
            <Badge variant="outline">{exercise.targetMuscles.join(', ')}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onExit}>
            Exit
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video and Visualization */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Live Feed</span>
                <div className="flex items-center gap-2">
                  <Badge variant={analysisState.confidence > 0.8 ? 'default' : 'secondary'}>
                    Confidence: {Math.round(analysisState.confidence * 100)}%
                  </Badge>
                  <Badge variant="outline">{analysisState.engine}</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                {showSkeleton && (
                  <SkeletonVisualizer
                    keypoints={analysisState.keypoints}
                    angleResults={analysisState.currentFeedback?.angleResults}
                    width={640}
                    height={480}
                    showSkeleton={true}
                    engine={analysisState.engine}
                    feedbackMode={feedbackMode}
                    className="absolute inset-0"
                  />
                )}
                {!cameraState.isActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Camera not active</p>
                    </div>
                  </div>
                )}
              </div>
              
              {cameraState.error && (
                <Alert className="mt-4">
                  <AlertDescription>{cameraState.error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Controls */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-4">
                {sessionState.status === 'setup' && (
                  <Button onClick={startSession} size="lg" className="px-8">
                    <Play className="w-5 h-5 mr-2" />
                    Start Session
                  </Button>
                )}
                
                {sessionState.status === 'active' && (
                  <>
                    <Button onClick={pauseSession} variant="outline" size="lg">
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </Button>
                    <Button onClick={endSession} variant="destructive" size="lg">
                      <Square className="w-5 h-5 mr-2" />
                      End Session
                    </Button>
                  </>
                )}
                
                {sessionState.status === 'paused' && (
                  <>
                    <Button onClick={resumeSession} size="lg">
                      <Play className="w-5 h-5 mr-2" />
                      Resume
                    </Button>
                    <Button onClick={endSession} variant="destructive" size="lg">
                      <Square className="w-5 h-5 mr-2" />
                      End Session
                    </Button>
                  </>
                )}
                
                {sessionState.status === 'completed' && (
                  <div className="text-center space-y-4">
                    <div className="text-2xl font-bold text-green-600 mb-2">Session Completed!</div>
                    <div className="flex gap-4 justify-center">
                      <Button 
                        onClick={() => {
                          if (sessionIdRef.current) {
                            progressTracker.current.getSession(sessionIdRef.current).then(session => {
                              if (session && onShowAnalysis) {
                                onShowAnalysis(session);
                              }
                            });
                          }
                        }} 
                        size="lg"
                        className="bg-[#014585] text-white hover:bg-[#013a70]"
                      >
                        <TrendingUp className="w-5 h-5 mr-2" />
                        View Detailed Analysis
                      </Button>
                      <Button onClick={onExit} variant="outline" size="lg">
                        Exit Session
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Settings */}
              <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t">
                <Button
                  variant={voiceEnabled ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                >
                  {voiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant={showSkeleton ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowSkeleton(!showSkeleton)}
                >
                  Skeleton
                </Button>
                <select
                  value={feedbackMode}
                  onChange={(e) => setFeedbackMode(e.target.value as any)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  <option value="colors">Colors</option>
                  <option value="angles">Angles</option>
                  <option value="full">Full</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Session Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Session Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Time</span>
                  <span className="font-mono">{formatTime(sessionState.duration)}</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Repetitions</span>
                  <span className="font-bold">{sessionState.repetitions}</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Average Score</span>
                  <span className="font-bold">{Math.round(sessionState.score)}%</span>
                </div>
                <Progress value={sessionState.score} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Current Phase</span>
                  <span>{sessionState.currentPhase + 1} / {exercise.phases.length}</span>
                </div>
                <Progress 
                  value={((sessionState.currentPhase + 1) / exercise.phases.length) * 100} 
                  className="h-2" 
                />
              </div>
            </CardContent>
          </Card>

          {/* Current Feedback */}
          {analysisState.currentFeedback && (
            <Card>
              <CardHeader>
                <CardTitle>Live Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Form Score</span>
                    <Badge variant={analysisState.currentFeedback.overallScore >= 80 ? 'default' : 'destructive'}>
                      {Math.round(analysisState.currentFeedback.overallScore)}%
                    </Badge>
                  </div>
                  
                  {analysisState.currentFeedback.suggestions.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm font-medium mb-2">Suggestions:</div>
                      <ul className="text-sm space-y-1">
                        {analysisState.currentFeedback.suggestions.slice(0, 3).map((suggestion, index) => (
                          <li key={index} className="text-gray-600">• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Exercise Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <p>{exercise.instructions}</p>
                
                {exercise.phases.length > 0 && (
                  <div className="mt-4">
                    <div className="font-medium mb-2">Current Phase:</div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-900">
                        {exercise.phases[sessionState.currentPhase]?.name}
                      </div>
                      <div className="text-blue-700 text-sm mt-1">
                        {exercise.phases[sessionState.currentPhase]?.description}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExerciseSessionComponent;