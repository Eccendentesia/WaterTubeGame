import React from 'react';
import { Undo2, RotateCcw, Lightbulb, Shuffle, Pause } from 'lucide-react';

function Control({ icon: Icon, label, onClick, disabled, accent }) {
  return <button className={`control-button ${accent ? 'accent' : ''}`} onClick={onClick} disabled={disabled}>
    <Icon size={19}/><span>{label}</span>
  </button>;
}

export default function GameControls({ onUndo, onRestart, onHint, onShuffle, onPause, canUndo, busy }) {
  return <div className="controls">
    <Control icon={Undo2} label="Undo" onClick={onUndo} disabled={!canUndo || busy}/>
    <Control icon={RotateCcw} label="Restart" onClick={onRestart} disabled={busy}/>
    <Control icon={Lightbulb} label="Hint" onClick={onHint} disabled={busy} accent/>
    <Control icon={Shuffle} label="New mix" onClick={onShuffle} disabled={busy}/>
    <Control icon={Pause} label="Pause" onClick={onPause} disabled={busy}/>
  </div>;
}
