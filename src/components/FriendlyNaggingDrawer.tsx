import React, { useState } from 'react';
import { NaggingMessage, FantasyGuildTeam } from '../types';
import { 
  X, MessageSquare, Send, Flame, Sparkles, Smile,
  HeartHandshake, ChevronRight, Image as ImageIcon
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  messages: NaggingMessage[];
  userGuild: FantasyGuildTeam;
  guilds: FantasyGuildTeam[];
  onSendMessage: (payload: {
    targetGuildId?: string;
    text: string;
    emoji: string;
    gifUrl?: string;
    gifTitle?: string;
    isBeggingForMercy?: boolean;
  }) => Promise<void>;
  onReactMessage: (messageId: string, emoji: string) => Promise<void>;
  onGrantMercy: (messageId: string) => Promise<void>;
  onOpenWagers: () => void;
}

const PRESET_GIFS = [
  {
    title: 'Smug Smirk',
    url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop&q=80',
    emoji: '🧀'
  },
  {
    title: 'Street Rat Begging',
    url: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&auto=format&fit=crop&q=80',
    emoji: '🐀'
  },
  {
    title: 'High Roller Crown',
    url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&auto=format&fit=crop&q=80',
    emoji: '👑'
  },
  {
    title: 'Shock & Disbelief',
    url: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=400&auto=format&fit=crop&q=80',
    emoji: '💀'
  }
];

const PRESET_SMACK_TALKS = [
  { text: "Your 4th quarter defense is melting faster than warm cheddar! 🧀", emoji: "🧀" },
  { text: "Caitlin Clark logo 3-pointers have shattered your defensive wards! 👑", emoji: "👑" },
  { text: "Squeak squeak! Who let the street rats out of the sewer? 🐀", emoji: "🐀" },
  { text: "Double or nothing on the next matchup? Or are you scared of the gutter? 🎲", emoji: "🔥" },
  { text: "Natural 20 on our box score tactical check! Bow before the High Rollers! ⚡", emoji: "⚡" }
];

