
import React from 'react';
import TetrisCell from './TetrisCell';
import { COLORS, SHAPES } from '../constants/tetrisConstants';

type NextPieceProps = {
  type: keyof typeof SHAPES;
};

const NextPiece: React.FC<NextPieceProps> = ({ type }) => {
  const shape = SHAPES[type];
  
  return (
    <div className="p-2 bg-gray-800 rounded">
      <h3 className="text-white text-center mb-2 font-medium">Próxima</h3>
      <div className="flex justify-center">
        <div 
          className="bg-gray-900 p-1 rounded"
          style={{ 
            display: 'grid',
            gridTemplateRows: `repeat(${shape.length}, 1fr)`,
            gridTemplateColumns: `repeat(${shape[0].length}, 1fr)`,
          }}
        >
          {shape.map((row, y) => 
            row.map((cell, x) => (
              <TetrisCell 
                key={`next-${y}-${x}`} 
                cell={cell ? `${COLORS[type]} border border-gray-700` : null}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NextPiece;
