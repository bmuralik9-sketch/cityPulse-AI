import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Bot,
  User,
  X,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import { useCity } from '../../context/CityContext';
import { askCityAssistant } from '../../services/geminiService';
import { SpeechService } from '../../services/speechService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiChatAssistant: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { telemetry, language } = useCity();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text:
        language === 'hi'
          ? 'नमस्ते! मैं सिटीपल्स एआई हूँ - आपका स्मार्ट सिटी कमांड सहायक। आप ट्रैफ़िक, ग्रिड ऊर्जा, कचरा प्रबंधन या आपात स्थिति पर कोई भी प्रश्न पूछ सकते हैं।'
          : language === 'te'
          ? 'నమస్కారం! నేను సిటీపల్స్ AI - మీ స్మార్ట్ సిటీ కమాండ్ అసిస్టెంట్. ట్రాఫిక్, విద్యుత్ లేదా ఇతర సమస్యలపై ఏదైనా అడగవచ్చు.'
          : 'Greetings, Operator. I am CityPulse AI, your autonomous urban command assistant. I am continuously monitoring live telemetry across all 5 sectors. How may I assist your operations?',
      timestamp: 'Just now',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Why is Zone 1 congested and what should we do?',
    'Is Zone 4 residential sector operating normally?',
    'Analyze Harbor logistics energy threshold',
    'Summarize citywide smart waste status',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const reply = await askCityAssistant(textToSend, telemetry, language);
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-a`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVoiceInput = () => {
    if (isListening) {
      SpeechService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      SpeechService.startListening(
        (transcript) => {
          setInputQuery(transcript);
          setIsListening(false);
          handleSend(transcript);
        },
        (err) => {
          console.warn('Voice error:', err);
          setIsListening(false);
        },
        () => setIsListening(false),
        language
      );
    }
  };

  const handleSpeakMessage = (text: string) => {
    SpeechService.speakText(text, language);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[460px] z-50 p-3 sm:p-4 flex flex-col justify-end pointer-events-none">
      <div className="w-full h-[90vh] rounded-2xl glass-panel-glow border border-cyan-400/50 shadow-2xl flex flex-col overflow-hidden pointer-events-auto backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950/70 border-b border-cyan-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-neon-cyan">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-white text-sm">
                  Gemini AI City Assistant
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-[10px] font-mono text-cyan-400/80">
                Live Telemetry Augmented Reasoning
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto flex gap-1.5 scrollbar-none">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(prompt)}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-cyan-950/60 border border-slate-700/80 hover:border-cyan-500/40 text-[11px] font-mono text-slate-300 hover:text-cyan-200 transition-all cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-cyan-500/25 border border-cyan-400/40 text-cyan-50 rounded-br-none'
                    : 'bg-slate-900/85 border border-slate-700/60 text-slate-100 rounded-bl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-700/30 text-[10px] font-mono text-slate-400">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && (
                    <button
                      type="button"
                      onClick={() => handleSpeakMessage(msg.text)}
                      title="Read aloud"
                      className="hover:text-cyan-300 transition-colors ml-2"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 w-fit">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Gemini analyzing sector telemetry...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Input Toggle Button */}
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              title={isListening ? 'Stop listening' : 'Speak your question'}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                  : 'bg-slate-900/90 text-cyan-400 border-slate-700 hover:border-cyan-400'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'शहर से जुड़ा कोई भी प्रश्न पूछें...'
                  : language === 'te'
                  ? 'సిటీ సమస్యలపై ఏదైనా ప్రశ్న అడగండి...'
                  : 'Ask anything about city operations...'
              }
              className="flex-1 px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />

            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="p-2.5 rounded-xl bg-cyan-400 text-slate-950 hover:bg-cyan-300 disabled:opacity-50 transition-all font-semibold shadow-neon-cyan cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
