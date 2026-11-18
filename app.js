import { Chess } from "https://cdn.jsdelivr.net/npm/chess.js@1.4.0/+esm";

const game = new Chess();
const boardEl = document.querySelector("#board");
const statusEl = document.querySelector("#status");
const movesEl = document.querySelector("#moves");
const eloEl = document.querySelector("#elo");
const eloValue = document.querySelector("#eloValue");
const eloHint = document.querySelector("#eloHint");
const newGameButton = document.querySelector("#newGame");
const undoButton = document.querySelector("#undo");

let selected = null;
let flipped = false;
let thinking = false;
let engineReady = false;
let engineFailed = false;
let engine = null;
let pendingSearch = null;

const glyph = {
  wk: "♔", wq: "♕", wr: "♖", wb: "♗", wn: "♘", wp: "♙",
  bk: "♚", bq: "♛", br: "♜", bb: "♝", bn: "♞", bp: "♟"
};

function send(command) {
  if (engine) engine.postMessage(command);
}

function setStatus() {
  if (engineFailed) {
    statusEl.textContent = "Stockfish konnte nicht geladen werden. Prüfe deine Internetverbindung und lade die Seite neu.";
  } else if (!engineReady) {
    statusEl.textContent = "Stockfish wird geladen … (beim ersten Start kann es kurz dauern)";
  } else if (game.isCheckmate()) {
    statusEl.textContent = game.turn() === "w" ? "Schachmatt – der Bot gewinnt." : "Schachmatt – du gewinnst!";
  } else if (game.isDraw()) {
    statusEl.textContent = "Remis.";
  } else if (thinking || game.turn() === "b") {
    statusEl.textContent = "Bot denkt …";
  } else {
    statusEl.textContent = (game.isCheck() ? "Schach! " : "") + "Du bist am Zug.";
  }
}

function render() {
  boardEl.innerHTML = "";
  const files = flipped ? "hgfedcba" : "abcdefgh";
  const ranks = flipped ? "12345678" : "87654321";
  const legal = selected ? game.moves({ square: selected, verbose: true }) : [];

  for (const rank of ranks) {
    for (const file of files) {
      const square = file + rank;
      const piece = game.get(square);
      const el = document.createElement("button");
      el.className = "square " + ((files.indexOf(file) + ranks.indexOf(rank)) % 2 === 0 ? "light" : "dark");
      el.type = "button";
      el.setAttribute("role", "gridcell");
      el.setAttribute("aria-label", square);
      if (piece) el.textContent = glyph[piece.color + piece.type];
      if (square === selected) el.classList.add("selected");
      if (legal.some(move => move.to === square)) el.classList.add(piece ? "capture" : "legal");
      el.disabled = !engineReady || thinking || game.isGameOver() || game.turn() !== "w";
      el.addEventListener("click", () => onSquare(square));
      boardEl.append(el);
    }
  }

  const history = game.history();
  movesEl.innerHTML = "";
  for (let i = 0; i < history.length; i += 2) {
    const li = document.createElement("li");
    li.textContent = history[i] + (history[i + 1] ? "   " + history[i + 1] : "");
    movesEl.append(li);
  }

  newGameButton.disabled = thinking || !engineReady;
  undoButton.disabled = thinking || !engineReady || history.length === 0;
  eloEl.disabled = thinking;
  setStatus();
}

function onSquare(square) {
  if (!engineReady || thinking || game.isGameOver() || game.turn() !== "w") return;

  const piece = game.get(square);
  if (selected) {
    const move = game.moves({ square: selected, verbose: true }).find(item => item.to === square);
    if (move) {
      game.move({ from: selected, to: square, promotion: "q" });
      selected = null;
      render();
      botMove();
      return;
    }
  }

  selected = piece && piece.color === "w" ? square : null;
  render();
}

function updateEloText() {
  const elo = Number(eloEl.value);
  eloValue.value = elo + " Elo";
  eloValue.textContent = elo + " Elo";
  if (elo < 1320) {
    eloHint.textContent = "Unter 1320: Stockfish nutzt eine grobe Zuordnung seiner Skill-Level-Stufen. Der angezeigte Elo-Wert ist hier nur eine Näherung.";
  } else {
    eloHint.textContent = "Ab 1320: Stockfish nutzt seine UCI-Elo-Begrenzung. Die tatsächliche Spielstärke kann je nach Bedenkzeit und Partie abweichen.";
  }
}

function setEngineStrength(elo) {
  if (elo >= 1320) {
    send("setoption name UCI_LimitStrength value true");
    send("setoption name UCI_Elo value " + Math.min(3000, Math.max(1320, elo)));
  } else {
    const skill = Math.round(((elo - 400) / (1319 - 400)) * 20);
    send("setoption name UCI_LimitStrength value false");
    send("setoption name Skill Level value " + Math.min(20, Math.max(0, skill)));
  }
}

function botMove() {
  if (!engineReady || engineFailed || game.isGameOver() || game.turn() !== "b") return;

  thinking = true;
  render();

  const thinkTime = 3000 + Math.floor(Math.random() * 5001);
  pendingSearch = { fen: game.fen(), thinkTime };
  setEngineStrength(Number(eloEl.value));
  send("isready");
}

function handleEngineMessage(rawMessage) {
  const message = String(rawMessage).trim();

  if (message === "uciok") {
    send("setoption name Threads value 1");
    send("setoption name Hash value 16");
    send("isready");
    return;
  }

  if (message === "readyok") {
    engineReady = true;
    if (pendingSearch) {
      const search = pendingSearch;
      pendingSearch = null;
      send("position fen " + search.fen);
      send("go movetime " + search.thinkTime);
    } else {
      render();
    }
    return;
  }

  if (message.startsWith("bestmove ")) {
    if (!thinking) return;
    const match = message.match(/^bestmove\s+([a-h][1-8][a-h][1-8][qrbn]?)/);
    if (match && game.turn() === "b" && !game.isGameOver()) {
      const uci = match[1];
      try {
        game.move({
          from: uci.slice(0, 2),
          to: uci.slice(2, 4),
          promotion: uci.length > 4 ? uci[4] : "q"
        });
      } catch (error) {
        console.error("Stockfish lieferte einen ungültigen Zug:", error);
      }
    }
    thinking = false;
    render();
  }
}

function startEngine() {
  try {
    engine = new Worker("./engine-worker.js");
    engine.onmessage = event => handleEngineMessage(event.data);
    engine.onerror = () => {
      engineFailed = true;
      engineReady = false;
      thinking = false;
      render();
    };
    send("uci");
  } catch (error) {
    engineFailed = true;
    render();
  }
}

newGameButton.addEventListener("click", () => {
  if (thinking || !engineReady) return;
  game.reset();
  selected = null;
  send("ucinewgame");
  render();
});

undoButton.addEventListener("click", () => {
  if (thinking || !engineReady) return;
  if (game.history().length) {
    game.undo();
    if (game.turn() === "b") game.undo();
  }
  selected = null;
  send("ucinewgame");
  render();
});

document.querySelector("#flip").addEventListener("click", () => {
  flipped = !flipped;
  render();
});

eloEl.addEventListener("input", updateEloText);
updateEloText();
render();
startEngine();