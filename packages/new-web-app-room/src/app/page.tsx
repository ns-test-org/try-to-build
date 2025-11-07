'use client';

import { useEffect, useState } from 'react';

// Card symbols for the memory game
const cardSymbols = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺'];

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize the game
  const initializeGame = () => {
    const shuffledCards = [...cardSymbols, ...cardSymbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }));
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameWon(false);
    setGameStarted(true);
  };

  // Handle card click
  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return;
    if (cards[cardId].isFlipped || cards[cardId].isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Flip the card
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));

    // Check for match when two cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstCard, secondCard] = newFlippedCards.map(id => cards[id]);
      
      if (firstCard.symbol === secondCard.symbol) {
        // Match found!
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            newFlippedCards.includes(card.id) 
              ? { ...card, isMatched: true }
              : card
          ));
          setMatches(prev => prev + 1);
          setFlippedCards([]);
          
          // Check if game is won
          if (matches + 1 === cardSymbols.length) {
            setGameWon(true);
          }
        }, 1000);
      } else {
        // No match - flip cards back
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            newFlippedCards.includes(card.id) 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-4">🧠</h1>
          <h2 className="text-4xl font-bold mb-6">Memory Match</h2>
          <p className="text-xl mb-8 opacity-90">
            Find all the matching pairs by flipping cards!
          </p>
          <button
            onClick={initializeGame}
            className="bg-white text-purple-900 px-8 py-4 rounded-full text-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl font-bold mb-4">Memory Match</h1>
          <div className="flex justify-center gap-8 text-lg">
            <div>Moves: <span className="font-bold">{moves}</span></div>
            <div>Matches: <span className="font-bold">{matches}/{cardSymbols.length}</span></div>
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`
                aspect-square rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105
                ${card.isFlipped || card.isMatched 
                  ? 'bg-white text-4xl' 
                  : 'bg-white/20 hover:bg-white/30'
                }
                ${card.isMatched ? 'ring-4 ring-green-400' : ''}
                flex items-center justify-center text-4xl font-bold
              `}
            >
              {card.isFlipped || card.isMatched ? card.symbol : '?'}
            </div>
          ))}
        </div>

        {/* Game Won Modal */}
        {gameWon && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 text-center max-w-md">
              <h2 className="text-3xl font-bold text-purple-900 mb-4">🎉 You Won!</h2>
              <p className="text-lg text-gray-700 mb-6">
                Congratulations! You completed the game in <strong>{moves}</strong> moves.
              </p>
              <button
                onClick={initializeGame}
                className="bg-purple-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-800 transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* New Game Button */}
        <div className="text-center">
          <button
            onClick={initializeGame}
            className="bg-white/20 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-colors"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}

