import React, { useState, useEffect } from 'react';

function App() {
// State declarations
const [currentPlayer, setCurrentPlayer] = useState(1);
const [player1Position, setPlayer1Position] = useState(0);
const [player2Position, setPlayer2Position] = useState(0);
const [diceValue, setDiceValue] = useState(null);
const [gameMessage, setGameMessage] = useState('');
const [boardTiles, setBoardTiles] = useState({
  red: [],
  green: [],
  blue: []
});

// Spelersnamen
const PLAYER_NAMES = {
  1: "Redlights Zootje",
  2: "Blauwjob Bientje"
  };


// Speciale vakjes
const specialTiles = {
  6: 'Brug: ga door naar 12',
  19: 'Herberg: sla één beurt over',
  31: 'Put: wacht tot iemand je verlost',
  42: 'Doolhof: ga terug naar 39',
  52: 'Gevangenis: drie beurten overslaan',
  58: 'Dood: terug naar start',
};

// Layout definitie voor het bord
const boardLayout = [
  // Rij 1 (1-10)
  { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, 
  { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 },
  
  // Rij 2 (11-20, van rechts naar links)
  { x: 9, y: 1 }, { x: 8, y: 1 }, { x: 7, y: 1 }, { x: 6, y: 1 }, { x: 5, y: 1 },
  { x: 4, y: 1 }, { x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 1 },
  
  // Rij 3 (21-30)
  { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 },
  { x: 5, y: 2 }, { x: 6, y: 2 }, { x: 7, y: 2 }, { x: 8, y: 2 }, { x: 9, y: 2 },
  
  // Rij 4 (31-40, van rechts naar links)
  { x: 9, y: 3 }, { x: 8, y: 3 }, { x: 7, y: 3 }, { x: 6, y: 3 }, { x: 5, y: 3 },
  { x: 4, y: 3 }, { x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }, { x: 0, y: 3 },
  
  // Rij 5 (41-50)
  { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 },
  { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 }, { x: 8, y: 4 }, { x: 9, y: 4 },
  
  // Rij 6 (51-60, van rechts naar links)
  { x: 9, y: 5 }, { x: 8, y: 5 }, { x: 7, y: 5 }, { x: 6, y: 5 }, { x: 5, y: 5 },
  { x: 4, y: 5 }, { x: 3, y: 5 }, { x: 2, y: 5 }, { x: 1, y: 5 }, { x: 0, y: 5 }
  ];

// Initialize colored tiles
useEffect(() => {
  const generateColoredTiles = () => {
    const positions = new Set();
    while (positions.size < 18) {
      positions.add(Math.floor(Math.random() * 60) + 1);
    }

    const positionsArray = [...positions];
    setBoardTiles({
      red: positionsArray.slice(0, 6),
      green: positionsArray.slice(6, 12),
      blue: positionsArray.slice(12, 18)
    });
  };

  generateColoredTiles();
}, []);

// Dobbelsteen functie
const rollDice = () => {
  const newDiceValue = Math.floor(Math.random() * 6) + 1;
  setDiceValue(newDiceValue);

  const currentPosition = currentPlayer === 1 ? player1Position : player2Position;
  let newPosition = currentPosition + newDiceValue;

  if (specialTiles[newPosition]) {
    setGameMessage(`${specialTiles[newPosition]}`);
    if (newPosition === 6) newPosition = 12;
    if (newPosition === 42) newPosition = 39;
    if (newPosition === 58) newPosition = 0;
  } else {
    setGameMessage('');
  }

  if (currentPlayer === 1) {
    setPlayer1Position(newPosition);
  } else {
    setPlayer2Position(newPosition);
  }

  setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
};

const renderBoard = () => {
  const maxX = Math.max(...boardLayout.map(pos => pos.x)) + 1;
  const maxY = Math.max(...boardLayout.map(pos => pos.y)) + 1;
  const grid = Array(maxY).fill().map(() => Array(maxX).fill(null));

  boardLayout.forEach((pos, index) => {
    const position = index + 1;
    const hasPlayer1 = player1Position === position;
    const hasPlayer2 = player2Position === position;
    const isSpecialTile = position in specialTiles;

    let bgColor = 'bg-white';
    if (boardTiles.red?.includes(position)) bgColor = 'bg-red-200';
    if (boardTiles.green?.includes(position)) bgColor = 'bg-green-200';
    if (boardTiles.blue?.includes(position)) bgColor = 'bg-blue-200';

    grid[pos.y][pos.x] = (
      <div key={`cell-${pos.x}-${pos.y}`} className="relative">
        <div className={`
          border ${isSpecialTile ? 'border-2 border-yellow-500' : 'border-gray-400'}
          p-2 w-16 h-16 
          flex items-center justify-center 
          relative 
          ${bgColor}
          transition-all duration-200
          hover:shadow-md
        `}>
          {position}
          {hasPlayer1 && (
            <div className="absolute w-5 h-5 bg-red-500 rounded-full top-1 left-1 shadow-md animate-pulse" />
          )}
          {hasPlayer2 && (
            <div className="absolute w-5 h-5 bg-blue-500 rounded-full top-1 right-1 shadow-md animate-pulse" />
          )}
        </div>
      </div>
    );
  });

  return (
    <div className="grid gap-1" style={{ gridTemplateRows: `repeat(${maxY}, minmax(0, 1fr))` }}>
      {grid.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-1">
          {row.map((cell, cellIndex) => (
            <div key={`cell-${rowIndex}-${cellIndex}`} className="w-16 h-16">
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

return (
  <div className="p-8 max-w-7xl mx-auto">
    <h1 className="text-3xl font-bold mb-6 text-center">Bientjes Koersspel</h1>

    <div className="bg-white p-4 rounded-lg shadow">
<p className="font-bold">Het is nu aan: {PLAYER_NAMES[currentPlayer]}</p>
<p>Redlights Zootje: {player1Position}</p>
<p>Blauwjob Bientje: {player2Position}</p>


      <div className="bg-white p-4 rounded-lg shadow">
        <button 
          onClick={rollDice}
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg
                     font-bold text-lg hover:bg-blue-600 
                     transition-colors transform hover:scale-105"
        >
          🎲 Stampeeen
        </button>
        {diceValue && (
          <p className="text-center mt-4 text-xl">Kilometers: {diceValue}</p>
        )}
      </div>
    </div>

    {gameMessage && (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
        <p className="text-yellow-700">{gameMessage}</p>
      </div>
    )}

    <div className="bg-white p-6 rounded-lg shadow-lg">
      {renderBoard()}
    </div>
  </div>
);
}

export default App;