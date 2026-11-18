# Chess Test Bot

A small Microsoft Edge extension project for configuring an openly used chess-training bot in a local or mutually agreed test environment.

## Scope

- This starter adds a settings popup only.
- It does not read chess positions from third-party websites, inject moves, or operate on live games.
- Use any future automatic-play feature only on your own test board or in a bot match where everyone knows a bot is playing.

## Settings

- Strength: approximate Stockfish skill setting (not a guaranteed Elo rating).
- Thinking delay: random delay range in seconds.

## Install in Edge

1. Open `edge://extensions`.
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select this project folder.

No engine is included yet; this is the settings-only starter.