import { useState } from 'react';
import { WordGuessLevel } from './components/GameContainer';
import { WalletConnect } from './components/WalletConnect';
import { LucidProvider } from './context/LucidProvider';

const levels = [
  {
    level: 1,
    image: "https://public.bnbstatic.com/static/academy/uploads-original/6628e286df1f461a86d25314c7204525.png",
    word: "CARDANO",
    hint: "A blockchain platform founded by Charles Hoskinson",
    timeLimit: 30,
    points: 100,
  },
  {
    level: 2,
    image: "https://image.coinpedia.org/wp-content/uploads/2024/11/12184731/Which-Among-These-Top-10-Tokens-Will-Hit-1-First-Cardano-ADA-or-XRP.webp",
    word: "ADA",
    hint: "The native cryptocurrency of Cardano",
    timeLimit: 25,
    points: 120,
  },
  {
    level: 3,
    image: "https://mudrex.com/blog/wp-content/uploads/2022/01/Old-Blog-35.png",
    word: "STAKING",
    hint: "A mechanism in Cardano to earn rewards by holding ADA",
    timeLimit: 30,
    points: 150,
  },
 
  {
    level: 5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU4Uriuj7fxSPskPcI9RkwJV9dQOFOsUSCBQ&s",
    word: "SMART CONTRACTS",
    hint: "Self-executing agreements deployed on Cardano",
    timeLimit: 40,
    points: 200,
  },
];


function App() {
  const [currentLevel, setCurrentLevel] = useState(0);

  const handleLevelComplete = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
    } else {
      console.log("Game Over! You've completed all levels.");
    }
  };

  return (
    <LucidProvider>
      <div className="min-h-screen bg-gray-300 flex items-center justify-center">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <WalletConnect />
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <WordGuessLevel
              level={levels[currentLevel].level}
              image={levels[currentLevel].image}
              word={levels[currentLevel].word}
              hint={levels[currentLevel].hint}
              timeLimit={levels[currentLevel].timeLimit}
              points={levels[currentLevel].points}
              onLevelComplete={handleLevelComplete}
            />
          </div>
        </div>
      </div>
    </LucidProvider>
  );
}


export default App;