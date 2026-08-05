import React from 'react';
import { BarChart3, Users, Heart, Award, MapPin, Calendar, Activity } from 'lucide-react';

export default function AnalyticsView({ members }) {
  const total = members.length;
  const males = members.filter(m => m.gender === 'male').length;
  const females = members.filter(m => m.gender === 'female').length;

  // Calculate average lifespan for deceased members
  const lifespans = members
    .filter(m => m.birthDate && m.deathDate)
    .map(m => {
      const bYear = parseInt(m.birthDate.substring(0, 4), 10);
      const dYear = parseInt(m.deathDate.substring(0, 4), 10);
      return dYear - bYear;
    })
    .filter(age => !isNaN(age) && age > 0);

  const avgLifespan = lifespans.length > 0
    ? Math.round(lifespans.reduce((a, b) => a + b, 0) / lifespans.length)
    : 'N/A';

  // Surnames count
  const surnameCounts = {};
  members.forEach(m => {
    const s = m.lastName || 'Unknown';
    surnameCounts[s] = (surnameCounts[s] || 0) + 1;
  });

  // Top Birth Places
  const placeCounts = {};
  members.forEach(m => {
    if (m.birthPlace) {
      placeCounts[m.birthPlace] = (placeCounts[m.birthPlace] || 0) + 1;
    }
  });

  // Generations Count
  const maxGen = Math.max(...members.map(m => m.generation || 1), 1);

  return (
    <div className="max-w-7xl mx-auto p-8 animate-fade-in">
      
      {/* Title */}
      <div className="mb-8">
        <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-[var(--accent-emerald)]" />
          Genealogy Analytics & Insights
        </h2>
        <p className="text-xs text-[var(--text-muted)]">
          Demographic stats, longevity metrics, and spatial distribution across your family history
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Total Members</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[var(--text-primary)]">{total}</p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">Indexed family profiles</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Gender Ratio</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[var(--text-primary)]">
            {males}M : {females}F
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            {total > 0 ? `${Math.round((males/total)*100)}% Male / ${Math.round((females/total)*100)}% Female` : ''}
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Avg Ancestor Lifespan</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[var(--text-primary)]">
            {avgLifespan} {typeof avgLifespan === 'number' ? 'yrs' : ''}
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">Based on historic records</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Generations Tracked</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[var(--text-primary)]">{maxGen}</p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">Direct ancestral depth</p>
        </div>

      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Top Surnames */}
        <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)]">
          <h3 className="font-bold text-base text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--accent-primary)]" />
            Most Common Surnames
          </h3>
          <div className="space-y-3">
            {Object.entries(surnameCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => (
              <div key={name} className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--text-primary)]">{name}</span>
                <div className="flex items-center gap-3 flex-1 max-w-[200px] ml-4">
                  <div className="w-full bg-[var(--bg-surface-elevated)] h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[var(--accent-primary)] h-full rounded-full" 
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                  <span className="text-[var(--text-muted)] font-bold min-w-[20px] text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Birth Places */}
        <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)]">
          <h3 className="font-bold text-base text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-400" />
            Ancestral Geographic Roots
          </h3>
          <div className="space-y-3">
            {Object.entries(placeCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([place, count]) => (
              <div key={place} className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--text-primary)] truncate max-w-[220px]">{place}</span>
                <span className="px-2.5 py-1 rounded-full bg-[var(--bg-surface-elevated)] text-[var(--accent-primary)] font-bold">
                  {count} member{count > 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
