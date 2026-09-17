import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, Dices, Shield, Flame } from 'lucide-react';
import { FantasyCampaign } from '../types';

interface Props {
  campaign: FantasyCampaign;
  onGetCommentary: (prompt: string, contextType?: string) => Promise<{ commentary: string; poweredBy: string }>;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  poweredBy?: string;
  timestamp: string;
}

export const CommissionerChat: React.FC<Props> = ({ campaign, onGetCommentary }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Greetings, Guildmasters! I am Arch-Commissioner Vorath, master of this sports campaign realm. I track every yard, triple, goal, and touchdown across the multi-league cosmos. Speak to me for tactical briefings, roll explanations, or campaign prophecies!`,
      poweredBy: 'Gemini 3.8 Flash (AI Dungeon Master)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "Assess our Week 4 matchup vs Shadow Syndicate",
    "How does the Blizzard modifier affect Patrick Mahomes and the ground attack?",
    "Give tactical advice for co-managers sharing roster positions",
    "Recap today's sports heroics in epic tabletop campaign style"
  ];

  const handleSend = async (textToSend?: string) => {
    const promptText = (textToSend || input).trim();
    if (!promptText || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await onGetCommentary(promptText, 'campaign_chat');
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.commentary,
        poweredBy: res.poweredBy,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: "Arch-Commissioner Vorath meditates atop the Astral Citadel. 'Stand fast, guildmaster—execute your tactical substitutions!'",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold font-['Rajdhani'] uppercase tracking-wide text-white">
                Arch-Commissioner Vorath's Citadel
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
                AI Dungeon Master
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Your AI Campaign Master combining comprehensive real-world sports statistics with tabletop D&D narrative lore.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white whitespace-nowrap transition font-medium text-left"
          >
            "{qp}"
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 flex flex-col h-[520px] shadow-xl overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map(msg => {
            const isAI = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isAI
                      ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400/30'
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isAI
                      ? 'bg-slate-950/80 border border-slate-800 text-slate-200'
                      : 'bg-indigo-600 text-white shadow-md'
                  }`}
                >
                  <div className="font-semibold text-[11px] mb-1 opacity-80 flex items-center justify-between gap-4">
                    <span>{isAI ? 'Arch-Commissioner Vorath' : 'You (Guildmaster)'}</span>
                    <span className="font-mono text-[10px]">{msg.timestamp}</span>
                  </div>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  {msg.poweredBy && (
                    <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-amber-400 font-mono">
                      ⚡ {msg.poweredBy}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 mr-auto max-w-xl">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Arch-Commissioner Vorath is scrying the sports scrolls...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3"
        >
          <input
            id="input-commissioner-chat"
            type="text"
            placeholder="Ask the Commissioner about campaign tactics, player synergies, or match analysis..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-900 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm border border-slate-800 focus:outline-none focus:border-amber-500"
          />
          <button
            id="btn-send-commissioner"
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-500/20 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
