import './Square.css';

function Square({value, handleClick, isWinningSquare}) {
    return (
        <button 
            className={`square ${isWinningSquare ? 'winning-square' : ''}`} onClick={handleClick}>
            {value}
        </button>
    );
}

export default Square;