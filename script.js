/*********************
 *  Background Slides
 ********************/
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;
const slideInterval = 5000;

function showSlide(index) {
  slides.forEach((slide) => slide.classList.remove("active"));
  slides[index].classList.add("active");
}

setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}, slideInterval);

showSlide(currentSlide);

/*********************
 *   Persistent Audio
 ********************/
const audioPlayer = document.getElementById("audio-player");
const playPauseBtn = document.getElementById("play-pause-btn");
const playIcon = document.getElementById("play-icon");
const pauseIcon = document.getElementById("pause-icon");
const songTitle = document.getElementById("song-title");
const artistName = document.getElementById("artist-name");
const galleryRoot = document.getElementById("moments-gallery");

const audioTrack = {
  title: "Purr",
  artist: "-by Priscilla Anastasia",
  src: "audio/track1.mp3"
};

const imageAssets = [
  "assets/slideshow-images/AlwaysLikeThis.jpg",
  "assets/slideshow-images/BestSeatInTheHouse.jpeg",
  "assets/slideshow-images/comfyheatingpad.JPG",
  "assets/slideshow-images/HerFavoriteSpot.jpg",
  "assets/slideshow-images/PrissAndHerChild.jpeg",
  "assets/slideshow-images/RememberWhen.jpg",
  "assets/slideshow-images/UsedToFitInMyHand.jpg",
  "assets/slideshow-images/vogueShot.JPG",
  "assets/slideshow-images/whyDoesSheLoveBoxes.JPG"
];

const videoAssets = [
  "assets/slideshow-videos/bestKindOfNeedy.MP4",
  "assets/slideshow-videos/bliss.mov",
  "assets/slideshow-videos/Shenanigans.MP4"
];

const sizePattern = ["large", "large", "medium", "medium", "medium"];

const captionOverrides = {
  AlwaysLikeThis: "Some habits are so completely hers that they feel timeless.",
  BestSeatInTheHouse: "She always seemed to know exactly where the best spot was.",
  comfyheatingpad: "She had a way of settling exactly where comfort lived.",
  HerFavoriteSpot: "Some places started to feel like hers the moment she chose them.",
  PrissAndHerChild: "A quiet little picture of the closeness she gave so easily.",
  RememberWhen: "The kind of moment that instantly brings everything back.",
  UsedToFitInMyHand: "A reminder of how long she has been loved, in every size and season.",
  vogueShot: "She could look completely at home and entirely iconic at the same time.",
  whyDoesSheLoveBoxes: "Because apparently every box was meant specifically for her.",
  bestKindOfNeedy: "She had her own gentle way of asking to be near you a little longer.",
  bliss: "One of those small, perfect moments where everything felt soft and right.",
  Shenanigans: "A little glimpse of the mischief that made her so unmistakably herself."
};

const titleOverrides = {
  BestSeatInTheHouse: "Best Seat In the House",
  vogueShot: "Vogue Shot",
  whyDoesSheLoveBoxes: "My box?"
};

const momentOverrides = {
  PrissAndHerChild: {
    size: "wide"
  },
  RememberWhen: {
    size: "wide"
  },
  HerFavoriteSpot: {
    size: "wide"
  }
};

function getFileStem(path) {
  const fileName = path.split("/").pop() || "";
  return fileName.replace(/\.[^.]+$/, "");
}

