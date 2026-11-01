import { useCallback, useRef } from 'react';

export function useSound(enabled) {
  const ctx = useRef(null);
  const play = useCallback((type = 'tap') => {
    if (!enabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!ctx.current) ctx.current = new AudioContext();
      const audio = ctx.current;
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      const presets = {
        tap: [520, 0.055], pour: [340, 0.12], invalid: [150, 0.12], win: [740, 0.24]
      };
      const [frequency, duration] = presets[type] || presets.tap;
      osc.type = type === 'invalid' ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(frequency, audio.currentTime);
      if (type === 'win') osc.frequency.exponentialRampToValueAtTime(1100, audio.currentTime + duration);
      gain.gain.setValueAtTime(0.0001, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.09, audio.currentTime + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);
      osc.connect(gain); gain.connect(audio.destination);
      osc.start(); osc.stop(audio.currentTime + duration + 0.02);
    } catch { /* Audio is an optional enhancement. */ }
  }, [enabled]);
  return play;
}
