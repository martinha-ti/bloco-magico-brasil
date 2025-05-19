
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  BOARD_WIDTH, BOARD_HEIGHT, COLORS, GAME_SPEEDS, 
  KEY, POINTS, SHAPES 
} from '../constants/tetrisConstants';
import { 
  checkCollision, createEmptyBoard, randomTetromino, 
  removeCompletedRows, rotateMatrix, calculateLevel 
} from '../utils/tetrisUtils';

type Tetromino = {
  shape: number[][];
  type: keyof typeof SHAPES;
  position: { x: number; y: number };
};

export const useTetris = () => {
  // Use a ref to prevent board updates triggering infinite loops
  const boardRef = useRef<(string | null)[][]>(createEmptyBoard());
  const [board, setBoard] = useState<(string | null)[][]>(boardRef.current);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [tetromino, setTetromino] = useState<Tetromino>(randomTetromino());
  const [nextTetromino, setNextTetromino] = useState<Tetromino>(randomTetromino());
  const [dropTime, setDropTime] = useState<null | number>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [flashingRows, setFlashingRows] = useState<number[]>([]);

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
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = `${COLORS[tetromino.type]} moving border border-gray-700`;
          }
        }
      });
    });

    // Adiciona a sombra da peça (ghost piece)
    let ghostPosition = { ...tetromino.position };
    while (!checkCollision(newBoard, tetromino.shape, { ...ghostPosition, y: ghostPosition.y + 1 })) {
      ghostPosition.y += 1;
    }

    // Não adicione a sombra se ela estiver na mesma posição que a peça atual
    if (ghostPosition.y !== tetromino.position.y) {
      tetromino.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const boardY = y + ghostPosition.y;
            const boardX = x + ghostPosition.x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH && newBoard[boardY][boardX] === null) {
              newBoard[boardY][boardX] = `${COLORS.ghost} ghost border border-gray-600`;
            }
          }
        });
      });
    }

    boardRef.current = newBoard;
    setBoard(newBoard);
  }, [board, tetromino, gameStarted]);

  // Movimento para baixo
  const moveDown = useCallback(() => {
    if (!tetromino || isPaused || gameOver || !gameStarted) return;
    
    const newPosition = { ...tetromino.position, y: tetromino.position.y + 1 };
    if (!checkCollision(board, tetromino.shape, newPosition)) {
      setTetromino({ ...tetromino, position: newPosition });
      setScore(prev => prev + POINTS.SOFT_DROP);
    } else {
      // Fixar a peça no tabuleiro
      const newBoard = [...board];
      tetromino.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const boardY = y + tetromino.position.y;
            const boardX = x + tetromino.position.x;
            if (boardY >= 0) {
              newBoard[boardY][boardX] = `${COLORS[tetromino.type]} border border-gray-700`;
            }
          }
        });
      });

      // Verificar se há linhas completas
      const { newBoard: updatedBoard, completedRows } = removeCompletedRows(newBoard);
      if (completedRows > 0) {
        const rowsToFlash = [];
        for (let i = 0; i < completedRows; i++) {
          rowsToFlash.push(tetromino.position.y + i);
        }
        setFlashingRows(rowsToFlash);
        setTimeout(() => setFlashingRows([]), 300);
        
        // Adicionar pontuação baseada no número de linhas removidas
        const points = completedRows === 1 ? POINTS.SINGLE :
                      completedRows === 2 ? POINTS.DOUBLE :
                      completedRows === 3 ? POINTS.TRIPLE :
                      POINTS.TETRIS;
        setScore(prev => prev + points * level);
        setLines(prev => prev + completedRows);
      }

      boardRef.current = updatedBoard;
      setBoard(updatedBoard);
      
      // Game over se a colisão ocorrer perto do topo
      if (tetromino.position.y < 1) {
        setGameOver(true);
        setDropTime(null);
        return;
      }
      
      // Gerar nova peça
      setTetromino(nextTetromino);
      setNextTetromino(randomTetromino());
    }
  }, [board, isPaused, level, nextTetromino, tetromino, gameOver, gameStarted]);

  // Movimento para esquerda
  const moveLeft = useCallback(() => {
    if (!tetromino || isPaused || gameOver || !gameStarted) return;
    const newPosition = { ...tetromino.position, x: tetromino.position.x - 1 };
    if (!checkCollision(board, tetromino.shape, newPosition)) {
      setTetromino({ ...tetromino, position: newPosition });
    }
  }, [board, isPaused, tetromino, gameOver, gameStarted]);

  // Movimento para direita
  const moveRight = useCallback(() => {
    if (!tetromino || isPaused || gameOver || !gameStarted) return;
    const newPosition = { ...tetromino.position, x: tetromino.position.x + 1 };
    if (!checkCollision(board, tetromino.shape, newPosition)) {
      setTetromino({ ...tetromino, position: newPosition });
    }
  }, [board, isPaused, tetromino, gameOver, gameStarted]);

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
        newPosition = testPosition;
        setTetromino({
          ...tetromino,
          shape: rotated,
          position: newPosition
        });
        return;
      }
    }
  }, [board, isPaused, tetromino, gameOver, gameStarted]);

  // Drop rápido
  const hardDrop = useCallback(() => {
    if (!tetromino || isPaused || gameOver || !gameStarted) return;
    
    let newPosition = { ...tetromino.position };
    let dropDistance = 0;
    
    while (!checkCollision(board, tetromino.shape, { ...newPosition, y: newPosition.y + 1 })) {
      newPosition.y += 1;
      dropDistance += 1;
    }
    
    setTetromino({ ...tetromino, position: newPosition });
    setScore(prev => prev + (dropDistance * POINTS.HARD_DROP));
    
    // Forçar movimentação para baixo para fixar a peça
    setTimeout(moveDown, 10);
  }, [board, isPaused, tetromino, moveDown, gameOver, gameStarted]);

  // Pausa/despausar o jogo
  const togglePause = useCallback(() => {
    if (!gameStarted) return;
    setIsPaused(!isPaused);
  }, [gameStarted, isPaused]);

  // Reiniciar o jogo
  const resetGame = useCallback(() => {
    const emptyBoard = createEmptyBoard();
    boardRef.current = emptyBoard;
    setBoard(emptyBoard);
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
    setIsPaused(false);
    setTetromino(randomTetromino());
    setNextTetromino(randomTetromino());
    setDropTime(GAME_SPEEDS[0]);
    setGameStarted(true);
    setFlashingRows([]);
  }, []);

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

  // Efeito para atualizar o tabuleiro
  useEffect(() => {
    if (gameStarted && !isPaused && !gameOver) {
      updateBoard();
    }
  }, [updateBoard, gameStarted, isPaused, gameOver]);

  // Efeito para atualizar o nível baseado na pontuação
  useEffect(() => {
    const newLevel = calculateLevel(score);
    if (newLevel !== level) {
      setLevel(newLevel);
      // Ajustar velocidade com base no nível (máximo 10)
      const speedIndex = Math.min(newLevel - 1, GAME_SPEEDS.length - 1);
      setDropTime(GAME_SPEEDS[speedIndex]);
    }
  }, [score, level]);

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

  return {
    board,
    score,
    level,
    lines,
    nextTetromino,
    gameOver,
    isPaused,
    gameStarted,
    flashingRows,
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    hardDrop,
    resetGame,
    togglePause,
    setGameStarted,
  };
};
