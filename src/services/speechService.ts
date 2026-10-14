import type { Language } from '../types/city';

// Web Speech API interface
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export class SpeechService {
  private static recognition: any = null;
  private static isListening: boolean = false;

  public static isSpeechRecognitionSupported(): boolean {
    const win = window as unknown as IWindow;
    return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
  }

  public static isSpeechSynthesisSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  public static startListening(
    onResult: (transcript: string) => void,
    onError?: (error: any) => void,
    onEnd?: () => void,
    lang: Language = 'en'
  ): void {
    if (!this.isSpeechRecognitionSupported()) {
      if (onError) onError('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const win = window as unknown as IWindow;
      const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      // Language code mapping
      this.recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'te' ? 'te-IN' : 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        if (onError) onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
    } catch (e) {
      this.isListening = false;
      if (onError) onError(e);
    }
  }

  public static stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public static speakText(text: string, lang: Language = 'en'): void {
    if (!this.isSpeechSynthesisSupported()) return;

    // Strip markdown formatting symbols before speaking
    const cleanText = text
      .replace(/[*#_`]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/\n+/g, '. ');

    window.speechSynthesis.cancel(); // Stop prior speech
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick appropriate language
    utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'te' ? 'te-IN' : 'en-US';

    // Try finding matching voice
    const voices = window.speechSynthesis.getVoices();
    const voicePrefix = lang === 'hi' ? 'hi' : lang === 'te' ? 'te' : 'en';
    const matchedVoice = voices.find(v => v.lang.startsWith(voicePrefix));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  public static stopSpeaking(): void {
    if (this.isSpeechSynthesisSupported()) {
      window.speechSynthesis.cancel();
    }
  }
}
