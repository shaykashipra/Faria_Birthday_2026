const photos = [
  { src: "assets/memory-02.jpg", caption: "With my constant." },
  { src: "assets/memory-05.jpg", caption: "Bright smiles, easy days." },
  { src: "assets/memory-03.jpg", caption: "With my constant..." },
  { src: "assets/memory-04.jpg", caption: "School-day chapter." },
  { src: "assets/memory-06.jpg", caption: "A soft old memory." },
  { src: "assets/memory-07.jpg", caption: "Two frames, one feeling." },
  { src: "assets/memory-01.jpg", caption: "A quiet moment saved." }
];

const mainPhoto = document.querySelector("#mainPhoto");
const photoCaption = document.querySelector("#photoCaption");
const thumbs = document.querySelector("#thumbs");
const toast = document.querySelector("#toast");
const modal = document.querySelector("#giftModal");
let photoIndex = 0;
let audioContext;
let musicTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function renderPhoto(index) {
  photoIndex = (index + photos.length) % photos.length;
  mainPhoto.src = photos[photoIndex].src;
  photoCaption.textContent = photos[photoIndex].caption;
  [...thumbs.children].forEach((button, i) => {
    button.classList.toggle("active", i === photoIndex);
  });
}

photos.forEach((photo, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute("aria-label", `Show memory ${index + 1}`);
  button.innerHTML = `<img src="${photo.src}" alt="">`;
  button.addEventListener("click", () => renderPhoto(index));
  thumbs.append(button);
});

document.querySelector("#prevPhoto").addEventListener("click", () => renderPhoto(photoIndex - 1));
document.querySelector("#nextPhoto").addEventListener("click", () => renderPhoto(photoIndex + 1));
renderPhoto(0);

function openGift() {
  document.body.classList.remove("party-burst");
  void document.body.offsetWidth;
  document.body.classList.add("party-open");
  document.body.classList.add("party-burst");
  document.querySelector("#party").scrollIntoView({ behavior: "smooth", block: "center" });
  showToast("Cake opened. Surprises unlocked.");
  window.setTimeout(() => document.body.classList.remove("party-burst"), 1300);
}

document.querySelector("#openGift").addEventListener("click", openGift);
document.querySelector("#phoneOpen").addEventListener("click", openGift);
document.querySelector("#cakeOpener").addEventListener("click", openGift);
document.querySelector("#closeModal").addEventListener("click", () => modal.close());
document.querySelector(".modal-link").addEventListener("click", () => modal.close());

document.querySelectorAll(".surprise-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelector(`#${card.dataset.target}`).scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

function playTone(freq, start, duration, gain = 0.04) {
  const oscillator = audioContext.createOscillator();
  const volume = audioContext.createGain();
  oscillator.frequency.value = freq;
  oscillator.type = "sine";
  volume.gain.setValueAtTime(0.0001, start);
  volume.gain.exponentialRampToValueAtTime(gain, start + 0.03);
  volume.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(volume);
  volume.connect(audioContext.destination);
  oscillator.start(start);
  oscillator.stop(start + duration);
}

function scheduleMelody() {
  if (!audioContext) return;
  const now = audioContext.currentTime;
  const notes = [392, 392, 440, 392, 523.25, 493.88, 392, 392, 440, 392, 587.33, 523.25];
  notes.forEach((note, index) => playTone(note, now + index * 0.28, 0.23));
}

document.querySelector("#musicToggle").addEventListener("click", async () => {
  if (document.body.classList.contains("music-on")) {
    document.body.classList.remove("music-on");
    window.clearInterval(musicTimer);
    return;
  }

  audioContext = audioContext || new AudioContext();
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }
  document.body.classList.add("music-on");
  scheduleMelody();
  musicTimer = window.setInterval(scheduleMelody, 3700);
});
