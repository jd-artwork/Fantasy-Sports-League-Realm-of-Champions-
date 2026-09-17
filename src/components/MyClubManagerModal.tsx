import React, { useState } from 'react';
import { 
  X, Shield, Swords, Crown, Sparkles, Download, Upload, 
  Check, Palette, Award, Users, Save, RefreshCw
} from 'lucide-react';
import { FantasyCampaign, SportsPlayer } from '../types';
import { playUiClick, playCriticalFanfare } from '../utils/audioSynth';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  campaign: FantasyCampaign;
  allPlayers: SportsPlayer[];
  onUpdateGuild: (updatedGuild: any) => void;
  onImportCampaign: (importedData: FantasyCampaign) => void;
}

const CREST_ICONS = ['⚡', '🐺', '⚔️', '🐉', '🦅', '🛡️', '👑', '🏹', '💥', '🌊', '🔥', '🦁', '🕷️', '🦑', '❄️'];
const BANNER_COLORS = [
  { name: 'Amber Gold', hex: '#f59e0b' },
  { name: 'Electric Blue', hex: '#3b82f6' },
  { name: 'Emerald Forest', hex: '#10b981' },
  { name: 'Crimson Red', hex: '#ef4444' },
  { name: 'Royal Purple', hex: '#8b5cf6' },
  { name: 'Cyan Frost', hex: '#06b6d4' },
  { name: 'Rose Quartz', hex: '#f43f5e' },
  { name: 'Shadow Obsidian', hex: '#64748b' }
];

export const MyClubManagerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  campaign,
  allPlayers,
  onUpdateGuild,
  onImportCampaign
}) => {
  if (!isOpen) return null;

  const userGuild = campaign.guilds[0] || {
    id: 'guild-1',
    name: 'Vanguard of Thunder',
    crestIcon: '⚡',
    bannerColor: '#f59e0b',
    members: [],
    roster: []
  };

  const [clubName, setClubName] = useState(userGuild.name);
  const [crest, setCrest] = useState(userGuild.crestIcon || '⚡');
  const [color, setColor] = useState(userGuild.bannerColor || '#f59e0b');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const handleSaveClub = () => {
    playUiClick();
    const updated = {
      ...userGuild,
      name: clubName.trim() || userGuild.name,
      crestIcon: crest,
      bannerColor: color
    };
    onUpdateGuild(updated);
    setSaveSuccess(true);
    playCriticalFanfare();
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Export campaign state to JSON
  const handleExportData = () => {
    playUiClick();
    const jsonStr = JSON.stringify(campaign, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `realm-champions-${campaign.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON campaign
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.id && parsed.guilds) {
          onImportCampaign(parsed);
          setImportError(null);
          playCriticalFanfare();
          onClose();
        } else {
          setImportError('Invalid campaign backup format.');
        }
      } catch {
        setImportError('Failed to parse campaign JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg"
              style={{ backgroundColor: color, color: '#020617' }}
            >
              {crest}
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-['Rajdhani'] uppercase tracking-tight">
                My Fantasy Club Syndicate
              </h2>
              <p className="text-xs text-slate-400">
                Customize your club identity, banner crest, and manage league data
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 scrollbar-thin">
          {/* Club Identity Section */}
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Club / Syndicate Name
            </label>
            <input
              type="text"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              placeholder="e.g. Vanguard of Thunder"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold focus:outline-none focus:border-amber-400 text-sm"
            />

            {/* Crest Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Select Club Crest Symbol
              </label>
              <div className="flex flex-wrap gap-2">
                {CREST_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => { playUiClick(); setCrest(icon); }}
                    className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center border transition ${
                      crest === icon
                        ? 'border-amber-400 bg-amber-500/20 shadow-md shadow-amber-500/20 scale-105'
                        : 'border-slate-800 bg-slate-950 hover:bg-slate-800'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Banner Color Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Club Banner Accent Color
              </label>
              <div className="flex flex-wrap gap-2.5">
                {BANNER_COLORS.map((bColor) => (
                  <button
                    key={bColor.hex}
                    type="button"
                    onClick={() => { playUiClick(); setColor(bColor.hex); }}
                    className={`w-8 h-8 rounded-full border-2 transition ${
                      color === bColor.hex ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: bColor.hex }}
                    title={bColor.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Roster Overview */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                Active Roster: {userGuild.roster?.length || 0} Athletes
              </span>
              <span className="text-xs font-mono text-amber-300">
                {userGuild.campaignStats?.totalPoints || 0} Total PTS
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(userGuild.roster || []).map((p) => (
                <span
                  key={p.id}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-medium text-slate-200"
                >
                  {p.name} ({p.league})
                </span>
              ))}
              {(!userGuild.roster || userGuild.roster.length === 0) && (
                <span className="text-xs text-slate-500 italic">No drafted players yet. Head to Live Draft!</span>
              )}
            </div>
          </div>

          {/* Export & Import Backup */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              League Data Management (Local Storage & JSON Backup)
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExportData}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export League Backup</span>
              </button>

              <label className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Import League JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>
            {importError && (
              <p className="text-xs text-red-400 font-medium">{importError}</p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <div>
            {saveSuccess && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-fadeIn">
                <Check className="w-4 h-4" />
                Club Profile Successfully Saved!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveClub}
              className="px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 flex items-center gap-1.5 transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
