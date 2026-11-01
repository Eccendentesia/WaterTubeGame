# Water Sort Challenge

A playable React + Vite water-sort puzzle prototype. It uses custom CSS-drawn glass tubes and liquid layers, so no external game-art downloads are required.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

## Gameplay

- Tap a tube, then tap a destination tube.
- You can pour only into an empty tube or onto the same colour.
- A pour transfers the top contiguous run, limited by destination capacity.
- Undo, restart, hint, new mix, pause and level selection are implemented.
- Progress and sound preference are saved in browser LocalStorage.

## Puzzle generation

`src/utils/puzzleGenerator.js` creates a solved board and applies reverse-scramble steps. Each scramble step moves one unit from a colour's home tube onto a different-coloured top layer (or an empty tube). Reversing those steps gives a legal solution path. Difficulty increases by adding colours and scramble steps.

## Assets and licensing

The game visuals are drawn in CSS; no third-party artwork is bundled. The optional Google Font is Nunito, served by Google Fonts. For optional sounds, this prototype synthesizes short tones with the Web Audio API, so no downloaded audio files are needed.

If you add external assets later, check the individual asset's license before redistribution:
- Kenney: https://kenney.nl/assets (asset-specific licenses; many packs are CC0)
- OpenGameArt: https://opengameart.org/ (check each asset's license)
- Pixabay: https://pixabay.com/sound-effects/ (check current license terms)
- Mixkit: https://mixkit.co/free-sound-effects/ (check current license terms)

## Notes

- The timer runs while a level is active and pauses in pause/completion overlays.
- Star thresholds are prototype scoring rules and can be tuned in `src/utils/scoring.js`.
- Level layouts are generated at runtime, not downloaded as fixed level data.
