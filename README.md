# Chessbot – lokale Trainingspartie

Ein eigenständiges, offen sichtbares Übungsbrett. Du spielst Weiß, Stockfish spielt Schwarz.

## Starten
1. Lade das Repository über **Code → Download ZIP** herunter und entpacke es.
2. Installiere Python, falls es noch nicht vorhanden ist.
3. Öffne im Projektordner ein Terminal und starte: `python -m http.server 8000`
4. Öffne Microsoft Edge unter `http://localhost:8000`.
5. Beim ersten Start lädt der Browser Stockfish Lite (ungefähr 1,7 MB) und chess.js aus dem Internet.

## Spielen
- Klicke auf eine weiße Figur und danach auf das Zielfeld.
- Der Bot spielt automatisch Schwarz und denkt pro Zug ungefähr 3–8 Sekunden.
- Mit **Neue Partie** startest du neu.
- **Zug zurück** nimmt deinen letzten Zug und die Antwort des Bots zurück.
- **Brett drehen** ändert die Ansicht.

## Elo-Einstellung
Der Regler reicht von **400 bis 3000**.
- Ab 1320 nutzt der Bot Stockfish' UCI-Elo-Begrenzung.
- Unter 1320 nutzt er Stockfish' Skill-Level-Stufen als Näherung, weil UCI_Elo dort nicht verfügbar ist.
- Elo ist kein garantierter Messwert: Die tatsächliche Spielstärke hängt unter anderem von Bedenkzeit, Engine-Build und Gegner ab. Stockfish' Kalibrierung bezieht sich auf ein anderes Zeitkontroll-Setting.

## Technischer Hinweis
Die Schachregeln kommen aus [chess.js](https://github.com/jhlywa/chess.js). Die Engine ist [Stockfish.js 19.0.1](https://www.npmjs.com/package/stockfish), Lite Single-Threaded WebAssembly, lizenziert unter GPL-3.0. Der Worker lädt das passende Engine-Skript und die WASM-Datei von jsDelivr, daher ist eine Internetverbindung erforderlich.

Dies ist eine eigenständige Trainingsseite. Sie greift nicht auf fremde Schach-Websites zu und führt dort keine Züge aus. Nutze sie für eigene Übungen oder offene Bot-Partien, bei denen allen Beteiligten klar ist, dass ein Bot mitspielt.