
import React, { useEffect, useState } from 'react';

interface GitHubStats {
  linesOfCode: number;
  linesFormatted: string;
  repositories: number;
  totalCommits: number;
  commitsFormatted: string;
  activeProject: string;
  lastCommit: string;
  lastCommitMessage: string;
  openPRs: number;
  openIssues: number;
  openWork: number;
  updatedAt: string;
}

interface StatusBoardProps {
  title: string;
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMins > 0) return `${diffMins}m ago`;
  return 'just now';
}

export const StatusBoard: React.FC<StatusBoardProps> = ({ title }) => {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/stats.json')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const activeWorkPercent = stats ? Math.min((stats.openWork / 10) * 100, 100) : 0;
  const repoActivityPercent = stats ? Math.min((stats.repositories / 20) * 100, 100) : 0;

  return (
    <div className="bg-[#0a0a0a] border border-slate-800 p-6 border-glow-slate">
      <h2 className="retro-text text-2xl mb-4 border-b border-slate-800 pb-2 uppercase glow-slate text-slate-100">{title}</h2>

      <div className="space-y-6">
        {/* Active Project & Recent Commit */}
        <div className="border border-slate-800 p-3 bg-slate-900/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase text-slate-500 font-mono">Active Project</span>
            <span className="text-[#ff7043] text-sm font-mono">{loading ? '...' : stats?.activeProject}</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono truncate" title={stats?.lastCommitMessage}>
            <span className="text-slate-600">Latest:</span> {loading ? '...' : stats?.lastCommitMessage}
          </div>
        </div>

        {/* Progress Bars */}
        <div>
          <div className="flex justify-between text-[10px] uppercase mb-1 text-slate-500 font-mono">
            <span>Open Work (PRs + Issues)</span>
            <span className="text-[#ff7043]">{loading ? '...' : stats?.openWork}</span>
          </div>
          <div className="w-full h-3 bg-slate-900 border border-slate-800 p-[2px]">
            <div
              className="h-full bg-[#ff7043] shadow-[0_0_10px_#ff704380] transition-all duration-500"
              style={{ width: `${activeWorkPercent}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] uppercase mb-1 text-slate-500 font-mono">
            <span>Repository Activity</span>
            <span className="text-[#ff7043]">{loading ? '...' : `${stats?.repositories} repos`}</span>
          </div>
          <div className="w-full h-3 bg-slate-900 border border-slate-800 p-[2px]">
            <div
              className="h-full bg-[#ff7043] shadow-[0_0_10px_#ff704380] transition-all duration-500"
              style={{ width: `${repoActivityPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mt-8">
           <div className="border border-slate-800 p-3 text-center bg-slate-900/50 hover:border-[#ff704340] transition-colors">
              <div className="text-2xl retro-text glow-slate text-slate-100">
                {loading ? '...' : stats?.linesFormatted}
              </div>
              <div className="text-[8px] uppercase tracking-tighter text-slate-600 font-mono">Lines Written</div>
           </div>
           <div className="border border-slate-800 p-3 text-center bg-slate-900/50 hover:border-[#ff704340] transition-colors">
              <div className="text-2xl retro-text glow-slate text-slate-100">
                {loading ? '...' : stats?.commitsFormatted}
              </div>
              <div className="text-[8px] uppercase tracking-tighter text-slate-600 font-mono">Total Commits</div>
           </div>
           <div className="border border-slate-800 p-3 text-center bg-slate-900/50 hover:border-[#ff704340] transition-colors">
              <div className="text-2xl retro-text glow-slate text-slate-100">
                {loading ? '...' : stats ? getRelativeTime(stats.lastCommit) : '...'}
              </div>
              <div className="text-[8px] uppercase tracking-tighter text-slate-600 font-mono">Last Commit</div>
           </div>
           <div className="border border-slate-800 p-3 text-center bg-slate-900/50 hover:border-[#ff704340] transition-colors">
              <div className="text-2xl retro-text glow-orange font-bold text-[#ff7043]">
                {loading ? '...' : stats?.repositories}
              </div>
              <div className="text-[8px] uppercase tracking-tighter text-slate-600 font-mono">Repositories</div>
           </div>
        </div>

        {/* Last Updated */}
        <div className="text-[8px] text-slate-700 font-mono text-right">
          Updated: {loading ? '...' : stats ? getRelativeTime(stats.updatedAt) : '...'}
        </div>
      </div>
    </div>
  );
};
