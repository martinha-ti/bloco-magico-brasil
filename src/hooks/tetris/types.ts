
import { SHAPES } from '../../constants/tetrisConstants';

export type Tetromino = {
  shape: number[][];
  type: keyof typeof SHAPES;
  position: { x: number; y: number };
  color: string;
};

export type TetrisState = {
  board: (string | null)[][];
  score: number;
  level: number;
  lines: number;
  gameOver: boolean;
  isPaused: boolean;
  tetromino: Tetromino;
  nextTetromino: Tetromino;
  dropTime: number | null;
  gameStarted: boolean;
  flashingRows: number[];
  shouldLockPiece: boolean;
  shouldReset: boolean;
};

export type TetrisActions = {
  moveLeft: () => void;
  moveRight: () => void;
  moveDown: () => void;
  rotate: () => void;
  hardDrop: () => void;
  togglePause: () => void;
  resetGame: () => void;
};
