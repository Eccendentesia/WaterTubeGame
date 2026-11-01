import { useEffect, useState } from 'react';

const KEY = 'water-sort-challenge-progress-v1';
const initial = { unlocked: 1, completed: {}, sound: true };

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    try {
      return { ...initial, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
    } catch { return initial; }
  });

  useEffect(() => localStorage.setItem(KEY, JSON.stringify(progress)), [progress]);

  const completeLevel = (level, stars) => setProgress(prev => ({
    ...prev,
    unlocked: Math.max(prev.unlocked, level + 1),
    completed: { ...prev.completed, [level]: Math.max(prev.completed[level] || 0, stars) }
  }));
  const toggleSound = () => setProgress(prev => ({ ...prev, sound: !prev.sound }));
  return { progress, completeLevel, toggleSound };
}
