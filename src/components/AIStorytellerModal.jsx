import React, { useState } from 'react';
import { useFamily } from '../context/FamilyContext';
import { X, Sparkles, Wand2, Compass, Award, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AIStorytellerModal() {
  const { activeModal, setActiveModal, selectedMember, members, relationships } = useFamily();
  const [generating, setGenerating] = useState(false);
  const [story, setStory] = useState(null);

  if (activeModal !== 'ai') return null;

  const handleGenerateStory = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setStory({
        title: `The Odyssey of ${selectedMember.firstName} ${selectedMember.lastName}`,
        narrative: `Born in ${selectedMember.birthYear || 'the late 19th century'} in ${selectedMember.birthPlace || 'Boston, Massachusetts'}, ${selectedMember.firstName} grew up amidst an era of monumental architectural expansion and generational transition. As a key figure in Generation ${selectedMember.generation || 'IV'}, their contributions bridged classical botanical engineering with modern civic preservation. Their legacy continues to ripple through ${members.length} documented family descendants and kin across seven vibrant generational circles.`,
        insights: [
          `Key Lineage Node connecting ${relationships.filter(r => r.from === selectedMember.id || r.to === selectedMember.id).length} direct family relationships.`,
          `Generational Span: Influenced kin across 3 centuries of lineage evolution.`,
          `Heritage Preservation Score: 98% complete vital statistics & biographical documentation.`
        ]
      });
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 900);
  };

  return (
    <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header ai-header">
          <div className="modal-title-wrapper">
            <div className="ai-title-badge">
              <Sparkles size={16} /> AI Atlas Storyteller
            </div>
            <h2>Dynasty Narrative Intelligence</h2>
          </div>
          <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body ai-body">
          <div className="ai-focus-card">
            <img src={selectedMember.avatar} alt={selectedMember.firstName} className="ai-focus-img" />
            <div className="ai-focus-details">
              <h4>{selectedMember.firstName} {selectedMember.lastName}</h4>
              <p>Generation {selectedMember.generation || 'IV'} • {selectedMember.birthYear}–{selectedMember.deathYear || 'Present'}</p>
            </div>
            <button 
              className="btn btn-primary glow-btn"
              onClick={handleGenerateStory}
              disabled={generating}
            >
              <Wand2 size={16} />
              {generating ? 'Synthesizing Heritage...' : 'Generate Biography'}
            </button>
          </div>

          {story ? (
            <div className="ai-story-output">
              <div className="story-output-title">{story.title}</div>
              <p className="story-output-text">{story.narrative}</p>

              <div className="story-insights-box">
                <h5>Heritage Insights</h5>
                {story.insights.map((ins, i) => (
                  <div key={i} className="insight-row">
                    <CheckCircle2 size={15} className="insight-icon" />
                    <span>{ins}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="ai-placeholder-box">
              <Compass size={32} className="ai-placeholder-icon" />
              <p>Click "Generate Biography" to create an AI-synthesized narrative chronicling {selectedMember.firstName}'s historical context, milestones, and generational impact.</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setActiveModal(null)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
