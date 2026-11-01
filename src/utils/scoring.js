export function calculateStars(moves, level) {
  const target = Math.max(8, 12 + Math.floor(level * 1.4));
  if (moves <= target) return 3;
  if (moves <= target * 1.55) return 2;
  return 1;
}
