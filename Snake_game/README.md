# Snake Game (Node.js + Tailwind CDN)

This is a small single-player Snake game implemented with a minimal Express server and frontend JavaScript modules. Tailwind CSS is used via its CDN for quick styling (no build step).

Features implemented from `requirement.md`:
- Canvas-based snake
- Regular food (+1 and growth)
- Bonus food (+5, does not grow, disappears after a short time and spawns occasionally)
- Speed levels 1–5 that change the movement interval
- Keyboard controls and basic touch swipe
- Score display and simple UI

How to run
1. Install dependencies:

```bash
cd /workspaces/ai-dev-tools/Snake_game
npm install
```

2. Start the server:

```bash
npm start
```

3. Open http://localhost:3000 in your browser.

Notes and assumptions
- Tailwind is pulled from CDN for simplicity instead of a postcss build. If you want a production build with Tailwind CLI, I can add that pipeline.
- This is a single-player local game. Leaderboard / WebSockets are optional extras.

Next steps (optional):
- Add sound effects, animations for bonus timer, and leaderboard API.
