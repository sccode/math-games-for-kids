# Fish Tank Math

A free browser game for California Common Core math, grades K-9. Right answers pour water into the tank; fill it above the leaking holes to earn stars. Points buy magic cards (50/50, Skip, Plug, Freeze); stars buy new fish, tank decorations and back walls. Sound effects are made in the browser (mute button in the header).

- Play: open `index.html` (single file, no server needed).
- With GitHub Pages enabled (Settings > Pages > Deploy from branch `main`, folder `/root`), it is at `https://sccode.github.io/math-games-for-kids/fish-tank/`.
- Progress is saved in each browser; use "Make my save code" to move it between devices.
- `src/` holds the sources (`questions/q?.js` banks, `game.js`, `head2.html`); `python3 build.py` in `src/` regenerates `index.html`.
