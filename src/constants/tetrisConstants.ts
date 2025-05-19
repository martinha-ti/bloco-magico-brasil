
// Cores para as peças de Tetris
export const COLORS = {
  I: 'bg-cyan-500',
  J: 'bg-blue-600',
  L: 'bg-orange-500',
  O: 'bg-yellow-400',
  S: 'bg-green-500',
  T: 'bg-purple-600',
  Z: 'bg-red-500',
  empty: 'bg-gray-900',
  ghost: 'bg-gray-600 opacity-30',
};

// Configurações do jogo
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const CELL_SIZE = 'h-6 w-6 sm:h-8 sm:w-8';
export const GAME_SPEEDS = [800, 650, 500, 400, 300, 250, 200, 150, 100, 50];

// Pontuação
export const POINTS = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  SOFT_DROP: 1,
  HARD_DROP: 2,
};

// Formas das peças
export const SHAPES = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
};

// Teclas utilizadas no jogo
export const KEY = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
  UP: 'ArrowUp',
  SPACE: ' ',
  P: 'p',
  ESCAPE: 'Escape',
};
