
document.addEventListener('DOMContentLoaded', () => {
    // Player elements
    const audioPlayer = document.getElementById('audio-player');
    const cover = document.getElementById('cover');
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');

    // Controls
    const playBtn = document.getElementById('play');
    const pauseBtn = document.getElementById('pause');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');

    // Progress and Time
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');

    // Volume
    const volumeBar = document.getElementById('volume-bar');

    // Autoplay
    const autoplayCheckbox = document.getElementById('autoplay');

    // Playlist
    const musicList = document.getElementById('music-list');

    // Hardcoded playlist for static use
    const songs = [
        {
            title: 'Better',
            artist: 'Zayn',
            src: 'music/Better.mp3',
            cover: 'https://placehold.co/100x100/00ffe7/222?text=Better'
        },
        {
            title: 'Apt.',
            artist: 'ROSÉ, Bruno Mars',
            src: 'music/Apt.mp3',
            cover: 'https://placehold.co/100x100/1a2980/fff?text=Apt.'
        },
        {
            title:'Bang Bang',
            artist:'Vishal Shekhar',
            src: 'music/BangBang.mp3',
            cover: 'https://placehold.co/100x100/00ffe7/222?text=Bang+Bang'
        }
    ];
    let songIndex = 0;

    // --- Playlist Generation ---
    function generatePlaylist() {
        musicList.innerHTML = '';
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.textContent = song.title;
            li.dataset.index = index;
            musicList.appendChild(li);
        });
    }

    // --- Core Functions ---
    function loadSong(song) {
        songTitle.textContent = song.title || 'Unknown Title';
        songArtist.textContent = song.artist || 'Unknown Artist';
        cover.src = song.cover || 'https://placehold.co/100x100/00ffe7/222?text=🎵';
        audioPlayer.src = song.src;

        // Highlight active song in playlist
        const listItems = musicList.querySelectorAll('li');
        listItems.forEach(item => item.classList.remove('active'));
        if (listItems[songIndex]) {
            listItems[songIndex].classList.add('active');
        }
    }

    function playSong() {
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
        audioPlayer.play();
    }

    function pauseSong() {
        playBtn.style.display = 'inline-block';
        pauseBtn.style.display = 'none';
        audioPlayer.pause();
    }

    function prevSong() {
        songIndex--;
        if (songIndex < 0) {
            songIndex = songs.length - 1;
        }
        loadSong(songs[songIndex]);
        playSong();
    }

    function nextSong() {
        songIndex++;
        if (songIndex > songs.length - 1) {
            songIndex = 0;
        }
        loadSong(songs[songIndex]);
        playSong();
    }

    // --- UI Updates ---
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            progressBar.value = progressPercent;
            currentTimeEl.textContent = formatTime(currentTime);
        }
    }

    function setProgress() {
        const duration = audioPlayer.duration;
        if (duration) {
            audioPlayer.currentTime = (progressBar.value / 100) * duration;
        }
    }

    function setDuration() {
        if (audioPlayer.duration) {
            durationEl.textContent = formatTime(audioPlayer.duration);
        }
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // --- Event Listeners ---
    playBtn.addEventListener('click', playSong);
    pauseBtn.addEventListener('click', pauseSong);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);

    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', setDuration);
    audioPlayer.addEventListener('ended', () => {
        if (autoplayCheckbox.checked) {
            nextSong();
        } else {
            pauseSong(); // Reset UI to paused state
        }
    });

    progressBar.addEventListener('input', setProgress);

    volumeBar.addEventListener('input', (e) => (audioPlayer.volume = e.target.value));

    musicList.addEventListener('click', (e) => {
        if (e.target && e.target.matches('li')) {
            songIndex = parseInt(e.target.dataset.index, 10);
            loadSong(songs[songIndex]);
            playSong();
        }
    });

    // --- Initialization ---
    generatePlaylist();
    loadSong(songs[songIndex]);
});