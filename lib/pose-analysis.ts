// Pose Analysis Engine for Real-time Physiotherapy Feedback
// Calculates joint angles and compares against exercise definitions

import { ExerciseDefinition, ExercisePhase, JointAngle } from './exercise-definitions';

export interface Keypoint {
  part: string;
  position: { x: number; y: number; z?: number };
  confidence: number;
}

export interface PoseData {
  keypoints: Keypoint[];
  engine: 'openpose' | 'mediapipe';
  score: number;
  timestamp: number;
}

export interface AngleCalculation {
  joint: string;
  angle: number;
  confidence: number;
  status: 'correct' | 'too_low' | 'too_high' | 'unknown';
  deviation: number; // degrees from target
}

export interface ExerciseFeedback {
  phase: string;
  overallScore: number; // 0-100
  angleResults: AngleCalculation[];
  feedback: string[];
  isCorrect: boolean;
  suggestions: string[];
  phaseComplete?: boolean;
}

export interface ProgressMetrics {
  exerciseId: string;
  sessionId: string;
  timestamp: number;
  duration: number;
  repetitions: number;
  averageScore: number;
  maxScore: number;
  minScore: number;
  angleAccuracy: { [joint: string]: number };
  improvements: string[];
  areas_for_focus: string[];
}

// Joint angle calculation functions
export class PoseAnalyzer {
  private static instance: PoseAnalyzer;
  private currentExercise: ExerciseDefinition | null = null;
  private currentPhase: number = 0;
  private sessionMetrics: ProgressMetrics[] = [];

  static getInstance(): PoseAnalyzer {
    if (!PoseAnalyzer.instance) {
      PoseAnalyzer.instance = new PoseAnalyzer();
    }
    return PoseAnalyzer.instance;
  }

  setCurrentExercise(exercise: ExerciseDefinition): void {
    this.currentExercise = exercise;
    this.currentPhase = 0;
  }

  // Calculate angle between three points (p1-p2-p3, where p2 is the vertex)
  private calculateAngle(p1: { x: number; y: number }, p2: { x: number; y: number }, p3: { x: number; y: number }): number {
    const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
    
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    
    if (mag1 === 0 || mag2 === 0) return 0;
    
    const cosAngle = dot / (mag1 * mag2);
    const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
    
    return (angle * 180) / Math.PI;
  }

  // Get keypoint by name
  private getKeypoint(keypoints: Keypoint[], name: string): Keypoint | null {
    return keypoints.find(kp => kp.part === name) || null;
  }

  // Calculate specific joint angles based on keypoints
  calculateJointAngles(poseData: PoseData): { [joint: string]: AngleCalculation } {
    const { keypoints } = poseData;
    const angles: { [joint: string]: AngleCalculation } = {};

    // Shoulder flexion (arm raise) - angle between torso and upper arm
    const leftShoulder = this.getKeypoint(keypoints, 'leftShoulder');
    const leftElbow = this.getKeypoint(keypoints, 'leftElbow');
    const leftHip = this.getKeypoint(keypoints, 'leftHip');
    
    if (leftShoulder && leftElbow && leftHip) {
      const angle = this.calculateAngle(leftHip.position, leftShoulder.position, leftElbow.position);
      const confidence = Math.min(leftShoulder.confidence, leftElbow.confidence, leftHip.confidence);
      
      angles['shoulder_flexion'] = {
        joint: 'shoulder_flexion',
        angle: 180 - angle, // Convert to flexion angle
        confidence,
        status: 'unknown',
        deviation: 0
      };
    }

    // Elbow flexion
    const leftWrist = this.getKeypoint(keypoints, 'leftWrist');
    if (leftShoulder && leftElbow && leftWrist) {
      const angle = this.calculateAngle(leftShoulder.position, leftElbow.position, leftWrist.position);
      const confidence = Math.min(leftShoulder.confidence, leftElbow.confidence, leftWrist.confidence);
      
      angles['elbow_flexion'] = {
        joint: 'elbow_flexion',
        angle,
        confidence,
        status: 'unknown',
        deviation: 0
      };
    }

    // Knee flexion
    const leftKnee = this.getKeypoint(keypoints, 'leftKnee');
    const leftAnkle = this.getKeypoint(keypoints, 'leftAnkle');
    if (leftHip && leftKnee && leftAnkle) {
      const angle = this.calculateAngle(leftHip.position, leftKnee.position, leftAnkle.position);
      const confidence = Math.min(leftHip.confidence, leftKnee.confidence, leftAnkle.confidence);
      
      angles['knee_flexion'] = {
        joint: 'knee_flexion',
        angle,
        confidence,
        status: 'unknown',
        deviation: 0
      };
    }

    // Hip flexion (for seated exercises)
    const leftKneeForHip = this.getKeypoint(keypoints, 'leftKnee');
    if (leftShoulder && leftHip && leftKneeForHip) {
      const angle = this.calculateAngle(leftShoulder.position, leftHip.position, leftKneeForHip.position);
      const confidence = Math.min(leftShoulder.confidence, leftHip.confidence, leftKneeForHip.confidence);
      
      angles['hip_flexion'] = {
        joint: 'hip_flexion',
        angle,
        confidence,
        status: 'unknown',
        deviation: 0
      };
    }

    // Ankle dorsiflexion
    const leftToe = this.getKeypoint(keypoints, 'leftBigToe') || this.getKeypoint(keypoints, 'leftAnkle');
    if (leftKnee && leftAnkle && leftToe) {
      const angle = this.calculateAngle(leftKnee.position, leftAnkle.position, leftToe.position);
      const confidence = Math.min(leftKnee.confidence, leftAnkle.confidence, leftToe.confidence);
      
      angles['ankle_dorsiflexion'] = {
        joint: 'ankle_dorsiflexion',
        angle,
        confidence,
        status: 'unknown',
        deviation: 0
      };
    }

    // Trunk alignment (spine angle)
    const nose = this.getKeypoint(keypoints, 'nose');
    if (nose && leftShoulder && leftHip) {
      const angle = this.calculateAngle(nose.position, leftShoulder.position, leftHip.position);
      const confidence = Math.min(nose.confidence, leftShoulder.confidence, leftHip.confidence);
      
      angles['trunk_alignment'] = {
        joint: 'trunk_alignment',
        angle: 180 - angle, // Convert to upright angle
        confidence,
        status: 'unknown',
        deviation: 0
      };
    }

    return angles;
  }

