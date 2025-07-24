// Voice Feedback System using Web Speech API
// Provides real-time audio guidance for physiotherapy exercises

export interface VoiceSettings {
  enabled: boolean;
  volume: number; // 0-1
  rate: number; // 0.1-10
  pitch: number; // 0-2
  voice: string | null; // Voice name
  language: string; // Language code
}

export interface FeedbackQueue {
  id: string;
  text: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: number;
  category: 'instruction' | 'correction' | 'encouragement' | 'warning';
}

export class VoiceFeedbackSystem {
  private static instance: VoiceFeedbackSystem;
  private synthesis: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private settings: VoiceSettings;
  private feedbackQueue: FeedbackQueue[] = [];
  private isPlaying: boolean = false;
  private lastFeedbackTime: number = 0;
  private feedbackCooldown: number = 3000; // 3 seconds between feedback

  private constructor() {
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis;
      this.settings = this.loadSettings();
      this.loadVoices();
      
      // Listen for voices changed event
      this.synthesis.addEventListener('voiceschanged', () => {
        this.loadVoices();
      });
    } else {
      this.settings = this.getDefaultSettings();
    }
  }

  static getInstance(): VoiceFeedbackSystem {
    if (!VoiceFeedbackSystem.instance) {
      VoiceFeedbackSystem.instance = new VoiceFeedbackSystem();
    }
    return VoiceFeedbackSystem.instance;
  }

  private loadSettings(): VoiceSettings {
    if (typeof window === 'undefined') {
      return this.getDefaultSettings();
    }
    
    try {
      const stored = localStorage.getItem('voice_feedback_settings');
      if (stored) {
        return { ...this.getDefaultSettings(), ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load voice settings:', error);
    }
    return this.getDefaultSettings();
  }

  private getDefaultSettings(): VoiceSettings {
    return {
      enabled: true,
      volume: 0.8,
      rate: 1.0,
      pitch: 1.0,
      voice: null,
      language: 'en-US'
    };
  }

  private saveSettings(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('voice_feedback_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save voice settings:', error);
    }
  }

  private loadVoices(): void {
    if (typeof window === 'undefined' || !this.synthesis) return;
    
    this.voices = this.synthesis.getVoices();
    
    // If no voice is selected, try to find a good default
    if (!this.settings.voice && this.voices.length > 0) {
      // Prefer English voices
      const englishVoice = this.voices.find(voice => 
        voice.lang.startsWith('en') && voice.localService
      );
      
      if (englishVoice) {
        this.settings.voice = englishVoice.name;
        this.saveSettings();
      }
    }
  }

  // Public API methods
  getSettings(): VoiceSettings {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<VoiceSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  isEnabled(): boolean {
    return this.settings.enabled && this.isSupported();
  }

  // Queue feedback with priority system
  queueFeedback(
    text: string, 
    category: FeedbackQueue['category'] = 'instruction',
    priority: FeedbackQueue['priority'] = 'medium'
  ): void {
    if (!this.isEnabled() || !text.trim()) return;

    // Check cooldown for non-critical feedback
    const now = Date.now();
    if (priority !== 'high' && (now - this.lastFeedbackTime) < this.feedbackCooldown) {
      return;
    }

    const feedback: FeedbackQueue = {
      id: `feedback_${now}_${Math.random().toString(36).substr(2, 9)}`,
      text: text.trim(),
      priority,
      timestamp: now,
      category
    };

    // Remove duplicate recent feedback
    this.feedbackQueue = this.feedbackQueue.filter(f => 
      f.text !== feedback.text || (now - f.timestamp) > 5000
    );

    // Insert based on priority
    if (priority === 'high') {
      this.feedbackQueue.unshift(feedback);
    } else {
      this.feedbackQueue.push(feedback);
    }

    // Limit queue size
    if (this.feedbackQueue.length > 10) {
      this.feedbackQueue = this.feedbackQueue.slice(-10);
    }

    this.processQueue();
  }

  // Process the feedback queue
  private async processQueue(): Promise<void> {
    if (this.isPlaying || this.feedbackQueue.length === 0) return;

    const feedback = this.feedbackQueue.shift();
    if (!feedback) return;

    this.isPlaying = true;
    this.lastFeedbackTime = Date.now();

    try {
      await this.speak(feedback.text);
    } catch (error) {
      console.error('Speech synthesis error:', error);
    } finally {
      this.isPlaying = false;
      
      // Process next item after a short delay
      setTimeout(() => {
        this.processQueue();
      }, 500);
    }
  }

  // Speak text with current settings
  private speak(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported() || !this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Apply settings
      utterance.volume = this.settings.volume;
      utterance.rate = this.settings.rate;
      utterance.pitch = this.settings.pitch;
      utterance.lang = this.settings.language;

      // Set voice if available
      if (this.settings.voice) {
        const selectedVoice = this.voices.find(voice => voice.name === this.settings.voice);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      // Event handlers
      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech error: ${event.error}`));
      
      // Speak
      this.synthesis.speak(utterance);
    });
  }

  // Immediate speech (bypasses queue)
  speakImmediate(text: string): Promise<void> {
    if (!this.isEnabled() || !this.synthesis) return Promise.resolve();
    
    // Clear queue and stop current speech
    this.clearQueue();
    this.synthesis.cancel();
    
    return this.speak(text);
  }

  // Exercise-specific feedback methods
  announceExerciseStart(exerciseName: string): void {
    this.queueFeedback(
      `Starting ${exerciseName}. Get into position.`,
      'instruction',
      'high'
    );
  }

  announcePhaseChange(phaseName: string): void {
    this.queueFeedback(
      `Moving to ${phaseName}`,
      'instruction',
      'medium'
    );
  }

  provideFormCorrection(correction: string): void {
    this.queueFeedback(
      correction,
      'correction',
      'high'
    );
  }

  provideEncouragement(message: string): void {
    this.queueFeedback(
      message,
      'encouragement',
      'low'
    );
  }

  announceRepetitionCount(current: number, total: number): void {
    if (current % 5 === 0 || current === total) { // Only announce every 5th rep or last rep
      this.queueFeedback(
        `${current} of ${total}`,
        'instruction',
        'low'
      );
    }
  }

  announceScore(score: number): void {
    let message = '';
    if (score >= 90) {
      message = `Excellent! Score: ${score}%`;
    } else if (score >= 80) {
      message = `Good form! Score: ${score}%`;
    } else if (score >= 70) {
      message = `Keep improving! Score: ${score}%`;
    } else {
      message = `Focus on form. Score: ${score}%`;
    }
    
    this.queueFeedback(message, 'instruction', 'medium');
  }

  announceExerciseComplete(exerciseName: string, finalScore: number): void {
    const message = `${exerciseName} complete! Final score: ${finalScore}%. Great work!`;
    this.queueFeedback(message, 'encouragement', 'high');
  }

  // Queue management
  clearQueue(): void {
    this.feedbackQueue = [];
  }

  getQueueLength(): number {
    return this.feedbackQueue.length;
  }

  // Stop all speech
  stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    this.clearQueue();
    this.isPlaying = false;
  }

  // Test speech functionality
  testSpeech(): void {
    this.speakImmediate('Voice feedback is working correctly.');
  }

  // Predefined feedback messages
  static readonly FEEDBACK_MESSAGES = {
    FORM_CORRECTIONS: [
      'Keep your back straight',
      'Lift your arms higher',
      'Bend your knees more',
      'Straighten your leg',
      'Hold your position',
      'Slow down the movement',
      'Keep your core engaged',
      'Maintain good posture'
    ],
    ENCOURAGEMENT: [
      'Great job!',
      'Perfect form!',
      'Excellent!',
      'Keep it up!',
      'You\'re doing well!',
      'Nice improvement!',
      'Stay focused!',
      'Almost there!'
    ],
    WARNINGS: [
      'Check your form',
      'Slow down',
      'Be careful',
      'Maintain control',
      'Focus on technique'
    ]
  };

  // Get random message from category
  getRandomMessage(category: keyof typeof VoiceFeedbackSystem.FEEDBACK_MESSAGES): string {
    const messages = VoiceFeedbackSystem.FEEDBACK_MESSAGES[category];
    return messages[Math.floor(Math.random() * messages.length)];
  }
}

// Export singleton instance
export const voiceFeedback = VoiceFeedbackSystem.getInstance();

// React hook for voice feedback
export function useVoiceFeedback() {
  const voice = VoiceFeedbackSystem.getInstance();
  
  return {
    isSupported: voice.isSupported(),
    isEnabled: voice.isEnabled(),
    settings: voice.getSettings(),
    voices: voice.getAvailableVoices(),
    updateSettings: (settings: Partial<VoiceSettings>) => voice.updateSettings(settings),
    speak: (text: string, category?: FeedbackQueue['category'], priority?: FeedbackQueue['priority']) => 
      voice.queueFeedback(text, category, priority),
    speakImmediate: (text: string) => voice.speakImmediate(text),
    stop: () => voice.stop(),
    test: () => voice.testSpeech(),
    announceExerciseStart: (name: string) => voice.announceExerciseStart(name),
    announcePhaseChange: (phase: string) => voice.announcePhaseChange(phase),
    provideCorrection: (correction: string) => voice.provideFormCorrection(correction),
    provideEncouragement: (message: string) => voice.provideEncouragement(message),
    announceScore: (score: number) => voice.announceScore(score),
    announceComplete: (exercise: string, score: number) => voice.announceExerciseComplete(exercise, score)
  };
}