function humanizeStem(stem) {
  const withSpaces = stem
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();

  if (!withSpaces) {
    return "A small moment";
  }

  return withSpaces
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function buildCaption(stem, type) {
  if (captionOverrides[stem]) {
    return captionOverrides[stem];
  }

  if (type === "video") {
    return "A short moving moment, kept alongside the photos and her purr.";
  }

  return "One more quiet snapshot to revisit whenever it feels right.";
}

function shuffleArray(items) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function buildMoment(path, type, size) {
  const stem = getFileStem(path);
  const title = titleOverrides[stem] || humanizeStem(stem);
  const overrides = momentOverrides[stem] || {};

  return {
    type,
    title,
    caption: buildCaption(stem, type),
    src: path,
    alt: title,
    size: overrides.size || size
  };
}

function selectMediaMoments() {
  const selectedImages = shuffleArray(imageAssets)
    .slice(0, Math.min(4, imageAssets.length))
    .map((path, index) => buildMoment(path, "image", sizePattern[index] || "medium"));

  const selectedVideo = videoAssets.length > 0
    ? [buildMoment(shuffleArray(videoAssets)[0], "video", sizePattern[selectedImages.length] || "medium")]
    : [];

  return [...selectedImages, ...selectedVideo];
}

const mediaMoments = selectMediaMoments();

let isPlaying = false;

function resetIcons() {
  isPlaying = false;
  playIcon.classList.add("active");
  pauseIcon.classList.remove("active");
}

function loadAudioTrack() {
  songTitle.textContent = audioTrack.title;
  artistName.textContent = audioTrack.artist;
  audioPlayer.src = audioTrack.src;
  resetIcons();
}

function createMomentCard(moment) {
  const card = document.createElement("article");
  card.className = `moment-card${moment.size ? ` is-${moment.size}` : ""}`;

  let mediaElement;
  if (moment.type === "video") {
    mediaElement = document.createElement("video");
    mediaElement.src = moment.src;
    mediaElement.muted = true;
    mediaElement.loop = true;
    mediaElement.controls = true;
    mediaElement.playsInline = true;
    mediaElement.preload = "metadata";
    mediaElement.setAttribute("aria-label", moment.alt || moment.title);

    const playPromise = mediaElement.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  } else {
    mediaElement = document.createElement("img");
    mediaElement.src = moment.src;
    mediaElement.alt = moment.alt || moment.title;
    mediaElement.loading = "lazy";
    mediaElement.decoding = "async";
  }

  mediaElement.className = "moment-card-media";
  card.appendChild(mediaElement);

  const copy = document.createElement("div");
  copy.className = "moment-copy";

  const heading = document.createElement("h2");
  heading.textContent = moment.title;

  const body = document.createElement("p");
  body.textContent = moment.caption;

  copy.appendChild(heading);
  copy.appendChild(body);
  card.appendChild(copy);

  return card;
}

function renderGallery() {
  galleryRoot.textContent = "";
  mediaMoments.forEach((moment) => {
    galleryRoot.appendChild(createMomentCard(moment));
  });
}

document.body.addEventListener("touchstart", unmuteIfNeeded, { once: true });
document.body.addEventListener("click", unmuteIfNeeded, { once: true });

function unmuteIfNeeded() {
  if (audioPlayer.muted) {
    audioPlayer.muted = false;
  }
}

function togglePlayPause() {
  if (audioPlayer.muted) {
    audioPlayer.muted = false;
  }

  if (isPlaying) {
    audioPlayer.pause();
    resetIcons();
    return;
  }

  const playPromise = audioPlayer.play();
  if (playPromise && typeof playPromise.then === "function") {
    playPromise
      .then(() => {
        isPlaying = true;
        playIcon.classList.remove("active");
        pauseIcon.classList.add("active");
      })
      .catch(() => {
        resetIcons();
      });
    return;
  }

  isPlaying = true;
  playIcon.classList.remove("active");
  pauseIcon.classList.add("active");
}

playPauseBtn.addEventListener("click", togglePlayPause);

audioPlayer.addEventListener("ended", () => {
  audioPlayer.currentTime = 0;
  resetIcons();
});

audioPlayer.addEventListener("pause", () => {
  if (!audioPlayer.ended) {
    resetIcons();
  }
});

audioPlayer.addEventListener("play", () => {
  isPlaying = true;
  playIcon.classList.remove("active");
  pauseIcon.classList.add("active");
});

loadAudioTrack();
renderGallery();
