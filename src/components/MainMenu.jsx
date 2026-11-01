import React from 'react';
import { Play, Grid3X3, Volume2, VolumeX, Droplets, Sparkles } from 'lucide-react';

export default function MainMenu({ progress, onPlay, onLevels, onToggleSound }) {
  const completed = Object.keys(progress.completed || {}).length;
  return <main className="screen menu-screen">
    <div className="menu-top"><span className="brand-mark"><Droplets size={20}/></span><span>CASUAL PUZZLES</span><button className="icon-button sound-toggle" onClick={onToggleSound} aria-label="Toggle sound">{progress.sound ? <Volume2/> : <VolumeX/>}</button></div>
    <div className="hero-art" aria-hidden="true">
      <div className="sparkle s1">✦</div><div className="sparkle s2">✧</div><div className="sparkle s3">✦</div>
      <div className="hero-tubes">
        {[
          ['#ff6685','#ffc247','#4f9cff'], ['#48c99a','#a47af5','#ff914d','#48c99a'],
          ['#4f9cff','#ff6685','#ffc247'], ['#a47af5','#39c7d5','#ff914d']
        ].map((layers,i) => <div className={`hero-tube ht${i}`} key={i}><div>{layers.map((c,j)=><i key={j} style={{background:c}}/>)}</div></div>)}
      </div>
    </div>
    <div className="menu-copy"><span className="eyebrow"><Sparkles size={13}/> A little colour therapy</span><h1>Water Sort<br/><em>Challenge</em></h1><p>Pour, sort and unwind.<br/>One satisfying puzzle at a time.</p></div>
    <div className="menu-actions">
      <button className="primary-button" onClick={onPlay}><Play size={19} fill="currentColor"/> Continue playing</button>
      <button className="secondary-button wide" onClick={onLevels}><Grid3X3 size={18}/> Level selection</button>
    </div>
    <div className="progress-strip"><div><strong>{completed}</strong><span>levels solved</span></div><div className="progress-divider"/><div><strong>{progress.unlocked}</strong><span>highest unlocked</span></div><div className="progress-divider"/><div><strong>{Object.values(progress.completed).reduce((a,b)=>a+b,0)}</strong><span>stars earned</span></div></div>
    <p className="menu-foot">Take a breath. Find your flow.</p>
  </main>;
}
