# Tic Tac Toe (React + MUI)

Small Tic Tac Toe game built with React and Material UI. Features a playable UI, AI opponent (minimax + alpha-beta), move history, scores saved to localStorage, and responsive layout.

## Requirements
- Node.js (>=14)
- npm

## Quick Start

1. Install dependencies
   npm install

2. Run development server
   npm start  
   Open http://localhost:3000

3. Build for production
   npm run build

4. Run tests
   npm test

## Project Structure
```
tic-tac-toe/
├─ package.json
├─ README.md
└─ src/
   ├─ index.js
   ├─ App.js
   ├─ components/
   │  ├─ Game.jsx
   │  ├─ Game.css
   │  ├─ Board.jsx
   │  ├─ Board.css
   │  ├─ Square.jsx
   │  └─ Square.css
   └─ utils/
      ├─ gameLogic.js        # default export: calculate winner / draw
      └─ ai.js               # AI: easy (random), hard (minimax + alpha-beta)
```

## Requirements
- For the current move only, show “You are at move #…” instead of a button: 1.8 points.
- Rewrite the Board to use two loops to make the squares instead of hardcoding them: 1.8 points.
- Add a toggle button that lets you sort the moves in either ascending or descending order: 1.8 points.
- When someone wins, highlight the three squares that caused the win (and when no one wins, display a message about the result being a draw): 1.8 points.
- Display the location for each move in the format (row, col) in the move history list: 1.8 points.
- Upload to a public host: 1 point

## Features
- Play against AI (player = X, AI = O)
- Difficulty: Easy (random) / Hard (minimax)
- Move history with position (row, col) and sort toggle
- Score tracking (player, AI, draws, streak) persisted to localStorage
- Winning squares highlighted
- Responsive layout using MUI components and CSS

## Development notes
- If you see import errors for `calculateWinner`, ensure you import the default export from gameLogic (e.g. `import calculateWinner from './gameLogic'`).
- To make move history scrollable, give the container a fixed height or max-height and `overflow-y: auto` (can be set via CSS or MUI `sx`).
- Adjust card sizes and scroll behavior in `Game.jsx` (use Box sx props) or `Game.css`.
- Winning square hover precedence: ensure `.square.winning-square, .square.winning-square:hover { background-color: ... }` in `Square.css`.

## Contributing
- Open an issue or submit a PR.
- Keep changes small and focused; update README or comments for API/logic changes.

## License
MIT (or your preferred license)