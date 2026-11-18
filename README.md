# Chessbot – lokale Trainingspartie

Ein kleines, offen sichtbares Schach-Übungsbrett. Du spielst Weiß, der Bot spielt Schwarz.

## Benutzung
1. Öffne **index.html** in Microsoft Edge oder einem anderen aktuellen Browser. Wenn der Browser ES-Module beim direkten Öffnen blockiert, starte im Projektordner einen lokalen Server, z. B. mit `python -m http.server 8000`, und öffne `http://localhost:8000`.
2. Klicke auf eine weiße Figur und danach auf das Zielfeld.
3. Der Bot antwortet automatisch.
4. Stelle die ungefähre Spielstärke über den Regler ein. Stufen 1–10 sind keine garantierten Elo-Werte.
5. „Neue Partie“ startet neu; „Zug zurück“ nimmt deinen letzten Zug und die Bot-Antwort zurück.

## Hinweis
Dies ist eine eigenständige Trainingsseite. Sie liest keine fremden Webseiten aus und führt dort keine Züge aus. Nutze sie für eigene Übungen oder vereinbarte Bot-Partien, bei denen allen klar ist, dass ein Bot mitspielt.

Die Schachregeln kommen aus [chess.js](https://github.com/jhlywa/chess.js), das beim Öffnen über jsDelivr geladen wird. Daher ist eine Internetverbindung nötig.