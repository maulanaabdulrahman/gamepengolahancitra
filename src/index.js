import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./index.css";
import ReactDom from "react-dom/client";
import {
  AlertCircle,
  ThumbsUp,
  Timer,
  Star,
  Zap,
  Trophy,
  Volume2,
  VolumeX,
} from "lucide-react";

const operations = ["Grayscale", "Negative", "Brightness", "Blur", "Flip"];

const gameData = {
  level1: {
    originalImages: [
      "/img/level1/soal/1.jpg",
      "/img/level1/soal/2.jpg",
      "/img/level1/soal/3.jpg",
      "/img/level1/soal/4.jpg",
      "/img/level1/soal/5.jpg",
    ],
    processedImages: [
      "/img/level1/jawaban/1-ans.jpg",
      "/img/level1/jawaban/2-ans.jpg",
      "/img/level1/jawaban/3-ans.jpg",
      "/img/level1/jawaban/4-ans.jpg",
      "/img/level1/jawaban/5-ans.jpg",
    ],
    answers: [["Grayscale"], ["Negative"], ["Flip"], ["Blur"], ["Brightness"]],
    hints: [
      "Perhatikan perubahan warna ke abu-abu",
      "Lihat pembalikan warna gelap dan terang",
      "Perhatikan orientasi gambar",
      "Fokus pada tingkat kejelasan gambar",
      "Perhatikan perubahan kecerahan gambar",
    ],
  },
  level2: {
    originalImages: [
      "/img/level2/soal/1.jpg",
      "/img/level2/soal/2.jpg",
      "/img/level2/soal/3.jpg",
      "/img/level2/soal/4.jpg",
      "/img/level2/soal/5.jpg",
    ],
    processedImages1: [
      "/img/level2/jawaban/1-step1.jpg",
      "/img/level2/jawaban/2-step1.jpg",
      "/img/level2/jawaban/3-step1.jpg",
      "/img/level2/jawaban/4-step1.jpg",
      "/img/level2/jawaban/5-step1.jpg",
    ],
    processedImages2: [
      "/img/level2/jawaban/1-step2.jpg",
      "/img/level2/jawaban/2-step2.jpg",
      "/img/level2/jawaban/3-step2.jpg",
      "/img/level2/jawaban/4-step2.jpg",
      "/img/level2/jawaban/5-step2.jpg",
    ],
    answers: [
      ["Grayscale", "Negative"],
      ["Negative", "Blur"],
      ["Flip", "Brightness"],
      ["Blur", "Grayscale"],
      ["Brightness", "Flip"],
    ],
    hints: [
      "Operasi pertama mengubah ke abu-abu, kedua membalik warna",
      "Pertama inversi warna, kedua membuat blur",
      "Pertama flip gambar, kedua mengatur kecerahan",
      "Pertama mengaburkan, kedua mengubah ke abu-abu",
      "Pertama mengatur kecerahan, kedua membalik orientasi",
    ],
  },
};

