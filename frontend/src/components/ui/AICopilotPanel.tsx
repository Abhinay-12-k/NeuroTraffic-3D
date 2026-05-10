import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Cpu, Activity, Zap } from 'lucide-react';
import { useCopilotStore } from '../../store/copilotStore';

// Simple markdown bold parser for the chat messages
const formatText = (text: string) => {
  return text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-sprint-sidebar font-bold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
};

export const AICopilotPanel = () => {
  const { isOpen, togglePanel, messages, sendQuery, isLoading } = useCopilotStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendQuery(input.trim());
    setInput('');
  };

  const handleQuickCommand = (cmd: string) => {
    sendQuery(cmd);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={togglePanel}
        className={`fixed bottom-8 right-8 p-4 rounded-full shadow-soft z-50 flex items-center justify-center transition-all ${isOpen ? 'bg-sprint-gold text-white hover:bg-sprint-goldLight' : 'bg-sprint-sidebar text-white hover:bg-[#1a4f3b]'}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={24} /> : <Bot size={28} className="animate-pulse" />}
      </motion.button>

      {/* Expanded Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-28 right-8 w-96 h-[600px] max-h-[80vh] bg-white border border-gray-100 rounded-[2rem] shadow-soft flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="bg-sprint-bg border-b border-gray-100 p-6 flex items-center gap-4 shrink-0 rounded-t-[2rem]">
              <div className="relative w-10 h-10 rounded-full bg-sprint-sidebar flex items-center justify-center shrink-0">
                <Cpu size={20} className="text-white" />
                <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-sprint-bg"></div>
              </div>
              <div>
                <h3 className="text-sprint-sidebar font-title italic font-bold text-lg tracking-wide">AI Operations Copilot</h3>
                <p className="text-green-600 text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 mt-0.5">
                  <Activity size={12} /> Live State Sync Active
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar bg-white">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                  <span className="text-[10px] font-bold text-sprint-textMuted mb-1 px-1 uppercase tracking-wider">
                    {msg.role === 'user' ? 'Operator' : 'AI Copilot'}
                  </span>
                  <div className={`p-4 rounded-2xl text-sm font-body leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-sprint-sidebar text-white rounded-br-none' 
                      : 'bg-sprint-bg border border-gray-100 text-sprint-sidebar rounded-bl-none'
                  }`}>
                    {formatText(msg.content)}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="self-start flex flex-col items-start max-w-[85%]">
                  <span className="text-[10px] font-bold text-sprint-textMuted mb-1 px-1 uppercase">AI Copilot</span>
                  <div className="bg-sprint-bg border border-gray-100 p-4 rounded-2xl rounded-bl-none flex items-center gap-2">
                    <div className="w-2 h-2 bg-sprint-gold rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-sprint-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-sprint-gold rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar shrink-0 border-t border-gray-100 bg-sprint-bg/50">
              <button onClick={() => handleQuickCommand("Why is the current lane congested?")} className="shrink-0 text-xs font-bold text-sprint-sidebar bg-white hover:bg-sprint-bg border border-gray-200 rounded-full px-4 py-2 transition-colors shadow-sm">
                Analyze Congestion
              </button>
              <button onClick={() => handleQuickCommand("Trigger ambulance in WEST lane")} className="shrink-0 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-full px-4 py-2 transition-colors shadow-sm">
                Simulate Emergency
              </button>
              <button onClick={() => handleQuickCommand("Activate VIP corridor Alpha")} className="shrink-0 text-xs font-bold text-sprint-gold bg-amber-50 hover:bg-amber-100 border border-amber-100 rounded-full px-4 py-2 transition-colors shadow-sm">
                VIP Alpha (N→S)
              </button>
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-gray-100 shrink-0">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask AI Copilot..."
                  disabled={isLoading}
                  className="flex-1 bg-sprint-bg border border-gray-200 rounded-xl px-5 py-3 text-sm font-body text-sprint-sidebar focus:outline-none focus:ring-2 focus:ring-sprint-gold/30 disabled:opacity-50 transition-all placeholder:text-sprint-textMuted"
                />
                <button 
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-sprint-sidebar text-white p-3 rounded-xl hover:bg-[#1a4f3b] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
