
import { useCallback, useEffect, useRef } from 'react';
import { 
  createEmptyBoard, 
  removeCompletedRows, 
  randomTetromino,
  calculateLevel
} from '../../utils/tetrisUtils';
import { GAME_SPEEDS } from '../../constants/tetrisConstants';
import { TetrisState } from './types';

export const useGameBoard = (
  state: TetrisState,
  setState: (updater: (prev: TetrisState) => Partial<TetrisState>) => void
) => {
  const { 
    board, 
    tetromino, 
    gameStarted, 
    isPaused, 
    gameOver, 
    shouldLockPiece,
    shouldReset,
    score,
    level
  } = state;

  const boardRef = useRef<(string | null)[][]>(board || createEmptyBoard());

  // Atualiza o tabuleiro com a peça atual
  const updateBoard = useCallback(() => {
    if (!tetromino || !gameStarted) return;

    // Limpar o tabuleiro de peças móveis
    const newBoard = board.map(row => row.map(cell => 
      typeof cell === 'string' && cell.includes('moving') ? null : cell
    ));

    // Adiciona a peça atual no tabuleiro
    tetromino.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = y + tetromino.position.y;
          const boardX = x + tetromino.position.x;
          if (boardY >= 0 && boardY < board.length && boardX >= 0 && boardX < board[0].length) {
            newBoard[boardY][boardX] = `${tetromino.color} moving border border-gray-700`;
          }
        }
      });
    });

    // Adiciona a sombra da peça (ghost piece)
    let ghostPosition = { ...tetromino.position };
    while (!checkCollisionInternal(newBoard, tetromino.shape, { ...ghostPosition, y: ghostPosition.y + 1 })) {
      ghostPosition.y += 1;
    }

    // Não adicione a sombra se ela estiver na mesma posição que a peça atual
    if (ghostPosition.y !== tetromino.position.y) {
      tetromino.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const boardY = y + ghostPosition.y;
            const boardX = x + ghostPosition.x;
            if (boardY >= 0 && boardY < board.length && boardX >= 0 && boardX < board[0].length && newBoard[boardY][boardX] === null) {
              newBoard[boardY][boardX] = `bg-gray-600 opacity-30 ghost border border-gray-600`;
            }
          }
        });
      });
    }

    boardRef.current = newBoard;
    setState(prev => ({ board: newBoard }));
  }, [board, tetromino, gameStarted, setState]);

  // Função interna de verificação de colisão para não depender de importações
  function checkCollisionInternal(
    board: (string | null)[][],
    shape: number[][],
    position: { x: number; y: number }
  ) {
    const { x, y } = position;
    
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          // Verifica se está fora dos limites do tabuleiro
          if (
            y + row < 0 ||
            y + row >= board.length ||
            x + col < 0 ||
            x + col >= board[0].length ||
            // Ou se há colisão com peças existentes
            (board[y + row] && board[y + row][x + col] && !board[y + row][x + col]?.includes('moving') && !board[y + row][x + col]?.includes('ghost'))
          ) {
            return true;
          }
        }
      }
    }
    
    return false;
  }

  // Processar peça fixa no tabuleiro quando shouldLockPiece é verdadeiro
  useEffect(() => {
    if (shouldLockPiece && tetromino) {
      // Fixar a peça no tabuleiro
      const newBoard = [...board];
      tetromino.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const boardY = y + tetromino.position.y;
            const boardX = x + tetromino.position.x;
            if (boardY >= 0 && boardY < board.length) {
              newBoard[boardY][boardX] = `${tetromino.color} border border-gray-700`;
            }
          }
        });
      });

      // Verificar se há linhas completas
      const { newBoard: updatedBoard, completedRows } = removeCompletedRows(newBoard);
      
      // Game over se a colisão ocorrer perto do topo
      const isGameOver = tetromino.position.y < 1;
      
      setState(prev => {
        const newState: Partial<TetrisState> = {
          board: updatedBoard,
          shouldLockPiece: false,
          flashingRows: completedRows > 0 ? Array.from({ length: completedRows }, (_, i) => tetromino.position.y + i) : []
        };
        
        if (completedRows > 0) {
          // Calcular pontuação baseada no número de linhas removidas
          const linePoints = completedRows === 1 ? 100 : 
                            completedRows === 2 ? 300 :
                            completedRows === 3 ? 500 : 800;
          
          newState.score = prev.score + linePoints * level;
          newState.lines = prev.lines + completedRows;
        }
        
        if (!isGameOver) {
          newState.tetromino = prev.nextTetromino;
          newState.nextTetromino = randomTetromino();
        } else {
          newState.gameOver = true;
        }
        
        return newState;
      });
      
      // Limpar flashingRows após um curto período
      if (state.flashingRows?.length > 0) {
        setTimeout(() => {
          setState(prev => ({ flashingRows: [] }));
        }, 300);
      }
    }
  }, [shouldLockPiece, board, tetromino, level, setState, state.flashingRows]);

  // Reset do jogo
  useEffect(() => {
    if (shouldReset) {
      const emptyBoard = createEmptyBoard();
      const firstTetromino = randomTetromino();
      const secondTetromino = randomTetromino();
      
      setState(() => ({
        board: emptyBoard,
        score: 0,
        level: 1,
        lines: 0,
        gameOver: false,
        isPaused: false,
        tetromino: firstTetromino,
        nextTetromino: secondTetromino,
        dropTime: GAME_SPEEDS[0],
        gameStarted: true,
        flashingRows: [],
        shouldReset: false,
        shouldLockPiece: false
      }));
    }
  }, [shouldReset, setState]);

  // Efeito para atualizar o nível baseado na pontuação
  useEffect(() => {
    const newLevel = calculateLevel(score);
    if (newLevel !== level) {
      setState(prev => {
        // Ajustar velocidade com base no nível (máximo 10)
        const speedIndex = Math.min(newLevel - 1, GAME_SPEEDS.length - 1);
        return {
          level: newLevel,
          dropTime: GAME_SPEEDS[speedIndex]
        };
      });
    }
  }, [score, level, setState]);

  // Efeito para atualizar o tabuleiro
  useEffect(() => {
    if (gameStarted && !isPaused && !gameOver) {
      updateBoard();
    }
  }, [updateBoard, gameStarted, isPaused, gameOver]);

  return { boardRef };
};
