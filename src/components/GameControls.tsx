
import React from 'react';
import { Button } from '@/components/ui/button';

type GameControlsProps = {
  moveLeft: () => void;
  moveRight: () => void;
  moveDown: () => void;
  rotate: () => void;
  hardDrop: () => void;
  isPaused: boolean;
  togglePause: () => void;
  resetGame: () => void;
  gameOver: boolean;
  gameStarted: boolean;
};

const GameControls: React.FC<GameControlsProps> = ({ 
  moveLeft, moveRight, moveDown, rotate, hardDrop,
  isPaused, togglePause, resetGame, gameOver, gameStarted 
}) => {
  return (
    <div>
      {/* Controles em dispositivos móveis */}
      <div className="md:hidden w-full flex flex-col gap-2">
        <div className="flex justify-center gap-3 mb-1">
          <Button variant="outline" className="w-12 h-12 p-0 rotate" onClick={rotate}>⟳</Button>
          <Button variant="outline" className="w-12 h-12 p-0" onClick={hardDrop}>⇓</Button>
        </div>
        <div className="flex justify-center gap-3">
          <Button variant="outline" className="w-12 h-12 p-0" onClick={moveLeft}>←</Button>
          <Button variant="outline" className="w-12 h-12 p-0" onClick={moveDown}>↓</Button>
          <Button variant="outline" className="w-12 h-12 p-0" onClick={moveRight}>→</Button>
        </div>
      </div>
      
      <div className="flex justify-center gap-3 mt-4">
        {gameStarted ? (
          <Button 
            onClick={togglePause} 
            variant={isPaused ? "default" : "outline"}
            className="px-6"
          >
            {isPaused ? "Continuar" : "Pausar"}
          </Button>
        ) : null}
        
        <Button 
          onClick={resetGame} 
          variant="default" 
          className="bg-blue-600 hover:bg-blue-700 px-6"
        >
          {gameOver || !gameStarted ? "Iniciar jogo" : "Reiniciar"}
        </Button>
      </div>
      
      {/* Informação sobre controles do teclado (somente desktop) */}
      <div className="hidden md:block mt-6 bg-gray-800 p-3 rounded text-sm text-gray-300">
        <h3 className="font-bold text-white mb-2">Controles do teclado:</h3>
        <ul className="space-y-1">
          <li>← → : Mover peça</li>
          <li>↓ : Descer peça</li>
          <li>↑ : Rotacionar</li>
          <li>Espaço : Queda rápida</li>
          <li>P : Pausar/Continuar</li>
        </ul>
      </div>
    </div>
  );
};

export default GameControls;
