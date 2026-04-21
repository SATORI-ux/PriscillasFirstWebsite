/*********************
 *  Slideshow Logic
 ********************/
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;
const slideInterval = 5000; // 5 seconds

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove("active"));
  slides[index].classList.add("active");
}

// Auto-advance slides
setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}, slideInterval);

// Initialize the first slide
showSlide(currentSlide);

/*********************
 *   Music Player
 ********************/
const audioPlayer = document.getElementById("audio-player");

// Buttons
const playPauseBtn = document.getElementById("play-pause-btn");
const playIcon = document.getElementById("play-icon");
const pauseIcon = document.getElementById("pause-icon");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const seekSlider = document.getElementById("seek-slider");

// Example Track List (Local Files)
const tracks = [
  {
    title: "Her Purr",
    artist: "Priscilla Anastasia",
    src: "audio/track1.mp3"
  }
];

let currentTrackIndex = 0;
let isPlaying = false;

// Load first track
function loadTrack(index) {
  const track = tracks[index];
  document.getElementById("song-title").textContent = track.title;
  document.getElementById("artist-name").textContent = track.artist;
  audioPlayer.src = track.src;
  resetIcons();
}

// Initialize
loadTrack(currentTrackIndex);

// Attempt to unmute after first user interaction
document.body.addEventListener("touchstart", unmuteIfNeeded, { once: true });
document.body.addEventListener("click", unmuteIfNeeded, { once: true });

function unmuteIfNeeded() {
  // If the audio is muted, unmute it so it can play with sound
  if (audioPlayer.muted) {
    audioPlayer.muted = false;
  }
}

/********************
 *  Play/Pause Logic
 ********************/
function togglePlayPause() {
  // If user taps play, we can also unmute if needed
  if (audioPlayer.muted) {
    audioPlayer.muted = false;
  }

  if (isPlaying) {
    audioPlayer.pause();
    isPlaying = false;
    playIcon.classList.add("active");
    pauseIcon.classList.remove("active");
  } else {
    audioPlayer.play();
    isPlaying = true;
    playIcon.classList.remove("active");
    pauseIcon.classList.add("active");
  }
}

function resetIcons() {
  isPlaying = false;
  playIcon.classList.add("active");
  pauseIcon.classList.remove("active");
}

/****************************
 *   Button Event Listeners
 ***************************/
playPauseBtn.addEventListener("click", togglePlayPause);

nextBtn.addEventListener("click", () => {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack(currentTrackIndex);
  audioPlayer.play();
  isPlaying = true;
  playIcon.classList.remove("active");
  pauseIcon.classList.add("active");
});

prevBtn.addEventListener("click", () => {
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrackIndex);
  audioPlayer.play();
  isPlaying = true;
  playIcon.classList.remove("active");
  pauseIcon.classList.add("active");
});

/****************************
 *   Seek Slider Updates
 ***************************/
audioPlayer.addEventListener("loadedmetadata", () => {
  seekSlider.max = Math.floor(audioPlayer.duration);
});

audioPlayer.addEventListener("timeupdate", () => {
  seekSlider.value = Math.floor(audioPlayer.currentTime);
});

seekSlider.addEventListener("input", () => {
  audioPlayer.currentTime = seekSlider.value;
});

/**************************************
 *   Handle End of Track Automatically
 **************************************/
audioPlayer.addEventListener("ended", () => {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack(currentTrackIndex);
  audioPlayer.play();
  isPlaying = true;
  playIcon.classList.remove("active");
  pauseIcon.classList.add("active");
});

audioPlayer.addEventListener("pause", () => {
  if (!audioPlayer.ended) {
    isPlaying = false;
    playIcon.classList.add("active");
    pauseIcon.classList.remove("active");
  }
});
