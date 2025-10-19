import Square from "./Square";
import "./Board.css";

function Board({ board, handleClick, winningCombo, size }) {
    //console.log("Board size:", size);
    const rows = [];

    for (let r = 0; r < size; r++) {
        const cols = [];
        for (let c = 0; c < size; c++) {
            const index = r * size + c;
            cols.push(
                <Square
                    key={index}
                    value={board[index]}
                    handleClick={() => handleClick(index)}
                    isWinningSquare={Array.isArray(winningCombo) && winningCombo.includes(index)}
                />
            );
        }
        rows.push(
            <div key={r} className="board-row">
                {cols}
            </div>
        );
    }

    return <div>{rows}</div>;
}

export default Board;
