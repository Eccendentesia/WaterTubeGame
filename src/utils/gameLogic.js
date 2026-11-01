export const CAPACITY = 4;

export function getPourAmount(source, destination) {
  if (!source?.length || destination.length >= CAPACITY) return 0;
  const color = source[source.length - 1];
  if (destination.length && destination[destination.length - 1] !== color) return 0;
  let run = 0;
  for (let i = source.length - 1; i >= 0 && source[i] === color; i--) run++;
  return Math.min(run, CAPACITY - destination.length);
}

export function canPour(tubes, from, to) {
  if (from === to || from < 0 || to < 0 || !tubes[from] || !tubes[to]) return false;
  return getPourAmount(tubes[from], tubes[to]) > 0;
}

export function pour(tubes, from, to) {
  if (!canPour(tubes, from, to)) return null;
  const next = tubes.map(t => [...t]);
  const amount = getPourAmount(next[from], next[to]);
  const moved = next[from].splice(next[from].length - amount, amount);
  next[to].push(...moved);
  return { tubes: next, amount };
}

export function isSolved(tubes) {
  return tubes.every(t => t.length === 0 || (t.length === CAPACITY && t.every(c => c === t[0])));
}

export function getHint(tubes) {
  for (let from = 0; from < tubes.length; from++) {
    for (let to = 0; to < tubes.length; to++) {
      if (!canPour(tubes, from, to)) continue;
      const source = tubes[from], dest = tubes[to];
      const color = source[source.length - 1];
      // Prefer completing a tube, then matching a partial tube, then emptying.
      const score = dest.length === 0 ? 1 : dest.length + 3;
      if (!getHint.best || score > getHint.best.score) getHint.best = { from, to, score, color };
    }
  }
  const result = getHint.best || null;
  getHint.best = null;
  return result;
}

export function countMovesToSolveEstimate(tubes) {
  return Math.max(12, tubes.reduce((sum, t) => sum + (t.length ? 1 : 0), 0) * 4);
}
