import React, { useState, useEffect } from 'react';
import './AudioPlayer.css';

const AudioPlayer = () => {
    const [playlist, setPlaylist] = useState([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [audioRef, setAudioRef] = useState(null);
    const [currentTrackName, setCurrentTrackName] = useState("");

    useEffect(() => {
        const savedPlaylist = JSON.parse(localStorage.getItem('playlist'));
        if (savedPlaylist && savedPlaylist.length > 0) {
            setPlaylist(savedPlaylist);
            const lastPlayedIndex = parseInt(localStorage.getItem('currentTrackIndex'));
            const lastPlayedPosition = parseFloat(localStorage.getItem('currentTrackPosition'));
            if (!isNaN(lastPlayedIndex) && lastPlayedIndex < savedPlaylist.length) {
                setCurrentTrackIndex(lastPlayedIndex);
                setCurrentTrackName(savedPlaylist[lastPlayedIndex].name);
                if (!isNaN(lastPlayedPosition) && audioRef) {
                    audioRef.currentTime = lastPlayedPosition;
                    audioRef.play();
                }
            }
        }
    }, [audioRef]);


    const generateUniqueId = () => {
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    const handleFileUpload = (event) => {
        const files = event.target.files;
        const updatedPlaylist = [...playlist];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const url = URL.createObjectURL(file);
            const uniqueId = generateUniqueId();
            updatedPlaylist.push({ id: uniqueId, file, url, name: file.name });
        }

        setPlaylist(updatedPlaylist);
        localStorage.setItem('playlist', JSON.stringify(updatedPlaylist));
    };

    const removeTrack = (id) => {
        const updatedPlaylist = playlist.filter(track => track.id !== id);
        setPlaylist(updatedPlaylist);
        localStorage.setItem('playlist', JSON.stringify(updatedPlaylist));
    };

    const playNextTrack = () => {
        if (currentTrackIndex < playlist.length - 1) {
            setCurrentTrackIndex(currentTrackIndex + 1);
            setCurrentTrackName(playlist[currentTrackIndex + 1].name);
        } else {
            setCurrentTrackIndex(0); // Loop back to the first track
            setCurrentTrackName(playlist[0].name);
        }
    };

    const handleAudioEnded = () => {
        playNextTrack();
    };

    useEffect(() => {
        if (audioRef) {
            audioRef.addEventListener('ended', handleAudioEnded);
            return () => {
                audioRef.removeEventListener('ended', handleAudioEnded);
                localStorage.setItem('currentTrackPosition', audioRef.currentTime.toString());
                localStorage.setItem('currentTrackIndex', currentTrackIndex.toString());
            };
        }
    }, [audioRef, currentTrackIndex]);

    return (
        <div className="audio-player-container">
            <input type="file" accept="audio/*" onChange={handleFileUpload} multiple />
            <ul className="playlist">
                {playlist.map((track, index) => (
                    <li key={track.id} onClick={() => {
                        setCurrentTrackIndex(index);
                        setCurrentTrackName(track.name);
                    }}>
                        {track.name}
                        <button className="remove-button" onClick={(e) => { e.stopPropagation(); removeTrack(track.id); }}>Remove</button>
                    </li>
                ))}
            </ul>
            {playlist.length > 0 && (
                <div>
                    <h3>Now Playing: {currentTrackName}</h3>
                    <audio
                        ref={(ref) => setAudioRef(ref)}
                        controls
                        src={playlist[currentTrackIndex].url}
                    />
                </div>
            )}
        </div>
    );
};

export default AudioPlayer;