"use client"

// Progress Tracking System
// Manages user exercise data, statistics, and session history

import { ExerciseFeedback, ProgressMetrics } from './pose-analysis';
import { ExerciseDefinition } from './exercise-definitions';

export interface ExerciseSession {
  id: string;
  exerciseId: string;
  exerciseName: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  repetitions: number;
  averageScore: number;
  maxScore: number;
  minScore: number;
  feedback: ExerciseFeedback[];
  metrics: ProgressMetrics;
  notes?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
}

export interface UserProgress {
  userId: string;
  totalSessions: number;
  totalExerciseTime: number; // in seconds
  totalRepetitions: number;
  averageScore: number;
  exerciseStats: Map<string, ExerciseStats>;
  weeklyProgress: WeeklyProgress[];
  achievements: Achievement[];
  lastSessionDate: Date;
  streakDays: number;
}

export interface ExerciseStats {
  exerciseId: string;
  exerciseName: string;
  totalSessions: number;
  totalTime: number;
  totalRepetitions: number;
  averageScore: number;
  bestScore: number;
  improvementRate: number; // percentage
  lastPerformed: Date;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  personalBest: {
    score: number;
    date: Date;
    duration: number;
    repetitions: number;
  };
}

export interface WeeklyProgress {
  weekStart: Date;
  weekEnd: Date;
  sessionsCompleted: number;
  totalTime: number;
  averageScore: number;
  exercisesPerformed: string[];
  goals: {
    targetSessions: number;
    targetTime: number;
    achieved: boolean;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedDate: Date;
  category: 'consistency' | 'performance' | 'milestone' | 'improvement';
  points: number;
}

export interface ProgressGoals {
  dailySessionTarget: number;
  weeklySessionTarget: number;
  targetScore: number;
  targetExercises: string[];
  targetDuration: number; // minutes per session
}

export class ProgressTracker {
  private storageKey = 'kinetic-rehab-progress';
  private sessionsKey = 'kinetic-rehab-sessions';
  private goalsKey = 'kinetic-rehab-goals';

  constructor(private userId: string = 'default') {}

  // Session Management
  async startSession(exercise: ExerciseDefinition): Promise<string> {
    const sessionId = this.generateSessionId();
    const session: ExerciseSession = {
      id: sessionId,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      startTime: new Date(),
      duration: 0,
      repetitions: 0,
      averageScore: 0,
      maxScore: 0,
      minScore: 100,
      feedback: [],
      metrics: {
        totalRepetitions: 0,
        averageScore: 0,
        exerciseTime: 0,
        correctPostures: 0,
        improvements: []
      },
      difficulty: exercise.difficulty,
      completed: false
    };

    await this.saveSession(session);
    return sessionId;
  }

  async getSession(sessionId: string): Promise<ExerciseSession | null> {
    const stored = localStorage.getItem(`${this.sessionsKey}-${this.userId}`);
    if (!stored) return null;

    const sessions = JSON.parse(stored) as ExerciseSession[];
    const session = sessions.find(s => s.id === sessionId);
    
    if (!session) return null;
    
    // Convert date strings back to Date objects
    return {
      ...session,
      startTime: new Date(session.startTime),
      endTime: session.endTime ? new Date(session.endTime) : undefined
    };
  }

  async updateSession(
    sessionId: string,
    feedback: ExerciseFeedback,
    metrics: ProgressMetrics
  ): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) return;

    // Update session data
    session.feedback.push(feedback);
    session.repetitions = metrics.totalRepetitions;
    session.averageScore = metrics.averageScore;
    session.maxScore = Math.max(session.maxScore, feedback.overallScore);
    session.minScore = Math.min(session.minScore, feedback.overallScore);
    session.metrics = metrics;
    session.duration = Math.floor((Date.now() - session.startTime.getTime()) / 1000);

