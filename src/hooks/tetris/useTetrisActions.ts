
import { useCallback } from 'react';
import { POINTS } from '../../constants/tetrisConstants';
import { checkCollision, rotateMatrix } from '../../utils/tetrisUtils';
import { TetrisState, Tetromino } from './types';

export const useTetrisActions = (
  state: TetrisState,
  setState: (updater: (prev: TetrisState) => Partial<TetrisState>) => void
) => {
  const { 
    board, 
    tetromino, 
    isPaused, 
    gameOver, 
    gameStarted, 
    level 
  } = state;

  // Movimento para baixo
  const moveDown = useCallback(() => {
    if (!tetromino || isPaused || gameOver || !gameStarted) return;
    
    const newPosition = { ...tetromino.position, y: tetromino.position.y + 1 };
    if (!checkCollision(board, tetromino.shape, newPosition)) {
      setState(prev => ({
        tetromino: { ...prev.tetromino, position: newPosition },
        score: prev.score + POINTS.SOFT_DROP
      }));
    } else {
      // Fixar a peça no tabuleiro e processar será feito no useBoard
      setState(prev => ({ shouldLockPiece: true }));
    }
  }, [board, isPaused, tetromino, gameOver, gameStarted, setState]);

  // Movimento para esquerda
  const moveLeft = useCallback(() => {
    if (!tetromino || isPaused || gameOver || !gameStarted) return;
    const newPosition = { ...tetromino.position, x: tetromino.position.x - 1 };
    if (!checkCollision(board, tetromino.shape, newPosition)) {
      setState(prev => ({
        tetromino: { ...prev.tetromino, position: newPosition }
      }));
    }
  }, [board, isPaused, tetromino, gameOver, gameStarted, setState]);

  // Movimento para direita
  const moveRight = useCallback(() => {
    if (!tetromino || isPaused || gameOver || !gameStarted) return;
    const newPosition = { ...tetromino.position, x: tetromino.position.x + 1 };
    if (!checkCollision(board, tetromino.shape, newPosition)) {
      setState(prev => ({
        tetromino: { ...prev.tetromino, position: newPosition }
      }));
    }
  }, [board, isPaused, tetromino, gameOver, gameStarted, setState]);

  // Rotação da peça
  const rotate = useCallback(() => {
    if (!tetromino || isPaused || gameOver || !gameStarted) return;
    
    const rotated = rotateMatrix(tetromino.shape);
    // Tentar rotação de acordo com a posição atual
    let newPosition = { ...tetromino.position };
    
    // Se a peça for do tipo O (quadrado), não precisa rotacionar
    if (tetromino.type === 'O') return;

    // Tentar diferentes posições para a rotação
    const positions = [
      { x: 0, y: 0 }, // posição atual
      { x: 1, y: 0 }, // tentar deslocar 1 para direita
      { x: -1, y: 0 }, // tentar deslocar 1 para esquerda
      { x: 0, y: 1 }, // tentar deslocar 1 para baixo
      { x: 2, y: 0 }, // tentar deslocar 2 para direita
      { x: -2, y: 0 }, // tentar deslocar 2 para esquerda
    ];

    // Para peça I, adicionar mais posições para teste
    if (tetromino.type === 'I') {
      positions.push(
        { x: -2, y: -1 },
        { x: 2, y: -1 },
        { x: -2, y: 1 },
        { x: 2, y: 1 }
      );
    }

    // Tentar cada posição
    for (const pos of positions) {
      const testPosition = {
        x: tetromino.position.x + pos.x,
        y: tetromino.position.y + pos.y
      };
      
      if (!checkCollision(board, rotated, testPosition)) {
        setState(prev => ({
          tetromino: {
            ...prev.tetromino,
            shape: rotated,
            position: testPosition
          }
        }));
        return;
      }
    }
  }, [board, isPaused, tetromino, gameOver, gameStarted, setState]);

  // Drop rápido
  const hardDrop = useCallback(() => {
    if (!tetromino || isPaused || gameOver || !gameStarted) return;
    
    let newPosition = { ...tetromino.position };
    let dropDistance = 0;
    
    while (!checkCollision(board, tetromino.shape, { ...newPosition, y: newPosition.y + 1 })) {
      newPosition.y += 1;
      dropDistance += 1;
    }
    
    setState(prev => ({
      tetromino: { ...prev.tetromino, position: newPosition },
      score: prev.score + (dropDistance * POINTS.HARD_DROP),
      shouldLockPiece: true
    }));
  }, [board, isPaused, tetromino, gameOver, gameStarted, setState]);

  // Pausa/despausar o jogo
  const togglePause = useCallback(() => {
    if (!gameStarted) return;
    setState(prev => ({ isPaused: !prev.isPaused }));
  }, [gameStarted, setState]);

  // Reiniciar o jogo
  const resetGame = useCallback(() => {
    setState(() => ({ shouldReset: true }));
  }, [setState]);

  return {
    moveDown,
    moveLeft,
    moveRight,
    rotate,
    hardDrop,
    togglePause,
    resetGame
  };
};
