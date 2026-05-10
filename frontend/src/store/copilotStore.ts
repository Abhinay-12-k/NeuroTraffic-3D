import { create } from 'zustand';
import { socket } from '../services/socket';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface CopilotStore {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
  togglePanel: () => void;
  sendQuery: (query: string) => void;
  addMessage: (msg: Omit<Message, 'id' | 'timestamp'>) => void;
}

export const useCopilotStore = create<CopilotStore>((set, get) => {
  // Listen for socket responses
  socket.on('copilot:response', (data) => {
    get().addMessage({ role: 'assistant', content: data.response });
    set({ isLoading: false });
  });

  return {
    isOpen: false,
    messages: [
      {
        id: 'initial',
        role: 'assistant',
        content: 'NeuroTraffic AI Copilot online. I am actively monitoring the digital twin. How can I assist with traffic operations?',
        timestamp: Date.now()
      }
    ],
    isLoading: false,
    togglePanel: () => set(state => ({ isOpen: !state.isOpen })),
    addMessage: (msg) => set(state => ({
      messages: [...state.messages, { ...msg, id: Math.random().toString(36).substring(7), timestamp: Date.now() }]
    })),
    sendQuery: (query) => {
      get().addMessage({ role: 'user', content: query });
      set({ isLoading: true });
      socket.emit('copilot:query', { query });
    }
  };
});
