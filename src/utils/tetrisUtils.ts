
import { BOARD_HEIGHT, BOARD_WIDTH, SHAPES, COLORS } from '../constants/tetrisConstants';

// Gera um tabuleiro vazio
export const createEmptyBoard = () => {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
};

// Rotaciona uma matriz no sentido horário
export const rotateMatrix = (matrix: number[][]) => {
  const N = matrix.length;
  const result = Array(N).fill(null).map(() => Array(N).fill(0));

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      result[j][N - 1 - i] = matrix[i][j];
    }
  }

  return result;
};

// Verifica colisão
export const checkCollision = (
  board: (string | null)[][],
  shape: number[][],
  position: { x: number; y: number }
) => {
  const { x, y } = position;
  
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        // Verifica se está fora dos limites do tabuleiro
        if (
          y + row < 0 ||
          y + row >= BOARD_HEIGHT ||
          x + col < 0 ||
          x + col >= BOARD_WIDTH ||
          // Ou se há colisão com peças existentes
          (board[y + row] && board[y + row][x + col])
        ) {
          return true;
        }
      }
    }
  }
  
  return false;
};

// Gera uma peça aleatória
export const randomTetromino = () => {
  const shapes = Object.keys(SHAPES);
  const randShape = shapes[Math.floor(Math.random() * shapes.length)] as keyof typeof SHAPES;
  
  return {
    shape: SHAPES[randShape],
    type: randShape,
    position: { x: BOARD_WIDTH / 2 - 1, y: 0 },
    color: COLORS[randShape]
  };
};

// Remove linhas completas e retorna a quantidade removida
export const removeCompletedRows = (board: (string | null)[][]) => {
  let completedRows = 0;
  const newBoard = board.filter(row => {
    const isRowFull = row.every(cell => cell !== null);
    if (isRowFull) {
      completedRows += 1;
    }
    return !isRowFull;
  });
  
  // Adiciona novas linhas no topo para substituir as removidas
  const emptyRows = Array(completedRows)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(null));
    
  return { newBoard: [...emptyRows, ...newBoard], completedRows };
};

// Calcula nível baseado na pontuação
export const calculateLevel = (score: number) => {
  return Math.floor(score / 1000) + 1;
};
