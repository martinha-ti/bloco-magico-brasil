
import { cn } from '../lib/utils';
import { CELL_SIZE } from '../constants/tetrisConstants';

type TetrisCellProps = {
  cell: string | null;
  isFlashing?: boolean;
};

const TetrisCell = ({ cell, isFlashing = false }: TetrisCellProps) => {
  return (
    <div 
      className={cn(
        CELL_SIZE, 
        'border border-gray-800',
        cell || 'bg-gray-900',
        isFlashing && 'flash bg-white'
      )}
    />
  );
};

export default TetrisCell;
