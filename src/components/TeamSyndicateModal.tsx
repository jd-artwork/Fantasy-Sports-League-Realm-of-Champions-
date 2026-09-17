import React, { useState } from 'react';
import { FantasyCampaign, FantasyGuildTeam, ManagerRole } from '../types';
import { X, Copy, Check, UserPlus, Users, Shield, Sparkles } from 'lucide-react';

interface Props {
  campaign: FantasyCampaign;
  isOpen: boolean;
  onClose: () => void;
  onInviteMember: (guildId: string, name: string, email: string, role: string) => Promise<void>;
}

export const TeamSyndicateModal: React.FC<Props> = ({
  campaign,
  isOpen,
  onClose,
  onInviteMember
}) => {
  if (!isOpen) return null;

  const userGuild = campaign?.guilds?.[0] || {
    id: 'guild-1',
    name: 'Vanguard of Thunder',
    bannerColor: '#3B82F6',
    crestIcon: 'ShieldAlert',
    budget: 185,
    gutterStatus: 'NORMAL',
    campaignStats: { wins: 3, losses: 0, ties: 0, totalPoints: 532.4, guildXP: 2450, level: 3 },
    members: [],
    roster: []
  } as any;
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<ManagerRole>('OFFENSE_COORDINATOR');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteFeedback, setInviteFeedback] = useState<string | null>(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(campaign.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await onInviteMember(userGuild.id, name.trim(), email.trim() || 'teammate@realm.net', role);
      setInviteFeedback(`Successfully invited ${name}! They have joined ${userGuild.name}.`);
      setName('');
      setEmail('');
      setTimeout(() => setInviteFeedback(null), 3500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Rajdhani'] uppercase tracking-wide">
                Invite Co-Managers to {userGuild.name}
              </h2>
              <p className="text-xs text-slate-400">
                Create a syndicate where multiple people manage designated players under their command.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shareable Campaign Invite Code */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Shareable Campaign Invite Code
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={campaign.inviteCode}
              className="w-full bg-slate-900 border border-slate-700 text-amber-400 font-mono font-bold text-sm rounded-xl px-3 py-2 focus:outline-none"
            />
            <button
              onClick={handleCopyCode}
              className="shrink-0 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Friends entering this code will join your guild syndicate as co-managers.
          </p>
        </div>

        {/* Invite Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-amber-500" />
            <span>Send Direct Co-Manager Invitation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium">Friend / Teammate Name</label>
              <input
                id="input-invite-name"
                type="text"
                placeholder="e.g. Jordan Miller"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium">Email (Optional)</label>
              <input
                id="input-invite-email"
                type="email"
                placeholder="jordan@fantasy.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">Designated Management Role</label>
            <select
              id="select-invite-role"
              value={role}
              onChange={(e) => setRole(e.target.value as ManagerRole)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="OFFENSE_COORDINATOR">Offensive Commander (Commands QBs, Strikers, Guards)</option>
              <option value="DEFENSE_TACTICIAN">Iron Wall Captain (Commands CBs, Defenders, Goalies)</option>
              <option value="SCOUT_SPECIALIST">Scout Master (Commands Flex, Bench & Rotations)</option>
            </select>
          </div>

          {inviteFeedback && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
              {inviteFeedback}
            </div>
          )}

          <button
            id="btn-submit-invite"
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-600/25 disabled:opacity-50"
          >
            {isSubmitting ? 'Inviting...' : 'Add Co-Manager to Team Roster'}
          </button>
        </form>

        {/* Existing Syndicate Roster */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Current Co-Managers ({userGuild.members.length})
          </div>

          <div className="space-y-2">
            {userGuild.members.map(member => (
              <div key={member.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full ${member.avatarColor} text-slate-950 font-bold flex items-center justify-center text-xs`}>
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>{member.name}</span>
                      {member.role === 'GUILD_MASTER' && (
                        <span className="text-[9px] font-bold px-1 rounded bg-amber-500/20 text-amber-400">Leader</span>
                      )}
                    </div>
                    <div className="text-[11px] text-indigo-400">{member.roleTitle}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-amber-400 font-semibold">{member.assignedPlayerIds.length} players assigned</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