    await this.saveSession(session);
  }

  async endSession(sessionId: string, notes?: string): Promise<ExerciseSession | null> {
    const session = await this.getSession(sessionId);
    if (!session) return null;

    session.endTime = new Date();
    session.duration = Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000);
    session.completed = true;
    session.notes = notes;

    await this.saveSession(session);
    await this.updateUserProgress(session);
    await this.checkAchievements(session);

    return session;
  }

  // Progress Analytics
  async getUserProgress(): Promise<UserProgress> {
    const stored = localStorage.getItem(`${this.storageKey}-${this.userId}`);
    if (!stored) {
      return this.createDefaultProgress();
    }

    const progress = JSON.parse(stored) as UserProgress;
    // Convert date strings back to Date objects
    progress.lastSessionDate = new Date(progress.lastSessionDate);
    progress.weeklyProgress = progress.weeklyProgress.map(wp => ({
      ...wp,
      weekStart: new Date(wp.weekStart),
      weekEnd: new Date(wp.weekEnd)
    }));
    progress.achievements = progress.achievements.map(a => ({
      ...a,
      unlockedDate: new Date(a.unlockedDate)
    }));

    return progress;
  }

  async getExerciseStats(exerciseId: string): Promise<ExerciseStats | null> {
    const progress = await this.getUserProgress();
    return progress.exerciseStats.get(exerciseId) || null;
  }

  async getSessionHistory(limit: number = 50): Promise<ExerciseSession[]> {
    const stored = localStorage.getItem(`${this.sessionsKey}-${this.userId}`);
    if (!stored) return [];

    const sessions = JSON.parse(stored) as ExerciseSession[];
    return sessions
      .map(s => ({
        ...s,
        startTime: new Date(s.startTime),
        endTime: s.endTime ? new Date(s.endTime) : undefined
      }))
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit);
  }

  async getWeeklyProgress(weeksBack: number = 4): Promise<WeeklyProgress[]> {
    const progress = await this.getUserProgress();
    return progress.weeklyProgress
      .sort((a, b) => b.weekStart.getTime() - a.weekStart.getTime())
      .slice(0, weeksBack);
  }

  // Goal Management
  async setGoals(goals: ProgressGoals): Promise<void> {
    localStorage.setItem(`${this.goalsKey}-${this.userId}`, JSON.stringify(goals));
  }

  async getGoals(): Promise<ProgressGoals> {
    const stored = localStorage.getItem(`${this.goalsKey}-${this.userId}`);
    if (!stored) {
      return {
        dailySessionTarget: 1,
        weeklySessionTarget: 5,
        targetScore: 80,
        targetExercises: [],
        targetDuration: 15
      };
    }
    return JSON.parse(stored);
  }

  // Statistics and Analytics
  async getImprovementTrend(exerciseId: string, days: number = 30): Promise<{
    dates: string[];
    scores: number[];
    trend: 'improving' | 'stable' | 'declining';
  }> {
    const sessions = await this.getSessionHistory(100);
    const exerciseSessions = sessions
      .filter(s => s.exerciseId === exerciseId && s.completed)
      .filter(s => {
        const daysDiff = (Date.now() - s.startTime.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff <= days;
      })
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    const dates = exerciseSessions.map(s => s.startTime.toISOString().split('T')[0]);
    const scores = exerciseSessions.map(s => s.averageScore);

    // Calculate trend
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (scores.length >= 3) {
      const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
      const secondHalf = scores.slice(Math.floor(scores.length / 2));
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      
      if (secondAvg > firstAvg + 5) trend = 'improving';
      else if (secondAvg < firstAvg - 5) trend = 'declining';
    }

    return { dates, scores, trend };
  }

  async getPerformanceInsights(): Promise<{
    strengths: string[];
    improvements: string[];
    recommendations: string[];
  }> {
    const progress = await this.getUserProgress();
    const sessions = await this.getSessionHistory(20);
    
    const strengths: string[] = [];
    const improvements: string[] = [];
    const recommendations: string[] = [];

    // Analyze consistency
    if (progress.streakDays >= 7) {
      strengths.push(`Excellent consistency with ${progress.streakDays} day streak!`);
    } else if (progress.streakDays < 3) {
      improvements.push('Try to maintain a more consistent exercise routine');
      recommendations.push('Set daily reminders to practice exercises');
    }

    // Analyze performance
    if (progress.averageScore >= 80) {
      strengths.push('High average performance score');
    } else if (progress.averageScore < 60) {
      improvements.push('Focus on improving exercise form and technique');
      recommendations.push('Consider starting with easier exercises');
    }

    // Analyze exercise variety
    const recentExercises = new Set(sessions.slice(0, 10).map(s => s.exerciseId));
    if (recentExercises.size >= 3) {
      strengths.push('Good exercise variety in recent sessions');
    } else {
      improvements.push('Try incorporating more exercise variety');
      recommendations.push('Explore different exercise categories');
    }

    return { strengths, improvements, recommendations };
  }

  // Private helper methods
  private async updateUserProgress(session: ExerciseSession): Promise<void> {
    const progress = await this.getUserProgress();
    
    // Update overall stats
    progress.totalSessions++;
    progress.totalExerciseTime += session.duration;
    progress.totalRepetitions += session.repetitions;
    progress.averageScore = this.calculateRunningAverage(
      progress.averageScore,
      session.averageScore,
      progress.totalSessions
    );
    progress.lastSessionDate = session.endTime || new Date();
    
    // Update streak
    progress.streakDays = this.calculateStreak(progress.lastSessionDate);
    
    // Update exercise-specific stats
    const exerciseStats = progress.exerciseStats.get(session.exerciseId) || 
      this.createDefaultExerciseStats(session);
    
    exerciseStats.totalSessions++;
    exerciseStats.totalTime += session.duration;
    exerciseStats.totalRepetitions += session.repetitions;
    exerciseStats.averageScore = this.calculateRunningAverage(
      exerciseStats.averageScore,
      session.averageScore,
      exerciseStats.totalSessions
    );
    exerciseStats.bestScore = Math.max(exerciseStats.bestScore, session.maxScore);
    exerciseStats.lastPerformed = session.endTime || new Date();
    
    // Update personal best
    if (session.averageScore > exerciseStats.personalBest.score) {
      exerciseStats.personalBest = {
        score: session.averageScore,
        date: session.endTime || new Date(),
        duration: session.duration,
        repetitions: session.repetitions
      };
    }
    
    progress.exerciseStats.set(session.exerciseId, exerciseStats);
    
    // Update weekly progress
    this.updateWeeklyProgress(progress, session);
    
    await this.saveUserProgress(progress);
  }

  private async checkAchievements(session: ExerciseSession): Promise<void> {
    const progress = await this.getUserProgress();
    const newAchievements: Achievement[] = [];

    // First session achievement
    if (progress.totalSessions === 1) {
      newAchievements.push({
        id: 'first-session',
        title: 'Getting Started',
        description: 'Completed your first exercise session',
        icon: '🎯',
        unlockedDate: new Date(),
        category: 'milestone',
        points: 10
      });
    }

    // Perfect score achievement
    if (session.averageScore >= 95) {
      newAchievements.push({
        id: 'perfect-score',
        title: 'Perfect Form',
        description: 'Achieved a score of 95% or higher',
        icon: '⭐',
        unlockedDate: new Date(),
        category: 'performance',
        points: 25
      });
    }

    // Consistency achievements
    if (progress.streakDays === 7) {
      newAchievements.push({
        id: 'week-streak',
        title: 'Week Warrior',
        description: 'Exercised for 7 days in a row',
        icon: '🔥',
        unlockedDate: new Date(),
        category: 'consistency',
        points: 50
      });
    }

    // Add new achievements
    progress.achievements.push(...newAchievements);
    await this.saveUserProgress(progress);
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async saveSession(session: ExerciseSession): Promise<void> {
    const sessions = await this.getSessionHistory(1000);
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.unshift(session);
    }
    
    // Keep only last 1000 sessions
    const trimmedSessions = sessions.slice(0, 1000);
    localStorage.setItem(`${this.sessionsKey}-${this.userId}`, JSON.stringify(trimmedSessions));
  }



  private async saveUserProgress(progress: UserProgress): Promise<void> {
    // Convert Map to object for storage
    const progressToStore = {
      ...progress,
      exerciseStats: Object.fromEntries(progress.exerciseStats)
    };
    localStorage.setItem(`${this.storageKey}-${this.userId}`, JSON.stringify(progressToStore));
  }

  private createDefaultProgress(): UserProgress {
    return {
      userId: this.userId,
      totalSessions: 0,
      totalExerciseTime: 0,
      totalRepetitions: 0,
      averageScore: 0,
      exerciseStats: new Map(),
      weeklyProgress: [],
      achievements: [],
      lastSessionDate: new Date(),
      streakDays: 0
    };
  }

  private createDefaultExerciseStats(session: ExerciseSession): ExerciseStats {
    return {
      exerciseId: session.exerciseId,
      exerciseName: session.exerciseName,
      totalSessions: 0,
      totalTime: 0,
      totalRepetitions: 0,
      averageScore: 0,
      bestScore: 0,
      improvementRate: 0,
      lastPerformed: new Date(),
      difficulty: session.difficulty,
      personalBest: {
        score: 0,
        date: new Date(),
        duration: 0,
        repetitions: 0
      }
    };
  }

  private calculateRunningAverage(currentAvg: number, newValue: number, count: number): number {
    return ((currentAvg * (count - 1)) + newValue) / count;
  }

  private calculateStreak(lastSessionDate: Date): number {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastSessionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // If last session was today or yesterday, maintain/increment streak
    if (diffDays <= 1) {
      return 1; // Simplified streak calculation
    }
    return 0;
  }

  private updateWeeklyProgress(progress: UserProgress, session: ExerciseSession): void {
    const sessionDate = session.endTime || new Date();
    const weekStart = this.getWeekStart(sessionDate);
    const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
    
    let weeklyProgress = progress.weeklyProgress.find(wp => 
      wp.weekStart.getTime() === weekStart.getTime()
    );
    
    if (!weeklyProgress) {
      weeklyProgress = {
        weekStart,
        weekEnd,
        sessionsCompleted: 0,
        totalTime: 0,
        averageScore: 0,
        exercisesPerformed: [],
        goals: {
          targetSessions: 5,
          targetTime: 150, // 2.5 hours
          achieved: false
        }
      };
      progress.weeklyProgress.push(weeklyProgress);
    }
    
    weeklyProgress.sessionsCompleted++;
    weeklyProgress.totalTime += session.duration;
    weeklyProgress.averageScore = this.calculateRunningAverage(
      weeklyProgress.averageScore,
      session.averageScore,
      weeklyProgress.sessionsCompleted
    );
    
    if (!weeklyProgress.exercisesPerformed.includes(session.exerciseId)) {
      weeklyProgress.exercisesPerformed.push(session.exerciseId);
    }
    
    // Check if weekly goals are achieved
    weeklyProgress.goals.achieved = 
      weeklyProgress.sessionsCompleted >= weeklyProgress.goals.targetSessions &&
      weeklyProgress.totalTime >= weeklyProgress.goals.targetTime;
  }

  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }
}

export default ProgressTracker;