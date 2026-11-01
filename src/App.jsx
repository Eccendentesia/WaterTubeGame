import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Settings as SettingsIcon, X, Lightbulb } from 'lucide-react';
import MainMenu from './components/MainMenu.jsx';
import LevelSelection from './components/LevelSelection.jsx';
import GameHeader from './components/GameHeader.jsx';
import Tube from './components/Tube.jsx';
import GameControls from './components/GameControls.jsx';
import LevelComplete from './components/LevelComplete.jsx';
import Settings from './components/Settings.jsx';
import { useProgress } from './hooks/useProgress.js';
import { useSound } from './hooks/useSound.js';
import { getLevelConfig } from './utils/levelConfig.js';
import { generatePuzzle } from './utils/puzzleGenerator.js';
import { canPour, pour, isSolved, getHint } from './utils/gameLogic.js';
import { calculateStars } from './utils/scoring.js';

export default function App() {
  const { progress, completeLevel, toggleSound } = useProgress();
  const playSound = useSound(progress.sound);
  const [screen, setScreen] = useState('menu');
  const [level, setLevel] = useState(1);
  const [tubes, setTubes] = useState([]);
  const [initialTubes, setInitialTubes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [history, setHistory] = useState([]);
  const [busy, setBusy] = useState(false);
  const [pouringFrom, setPouringFrom] = useState(null);
  const [invalid, setInvalid] = useState(null);
  const [hint, setHint] = useState(null);
  const [showWin, setShowWin] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const timerRef = useRef(null);
  const busyRef = useRef(false);

  const config = useMemo(() => getLevelConfig(level), [level]);

  const loadLevel = useCallback((number) => {
    const cfg = getLevelConfig(number);
    const board = generatePuzzle(number, cfg);
    setLevel(number); setTubes(board); setInitialTubes(board.map(t => [...t]));
    setSelected(null); setMoves(0); setSeconds(0); setHistory([]);setHint(null);
setShowWin(false);
setShowPause(false);
setBusy(false);
setPouringFrom(null);
busyRef.current = false;

setScreen('game');
  }, []);

  useEffect(() => {
    if (screen !== 'game' || showWin || showPause) return;
    timerRef.current = window.setInterval(() => setSeconds(s => s + 1), 1000);
    return () => window.clearInterval(timerRef.current);
  }, [screen, showWin, showPause]);

const commitMove = useCallback((from, to) => {
  if (busyRef.current || !canPour(tubes, from, to)) return false;

  const result = pour(tubes, from, to);
  if (!result) return false;

  const before = tubes.map(t => [...t]);

  // Start the pouring animation
  busyRef.current = true;
  setBusy(true);
  setPouringFrom(from);
  setSelected(null);
  setHint(null);

  playSound('pour');

  // Update liquid only after the animation
  window.setTimeout(() => {
    setHistory(h => [...h, before]);
    setTubes(result.tubes);
    setMoves(m => m + 1);
    setPouringFrom(null);

    busyRef.current = false;
    setBusy(false);

    if (isSolved(result.tubes)) {
      const stars = calculateStars(moves + 1, level);
      completeLevel(level, stars);
      setShowWin(true);
      playSound('win');
    }
  }, 450);

  return true;
}, [tubes, moves, level, completeLevel, playSound]);

  const handleTubeClick = (index) => {
    if (busy || showWin || showPause) return;
    setHint(null);
    if (selected === null) {
      if (tubes[index].length) { setSelected(index); playSound('tap'); }
      return;
    }
    if (selected === index) { setSelected(null); return; }
    if (commitMove(selected, index)) return;
    if (tubes[index].length) {
      if (canPour(tubes, index, selected)) { setSelected(index); return; }
    }
    setInvalid(index); playSound('invalid');
    window.setTimeout(() => setInvalid(null), 350);
    setSelected(null);
  };

  const undo = () => {
    if (!history.length || busy) return;
    setTubes(history[history.length - 1]);
    setHistory(h => h.slice(0, -1)); setMoves(m => Math.max(0, m - 1));
    setSelected(null); setHint(null); playSound('tap');
  };
  const restart = () => {
    setTubes(initialTubes.map(t => [...t])); setHistory([]); setMoves(0);
    setSelected(null); setHint(null); setShowWin(false); setSeconds(0); playSound('tap');
  };
  const showHint = () => {
    const found = getHint(tubes);
    if (found) { setHint(found); setSelected(found.from); playSound('tap'); }
  };
  const nextLevel = () => loadLevel(level + 1);
  const shuffleLevel = () => loadLevel(level);

  return <div className="app-shell">
    {screen === 'menu' && <MainMenu progress={progress} onPlay={() => loadLevel(progress.unlocked)} onLevels={() => setScreen('levels')} onToggleSound={toggleSound}/>}
    {screen === 'levels' && <LevelSelection progress={progress} onBack={() => setScreen('menu')} onSelect={loadLevel}/>}
    {screen === 'game' && <>
      <div className="game-top-actions"><span className="tiny-brand">💧 WATER SORT</span><button className="icon-button" onClick={() => setShowSettings(true)} aria-label="Settings"><SettingsIcon size={19}/></button></div>
      <GameHeader level={level} moves={moves} seconds={seconds} onBack={() => setScreen('menu')} bestStars={progress.completed[level]} difficulty={config.difficulty}/>
      <div className="game-instruction">{hint ? <><Lightbulb size={15}/> Try pouring from tube {hint.from + 1} to tube {hint.to + 1}</> : 'Tap a tube, then tap where you want to pour'}</div>
      <section className={`board-wrap ${busy ? 'board-busy' : ''}`}>
        <div className="game-board" style={{'--tube-count': tubes.length}}>
          {tubes.map((layers, i) => (
  <Tube
    key={i}
    index={i}
    layers={layers}
    selected={selected === i}
    pouring={pouringFrom === i}
    hint={hint && (hint.from === i || hint.to === i)}
    invalid={invalid === i}
    disabled={busy}
    onClick={handleTubeClick}
  />
))}
        </div>
      </section>
      <div className="board-legend"><span><i className="legend-dot"/>{config.colors} colours</span><span>{config.emptyTubes} empty tubes</span></div>
      <GameControls onUndo={undo} onRestart={restart} onHint={showHint} onShuffle={shuffleLevel}
        onPause={() => setShowPause(true)} canUndo={history.length > 0} busy={busy}/>
      <div className="game-footer">Every colour has its place <span>✦</span></div>
      {showWin && <LevelComplete level={level} moves={moves} stars={calculateStars(moves, level)} onNext={nextLevel} onReplay={restart} onHome={() => {setShowWin(false);setScreen('menu');}}/>}
      {showPause && <div className="modal-backdrop"><div className="pause-modal"><button className="modal-close" onClick={() => setShowPause(false)}><X/></button><div className="pause-icon">Ⅱ</div><h2>Take a break</h2><p className="muted">Your puzzle is waiting right here.</p><button className="primary-button full" onClick={() => setShowPause(false)}>Resume puzzle</button><button className="secondary-button full" onClick={() => {setShowPause(false);setScreen('menu');}}>Back to menu</button></div></div>}
      {showSettings && <Settings sound={progress.sound} onToggleSound={toggleSound} onClose={() => setShowSettings(false)}/>}
    </>}
  </div>;
}