export const FriendlyNaggingDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  messages,
  userGuild,
  guilds,
  onSendMessage,
  onReactMessage,
  onGrantMercy,
  onOpenWagers
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💬');
  const [selectedGif, setSelectedGif] = useState<{ url: string; title: string } | null>(null);
  const [targetGuildId, setTargetGuildId] = useState<string>('guild-2');
  const [isBeggingMode, setIsBeggingMode] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const isStreetRat = userGuild.gutterStatus === 'STREET_RAT';

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedGif) return;

    setIsSending(true);
    try {
      await onSendMessage({
        targetGuildId,
        text: inputText.trim(),
        emoji: isBeggingMode ? '🐀' : selectedEmoji,
        gifUrl: selectedGif?.url,
        gifTitle: selectedGif?.title,
        isBeggingForMercy: isBeggingMode
      });
      setInputText('');
      setSelectedGif(null);
      setIsBeggingMode(false);
      setShowGifPicker(false);
    } finally {
      setIsSending(false);
    }
  };

  const sendBeggingPleaQuick = () => {
    setIsBeggingMode(true);
    setInputText('🐭😭 "Spare us, high lords! We lost our wager and the sewer gutter is cold! Toss a cheese crumb of mercy!"');
    setSelectedEmoji('🐀');
    setSelectedGif({
      title: 'Street Rat Begging',
      url: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&auto=format&fit=crop&q=80'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-lg h-full flex flex-col shadow-2xl overflow-hidden">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-lg">
              💬
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wide flex items-center gap-1.5">
                <span>Guild Smack Talk & Banter</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Friendly nagging with emojis, GIFs & street rat mercy pleas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenWagers}
              className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30 flex items-center gap-1 transition"
            >
              <span>🎲 Wagers</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Street Rat Emergency Banner if in gutter */}
        {isStreetRat && (
          <div className="px-4 py-2.5 bg-gradient-to-r from-red-950/50 via-amber-950/40 to-slate-900 border-b border-red-900/40 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🐀</span>
              <div>
                <span className="text-xs font-bold text-red-300 block leading-tight">
                  You are trapped in the Sewer Gutter!
                </span>
                <span className="text-[10px] text-slate-400">
                  Beg the High Rollers for mercy to earn cheese crumbs (+10 PTS)
                </span>
              </div>
            </div>

            <button
              onClick={sendBeggingPleaQuick}
              className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-900/40 transition shrink-0"
            >
              Squeak for Mercy 🙏
            </button>
          </div>
        )}

        {/* Preset quick smack talk chips */}
        <div className="px-4 py-2 bg-slate-950/50 border-b border-slate-800 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
          <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">Quick Smack:</span>
          {PRESET_SMACK_TALKS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(preset.text);
                setSelectedEmoji(preset.emoji);
              }}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-300 font-medium whitespace-nowrap border border-slate-700/60 transition shrink-0"
            >
              {preset.emoji} {preset.text.slice(0, 24)}...
            </button>
          ))}
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs">No banter yet. Break the silence with friendly smack talk!</p>
            </div>
          ) : (
            messages.map(msg => {
              const isUser = msg.senderGuildId === userGuild.id;

              return (
                <div 
                  key={msg.id}
                  className={`p-3.5 rounded-2xl border transition ${
                    msg.isBeggingForMercy
                      ? 'bg-red-950/20 border-red-900/40 shadow-inner'
                      : isUser
                      ? 'bg-amber-500/10 border-amber-500/30 ml-4'
                      : 'bg-slate-950/60 border-slate-800 mr-4'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{msg.emoji}</span>
                      <strong className={`text-xs font-bold ${isUser ? 'text-amber-400' : 'text-slate-200'}`}>
                        {msg.senderGuildName}
                      </strong>
                      <span className="text-[10px] text-slate-500">({msg.senderManagerName})</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  </div>

                  {/* Text */}
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {msg.text}
                  </p>

                  {/* GIF Preview if attached */}
                  {msg.gifUrl && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-slate-700 max-w-xs">
                      <img
                        src={msg.gifUrl}
                        alt={msg.gifTitle || 'Smack talk GIF'}
                        className="w-full h-32 object-cover"
                      />
                      {msg.gifTitle && (
                        <div className="bg-slate-950/80 px-2 py-1 text-[10px] font-medium text-slate-400">
                          {msg.gifTitle}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mercy Granted Badge or Action */}
                  {msg.isBeggingForMercy && (
                    <div className="mt-2.5 pt-2 border-t border-red-900/30 flex items-center justify-between">
                      {msg.mercyGranted ? (
                        <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                          🧀 Mercy Granted! Tossed +10 Points to the Street Rat!
                        </span>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[11px] font-semibold text-red-300">
                            Plea for Mercy in the Gutter!
                          </span>
                          {!isUser && (
                            <button
                              onClick={() => onGrantMercy(msg.id)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-extrabold flex items-center gap-1 shadow transition"
                            >
                              <span>🧀 Toss Cheese Crumb (Grant Mercy)</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Emoji Reactions */}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 pt-1">
                    {msg.reactions.map((r, rIdx) => (
                      <button
                        key={rIdx}
                        onClick={() => onReactMessage(msg.id, r.emoji)}
                        className="px-2 py-0.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700/50 flex items-center gap-1 transition"
                      >
                        <span>{r.emoji}</span>
                        <span className="text-[10px] font-mono text-slate-400">{r.count}</span>
                      </button>
                    ))}

                    {/* Quick react buttons */}
                    {['🧀', '🐀', '👑', '🔥', '😂', '🙏'].map(em => (
                      <button
                        key={em}
                        onClick={() => onReactMessage(msg.id, em)}
                        className="w-6 h-6 rounded-full hover:bg-slate-800 text-[12px] flex items-center justify-center transition opacity-60 hover:opacity-100"
                        title={`React with ${em}`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* GIF Picker Tray */}
        {showGifPicker && (
          <div className="p-3 bg-slate-950 border-t border-slate-800 grid grid-cols-2 gap-2 animate-fadeIn">
            {PRESET_GIFS.map((g, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedGif({ url: g.url, title: g.title });
                  setSelectedEmoji(g.emoji);
                  setShowGifPicker(false);
                }}
                className="cursor-pointer group rounded-xl overflow-hidden border border-slate-800 hover:border-amber-500 relative"
              >
                <img src={g.url} alt={g.title} className="w-full h-20 object-cover group-hover:scale-105 transition" />
                <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 p-1 text-[10px] text-center font-bold text-slate-300">
                  {g.emoji} {g.title}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected GIF indicator */}
        {selectedGif && (
          <div className="px-4 py-1.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400">
            <span className="flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5" /> Attached: {selectedGif.title}
            </span>
            <button onClick={() => setSelectedGif(null)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-500">To:</span>
              <select
                value={targetGuildId}
                onChange={e => setTargetGuildId(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
              >
                {guilds.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              {['💬', '🧀', '🐀', '👑', '🔥', '💀'].map(em => (
                <button
                  type="button"
                  key={em}
                  onClick={() => setSelectedEmoji(em)}
                  className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center transition ${
                    selectedEmoji === em ? 'bg-amber-500/30 border border-amber-500' : 'hover:bg-slate-800'
                  }`}
                >
                  {em}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowGifPicker(!showGifPicker)}
                className={`px-2 py-1 rounded-lg text-xs font-bold border transition flex items-center gap-1 ${
                  showGifPicker ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                GIF
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={isBeggingMode ? "Squeak your mercy plea to the high rollers..." : "Drop some friendly banter, smack talk, or GIFs..."}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
            />
            <button
              type="submit"
              disabled={isSending || (!inputText.trim() && !selectedGif)}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20 disabled:opacity-40 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
