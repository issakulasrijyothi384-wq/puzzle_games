let selectedImage = "";
let gridSize;
let pieceSize;
let dragged = null;
let timerInterval;
let seconds = 0;
let moves = 0;

let coins = parseInt(localStorage.getItem("coins")) || 0;
let bestMoves = localStorage.getItem("bestMoves");

document.getElementById("coins").innerText = coins;
document.getElementById("bestMoves").innerText = bestMoves || "--";

document.getElementById("imageUpload").addEventListener("change", function (e) {
  const reader = new FileReader();
  reader.onload = function (event) {
    selectedImage = event.target.result;
    document.getElementById("previewImage").src = selectedImage;
    document.getElementById("previewImage").style.display = "block";
  };
  reader.readAsDataURL(e.target.files[0]);
});

function createPuzzle() {
  if (!selectedImage) {
    alert("Upload image first!");
    return;
  }

  resetGame();

  gridSize = parseInt(document.getElementById("difficulty").value);
  const shape = document.getElementById("shape").value;

  const container = document.getElementById("puzzleContainer");
  container.innerHTML = "";
  container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

  pieceSize = 450 / gridSize;

  let pieces = [];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {

      const piece = document.createElement("div");
      piece.className = "piece " + shape;
      piece.draggable = true;

      piece.style.width = pieceSize + "px";
      piece.style.height = pieceSize + "px";
      piece.style.backgroundImage = `url(${selectedImage})`;
      piece.style.backgroundSize = `450px 450px`;
      piece.style.backgroundPosition =
        `-${col * pieceSize}px -${row * pieceSize}px`;

      piece.dataset.correct = row * gridSize + col;

      piece.addEventListener("dragstart", () => dragged = piece);
      piece.addEventListener("dragover", e => e.preventDefault());
      piece.addEventListener("drop", drop);

      pieces.push(piece);
    }
  }

  shuffleArray(pieces);
  pieces.forEach(p => container.appendChild(p));

  startTimer();
}

function drop() {
  if (!dragged) return;

  let tempBg = this.style.backgroundPosition;
  let tempCorrect = this.dataset.correct;

  this.style.backgroundPosition = dragged.style.backgroundPosition;
  this.dataset.correct = dragged.dataset.correct;

  dragged.style.backgroundPosition = tempBg;
  dragged.dataset.correct = tempCorrect;

  moves++;
  document.getElementById("moves").innerText = moves;
  document.getElementById("moveSound").play();

  checkWin();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startTimer() {
  seconds = 0;
  document.getElementById("timer").innerText = seconds;

  timerInterval = setInterval(() => {
    seconds++;
    document.getElementById("timer").innerText = seconds;
  }, 1000);
}

function checkWin() {
  const pieces = document.getElementById("puzzleContainer").children;

  for (let i = 0; i < pieces.length; i++) {
    if (pieces[i].dataset.correct != i) return;
  }

  clearInterval(timerInterval);

  coins += 10;
  localStorage.setItem("coins", coins);
  document.getElementById("coins").innerText = coins;

  if (!bestMoves || moves < bestMoves) {
    bestMoves = moves;
    localStorage.setItem("bestMoves", bestMoves);
    document.getElementById("bestMoves").innerText = bestMoves;
  }

  document.getElementById("winSound").play();

  document.getElementById("message").innerHTML =
    "🎉 Yayyyy! You Won! 🪙 +10 Gold Coins 💖";

  document.getElementById("nextBtn").style.display = "inline-block";
}

function resetGame() {
  clearInterval(timerInterval);
  seconds = 0;
  moves = 0;
  dragged = null;

  document.getElementById("timer").innerText = 0;
  document.getElementById("moves").innerText = 0;
  document.getElementById("message").innerText = "";
  document.getElementById("puzzleContainer").innerHTML = "";
}

function nextGame() {
  resetGame();
  document.getElementById("previewImage").style.display = "none";
  selectedImage = "";
  document.getElementById("imageUpload").value = "";
  document.getElementById("nextBtn").style.display = "none";
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}