  // Main analysis method called by components
  async analyzeExercise(keypoints: Keypoint[], exercise: ExerciseDefinition, currentPhase: number): Promise<ExerciseFeedback> {
    const poseData: PoseData = {
      keypoints,
      engine: 'mediapipe',
      score: 0,
      timestamp: Date.now()
    };
    
    const phase = exercise.phases[currentPhase] || exercise.phases[0];
    const feedback = this.analyzeExerciseForm(poseData, phase);
    
    // Add phase completion logic
    const phaseComplete = feedback.overallScore >= 80;
    
    return {
      ...feedback,
      phaseComplete
    };
  }

  // Compare calculated angles against exercise requirements
  analyzeExerciseForm(poseData: PoseData, exercisePhase: ExercisePhase): ExerciseFeedback {
    const calculatedAngles = this.calculateJointAngles(poseData);
    const angleResults: AngleCalculation[] = [];
    const feedback: string[] = [];
    const suggestions: string[] = [];
    let totalScore = 0;
    let validAngles = 0;

    // Analyze each required angle for this phase
    exercisePhase.keyAngles.forEach(requiredAngle => {
      const calculated = calculatedAngles[requiredAngle.joint];
      
      if (calculated && calculated.confidence > 0.5) {
        const deviation = Math.abs(calculated.angle - requiredAngle.targetAngle);
        calculated.deviation = deviation;
        
        // Determine status based on tolerance
        if (deviation <= requiredAngle.tolerance) {
          calculated.status = 'correct';
          feedback.push(requiredAngle.feedback.correct);
          totalScore += 100;
        } else if (calculated.angle < requiredAngle.minAngle) {
          calculated.status = 'too_low';
          feedback.push(requiredAngle.feedback.tooLow);
          suggestions.push(`Increase ${requiredAngle.joint} angle by ${Math.round(requiredAngle.minAngle - calculated.angle)}°`);
          totalScore += Math.max(0, 100 - (deviation * 2));
        } else if (calculated.angle > requiredAngle.maxAngle) {
          calculated.status = 'too_high';
          feedback.push(requiredAngle.feedback.tooHigh);
          suggestions.push(`Decrease ${requiredAngle.joint} angle by ${Math.round(calculated.angle - requiredAngle.maxAngle)}°`);
          totalScore += Math.max(0, 100 - (deviation * 2));
        } else {
          calculated.status = 'correct';
          feedback.push(requiredAngle.feedback.general);
          totalScore += Math.max(50, 100 - deviation);
        }
        
        angleResults.push(calculated);
        validAngles++;
      } else {
        // Low confidence or missing keypoint
        feedback.push(`Cannot detect ${requiredAngle.joint} clearly`);
        suggestions.push('Ensure you are fully visible in the camera');
      }
    });

    const overallScore = validAngles > 0 ? Math.round(totalScore / validAngles) : 0;
    const isCorrect = overallScore >= 80;

    return {
      phase: exercisePhase.name,
      overallScore,
      angleResults,
      feedback: feedback.slice(0, 3), // Limit feedback messages
      isCorrect,
      suggestions: suggestions.slice(0, 2) // Limit suggestions
    };
  }

