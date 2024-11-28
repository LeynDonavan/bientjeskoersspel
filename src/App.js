import React, { useState } from 'react';

function App() {
const [currentPlayer, setCurrentPlayer] = useState(1);
const [player1Position, setPlayer1Position] = useState(0);
const [player2Position, setPlayer2Position] = useState(0);
const [diceValue, setDiceValue] = useState(null);
const [gameMessage, setGameMessage] = useState('');

// Speciale vakjes
const specialTiles = {
  6: 'Brug: ga door naar 12',
  19: 'Herberg: sla één beurt over',
  31: 'Put: wacht tot iemand je verlost',
  42: 'Doolhof: ga terug naar 39',
  52: 'Gevangenis: drie beurten overslaan',
  58: 'Dood: terug naar start',
};

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
  }

  if (currentPlayer === 1) {
    setPlayer1Position(newPosition);
  } else {
    setPlayer2Position(newPosition);
  }

  setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
};

const renderBoard = () => {
  const tiles = [];
  for (let i = 0; i < 63; i++) {
    const hasPlayer1 = player1Position === i;
    const hasPlayer2 = player2Position === i;
    const isSpecial = specialTiles[i] ? 'bg-yellow-200' : 'bg-white';

    tiles.push(
      <div 
        key={i} 
        className={`border border-gray-400 p-2 w-16 h-16 flex items-center justify-center relative ${isSpecial}`}
      >
        {i}
        {hasPlayer1 && (
          <div className="absolute w-4 h-4 bg-red-500 rounded-full top-1 left-1" />
        )}
        {hasPlayer2 && (
          <div className="absolute w-4 h-4 bg-blue-500 rounded-full top-1 right-1" />
        )}
      </div>
    );
  }
  return tiles;
};

return (
  <div className="p-4">
    <h1 className="text-2xl mb-4">Bientjes Koersspel</h1>
    <div className="mb-4">
      <p>Speler aan zet: {currentPlayer}</p>
      <p>Speler 1 positie: {player1Position}</p>
      <p>Speler 2 positie: {player2Position}</p>
      {gameMessage && <p className="text-red-500">{gameMessage}</p>}
    </div>

    <button 
      onClick={rollDice}
      className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
    >
      Gooi dobbelsteen
    </button>

    {diceValue && (
      <div className="mb-4">
        <p>Dobbelsteen: {diceValue}</p>
      </div>
    )}

    <div className="grid grid-cols-9 gap-1 w-fit">
      {renderBoard()}
    </div>
  </div>
);
}

export default App;