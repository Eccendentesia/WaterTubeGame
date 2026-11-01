import React from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';

export default function Settings({ sound, onToggleSound, onClose }) {
  return <div className="modal-backdrop"><div className="settings-modal">
    <button className="modal-close" onClick={onClose}><X/></button>
    <span className="eyebrow">Your experience</span><h2>Settings</h2>
    <button className="setting-row" onClick={onToggleSound}><span>{sound ? <Volume2/> : <VolumeX/>} Sound effects</span><span className={`switch ${sound ? 'on' : ''}`}><i/></span></button>
    <p className="muted small">Progress is saved automatically on this device.</p>
    <button className="primary-button full" onClick={onClose}>Done</button>
  </div></div>;
}
