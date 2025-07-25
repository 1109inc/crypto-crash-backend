// utils/gameEngine.js

const crypto = require('crypto');

let currentMultiplier = 1.0;
let crashPoint = 0;
let roundInProgress = false;
let interval = null;
let io = null;

function generateCrashPoint(seed, roundNumber) {
  const hash = crypto.createHash('sha256').update(seed + roundNumber).digest('hex');
  const decimal = parseInt(hash.substring(0, 8), 16) / 0xffffffff;
  const crash = Math.max(1.0, Math.floor((1 / (1 - decimal)) * 100) / 100);
  return Math.min(crash, 120); // Cap at 120x
}

function startGameEngine(socketIO) {
  io = socketIO;
  let roundNumber = 1;

  setInterval(() => {
    if (roundInProgress) return;

    // Start new round
    roundInProgress = true;
    currentMultiplier = 1.0;

    const seed = crypto.randomBytes(16).toString('hex');
    crashPoint = generateCrashPoint(seed, roundNumber);
    console.log(`🕹️ Round ${roundNumber} started. Crash point: ${crashPoint}`);

    io.emit('round_start', { roundNumber, crashPoint });

    const growthRate = 0.02;
    const startTime = Date.now();

    interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      currentMultiplier = parseFloat((1 + elapsed * growthRate).toFixed(2));

      if (currentMultiplier >= crashPoint) {
        clearInterval(interval);
        roundInProgress = false;
        io.emit('round_crash', { roundNumber, crashPoint });
        console.log(`💥 Round ${roundNumber} crashed at ${crashPoint}x`);
        roundNumber++;
        return;
      }

      io.emit('multiplier_update', { multiplier: currentMultiplier });
    }, 100); // Update every 100ms
  }, 10000); // New round every 10s
}

module.exports = { startGameEngine };
