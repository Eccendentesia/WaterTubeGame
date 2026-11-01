import React from 'react';
import { ArrowLeft, Lock, Star } from 'lucide-react';

export default function LevelSelection({ progress, onBack, onSelect }) {
  return <section className="screen level-screen">
    <div className="screen-top"><button className="icon-button" onClick={onBack}><ArrowLeft/></button><div><span className="eyebrow">Choose your puzzle</span><h1>Level map</h1></div></div>
    <div className="level-grid">
      {Array.from({ length: 100 }, (_, i) => i + 1).map(level => {
        const locked = level > progress.unlocked;
        const stars = progress.completed[level] || 0;
        return <button key={level} disabled={locked} className={`level-tile ${locked ? 'locked' : ''} ${stars ? 'done' : ''}`} onClick={() => onSelect(level)}>
          {locked ? <Lock size={17}/> : <strong>{level}</strong>}
          <span className="tile-stars">{[1,2,3].map(n => <Star key={n} size={8} fill={n <= stars ? '#ffc44d' : 'none'} color={n <= stars ? '#e6a62d' : '#cdd1df'}/>)}</span>
        </button>;
      })}
    </div>
  </section>;
}