  // Auto-detect exercise phase based on pose
  detectExercisePhase(poseData: PoseData, exercise: ExerciseDefinition): number {
    if (!exercise.phases.length) return 0;

    let bestPhase = 0;
    let bestScore = 0;

    exercise.phases.forEach((phase, index) => {
      const feedback = this.analyzeExerciseForm(poseData, phase);
      if (feedback.overallScore > bestScore) {
        bestScore = feedback.overallScore;
        bestPhase = index;
      }
    });

    return bestPhase;
  }

  // Generate voice feedback text
  generateVoiceFeedback(feedback: ExerciseFeedback): string {
    if (feedback.isCorrect) {
      return feedback.feedback[0] || 'Good form!';
    } else {
      return feedback.suggestions[0] || feedback.feedback[0] || 'Adjust your position';
    }
  }

  // Track progress over time
  recordProgress(exerciseId: string, feedback: ExerciseFeedback, duration: number): void {
    const sessionId = `session_${Date.now()}`;
    
    const angleAccuracy: { [joint: string]: number } = {};
    feedback.angleResults.forEach(result => {
      angleAccuracy[result.joint] = Math.max(0, 100 - result.deviation);
    });

    const metrics: ProgressMetrics = {
      exerciseId,
      sessionId,
      timestamp: Date.now(),
      duration,
      repetitions: 1, // This would be tracked separately
      averageScore: feedback.overallScore,
      maxScore: feedback.overallScore,
      minScore: feedback.overallScore,
      angleAccuracy,
      improvements: feedback.isCorrect ? ['Form improved'] : [],
      areas_for_focus: feedback.suggestions
    };

    this.sessionMetrics.push(metrics);
    
    // Store in localStorage for persistence
    try {
      const stored = localStorage.getItem('physiotherapy_progress') || '[]';
      const allMetrics = JSON.parse(stored);
      allMetrics.push(metrics);
      localStorage.setItem('physiotherapy_progress', JSON.stringify(allMetrics));
    } catch (error) {
      console.error('Failed to store progress:', error);
    }
  }

  // Get progress statistics
  getProgressStats(exerciseId?: string): {
    totalSessions: number;
    averageScore: number;
    improvement: number;
    recentSessions: ProgressMetrics[];
  } {
    try {
      const stored = localStorage.getItem('physiotherapy_progress') || '[]';
      let allMetrics: ProgressMetrics[] = JSON.parse(stored);
      
      if (exerciseId) {
        allMetrics = allMetrics.filter(m => m.exerciseId === exerciseId);
      }

      if (allMetrics.length === 0) {
        return { totalSessions: 0, averageScore: 0, improvement: 0, recentSessions: [] };
      }

      const totalSessions = allMetrics.length;
      const averageScore = allMetrics.reduce((sum, m) => sum + m.averageScore, 0) / totalSessions;
      
      // Calculate improvement (compare first 25% vs last 25% of sessions)
      const firstQuarter = allMetrics.slice(0, Math.max(1, Math.floor(totalSessions * 0.25)));
      const lastQuarter = allMetrics.slice(-Math.max(1, Math.floor(totalSessions * 0.25)));
      
      const firstAvg = firstQuarter.reduce((sum, m) => sum + m.averageScore, 0) / firstQuarter.length;
      const lastAvg = lastQuarter.reduce((sum, m) => sum + m.averageScore, 0) / lastQuarter.length;
      const improvement = lastAvg - firstAvg;

      const recentSessions = allMetrics.slice(-10); // Last 10 sessions

      return { totalSessions, averageScore, improvement, recentSessions };
    } catch (error) {
      console.error('Failed to get progress stats:', error);
      return { totalSessions: 0, averageScore: 0, improvement: 0, recentSessions: [] };
    }
  }

  // Clear progress data
  clearProgress(): void {
    this.sessionMetrics = [];
    try {
      localStorage.removeItem('physiotherapy_progress');
    } catch (error) {
      console.error('Failed to clear progress:', error);
    }
  }
}

// Export singleton instance
export const poseAnalyzer = PoseAnalyzer.getInstance();