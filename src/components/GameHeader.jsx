import React from 'react';
import { ArrowLeft, Trophy, Clock3, Footprints } from 'lucide-react';

export default function GameHeader({ level, moves, seconds, onBack, bestStars, difficulty }) {
  const time = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  return (
    <header className="game-header">
      <button className="icon-button back-button" onClick={onBack} aria-label="Back to menu"><ArrowLeft size={20}/></button>
      <div className="level-heading">
        <span className="eyebrow">{difficulty} puzzle</span>
        <h1>Level {level}</h1>
      </div>
      <div className="header-stats">
        <div className="stat-chip"><Footprints size={15}/><span>{moves}</span></div>
        <div className="stat-chip"><Clock3 size={15}/><span>{time}</span></div>
        <div className="stat-chip"><Trophy size={15}/><span>{bestStars || 0}/3</span></div>
      </div>
    </header>
  );
}
