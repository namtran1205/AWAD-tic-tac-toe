import { calculateWinner } from "./gameLogic";

function getEmptyCells(board) {
    return board.map((cell, idx) => cell ? null : idx).filter(index => index !== null);
}


const minimax = (board, depth, isMaximizing, alpha, beta) => {
    const winner = calculateWinner(board);
    if (winner.winner === 'O') return 10 - depth;
    if (winner.winner === 'X') return -10 + depth;
    if (winner.winner === 'Draw') return 0;

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                let boardCopy = [...board];
            boardCopy[i] = 'O';
            const evalScore = minimax(boardCopy, depth + 1, false, alpha, beta);
            maxEval = Math.max(maxEval, evalScore);
            alpha = Math.max(alpha, evalScore);
            if (beta <= alpha) break; // Alpha-Beta Pruning
        }
    }
        return maxEval;
    }
    else {
        let minEval = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                let boardCopy = [...board];
                boardCopy[i] = 'X';
                const evalScore = minimax(boardCopy, depth + 1, true, alpha, beta);
            minEval = Math.min(minEval, evalScore);
            beta = Math.min(beta, evalScore);
            if (beta <= alpha) break; // Alpha-Beta Pruning
        }
        }
        return minEval;
    }
}


export function findBestMove(board, difficulty = 'easy') {
    if (difficulty === 'easy') {
        const availableMoves = getEmptyCells(board);
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        //console.log(`Easy Mode: Chose Move ${availableMoves[randomIndex]}`);
        return {
            move: availableMoves[randomIndex],
        };
    }

    let bestVal = -Infinity;
    let bestMove = -1;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
            const newBoard = [...board];
            newBoard[i] = 'O';
            const moveVal = minimax(newBoard, 0, false, -Infinity, Infinity);
            //console.log(`Evaluated Move ${i}: ${moveVal}`);
            if (moveVal > bestVal) {
                bestMove = i;
                bestVal = moveVal;
            }
        }
    }
    return {
        move: bestMove,
    };
}