function App() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userGuess, setUserGuess] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const backgroundMusicRef = useRef(new Audio("music/game-music.mp3"));

  useEffect(() => {
    const music = backgroundMusicRef.current;
    music.loop = true;

    return () => {
      music.play().catch((e) => console.log("Audio autoplay prevented"));
      music.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    const music = backgroundMusicRef.current;
    if (isMuted) {
      music.pause();
    } else {
      music.play().catch((e) => console.log("Audio autoplay prevented"));
    }
  }, [isMuted]);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver && !gameWon) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver, gameWon]);

  useEffect(() => {
    startNewRound();
  }, [level]);

  const startNewRound = () => {
    const randomIndex = Math.floor(Math.random() * 5);
    setCurrentImageIndex(randomIndex);
    setUserGuess([]);
    setShowHint(false);
    setTimeLeft(30);
    setIsCorrect(null);
  };

  const handleGuess = () => {
    const currentAnswers =
      level === 1
        ? gameData.level1.answers[currentImageIndex]
        : gameData.level2.answers[currentImageIndex];

    const correct =
      JSON.stringify(userGuess) === JSON.stringify(currentAnswers);
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 10 * level);
      if (level === 1) {
        setTimeout(() => {
          setLevel(2);
        }, 1500);
      } else {
        setTimeout(() => {
          setGameWon(true);
        }, 1500);
      }
    } else {
      setScore(score - 1);
    }
  };

  const showHintHandler = () => {
    setShowHint(true);
    setScore(score - 2);
  };

  if (gameWon) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
        <div className="max-w-lg w-full p-6 bg-white rounded-lg shadow-xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Trophy className="w-20 h-20 mx-auto text-yellow-500 mb-4" />
            <h1 className="text-4xl font-bold text-purple-600">Selamat!</h1>
            <p className="text-2xl mt-4 text-gray-700">
              Anda telah menyelesaikan permainan!
            </p>
            <p className="text-xl mt-2 text-gray-600">Skor Akhir: {score}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition"
            >
              Main Lagi
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
        <div className="max-w-lg w-full p-6 bg-white rounded-lg shadow-xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <h1 className="text-4xl font-bold text-purple-600">
              Permainan Selesai!
            </h1>
            <p className="text-2xl mt-4 text-gray-700">
              Skor akhir Anda: {score}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition"
            >
              Main Lagi
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentLevelData = level === 1 ? gameData.level1 : gameData.level2;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-center text-3xl sm:text-5xl font-bold text-purple-600 mb-4 sm:mb-8">
          Permainan Pengolahan Citra
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          {/* Header dengan skor dan waktu */}
          <div className="flex flex-wrap justify-between items-center mb-4 sm:mb-8 gap-4">
            <div className="flex items-center">
              <Star className="text-yellow-500 w-6 h-6 sm:w-8 sm:h-8 mr-2" />
              <span className="text-lg sm:text-xl font-semibold text-gray-800">
                Level: {level}
              </span>
            </div>
            <div className="flex items-center">
              <Zap className="text-blue-500 w-6 h-6 sm:w-8 sm:h-8 mr-2" />
              <span className="text-lg sm:text-xl font-semibold text-gray-800">
                Skor: {score}
              </span>
            </div>
            <div className="flex items-center">
              <Timer className="text-red-500 w-6 h-6 sm:w-8 sm:h-8 mr-2" />
              <span className="text-lg sm:text-xl font-semibold text-gray-800">
                Waktu: {timeLeft} detik
              </span>
            </div>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6 text-gray-600" />
              ) : (
                <Volume2 className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>

          {/* Grid gambar */}
          <div
            className={`grid ${
              level === 1
                ? "grid-cols-1 sm:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            } gap-4 sm:gap-6 mb-6`}
          >
            <div className="relative">
              <img
                src={currentLevelData.originalImages[currentImageIndex]}
                alt="Original"
                className="w-full h-48 sm:h-64 object-cover rounded-lg shadow-md"
              />
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg">
                Gambar Asli
              </div>
            </div>

            <div className="relative">
              <img
                src={
                  level === 1
                    ? currentLevelData.processedImages[currentImageIndex]
                    : currentLevelData.processedImages1[currentImageIndex]
                }
                alt="Processed"
                className="w-full h-48 sm:h-64 object-cover rounded-lg shadow-md"
              />
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg">
                {level === 1 ? "Hasil" : "Hasil 1"}
              </div>
            </div>

            {level === 2 && (
              <div className="relative">
                <img
                  src={currentLevelData.processedImages2[currentImageIndex]}
                  alt="Final Processed"
                  className="w-full h-48 sm:h-64 object-cover rounded-lg shadow-md"
                />
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg">
                  Hasil 2
                </div>
              </div>
            )}
          </div>

          {/* Dropdown section */}
          <div className="mb-6">
            <p className="text-lg font-semibold text-gray-700 mb-4">
              Tebak operasi yang diterapkan:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array(level)
                .fill()
                .map((_, index) => (
                  <div key={index} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {level === 2
                        ? `Operasi untuk Hasil ${index + 1}`
                        : "Operasi"}
                    </label>
                    <select
                      value={userGuess[index] || ""}
                      onChange={(e) => {
                        const newGuess = [...userGuess];
                        newGuess[index] = e.target.value;
                        setUserGuess(newGuess);
                      }}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option disabled value="">
                        Pilih operasi
                      </option>
                      {operations.map((op) => (
                        <option key={op} value={op}>
                          {op}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              onClick={handleGuess}
              className="w-full sm:w-auto px-6 py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition"
            >
              Kirim Jawaban
            </button>
            <button
              onClick={showHintHandler}
              disabled={showHint}
              className="w-full sm:w-auto px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
            >
              Tampilkan Petunjuk (-2 poin)
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
                Petunjuk: {currentLevelData.hints[currentImageIndex]}
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
                  Benar!{" "}
                  {level === 1
                    ? "Lanjut ke Level 2!"
                    : "Anda telah menyelesaikan permainan!"}
                </p>
              ) : (
                <p className="flex items-center justify-center">
                  <AlertCircle className="mr-2" />
                  Ups! Jawaban salah. Coba lagi! (-1 poin)
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
