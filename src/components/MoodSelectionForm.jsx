// src/components/MoodSelectionForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function MoodSelectionForm() {
  const [mood, setMood] = useState("");
  const navigate = useNavigate();

  const moods = ["happy", "sad", "energetic", "calm"];

  const handleMoodChange = (e) => {
    setMood(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mood) {
      navigate(`/songs/${mood}`);
    }
  };

  const handleRandomMood = () => {
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    setMood(randomMood);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5">
      <h2 className="mb-5 text-2xl text-gray-800">Select Your Mood</h2>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="flex flex-col mb-5 space-y-2.5">
          {moods.map((m) => (
            <label key={m} className="flex items-center text-lg text-black cursor-pointer">
              <input
                type="radio"
                value={m}
                checked={mood === m}
                onChange={handleMoodChange}
                className="w-4 h-4 mr-2.5 border-2 border-purple-800 rounded-full appearance-none checked:bg-purple-800 cursor-pointer focus:outline-none"
              />
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </label>
          ))}
        </div>
        <div className="flex space-x-2">
          <button 
            type="button" 
            onClick={handleRandomMood}
            className="px-5 py-2.5 m-1 text-base text-white bg-purple-700 rounded hover:bg-purple-900 transition-colors duration-300"
          >
            Random
          </button>
          <button 
            type="submit"
            className="px-5 py-2.5 m-1 text-base text-white bg-purple-700 rounded hover:bg-purple-900 transition-colors duration-300"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}

export default MoodSelectionForm;