
import { useCallback, useEffect } from 'react';
import { KEY } from '../../constants/tetrisConstants';
import { TetrisActions, TetrisState } from './types';

export const useKeyboardControls = (
  state: TetrisState,
  actions: TetrisActions
) => {
  const { 
    gameStarted, 
    gameOver, 
    isPaused 
  } = state;
  
  const { 
    moveLeft, 
    moveRight, 
    moveDown, 
    rotate, 
    hardDrop, 
    togglePause 
  } = actions;

  // Manipulador de teclas
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!gameStarted && !gameOver) return;
    
    if (event.key === KEY.P || event.key === KEY.ESCAPE) {
      togglePause();
      return;
    }
    
    if (isPaused) return;
    
    switch(event.key) {
      case KEY.LEFT:
        moveLeft();
        break;
      case KEY.RIGHT:
        moveRight();
        break;
      case KEY.DOWN:
        moveDown();
        break;
      case KEY.UP:
        rotate();
        break;
      case KEY.SPACE:
        hardDrop();
        break;
      default:
        break;
    }
  }, [gameStarted, gameOver, isPaused, moveDown, moveLeft, moveRight, rotate, hardDrop, togglePause]);

  // Efeito para configurar o manipulador de teclas
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return null; // Este hook não retorna nada, apenas adiciona efeitos colaterais
};
