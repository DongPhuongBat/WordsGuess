import React, { useState, useEffect } from 'react';
import { MintTokenValidator } from './MintTokenValidator';

interface WordGuessLevelProps {
  level: number;
  image: string;
  word: string;
  hint: string;
  timeLimit: number;
  points: number;
  onLevelComplete: () => void;
}

export const WordGuessLevel: React.FC<WordGuessLevelProps> = ({
  level,
  image,
  word,
  hint,
  timeLimit,
  points,
  onLevelComplete
}) => {
  const [guess, setGuess] = useState('');
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (isCompleted) {
      console.log({ level, timeLeft, points, word });
    }
  }, [isCompleted]);

  const handleStart = () => {
    setIsActive(true);
    setTimeLeft(timeLimit);
    setGuess('');
    setShowHint(false);
  };

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Guess submitted:", guess);
    if (guess.toUpperCase() === word.toUpperCase()) {
      setIsActive(false);
      setIsCompleted(true);
      onLevelComplete();
    }
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg border-4 border-blue-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-600">
          Level {level}
        </h2>
        <div className="text-lg font-semibold text-blue-800 bg-blue-100 p-2 rounded-lg">
          Time: <span className="text-red-600">{timeLeft}s</span>
        </div>
      </div>

      {isActive && (
        <>
          <div className="mb-6">
            <img
              src={image}
              alt={`Level ${level} puzzle`}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          <form onSubmit={handleGuess} className="space-y-4">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="w-full p-3 bg-blue-50 text-blue-800 rounded-lg border-2 border-blue-300"
              placeholder="Type your answer..."
            />
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 py-3 px-6 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition"
              >
                Submit Answer
              </button>
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="py-3 px-6 bg-blue-300 text-blue-800 rounded-lg hover:bg-blue-400 transition"
              >
                Show Hint
              </button>
            </div>
          </form>

          {showHint && (
            <div className="mt-4 p-4 bg-blue-100 rounded-lg">
              <p className="text-blue-800">Hint: {hint}</p>
            </div>
          )}
        </>
      )}

      {!isActive && !isCompleted && (
        <button
          onClick={handleStart}
          className="w-full py-4 px-8 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition"
        >
          Start Level {level}
        </button>
      )}

      {isCompleted && (
        <MintTokenValidator
          level={level}
          timeLeft={timeLeft}
          points={points}
          word={word}
        />
      )}
    </div>
  );
};