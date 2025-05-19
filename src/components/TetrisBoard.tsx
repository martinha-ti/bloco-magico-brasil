
import React from 'react';
import TetrisCell from './TetrisCell';
import { BOARD_WIDTH } from '../constants/tetrisConstants';

type TetrisBoardProps = {
  board: (string | null)[][];
  flashingRows: number[];
};

const TetrisBoard: React.FC<TetrisBoardProps> = ({ board, flashingRows }) => {
  return (
    <div 
      className="bg-gray-900 border-4 border-gray-700 p-1 rounded"
      style={{ 
        display: 'grid',
        gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
      }}
    >
      {board.map((row, y) => 
        row.map((cell, x) => (
          <TetrisCell 
            key={`${y}-${x}`} 
            cell={cell}
            isFlashing={flashingRows.includes(y)} 
          />
        ))
      )}
    </div>
  );
};

export default TetrisBoard;
