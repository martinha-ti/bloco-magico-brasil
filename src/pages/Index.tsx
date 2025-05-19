
import React, { useState, useEffect } from 'react';
import TetrisBoard from '../components/TetrisBoard';
import GameControls from '../components/GameControls';
import NextPiece from '../components/NextPiece';
import GameStats from '../components/GameStats';
import { useTetris } from '../hooks/useTetris';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { toast } = useToast();
  const {
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
  } = useTetris();

  const [highScore, setHighScore] = useState(0);
  
  // Carregar high score do localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('tetrisHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Verificar e atualizar high score quando o jogo terminar
  useEffect(() => {
    if (gameOver && score > highScore && score > 0) {
      setHighScore(score);
      localStorage.setItem('tetrisHighScore', score.toString());
      toast({
        title: "Novo recorde!",
        description: `Você atingiu uma nova pontuação máxima: ${score}`,
      });
    }
  }, [gameOver, score, highScore, toast]);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center py-8 px-4">
      <div className="mb-6 text-center">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          TETRIS
        </h1>
        <p className="text-gray-400 mt-1">Clássico dos anos 80</p>
      </div>

      <div className="relative flex flex-col md:flex-row gap-6 items-center md:items-start">
        {/* Camada de overlay para mensagens */}
        {(gameOver || !gameStarted || isPaused) && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-black bg-opacity-80 p-6 rounded-lg text-center">
              {gameOver && (
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-red-500 mb-2">Game Over!</h2>
                  <p className="text-white">Pontuação final: {score}</p>
                  <p className="text-gray-400">Recorde: {highScore}</p>
                </div>
              )}

              {!gameStarted && !gameOver && (
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-blue-400 mb-2">Tetris</h2>
                  <p className="text-white">Pressione "Iniciar jogo" para começar</p>
                </div>
              )}

              {isPaused && gameStarted && (
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-yellow-400 mb-2">Jogo Pausado</h2>
                  <p className="text-white">Pressione "Continuar" para retomar</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tabuleiro principal */}
        <div className="md:order-2">
          <TetrisBoard board={board} flashingRows={flashingRows} />
        </div>

        {/* Painel lateral */}
        <div className="w-full md:w-48 flex flex-col gap-4 md:order-3">
          <NextPiece type={nextTetromino.type} />
          <GameStats score={score} level={level} lines={lines} />
        </div>

        {/* Controles do jogo */}
        <div className="md:order-1 w-full md:w-48">
          <GameControls 
            moveLeft={moveLeft}
            moveRight={moveRight}
            moveDown={moveDown}
            rotate={rotate}
            hardDrop={hardDrop}
            isPaused={isPaused}
            togglePause={togglePause}
            resetGame={resetGame}
            gameOver={gameOver}
            gameStarted={gameStarted}
          />
        </div>
      </div>

      <div className="mt-8 text-center text-gray-500 text-sm max-w-md">
        <p>
          Empilhe as peças e complete linhas horizontais para marcar pontos. 
          O jogo acelera conforme você avança de nível.
        </p>
      </div>
    </div>
  );
};

export default Index;
