const crypto = require('crypto');

let currentMultiplier = 1.0;
let crashPoint = 0;
let roundInProgress = false;
let io = null;
let currentRoundNumber = 1;

function generateCrashPoint(seed, roundNumber) {
  const hash = crypto.createHash('sha256').update(seed + roundNumber).digest('hex');
  const decimal = parseInt(hash.substring(0, 8), 16) / 0xffffffff;
  const crash = Math.max(1.0, Math.floor((1 / (1 - decimal)) * 100) / 100);
  return Math.min(crash, 120); // Cap at 120x
}

function startGameEngine(socketIO) {
  io = socketIO;
  runNextRound();
}

function runNextRound() {
  if (roundInProgress) return;

  roundInProgress = true;
  currentMultiplier = 1.0;

  const seed = crypto.randomBytes(16).toString('hex');
  crashPoint = generateCrashPoint(seed, currentRoundNumber);
  console.log(`🕹️ Round ${currentRoundNumber} started. Crash point: ${crashPoint}`);

  io.emit('round_start', { roundNumber: currentRoundNumber, crashPoint });

  const growthRate = 0.02;
  const startTime = Date.now();

  function updateMultiplier() {
    const elapsed = (Date.now() - startTime) / 1000;
    currentMultiplier = parseFloat((1 + elapsed * growthRate).toFixed(2));

    if (currentMultiplier >= crashPoint) {
      roundInProgress = false;
      io.emit('round_crash', { roundNumber: currentRoundNumber, crashPoint });
      console.log(`💥 Round ${currentRoundNumber} crashed at ${crashPoint}x`);
      currentRoundNumber++;

      // Wait 2 seconds before starting the next round
      setTimeout(runNextRound, 2000);
    } else {
      io.emit('multiplier_update', { multiplier: currentMultiplier });
      // console.log(`📈 Multiplier update: ${currentMultiplier}x`);
      setTimeout(updateMultiplier, 100); // Update every 100ms
    }
  }

  updateMultiplier();
}

function getCurrentMultiplier() {
  return currentMultiplier;
}

function getCurrentRoundNumber() {
  return currentRoundNumber;
}

module.exports = {
  startGameEngine,
  getCurrentMultiplier,
  getCurrentRoundNumber
};
