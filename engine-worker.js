// Stockfish.js worker wrapper. The matching WASM file is fetched from jsDelivr.
const STOCKFISH_BASE = "https://cdn.jsdelivr.net/npm/stockfish@19.0.1/bin/";
self.Module = {
  locateFile(path) {
    return STOCKFISH_BASE + path;
  }
};
importScripts(STOCKFISH_BASE + "stockfish-19-lite-single.js");