import { useRef, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import Player from "./components/PlayerSong";
import Song from "./components/Song";
import MusicSelectionForm from "./components/MusicSelectionForm";
import MoodSelectionForm from "./components/MoodSelectionForm";
import quoteqen from "./components/quotegen";
import "./index.css";

// Importing DATA
import data from "./components/data";
import Library from "./components/Library";
import Nav from "./components/Nav";
import { v4 as uuidv4 } from 'uuid';

function MusicPlayer({songs, setSongs}) {
  const { songName } = useParams();
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [libraryStatus, setLibraryStatus] = useState(false);
  const audioRef = useRef(null);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });

  // Modified useEffect to only run on initial mount and form navigation
  useEffect(() => {
    if (songName && !currentSong.initializedFromUrl) {
      const selectedSong = songs.find(
        song => song.name.toLowerCase() === decodeURIComponent(songName).toLowerCase()
      );
      if (selectedSong) {
        setCurrentSong({
          ...selectedSong,
          initializedFromUrl: true
        });
        if (audioRef.current) {
          audioRef.current.load();
        }
      }
    }
  }, [songName]); // Remove songs from dependency array

 


  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;
    const roundedCurrent = Math.round(current);
    const roundedDuration = Math.round(duration);
    const animation = Math.round((roundedCurrent / roundedDuration) * 100);
    setSongInfo({
      currentTime: current,
      duration,
      animationPercentage: animation,
    });
  };

  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
    if (isPlaying) audioRef.current.play();
  };

  return (
    <div>
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
      <Song currentSong={currentSong} />
      <Player
        id={songs.id}
        songs={songs}
        songInfo={songInfo}
        setSongInfo={setSongInfo}
        audioRef={audioRef}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        setSongs={setSongs}
      />
      <Library
        libraryStatus={libraryStatus}
        setLibraryStatus={setLibraryStatus}
        setSongs={setSongs}
        isPlaying={isPlaying}
        audioRef={audioRef}
        songs={songs}
        setCurrentSong={setCurrentSong}
      />
      <audio
        onLoadedMetadata={timeUpdateHandler}
        onTimeUpdate={timeUpdateHandler}
        src={currentSong.audio}
        ref={audioRef}
        onEnded={songEndHandler}
      ></audio>
    </div>
  );
}

function App() {

  const [songs,setSongs] = useState(data());
  useEffect(() => {
    fetch('https://sheets.googleapis.com/v4/spreadsheets/1l24dQHuELNHEGPEwrhxHnX9U4tQna_eO-AEmU79k4D4/values/工作表1?key=AIzaSyAtmwxjW4A6BFCEqNlQv_Zhthlvs8Zyd90')
      .then((res) => res.json()) // Parse the JSON response
      .then((data) => {
        const formattedData = data.values.slice(1).map((item) => { // Skip the header row
          return {
            name: item[1], // Song title
            cover: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(item[2])}&bgcolor=FFFFFF`, // QR code for the link
            artist: "TuneLab Edition", // You can modify this if you have artist data
            audio: item[2], // Audio link
            color: ["#205950", "#2ab3bf"], // Default colors, modify as needed
            id: uuidv4(), // Unique ID
            active: false, // Set to false by default
            mood: [item[0].toLowerCase()], // Mood, converted to lowercase
          };
        });
        setSongs(formattedData); // Store the formatted data in state
      })
      .catch((error) => console.error('Error fetching data:', error)); // Handle errors
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MoodSelectionForm />} />
        <Route path="/songs/:mood" element={<MusicSelectionForm songs={songs} />} />
        <Route path="/player/:songName" element={<MusicPlayer  songs={songs} setSongs={setSongs}/>} />
      </Routes>
    </Router>
  );
}

export default App;
