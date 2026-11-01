const shuffle = (arr) => {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

// Reverse-scramble a solved board. Each reverse step places one top unit
// onto a tube with a different top colour. Reversing these steps is legal.
export function generatePuzzle(level, config) {
  const palette = [
    '#ff6685', '#4f9cff', '#ffc247', '#48c99a', '#a47af5',
    '#ff914d', '#39c7d5', '#e77ac8', '#91b94d'
  ];
  const tubes = Array.from({ length: config.colors + config.emptyTubes }, (_, i) =>
    i < config.colors ? Array(4).fill(palette[i]) : []
  );

  const targetMoves = config.scrambleMoves;
  let made = 0;
  let attempts = 0;
  // A tube that has received a foreign colour is no longer used as a
  // scramble source. This preserves the inverse-move solution sequence.
  const eligibleSources = Array(config.colors + config.emptyTubes).fill(false);
  for (let i = 0; i < config.colors; i++) eligibleSources[i] = true;

  while (made < targetMoves && attempts < targetMoves * 100) {
    attempts++;
    const sources = shuffle(Array.from({ length: tubes.length }, (_, i) => i)
      .filter(i => eligibleSources[i]));
    let moved = false;

    for (const sourceIndex of sources) {
      const source = tubes[sourceIndex];
      if (!source.length) continue;
      const color = source[source.length - 1];
      const destinations = shuffle(Array.from({ length: tubes.length }, (_, i) => i)
        .filter(i => i !== sourceIndex && tubes[i].length < 4 &&
          (tubes[i].length === 0 || tubes[i][tubes[i].length - 1] !== color)));

      if (!destinations.length) continue;
      const destIndex = destinations[0];
      tubes[sourceIndex] = source.slice(0, -1);
      tubes[destIndex] = [...tubes[destIndex], color];
      eligibleSources[destIndex] = false;
      made++;
      moved = true;
      break;
    }
    if (!moved) break;
  }

  // Even if the board fills early, every performed reverse step is legal
  // to undo; never replace it with an arbitrary unsolvable random shuffle.
  return tubes;
}
