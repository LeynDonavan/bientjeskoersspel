import React, { useState, useEffect } from 'react';
import SoundLonely from './Lonely.mp3';


function App() {
// State declarations
const [currentPlayer, setCurrentPlayer] = useState(1);
const [player1Position, setPlayer1Position] = useState(0);
const [player2Position, setPlayer2Position] = useState(0);
const [player1DemarrageUsed, setPlayer1DemarrageUsed] = useState(false);
const [player2DemarrageUsed, setPlayer2DemarrageUsed] = useState(false);
const [isDemarrageActive, setIsDemarrageActive] = useState(false);
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
  
  // Windstoot (donkergroen)
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

  // Validatie voor demarrage
  if (isNaN(value) || 
      (isDemarrageActive && (value < 3 || value > 18)) || 
      (!isDemarrageActive && (value < 1 || value > 6))) {
    setGameMessage(isDemarrageActive 
      ? 'Demarrage moet tussen 3 en 18 zijn!' 
      : 'Kilometers gereden moet tussen 1 en 6 zijn!');
    return;
  }

  setDiceValue(value);

  const currentPosition = currentPlayer === 1 ? player1Position : player2Position;
  const element = document.getElementById(`player${currentPlayer}`);

  // Stap voor stap beweging
  let step = 0;
  let finalPosition = currentPosition + value;
  let skipTurnChange = false;

  const moveInterval = setInterval(() => {
    if (step < value) {
      step++;
      let newPosition = currentPosition + step;

      // Animeer elke stap
      if (element) {
        element.style.transition = 'all 0.3s ease';
        element.style.transform = `translateX(${newPosition * 60}px)`;
      }

      // Update positie in state
      if (currentPlayer === 1) {
        setPlayer1Position(newPosition);
      } else {
        setPlayer2Position(newPosition);
      }

      // Bij laatste stap, verwerk speciale vakjes en effecten
      if (step === value) {
        if (specialTiles[newPosition]) {
          const tile = specialTiles[newPosition];
          setGameMessage(tile.message);

          if (tile.sound) {
            audio.play();
          }

          // Verwerk special tile effecten
          switch(tile.effect) {
            case 'back3':
              finalPosition = newPosition - 3;
              break;
            case 'back10':
              finalPosition = newPosition - 10;
              break;
            case 'skipTurn':
              break;
            case 'goto25':
              finalPosition = 25;
              break;
            case 'forward3':
              finalPosition = newPosition + 3;
              break;
            case 'extraTurn':
              skipTurnChange = true;
              break;
          }

          // Animeer extra beweging door special effect
          if (finalPosition !== newPosition) {
            setTimeout(() => {
              if (element) {
                element.style.transition = 'all 0.5s ease';
                element.style.transform = `translateX(${finalPosition * 60}px)`;
              }
              if (currentPlayer === 1) {
                setPlayer1Position(finalPosition);
              } else {
                setPlayer2Position(finalPosition);
              }
            }, 500);
          }
        } else {
          setGameMessage('');
          finalPosition = newPosition;
        }

        // Check voor winnaar
        if (checkWinner(finalPosition)) {
          setGameMessage(`${PLAYER_NAMES[currentPlayer]} heeft gewonnen!`);
          clearInterval(moveInterval);
          return;
        }

        // Voeg de zet toe aan de geschiedenis
        setMoveHistory(prev => [...prev, {
          player: currentPlayer,
          from: currentPosition,
          to: finalPosition,
          diceValue: value,
          effect: specialTiles[newPosition]?.message || null
        }]);

        // Verwerk demarrage status
        if (isDemarrageActive) {
          setIsDemarrageActive(false);
          if (currentPlayer === 1) {
            setPlayer1DemarrageUsed(true);
          } else {
            setPlayer2DemarrageUsed(true);
          }
        }

        // Wissel de beurt (tenzij er een extraTurn effect actief is)
        if (!skipTurnChange) {
          setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        }

        // Reset het invoerveld
        setMoveValue('');
      }
    } else {
      clearInterval(moveInterval);
    }
  }, 1000); // Interval tussen elke stap (300ms)
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
    setPlayer1DemarrageUsed(false);
  setPlayer2DemarrageUsed(false);
  setIsDemarrageActive(false);
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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Bientjes Koersspel</h1>
  
      <div className="flex gap-8">
        {/* Linker kolom - Moderator Controls */}
        <div className="w-1/4">
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h2 className="font-bold text-lg mb-4">Moderator Controls</h2>
  
            {/* Redlights Controls */}
            <div className="flex flex-col gap-2 mb-4">
              <button 
                onClick={() => setCurrentPlayer(1)}
                className={`px-4 py-2 rounded-md text-white transition-colors
                  ${currentPlayer === 1 ? 'bg-red-600 font-bold' : 'bg-red-400 hover:bg-red-500'}`}
              >   
                Beurt aan Redlights
              </button>
              <button 
                onClick={() => {
                  if (!player1DemarrageUsed) {
                    setIsDemarrageActive(true);
                    setCurrentPlayer(1);
                  }
                }}
                disabled={player1DemarrageUsed}
                className={`px-4 py-2 rounded-md text-white transition-colors 
                  ${player1DemarrageUsed ? 'bg-gray-400' : 'bg-pink-500 hover:bg-pink-600'}`}
              >
                Demarrage Redlights
              </button>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const oldPosition = player1Position;
                    const newPosition = oldPosition + 1;
                    if (newPosition <= 60) {
                      setPlayer1Position(newPosition);
                      setMoveHistory(prev => [...prev, {
                        player: 1,
                        from: oldPosition,
                        to: newPosition,
                        diceValue: 1,
                        effect: "Moderator: +1 stap"
                      }]);
                      const element = document.getElementById('player1');
                      if (element) {
                        element.style.transition = 'all 0.5s ease';
                        element.style.transform = `translateX(${newPosition * 60}px)`;
                      }
                      if (specialTiles[newPosition]) {
                        setGameMessage(`Redlights komt op ${specialTiles[newPosition].message}`);
                      }
                    }
                  }}
                  className="flex-1 px-4 py-2 rounded-md text-white bg-pink-500 hover:bg-pink-600"
                >
                  Redlights +1
                </button>
                <button 
                  onClick={() => {
                    const oldPosition = player1Position;
                    const newPosition = Math.max(0, oldPosition - 1);
                    setPlayer1Position(newPosition);
                    setMoveHistory(prev => [...prev, {
                      player: 1,
                      from: oldPosition,
                      to: newPosition,
                      diceValue: -1,
                      effect: "Moderator: -1 stap"
                    }]);
                    const element = document.getElementById('player1');
                    if (element) {
                      element.style.transition = 'all 0.5s ease';
                      element.style.transform = `translateX(${newPosition * 60}px)`;
                    }
                    if (specialTiles[newPosition]) {
                      setGameMessage(`Redlights komt op ${specialTiles[newPosition].message}`);
                    }
                  }}
                  className="flex-1 px-4 py-2 rounded-md text-white bg-pink-500 hover:bg-pink-600"
                >
                  Redlights -1
                </button>
              </div>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  min="0" 
                  max="60"
                  className="w-20 px-2 py-1 border rounded"
                  id="redlightsJumpInput"
                  placeholder="0-60"
                />
                <button 
                  onClick={() => {
                    const input = document.getElementById('redlightsJumpInput');
                    const targetPosition = parseInt(input.value);
                    if (!isNaN(targetPosition) && targetPosition >= 0 && targetPosition <= 60) {
                      const oldPosition = player1Position;
                      setPlayer1Position(targetPosition);
                      setMoveHistory(prev => [...prev, {
                        player: 1,
                        from: oldPosition,
                        to: targetPosition,
                        diceValue: 'Jump',
                        effect: "Moderator: Directe sprong"
                      }]);
                      const element = document.getElementById('player1');
                      if (element) {
                        element.style.transition = 'all 0.5s ease';
                        element.style.transform = `translateX(${targetPosition * 60}px)`;
                      }
                      if (specialTiles[targetPosition]) {
                        setGameMessage(`Redlights komt op ${specialTiles[targetPosition].message}`);
                      }
                      input.value = '';
                    }
                  }}
                  className="flex-1 px-4 py-2 rounded-md text-white bg-pink-500 hover:bg-pink-600"
                >
                  Plaats Redlights
                </button>
              </div>
            </div>
  
            {/* Blauwjob Controls */}
            <div className="flex flex-col gap-2 mb-4">
              <button 
                onClick={() => setCurrentPlayer(2)}
                className={`px-4 py-2 rounded-md text-white transition-colors
                  ${currentPlayer === 2 ? 'bg-blue-600 font-bold' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                Beurt aan Blauwjob
              </button>
              <button 
                onClick={() => {
                  if (!player2DemarrageUsed) {
                    setIsDemarrageActive(true);
                    setCurrentPlayer(2);
                  }
                }}
                disabled={player2DemarrageUsed}
                className={`px-4 py-2 rounded-md text-white transition-colors 
                  ${player2DemarrageUsed ? 'bg-gray-400' : 'bg-blue-400 hover:bg-blue-500'}`}
              >
                Demarrage Blauwjob
              </button>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const oldPosition = player2Position;
                    const newPosition = oldPosition + 1;
                    if (newPosition <= 60) {
                      setPlayer2Position(newPosition);
                      setMoveHistory(prev => [...prev, {
                        player: 2,
                        from: oldPosition,
                        to: newPosition,
                        diceValue: 1,
                        effect: "Moderator: +1 stap"
                      }]);
                      const element = document.getElementById('player2');
                      if (element) {
                        element.style.transition = 'all 0.5s ease';
                        element.style.transform = `translateX(${newPosition * 60}px)`;
                      }
                      if (specialTiles[newPosition]) {
                        setGameMessage(`Blauwjob komt op ${specialTiles[newPosition].message}`);
                      }
                    }
                  }}
                  className="flex-1 px-4 py-2 rounded-md text-white bg-blue-400 hover:bg-blue-500"
                >
                  Blauwjob +1
                </button>
                <button 
                  onClick={() => {
                    const oldPosition = player2Position;
                    const newPosition = Math.max(0, oldPosition - 1);
                    setPlayer2Position(newPosition);
                    setMoveHistory(prev => [...prev, {
                      player: 2,
                      from: oldPosition,
                      to: newPosition,
                      diceValue: -1,
                      effect: "Moderator: -1 stap"
                    }]);
                    const element = document.getElementById('player2');
                    if (element) {
                      element.style.transition = 'all 0.5s ease';
                      element.style.transform = `translateX(${newPosition * 60}px)`;
                    }
                    if (specialTiles[newPosition]) {
                      setGameMessage(`Blauwjob komt op ${specialTiles[newPosition].message}`);
                    }
                  }}
                  className="flex-1 px-4 py-2 rounded-md text-white bg-blue-400 hover:bg-blue-500"
                >
                  Blauwjob -1
                </button>
              </div>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  min="0" 
                  max="60"
                  className="w-20 px-2 py-1 border rounded"
                  id="blauwjobJumpInput"
                  placeholder="0-60"
                />
                <button 
                  onClick={() => {
                    const input = document.getElementById('blauwjobJumpInput');
                    const targetPosition = parseInt(input.value);
                    if (!isNaN(targetPosition) && targetPosition >= 0 && targetPosition <= 60) {
                      const oldPosition = player2Position;
                      setPlayer2Position(targetPosition);
                      setMoveHistory(prev => [...prev, {
                        player: 2,
                        from: oldPosition,
                        to: targetPosition,
                        diceValue: 'Jump',
                        effect: "Moderator: Directe sprong"
                      }]);
                      const element = document.getElementById('player2');
                      if (element) {
                        element.style.transition = 'all 0.5s ease';
                        element.style.transform = `translateX(${targetPosition * 60}px)`;
                      }
                      if (specialTiles[targetPosition]) {
                        setGameMessage(`Blauwjob komt op ${specialTiles[targetPosition].message}`);
                      }
                      input.value = '';
                    }
                  }}
                  className="flex-1 px-4 py-2 rounded-md text-white bg-blue-400 hover:bg-blue-500"
                >
                  Plaats Blauwjob
                </button>
              </div>
            </div>
  
            {/* Algemene Controls */}
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className="px-4 py-2 rounded-md text-white bg-gray-500 hover:bg-gray-600"
              >
                Toon Geschiedenis
              </button>
              <button 
                onClick={resetGame}
                className="px-4 py-2 rounded-md text-white bg-gray-500 hover:bg-gray-600"
              >
                Neutralisatie
              </button>
            </div>
          </div>
        </div>
  
        {/* Rechter kolom - Spelbord en Status */}
        <div className="flex-1">
          <div className="bg-white p-6 rounded-lg shadow mb-4">
            <div className="flex justify-between items-center mb-4">
              <p className="font-bold text-xl">Het is nu aan: {PLAYER_NAMES[currentPlayer]}</p>
              <form onSubmit={movePlayer} className="flex items-center gap-2">
                <input 
                  type="number"
                  min={isDemarrageActive ? "3" : "1"}
                  max={isDemarrageActive ? "18" : "6"}
                  value={moveValue}
                  onChange={(e) => setMoveValue(e.target.value)}
                  className="w-16 px-2 py-1 border rounded"
                  placeholder={isDemarrageActive ? "3-18" : "1-6"}
                />
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-md text-white bg-green-500 hover:bg-green-600"
                >
                  Kilometers
                </button>
              </form>
            </div>
  
            {gameMessage && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
                <p className="text-yellow-700">{gameMessage}</p>
              </div>
            )}
  
            <div className="bg-white rounded-lg">
              {renderBoard()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;