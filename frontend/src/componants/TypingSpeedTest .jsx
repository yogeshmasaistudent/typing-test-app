import React, { useState, useEffect, useRef } from "react";

const sentences = [
  "The quick brown fox jumps over the lazy dog",
  "Pack my box with five dozen liquor jugs",
  "How vexingly quick daft zebras jump",
  "The five boxing wizards jump quickly",
  "Sphinx of black quartz, judge my vow",
];

const TypingSpeedTest = () => {
  const [currentSentence, setCurrentSentence] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [bestWpm, setBestWpm] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    getNewSentence();
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentSentence]);

  const getNewSentence = () => {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    setCurrentSentence(sentences[randomIndex]);
    setUserInput("");
    setStartTime(null);
    setWpm(0);
    setIsCompleted(false);
    setHasStarted(false);
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setUserInput(input);

    if (!hasStarted && input.length === 1) {
      setStartTime(Date.now());
      setHasStarted(true);
    }

    if (input === currentSentence) {
      const endTime = Date.now();
      const timeInMinutes = (endTime - startTime) / 60000;
      const words = currentSentence.split(" ").length;
      const calculatedWpm = Math.round(words / timeInMinutes);

      setWpm(calculatedWpm);
      setIsCompleted(true);

      if (calculatedWpm > bestWpm) {
        setBestWpm(calculatedWpm);
      }
    }
  };

  const calculateAccuracy = () => {
    if (userInput.length === 0) return 100;
    let correct = 0;
    const minLength = Math.min(userInput.length, currentSentence.length);

    for (let i = 0; i < minLength; i++) {
      if (userInput[i] === currentSentence[i]) correct++;
    }

    return Math.round((correct / minLength) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Speed Typing Test
            </h1>
            {bestWpm > 0 && (
              <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-500 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L10 6.477 6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold text-yellow-800">
                  Best: {bestWpm} WPM
                </span>
              </div>
            )}
          </div>

          {/* Sentence Display */}
          <div className="bg-gray-50 p-6 rounded-xl mb-6 font-mono text-lg leading-relaxed">
            {currentSentence.split("").map((char, index) => (
              <span
                key={index}
                className={`transition-colors duration-200 ${
                  index < userInput.length
                    ? userInput[index] === char
                      ? "text-green-600"
                      : "text-red-600 bg-red-50"
                    : "text-gray-800"
                }`}
              >
                {char}
              </span>
            ))}
          </div>

          {/* Input Section */}
          <div className="relative mb-6">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              disabled={isCompleted}
              className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-200 font-mono text-lg disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="Start typing here..."
            />
            {!hasStarted && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">Start typing to begin</span>
              </div>
            )}
          </div>

          {/* Stats and Controls */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
              {hasStarted && !isCompleted && (
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <span className="text-blue-800 font-semibold">
                    Accuracy: {calculateAccuracy()}%
                  </span>
                </div>
              )}
              {wpm > 0 && (
                <div className="bg-green-50 px-4 py-2 rounded-lg">
                  <span className="text-green-800 font-semibold">
                    Speed: {wpm} WPM
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={getNewSentence}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 flex items-center gap-2 shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              New Sentence
            </button>
          </div>

          {/* Completion Message */}
          {isCompleted && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-green-800">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎉</span>
                <div>
                  <p className="font-semibold">Congratulations!</p>
                  <p>
                    You typed at {wpm} WPM with {calculateAccuracy()}% accuracy.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            How to Use
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 flex items-center justify-center bg-purple-100 rounded-full text-purple-600 font-semibold">
                1
              </span>
              Start typing the sentence shown above in the input field
            </li>
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 flex items-center justify-center bg-purple-100 rounded-full text-purple-600 font-semibold">
                2
              </span>
              Your typing speed will be calculated automatically
            </li>
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 flex items-center justify-center bg-purple-100 rounded-full text-purple-600 font-semibold">
                3
              </span>
              Click "New Sentence" to try again with a different sentence
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TypingSpeedTest;
