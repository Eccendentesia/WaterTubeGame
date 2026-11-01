export function getLevelConfig(level) {
  const colors = Math.min(9, 3 + Math.floor((level - 1) / 8));
  return {
    colors,
    emptyTubes: 2,
    scrambleMoves: Math.min(12 + level * 2, 90),
    difficulty: level < 8 ? 'Relaxed' : level < 25 ? 'Tricky' : 'Brainy'
  };
}
