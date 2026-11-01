import React from 'react';
import { Star, ArrowRight, RotateCcw, House } from 'lucide-react';

export default function LevelComplete({ level, moves, stars, onNext, onReplay, onHome }) {
  return <div className="modal-backdrop">
    <div className="result-modal">
      <div className="win-orb">🏆</div>
      <p className="eyebrow">Puzzle solved</p>
      <h2>Brilliant work!</h2>
      <p className="muted">You sorted every colour in Level {level}.</p>
      <div className="earned-stars">{[1,2,3].map(n => <Star key={n} size={34} fill={n <= stars ? '#ffc44d' : 'none'} color={n <= stars ? '#e6a62d' : '#d9dce9'}/>)}</div>
      <div className="result-moves"><strong>{moves}</strong><span>moves used</span></div>
      <button className="primary-button full" onClick={onNext}>Next level <ArrowRight size={18}/></button>
      <div className="modal-actions">
        <button className="secondary-button" onClick={onReplay}><RotateCcw size={16}/> Replay</button>
        <button className="secondary-button" onClick={onHome}><House size={16}/> Home</button>
      </div>
    </div>
  </div>;
}
