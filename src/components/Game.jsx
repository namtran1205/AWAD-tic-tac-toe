import { useState, useEffect } from 'react';
import {Box, Button, Typography, FormControlLabel, Switch} from '@mui/material';
import './Game.css';
import Board from './Board';
import { calculateWinner } from '../utils/gameLogic';
import { findBestMove } from '../utils/ai';

function getPositionFromIndex(index, length) {
    const row = Math.floor(index / length) + 1;
    const col = (index % length) + 1;
    console.log("Get position from index:", index, "->", row, col);
    return `${row}, ${col}`;
}

function Game() {
    const [game, setGame] = useState({
        length: 3,
        board: Array(9).fill(null),
        isXNext: true,
        winner: null,
        winningCombo: null,
        difficulty: 'easy', // can be 'easy', 'hard'
        gameState: 'playing', // can be 'playing', 'won', 'draw'
        scores: { player: 0, ai: 0, draws: 0, streak: 0 },
        history: [{ board: Array(9).fill(null), move: null, player: null, position: null }],
        moveSortAsc: true,
    });

    const player = 'X';
    const ai = 'O';

    useEffect(() => {
        const savedScores = JSON.parse(localStorage.getItem('scores'));
        if (savedScores) {
            setGame(prevGame => ({ ...prevGame, scores: savedScores }));
        }
    }, []);

    useEffect(() => {
        const { winner, winningCombo } = calculateWinner(game.board);

        if (winner !== null) {

            setGame(prev => {
            // Nếu đã từng rời 'playing' rồi thì KHÔNG cộng lại
            if (prev.gameState !== 'playing') {
                return { ...prev, winner, winningCombo };
            }

            const newState =
                winner === 'Draw' ? 'draw' :
                winner === 'X' ? 'player-won' : 'ai-won';

            const newScores =
                winner === 'Draw'
                ? { ...prev.scores, draws: prev.scores.draws + 1, streak: 0 }
                : winner === 'X'
                ? { ...prev.scores, player: prev.scores.player + 1, streak: (prev.scores.streak ?? 0) + 1 }
                : { ...prev.scores, ai: prev.scores.ai + 1, streak: 0 };
            
            //console.log(winner, winningCombo, newState, newScores);
            return { ...prev, winner, winningCombo, gameState: newState, scores: newScores };
            });
        } else {
            setGame(prev => ({ ...prev, winner: null, winningCombo: [], gameState: 'playing' }));
        }
        }, [game.board]);


    useEffect(() => {
        if (game.gameState === 'playing' && !game.isXNext) {
            const { move } = findBestMove(game.board, game.difficulty);
            if (move !== -1) {
            const t = setTimeout(() => {
                // Dùng functional setState để đọc state MỚI NHẤT
                setGame(prev => {
                if (prev.gameState !== 'playing') return prev; // ván đã kết thúc → KHÔNG đi nữa
                const newBoard = prev.board.slice();
                newBoard[move] = ai;
                return {
                    ...prev,
                    length: prev.length,
                    board: newBoard,
                    isXNext: true,
                    history: [
                        ...prev.history,
                        { board: newBoard, move, player: ai, position: getPositionFromIndex(move, prev.length) },
                    ],

                };
                });
            }, 500);
            return () => clearTimeout(t); // dọn dẹp nếu deps thay đổi
            }
        }
        }, [game.isXNext, game.gameState, game.board, game.difficulty]);

    useEffect(() => {
        localStorage.setItem('scores', JSON.stringify(game.scores));
    }, [game.scores]);

    const handleClick = (index) => {
        if (game.board[index] || game.winner || !game.isXNext) return;
        const newBoard = game.board.slice();
        newBoard[index] = player;
        setGame(prev => ({
            ...prev,
            length: prev.length,
            board: newBoard,
            isXNext: !prev.isXNext,
            history: [
                ...prev.history,
                { board: newBoard, move: index, player: player, position: getPositionFromIndex(index, prev.length) },
            ],  
        }));
    }

    const resetGame = () => {
        setGame(prev => ({
            ...prev,
            length: 3,
            board: Array(9).fill(null),
            isXNext: true,
            winner: null,
            winningCombo: null,
            gameState: 'playing',
            history: [{ board: Array(9).fill(null), move: null, player: null, position: null }],
        }));
    }

    const toggleMoveSort = () => {
    setGame((prev) => ({ ...prev, moveSortAsc: !prev.moveSortAsc }));
    };


    const getMoveHistory = () => {
        // take a copy of moves (skip initial state) and reverse a copy when needed
        const moves = game.history.slice(1);
        const sortedHistory = game.moveSortAsc ? moves : moves.slice().reverse();

        return sortedHistory.map((step, index) => {
            const moveIndex = game.moveSortAsc ? index + 1 : moves.length - index;

            // parse position which may be stored as "row, col" string or as [row, col]
            let desc;
            if (step && step.player) {
                let row = null;
                let col = null;
                if (Array.isArray(step.position)) {
                    [row, col] = step.position;
                } else if (typeof step.position === 'string' && step.position.includes(',')) {
                    [row, col] = step.position.split(',').map(s => s.trim());
                }
                desc = row != null && col != null
                    ? `${step.player} moved to (${row}, ${col})`
                    : `${step.player} made a move`;
            } else {
                desc = 'Game start';
            }

            const isCurrent = moveIndex === game.history.length - 1;
            const playerColor = step && step.player === 'X' ? '#4caf50' : '#f44336';

            return (
                <Box
                    key={moveIndex}
                    className="move-history-item"
                    sx={{
                        backgroundColor: isCurrent ? '#fff9c4' : '#f5f5f5',
                        borderLeft: `6px solid ${step && step.player ? playerColor : '#bbb'}`,
                        p: 1.25,
                        mb: 1,
                        borderRadius: 1,
                        boxShadow: isCurrent ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
                        cursor: 'default',
                    }}
                >
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="subtitle2" sx={{ fontWeight: isCurrent ? 700 : 600 }}>
                            Move #{moveIndex}
                        </Typography>
                        {step && step.player ? (
                            <Typography
                                variant="caption"
                                sx={{
                                    bgcolor: playerColor,
                                    color: '#fff',
                                    px: 1,
                                    py: '2px',
                                    borderRadius: 1,
                                    fontWeight: 700,
                                }}
                            >
                                {step.player}
                            </Typography>
                        ) : null}
                    </Box>
                    <Typography variant="body2" sx={{ mt: 0.5, color: isCurrent ? '#000' : '#555' }}>
                        {desc}
                    </Typography>
                </Box>
            );
        });
    };

    const getStatusMessage = () => {
        if (game.winner) {
            return game.winner === 'Draw' ? "It's a Draw!" : (game.winner === player ? "You Win!" : "AI Wins!");
        } else {
            return game.isXNext ? "Your Turn (X)" : "AI's Turn (O)";
        }
    }

    return (
        <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="flex-start" width="100%">
            {/* Nội dung chính được phóng to bằng flex lớn hơn */}
            <Box className="game" flex={4} minWidth="420px" p={1} align="center">
                <Typography variant="h5" align="center" gutterBottom>
                    {getStatusMessage()}
                </Typography>
                <Box 
                    display="flex" 
                    maxWidth={250}
                    align="center"
                    justifyContent="space-around" 
                    my={1} 
                    p={1.2} 
                    bgcolor="#f5f5f5" 
                    borderRadius={2}
                >
                    <Box textAlign="center">
                        <Typography variant="subtitle1" gutterBottom>
                            You
                        </Typography>
                        <Typography variant="h6" color="#4caf50">
                            {game.scores.player}
                        </Typography>
                    </Box>
                    <Box textAlign="center">
                        <Typography variant="subtitle1" gutterBottom>
                            Draws
                        </Typography>
                        <Typography variant="h6" color="#ff9800">
                            {game.scores.draws}
                        </Typography>
                    </Box>
                    <Box textAlign="center">
                        <Typography variant="subtitle1" gutterBottom>
                            AI
                        </Typography>
                        <Typography variant="h6" color="#f44336">
                            {game.scores.ai}
                        </Typography>
                    </Box>
                    <Box textAlign="center">
                        <Typography variant="subtitle1" gutterBottom>
                            Streak
                        </Typography>
                        <Typography variant="h6">
                            {game.scores.streak}
                        </Typography>
                    </Box>
                </Box>
                <Box className="controls" display="flex" justifyContent="center" my={1.5}>
                    <Button
                        variant={game.difficulty === 'easy' ? "contained" : "outlined"}
                        onClick={() => {
                            setGame(prev => ({ ...prev, difficulty: 'easy' }));
                            resetGame();
                        }}
                        sx={{ mr: 1 }}
                    >
                        Easy
                    </Button>
                    <Button
                        variant={game.difficulty === 'hard' ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => {
                            setGame(prev => ({ ...prev, difficulty: 'hard' }));
                            resetGame();
                        }}
                        sx={{ ml: 1 }}
                    >
                        Hard
                    </Button>
                </Box>
                <Board board={game.board} handleClick={handleClick} winningCombo={game.winningCombo} size={game.length}/>
                <Box display="flex" justifyContent="center" mt={2} mb={1}>
                    <Button 
                        variant="contained"
                        color="secondary"
                        onClick={resetGame}
                    >
                        New Game
                    </Button>
                </Box>
            </Box>

            <Box ml={4} p={4} className="game" flex={2} align="center">              
                <Typography variant="h4" className="move-history-title">
                        Move History
                    </Typography>

                    <FormControlLabel label={game.moveSortAsc ? "Ascending" : "Descending"}
                    control={
                        <Switch
                            checked={game.moveSortAsc}
                            onChange={toggleMoveSort}
                            color="primary"
                        />
                    }
                    />

                <Box className="move-history">
                    {getMoveHistory()}
                </Box>

                
                <Typography variant="h6" className="move-count" sx={{ mt: 2 }}>
                    You are at move #{game.history.length - 1}
                </Typography>

            </Box>
        </Box>
    );
}

export default Game;