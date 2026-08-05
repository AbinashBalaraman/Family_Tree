import React from 'react';
import { Clock, Calendar, Heart, Award, MapPin } from 'lucide-react';

export default function TimelineView({ members, onSelectMember }) {
  // Build chronological events list from family members
  const events = [];

  members.forEach(m => {
    if (m.birthDate) {
      const year = parseInt(m.birthDate.substring(0, 4), 10);
      if (!isNaN(year)) {
        events.push({
          id: `birt_${m.id}`,
          year,
          date: m.birthDate,
          type: 'birth',
          title: `Birth of ${m.firstName} ${m.lastName}`,
          location: m.birthPlace,
          member: m,
          description: m.bio || `${m.firstName} was born in ${m.birthPlace || 'unknown location'}.`
        });
      }
    }

    if (m.deathDate) {
      const year = parseInt(m.deathDate.substring(0, 4), 10);
      if (!isNaN(year)) {
        events.push({
          id: `deat_${m.id}`,
          year,
          date: m.deathDate,
          type: 'passing',
          title: `Passing of ${m.firstName} ${m.lastName}`,
          location: '',
          member: m,
          description: `Passed away at the age of ${m.birthDate ? year - parseInt(m.birthDate.substring(0, 4), 10) : 'unknown'}.`
        });
      }
    }
  });

  events.sort((a, b) => a.year - b.year);

  return (
    <div className="max-w-4xl mx-auto p-8 animate-fade-in">
      
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl font-bold flex items-center justify-center gap-3">
          <Clock className="w-8 h-8 text-[var(--accent-amber)]" />
          Family Heritage Timeline
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          Chronological journey through major births, milestones, and family legacy events
        </p>
      </div>

      <div className="relative border-l-2 border-[var(--border-color)] pl-8 space-y-10 ml-4 md:ml-12">
        {events.map((evt) => {
          const isBirth = evt.type === 'birth';
          return (
            <div key={evt.id} className="relative group">
              
              {/* Timeline Icon Node */}
              <div className={`absolute -left-[45px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-white border-2 border-[var(--bg-main)] shadow-lg transition-transform group-hover:scale-125 ${isBirth ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                {isBirth ? <Calendar className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
              </div>

              {/* Event Content Box */}
              <div className="glass-panel p-6 rounded-2xl border border-[var(--border-color)] group-hover:border-[var(--accent-primary)] transition-all">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[var(--bg-surface-elevated)] text-[var(--accent-primary)] border border-[var(--border-color)]">
                    {evt.year}
                  </span>
                  {evt.location && (
                    <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {evt.location}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-[var(--text-primary)] mb-1">
                  {evt.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mb-4">
                  {evt.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
                  <div className="flex items-center gap-2">
                    {evt.member.avatar && (
                      <img src={evt.member.avatar} alt={evt.member.firstName} className="w-6 h-6 rounded-full object-cover" />
                    )}
                    <span className="text-xs font-semibold text-[var(--text-muted)]">
                      Gen {evt.member.generation || 1}
                    </span>
                  </div>

                  <button 
                    onClick={() => onSelectMember(evt.member.id)}
                    className="text-xs font-bold text-[var(--accent-primary)] hover:underline"
                  >
                    View Member →
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
