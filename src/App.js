import './App.css';
import { Typography } from '@mui/material';
import Game from './components/Game';

function App() {
  return (
    <div className="app-container">
      <div className="app-card">
        <Typography variant="h4" component="h1" className="app-title">Tic Tac Toe</Typography>
        <Game/>
      </div>
    </div>
  );
}

export default App;
