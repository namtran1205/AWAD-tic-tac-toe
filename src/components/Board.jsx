import Square from "./Square";
import "./Board.css";

function Board({board, handleClick, winningCombo}) {
    //console.log("Winning Combo in Board:", winningCombo);
    const rows = [0, 1, 2];
    return (
        <div>
            {rows.map(row => (
                <div key={row} className="board-row">
                    {board.slice(row * 3, row * 3 + 3).map((value, col) => {
                        const index = row * 3 + col;
                        return (
                            <Square 
                                key={index} 
                                value={value} 
                                handleClick={() => handleClick(index)}
                                isWinningSquare={winningCombo && winningCombo.includes(index)}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

export default Board;