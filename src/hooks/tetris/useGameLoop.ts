
import { useEffect } from 'react';
import { TetrisState, TetrisActions } from './types';

export const useGameLoop = (
  state: TetrisState,
  actions: TetrisActions
) => {
  const { 
    dropTime, 
    gameOver, 
    isPaused, 
    gameStarted 
  } = state;
  
  const { moveDown } = actions;

  // Efeito para drop automático
  useEffect(() => {
    let dropTimer: ReturnType<typeof setTimeout> | null = null;
    
    if (!gameOver && !isPaused && gameStarted && dropTime) {
      dropTimer = setTimeout(moveDown, dropTime);
    }
    
    return () => {
      if (dropTimer) clearTimeout(dropTimer);
    };
  }, [moveDown, dropTime, gameOver, isPaused, gameStarted]);

  return null;
};
