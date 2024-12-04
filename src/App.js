import React, { useState, useEffect } from 'react';
import SoundLonely from './Lonely.mp3';


function App() {
// State declarations
const [currentPlayer, setCurrentPlayer] = useState(1);
const [player1Position, setPlayer1Position] = useState(0);
const [player2Position, setPlayer2Position] = useState(0);
const [diceValue, setDiceValue] = useState(null);
const [gameMessage, setGameMessage] = useState('');
const [moveValue, setMoveValue] = useState('');
const [winner, setWinner] = useState(null);
const [isMoving, setIsMoving] = useState(false);
const [currentPath, setCurrentPath] = useState([]);
const [moveHistory, setMoveHistory] = useState([]);
const [audio] = useState(new Audio(SoundLonely));
const [showHistory, setShowHistory] = useState(false);


// Spelersnamen
const PLAYER_NAMES = {
  1: "Redlights.be",
  2: "Blauwjob Bientje"
};

// Speciale vakjes
const specialTiles = {
  // Chasse patatte (lichtrood)
  10: { message: 'Chasse patatte - keer 3 kilometer terug', effect: 'back3', color: 'bg-red-100' },
  43: { message: 'Chasse patatte - keer 3 kilometer terug', effect: 'back3', color: 'bg-red-100' },
  52: { message: 'Chasse patatte - keer 3 kilometer terug', effect: 'back3', color: 'bg-red-100' },
  
  // Valpartij (zeer donkerrood)
  32: { message: 'Valpartij - keer 10 kilometer terug', effect: 'back10', color: 'bg-red-800' },
  56: { message: 'Valpartij - keer 10 kilometer terug', effect: 'back10', color: 'bg-red-800' },
  
  // Platte band (middenrood)
  6: { message: 'Platte band - sla een beurt over', effect: 'skipTurn', color: 'bg-red-400' },
  24: { message: 'Platte band - sla een beurt over', effect: 'skipTurn', color: 'bg-red-400' },
  
  // Lonely without you (donkerrood)
  29: { message: 'Lonely without you - Frank wacht op je bij kilometer 25', effect: 'goto25', color: 'bg-red-600', sound: SoundLonely },
  47: { message: 'Lonely without you - Frank wacht op je bij kilometer 25', effect: 'goto25', color: 'bg-red-600', sound: SoundLonely },
  
  // Bidon collée (lichtgroen)
  13: { message: 'Bidon collée - rij 3 extra kilometers', effect: 'forward3', color: 'bg-green-200' },
  36: { message: 'Bidon collée - rij 3 extra kilometers', effect: 'forward3', color: 'bg-green-200' },
  
  // Demarrage (donkergroen)
  26: { message: 'Windstoot - gooi nog eens', effect: 'extraTurn', color: 'bg-green-600' },
  45: { message: 'Windstoot - gooi nog eens', effect: 'extraTurn', color: 'bg-green-600' },

  // Opdrachten (paars)
  7: { message: 'Opdracht!', effect: 'challenge', color: 'bg-purple-400' },
  16: { message: 'Opdracht!', effect: 'challenge', color: 'bg-purple-400' },
  22: { message: 'Opdracht!', effect: 'challenge', color: 'bg-purple-400' },
  40: { message: 'Opdracht!', effect: 'challenge', color: 'bg-purple-400' },
  46: { message: 'Opdracht!', effect: 'challenge', color: 'bg-purple-400' },
  49: { message: 'Opdracht!', effect: 'challenge', color: 'bg-purple-400' },
  59: { message: 'Opdracht!', effect: 'challenge', color: 'bg-purple-400' }
  };
  
// Layout van het bord
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
  
// MovePlayer functie
const movePlayer = (e) => {
  e.preventDefault();

  const value = parseInt(moveValue);

  if (isNaN(value) || value < 0 || value > 6) {
    setGameMessage('Kilometers gereden?');
    return;
  }

  setDiceValue(value);

  const currentPosition = currentPlayer === 1 ? player1Position : player2Position;
  let newPosition = currentPosition + value;

  if (specialTiles[newPosition]) {
    const tile = specialTiles[newPosition];
    setGameMessage(tile.message);

  if (tile.sound) {
    audio.play();
  }

    switch(tile.effect) {
      case 'back3':
        newPosition -= 3;
        break;
      case 'back10':
        newPosition -= 10;
        break;
      case 'skipTurn':
        break;
      case 'goto25':
        newPosition = 25;
        break;
      case 'forward3':
        newPosition += 3;
        break;
      case 'extraTurn':
        break;
    }
  } else {
    setGameMessage('');
  }

  newPosition = Math.max(0, newPosition);

  if (checkWinner(newPosition)) {
    setGameMessage(`${PLAYER_NAMES[currentPlayer]} heeft gewonnen!`);
    return;
  }

  //Voeg de zet toe aan de geschiedenis 
  setMoveHistory(prev => [...prev, {
    player: currentPlayer,
    from: currentPosition,
    to: newPosition,
    diceValue: value,
    effect: specialTiles[newPosition]?.message || null
    }]);

  // Animeer de beweging
  animateMovement(currentPosition, newPosition); 

  if (currentPlayer === 1) {
    setPlayer1Position(newPosition);
  } else {
    setPlayer2Position(newPosition);
  }

  // Reset het invoerveld
  setMoveValue('');
};

// Winner functie
const checkWinner = (position) => {
  if (position >= 60) {
    setWinner(currentPlayer);
    return true;
  }
  return false;
};

// Functie voor stapsgewijze beweging
const animateMovement = (start, end) => {
  setIsMoving(true);
  const path = [];
  for (let i = start + 1; i <= end; i++) {
    path.push(i);
  }
  setCurrentPath(path);

  let currentStep = 0;
  const interval = setInterval(() => {
    if (currentStep < path.length) {
      if (currentPlayer === 1) {
        setPlayer1Position(path[currentStep]);
      } else {
        setPlayer2Position(path[currentStep]);
      }
      currentStep++;
    } else {
      clearInterval(interval);
      setIsMoving(false);
      setCurrentPath([]);
    }
  }, 500);
};

// Reset functie
const resetGame = () => {
  setPlayer1Position(0);
  setPlayer2Position(0);
  setCurrentPlayer(1);
  setDiceValue(null);
  setGameMessage('');
  setMoveValue('');
  setWinner(null);
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
  
      {/* Moderator Controls */}
      <div className="bg-gray-100 p-4 rounded-lg shadow mb-4">
      <h2 className="font-bold text-lg mb-2">Moderator Controls</h2>
      <div className="flex gap-4 flex-wrap">
        <button 
          onClick={() => setCurrentPlayer(1)}
          className={`px-4 py-2 rounded-md text-white transition-colors
                 ${currentPlayer === 1 
                   ? 'bg-red-600 font-bold' 
                   : 'bg-red-400 hover:bg-red-500'}`}
                >   
          Beurt aan Redlights
        </button>

        <button 
          onClick={() => setCurrentPlayer(2)}
          className={`px-4 py-2 rounded-md text-white transition-colors
                 ${currentPlayer === 2 
                   ? 'bg-blue-600 font-bold' 
                   : 'bg-blue-400 hover:bg-blue-500'}`}
                >
          Beurt aan Blauwjob
        </button>

        <button 
          onClick={() => setShowHistory(!showHistory)}
          className={`px-4 py-2 rounded-md text-white transition-colors
                 ${showHistory 
                   ? 'bg-purple-600 font-bold' 
                   : 'bg-purple-400 hover:bg-purple-500'}`}
                >
          {showHistory ? 'Verberg Geschiedenis' : 'Toon Geschiedenis'}
        </button>
    
        <button 
          onClick={resetGame}
          className="px-4 py-2 rounded-md text-white transition-colors
                bg-gray-500 hover:bg-gray-600"
                >
      Neutralisatie
        </button>
      </div>

  {/* Geschiedenis sectie - alleen tonen als showHistory true is */}
  {showHistory && (
    <div className="mt-4 bg-white p-4 rounded-lg">
      <h3 className="font-bold mb-2">Geschiedenis</h3>
      <div className="max-h-40 overflow-y-auto">
        {moveHistory.map((move, index) => (
          <div key={index} className="text-sm mb-1">
            {PLAYER_NAMES[move.player]}: {move.from} → {move.to} 
            {move.effect && ` (${move.effect})`}
          </div>
        ))}
      </div>
    </div>
  )}
</div>
  
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className={`font-bold text-xl ${currentPlayer === 1 ? 'text-red-500' : 'text-blue-500'} 
                          transition-colors duration-300 transform scale-105`}>
              Het is nu aan: {PLAYER_NAMES[currentPlayer]}
            </p>
            <form onSubmit={movePlayer} className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                max="6"
                value={moveValue}
                onChange={(e) => setMoveValue(e.target.value)}
                className={`w-16 px-2 py-1 border-2 rounded-md focus:outline-none focus:ring-2
                           ${currentPlayer === 1 ? 'border-red-300 focus:ring-red-500' : 'border-blue-300 focus:ring-blue-500'}`}
                placeholder="0-6"
              />
              <button 
                type="submit"
                className={`px-4 py-1 rounded-md text-white transition-colors
                           ${currentPlayer === 1 
                             ? 'bg-red-500 hover:bg-red-600' 
                             : 'bg-blue-500 hover:bg-blue-600'}`}
              >
                Zet
              </button>
            </form>
          </div>
  
          <div className="flex justify-between items-center">
            <p className={`flex items-center text-lg ${currentPlayer === 1 ? 'font-bold scale-105' : ''} 
                          transition-all duration-300`}>
              <span className="w-3 h-3 bg-red-500 rounded-full inline-block mr-2"></span>
              Redlights.be: {player1Position}
            </p>
            <p className={`flex items-center text-lg ${currentPlayer === 2 ? 'font-bold scale-105' : ''} 
                          transition-all duration-300`}>
              <span className="w-3 h-3 bg-blue-500 rounded-full inline-block mr-2"></span>
              Blauwjob Bientje: {player2Position}
            </p>
          </div>
        </div>
      </div>
     
      {gameMessage && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 my-6">
          <p className="text-yellow-700">{gameMessage}</p>
        </div>
      )}

      
  
      <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
        {renderBoard()}
      </div>
    </div>
  );
};

export default App;