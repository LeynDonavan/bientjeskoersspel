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
  // Chasse patatte (lichtrood)
  10: { message: 'Chasse patatte', effect: 'back3', color: 'bg-red-100' },
  43: { message: 'Chasse patatte', effect: 'back3', color: 'bg-red-100' },
  52: { message: 'Chasse patatte', effect: 'back3', color: 'bg-red-100' },
  
  // Valpartij (zeer donkerrood)
  34: { message: 'Valpartij', effect: 'back10', color: 'bg-red-800' },
  56: { message: 'Valpartij', effect: 'back10', color: 'bg-red-800' },
  
  // Platte band (middenrood)
  6: { message: 'Platte band', effect: 'skipTurn', color: 'bg-red-400' },
  24: { message: 'Platte band', effect: 'skipTurn', color: 'bg-red-400' },
  
  // Lonely without You (donkerrood)
  29: { message: 'Lonely without You', effect: 'goto25', color: 'bg-red-600' },
  47: { message: 'Lonely without You', effect: 'goto25', color: 'bg-red-600' },
  
  // Bidon collée (lichtgroen)
  15: { message: 'Bidon collée', effect: 'forward3', color: 'bg-green-200' },
  36: { message: 'Bidon collée', effect: 'forward3', color: 'bg-green-200' },
  
  // Demarrage (donkergroen)
  26: { message: 'Demarrage', effect: 'extraTurn', color: 'bg-green-600' },
  45: { message: 'Demarrage', effect: 'extraTurn', color: 'bg-green-600' }
  };

// Layout definitie voor het bord
const boardLayout = [
  // Buitenste ring (1-20) - nog verder uitgerekt
  { x: 5.5, y: 0.4 },  { x: 7.0, y: 0.4 },  { x: 8.5, y: 0.6 },  { x: 9.8, y: 1.0 },
  { x: 11.0, y: 1.7 }, { x: 11.8, y: 2.8 }, { x: 12.2, y: 4 },   { x: 11.8, y: 5.2 },
  { x: 11.0, y: 6.3 }, { x: 9.8, y: 7.0 },  { x: 8.5, y: 7.4 },  { x: 7.0, y: 7.6 },
  { x: 5.5, y: 7.6 },  { x: 4.0, y: 7.4 },  { x: 2.7, y: 7.0 },  { x: 1.8, y: 6.3 },
  { x: 1.2, y: 5.2 },  { x: 0.8, y: 4.0 },  { x: 1.2, y: 2.8 },  { x: 1.8, y: 1.7 },

  // Tweede ring (21-40) - proportioneel mee vergroot
  { x: 2.7, y: 1.0 },  { x: 4.0, y: 0.6 },  { x: 5.5, y: 1.4 },  { x: 7.0, y: 1.4 },
  { x: 8.4, y: 1.6 },  { x: 9.6, y: 2.2 },  { x: 10.4, y: 3.2 }, { x: 10.4, y: 4.8 },
  { x: 9.6, y: 5.8 },  { x: 8.4, y: 6.4 },  { x: 7.0, y: 6.6 },  { x: 5.5, y: 6.6 },
  { x: 4.0, y: 6.4 },  { x: 2.8, y: 5.8 },  { x: 2.2, y: 4.8 },  { x: 2.2, y: 3.2 },
  { x: 2.8, y: 2.2 },  { x: 4.0, y: 1.6 },  { x: 5.5, y: 2.4 },  { x: 7.0, y: 2.4 },

  // Derde ring (41-50) - aangepast aan nieuwe schaal
  { x: 8.2, y: 2.7 },  { x: 9.0, y: 3.2 },  { x: 9.0, y: 4.8 },  { x: 8.2, y: 5.3 },
  { x: 7.0, y: 5.6 },  { x: 5.5, y: 5.6 },  { x: 4.0, y: 5.3 },  { x: 3.2, y: 4.8 },
  { x: 3.2, y: 3.2 },  { x: 4.0, y: 2.7 },

  // Binnenste ring (51-60) - proportioneel aangepast
  { x: 5.5, y: 3.0 },  { x: 6.6, y: 3.0 },  { x: 7.4, y: 3.2 },  { x: 7.8, y: 3.7 },
  { x: 7.6, y: 4.3 },  { x: 7.0, y: 4.7 },  { x: 5.5, y: 4.8 },  { x: 4.0, y: 4.7 },
  { x: 3.4, y: 4.3 },  { x: 3.6, y: 3.7 }
];


  // Dobbelsteen functie
  const rollDice = () => {
    const newDiceValue = Math.floor(Math.random() * 6) + 1;
    setDiceValue(newDiceValue);

    const currentPosition = currentPlayer === 1 ? player1Position : player2Position;
    let newPosition = currentPosition + newDiceValue;
    let skipTurnChange = false;

    if (specialTiles[newPosition]) {
      const tile = specialTiles[newPosition];
      setGameMessage(tile.message);

      switch(tile.effect) {
        case 'back3':
          newPosition -= 3;
          break;
        case 'back10':
          newPosition -= 10;
          break;
        case 'skipTurn':
          // Implementeer beurt overslaan logica
          break;
        case 'goto25':
          newPosition = 25;
          break;
        case 'forward3':
          newPosition += 3;
          break;
        case 'extraTurn':
          skipTurnChange = true;
          break;
      }
    } else {
      setGameMessage('');
    }

    // Zorg dat positie niet onder 0 komt
    newPosition = Math.max(0, newPosition);

    if (currentPlayer === 1) {
      setPlayer1Position(newPosition);
    } else {
      setPlayer2Position(newPosition);
    }

    if (!skipTurnChange) {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  const renderBoard = () => {
    return (
      <div className="relative w-full h-[600px] bg-gray-50 rounded-xl p-4">
        {/* Verbindingslijnen */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
          {boardLayout.map((pos, index) => {
            if (index < boardLayout.length - 1) {
              const next = boardLayout[index + 1];
              return (
                <line
                  key={`line-${index}`}
                  x1={pos.x * 70}
                  y1={pos.y * 70}
                  x2={next.x * 70}
                  y2={next.y * 70}
                  stroke="#ddd"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
              );
            }
            return null;
          })}
        </svg>

        {boardLayout.map((pos, index) => {
          const position = index + 1;
          const hasPlayer1 = player1Position === position;
          const hasPlayer2 = player2Position === position;

          return (
            <div
              key={`cell-${position}`}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${pos.x * 70}px`,
                top: `${pos.y * 70}px`,
                zIndex: 1
              }}
            >
              <div
                className={`
                  ${specialTiles[position]?.color || 'bg-white'}
                  w-10 h-10
                  rounded-full
                  border-2 border-gray-400
                  flex items-center justify-center
                  relative
                  transition-all duration-200
                  hover:shadow-lg
                  hover:scale-105
                  group
                  cursor-help
                `}
              >
                <span className="text-xs font-bold">{position}</span>
                {specialTiles[position] && (
                  <div className="absolute invisible group-hover:visible bg-black text-white p-2 rounded-md text-xs whitespace-nowrap -top-8 left-1/2 transform -translate-x-1/2">
                    {specialTiles[position].message}
                  </div>
                )}
                {hasPlayer1 && (
                  <div className="absolute w-3 h-3 bg-red-500 rounded-full -top-1 -left-1 shadow-md animate-pulse" />
                )}
                {hasPlayer2 && (
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -top-1 -right-1 shadow-md animate-pulse" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Bientjes Koersspel</h1>

      <div className="bg-white p-6 rounded-lg shadow">
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