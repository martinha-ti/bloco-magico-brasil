
import { useState, useRef } from 'react';
import { COLORS, GAME_SPEEDS } from '../../constants/tetrisConstants';
import { createEmptyBoard, randomTetromino } from '../../utils/tetrisUtils';
import { useTetrisActions } from './useTetrisActions';
import { useGameBoard } from './useGameBoard';
import { useKeyboardControls } from './useKeyboardControls';
import { useGameLoop } from './useGameLoop';
import { TetrisState } from './types';

export const useTetris = () => {
  // Inicializar o estado com uma função para garantir que os valores iniciais são calculados apenas uma vez
  const initialState = (): TetrisState => {
    const emptyBoard = createEmptyBoard();
    const firstTetromino = randomTetromino();
    const secondTetromino = randomTetromino();
    
    // Adicionar a cor ao tetromino
    firstTetromino.color = COLORS[firstTetromino.type];
    secondTetromino.color = COLORS[secondTetromino.type];
    
    return {
      board: emptyBoard,
      score: 0,
      level: 1,
      lines: 0,
      gameOver: false,
      isPaused: false,
      tetromino: firstTetromino,
      nextTetromino: secondTetromino,
      dropTime: null,
      gameStarted: false,
      flashingRows: [],
      shouldLockPiece: false,
      shouldReset: false
    };
  };

  // Usar useRef para garantir que o valor inicial seja calculado apenas uma vez
  const initialStateRef = useRef(initialState());
  const [state, setStateRaw] = useState<TetrisState>(initialStateRef.current);

  // Wrapper para setState que permite atualizações parciais do estado
  const setState = (updater: (prev: TetrisState) => Partial<TetrisState>) => {
    setStateRaw(prev => ({ ...prev, ...updater(prev) }));
  };

  // Hooks modulares para gerenciar diferentes aspectos do jogo
  const actions = useTetrisActions(state, setState);
  const { boardRef } = useGameBoard(state, setState);
  useKeyboardControls(state, actions);
  useGameLoop(state, actions);

  // Funções para controlar o fluxo do jogo
  const setGameStarted = (started: boolean) => {
    setState(prev => ({
      gameStarted: started,
      dropTime: started ? GAME_SPEEDS[prev.level - 1] : null
    }));
  };

  return {
    // Estado do jogo
    board: state.board,
    score: state.score,
    level: state.level,
    lines: state.lines,
    nextTetromino: state.nextTetromino,
    gameOver: state.gameOver,
    isPaused: state.isPaused,
    gameStarted: state.gameStarted,
    flashingRows: state.flashingRows,
    
    // Ações do jogador
    ...actions,
    
    // Controles do jogo
    setGameStarted,
  };
};
