import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./index.css";
import ReactDom from "react-dom/client";
import { AlertCircle, ThumbsUp, Timer, Star, Zap } from "lucide-react";

const operations = ["Brightness", "Contrast", "Flip", "Blur", "Sharpen"];

function App() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [processedImage, setProcessedImage] = useState("");
  const [appliedOperations, setAppliedOperations] = useState([]);
  const [userGuess, setUserGuess] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  useEffect(() => {
    startNewRound();
  }, [level]);

  const startNewRound = () => {
    // Generate a random image URL from Picsum
    const randomImageUrl = `https://picsum.photos/400/300?random=${Math.floor(
      Math.random() * 1000
    )}`;

    // Set the new random image as the current image
    setCurrentImage(randomImageUrl);

    const newOperations = Array(level)
      .fill()
      .map(() => operations[Math.floor(Math.random() * operations.length)]);
    setAppliedOperations(newOperations);

    // Apply operations (in this case, we just change the text in the URL for simplicity)
    let processed = randomImageUrl;
    newOperations.forEach((op) => {
      processed = `https://picsum.photos/400/300?random=${Math.floor(
      Math.random() * 1000
    )}`;
    });

    setProcessedImage(processed);
    setUserGuess([]);
    setShowHint(false);
    setTimeLeft(30);
    setIsCorrect(null);
  };

  const handleGuess = () => {
    const correct =
      JSON.stringify(userGuess) === JSON.stringify(appliedOperations);
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 10 * level);
      if (level < 2) {
        setTimeout(() => {
          setLevel(level + 1);
        }, 1500);
      } else {
        setTimeout(startNewRound, 1500);
      }
    } else {
      setScore(Math.max(0, score - 5));
    }
  };

  const showHintHandler = () => {
    setShowHint(true);
    setScore(Math.max(0, score - 2));
  };

  if (gameOver) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
        <div className="max-w-lg w-full p-6 bg-white rounded-lg shadow-xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <h1 className="text-4xl font-bold text-purple-600">Game Over!</h1>
            <p className="text-2xl mt-4 text-gray-700">
              Your final score: {score}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition"
            >
              Play Again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-center text-5xl font-bold text-purple-600 mb-8">
          Image Processing Wizard
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Star className="text-yellow-500 w-8 h-8 mr-2" />
              <span className="text-xl font-semibold text-gray-800">
                Level: {level}
              </span>
            </div>
            <div className="flex items-center">
              <Zap className="text-blue-500 w-8 h-8 mr-2" />
              <span className="text-xl font-semibold text-gray-800">
                Score: {score}
              </span>
            </div>
            <div className="flex items-center">
              <Timer className="text-red-500 w-8 h-8 mr-2" />
              <span className="text-xl font-semibold text-gray-800">
                Time: {timeLeft}s
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="relative">
              <img
                src={currentImage}
                alt="Original"
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg">
                Original
              </div>
            </div>

            <div className="relative">
              <img
                src={processedImage}
                alt="Processed"
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg">
                Processed
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-lg font-semibold text-gray-700">
              Guess the applied operations:
            </p>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {Array(level)
                .fill()
                .map((_, index) => (
                  <select
                    key={index}
                    value={userGuess[index] || ""}
                    onChange={(e) => {
                      const newGuess = [...userGuess];
                      newGuess[index] = e.target.value;
                      setUserGuess(newGuess);
                    }}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select operation</option>
                    {operations.map((op) => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleGuess}
              className="px-6 py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition"
            >
              Submit Guess
            </button>
            <button
              onClick={showHintHandler}
              disabled={showHint}
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
            >
              Show Hint (-2 points)
            </button>
          </div>

          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-yellow-100 text-yellow-800 rounded-lg"
            >
              <p className="flex items-center">
                <AlertCircle className="mr-2" />
                Hint: The first operation is {appliedOperations[0]}
              </p>
            </motion.div>
          )}

          {isCorrect !== null && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`mt-6 p-4 rounded-lg text-center ${
                isCorrect
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isCorrect ? (
                <p className="flex items-center justify-center">
                  <ThumbsUp className="mr-2" />
                  Correct! Great job!
                </p>
              ) : (
                <p className="flex items-center justify-center">
                  <AlertCircle className="mr-2" />
                  Oops! That's not right. Try again!
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

const root = ReactDom.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
