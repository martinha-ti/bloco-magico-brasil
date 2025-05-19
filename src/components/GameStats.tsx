
import React from 'react';

type GameStatsProps = {
  score: number;
  level: number;
  lines: number;
};

const GameStats: React.FC<GameStatsProps> = ({ score, level, lines }) => {
  return (
    <div className="bg-gray-800 p-4 rounded space-y-3">
      <div className="text-center">
        <h3 className="text-gray-400 text-sm">Pontuação</h3>
        <p className="text-xl font-bold text-white">{score}</p>
      </div>
      
      <div className="text-center">
        <h3 className="text-gray-400 text-sm">Nível</h3>
        <p className="text-xl font-bold text-white">{level}</p>
      </div>
      
      <div className="text-center">
        <h3 className="text-gray-400 text-sm">Linhas</h3>
        <p className="text-xl font-bold text-white">{lines}</p>
      </div>
    </div>
  );
};

export default GameStats;
