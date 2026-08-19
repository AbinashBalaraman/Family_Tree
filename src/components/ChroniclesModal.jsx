import React from 'react';
import { useFamily } from '../context/FamilyContext';
import { X, BookOpen, Clock, Award, Users } from 'lucide-react';

export default function ChroniclesModal() {
  const { activeModal, setActiveModal, members } = useFamily();

  if (activeModal !== 'chronicles') return null;

  // Group members by generation
  const generations = [
    { gen: 1, name: 'Gen I — Ancestral Foundations & Patriarchs', desc: 'The earliest documented forebears establishing the family lineage in the mid-19th century.' },
    { gen: 2, name: 'Gen II — Maritime & Industrial Expansion', desc: 'Pioneers of Atlantic merchant trading and industrial civic engineering.' },
    { gen: 3, name: 'Gen III — Scholars, Jurists & Botanists', desc: 'Academics, legal magistrates, and civic leaders expanding the family heritage.' },
    { gen: 4, name: 'Gen IV — Architectural & Cultural Golden Age', desc: 'Matriarch Sarah Johnson and contemporaries pioneering architectural landmarks and academic chairs.' },
    { gen: 5, name: 'Gen V — The New Century Innovators', desc: 'Naval architects, botanical educators, and modern researchers.' },
    { gen: 6, name: 'Gen VI — Contemporary Generation', desc: 'Active contributors in civic arts, sciences, and global enterprise.' },
    { gen: 7, name: 'Gen VII — Next Century Descendants', desc: 'The burgeoning youth carrying forward the Johnson heritage.' }
  ];

  return (
    <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
      <div className="modal-card wide-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <h2>📖 Family Atlas Chronicles</h2>
            <span className="modal-subtitle">Comprehensive Generational Dynasty History ({members.length} Documented Members)</span>
          </div>
          <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body chronicles-body">
          <div className="chronicles-intro-banner">
            <BookOpen size={24} className="banner-icon" />
            <div>
              <h3>The Johnson-Harper-Vance Dynasty</h3>
              <p>An archival record spanning seven generations across three centuries, detailing matrimonial alliances, architectural achievements, and heritage preservation.</p>
            </div>
          </div>

          <div className="generational-chronicle-list">
            {generations.map(g => {
              const genMembers = members.filter(m => m.generation === g.gen);
              if (genMembers.length === 0) return null;

              return (
                <div key={g.gen} className="dynasty-generation-block">
                  <div className="dynasty-gen-header">
                    <span className="gen-pill-tag">Gen {g.gen}</span>
                    <h4>{g.name}</h4>
                  </div>
                  <p className="dynasty-gen-desc">{g.desc}</p>

                  <div className="dynasty-members-grid">
                    {genMembers.map(m => (
                      <div key={m.id} className="dynasty-member-tile">
                        <img src={m.avatar} alt={m.firstName} className="dynasty-thumb" />
                        <div className="dynasty-info">
                          <div className="dynasty-name">{m.firstName} {m.lastName}</div>
                          <div className="dynasty-dates">{m.birthYear}–{m.deathYear || ''}</div>
                          <div className="dynasty-occ">{m.occupation || 'Lineage Member'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setActiveModal(null)}>
            Close Chronicles
          </button>
        </div>
      </div>
    </div>
  );
}
