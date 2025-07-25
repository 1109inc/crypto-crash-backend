const { getCurrentMultiplier } = require('../utils/gameEngine');
const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const Bet = require('../models/Bet');
const { getCryptoPrices } = require('../utils/cryptoPrice');

router.post('/', async (req, res) => {
  const { username, roundNumber } = req.body;

  console.log(`🔍 Checking bet for ${username} in round ${roundNumber}`);

  if (!username || !roundNumber) {
    return res.status(400).json({ error: 'Missing username or roundNumber' });
  }

  try {
    const bet = await Bet.findOne({ username, roundNumber, cashedOut: false });
    if (!bet) {
      console.log('❌ No bet found in DB with that round and username');
      return res.status(404).json({ error: 'No active bet found for this player and round' });
    }

    const currentMultiplier = getCurrentMultiplier(); // ✅ Moved here
    console.log(`💰 Using live multiplier: ${currentMultiplier}`);

    const payoutCrypto = bet.cryptoAmount * currentMultiplier;
    const prices = await getCryptoPrices();
    const usdValue = payoutCrypto * prices[bet.currency];

    // Update player wallet
    const player = await Player.findOne({ username });
    player.wallet[bet.currency] += payoutCrypto;
    await player.save();

    // Update bet
    bet.cashedOut = true;
    bet.multiplierAtCashout = currentMultiplier;
    await bet.save();

    res.json({
      message: '✅ Cashout successful',
      payout: {
        crypto: payoutCrypto.toFixed(8),
        usd: usdValue.toFixed(2),
        multiplier: currentMultiplier
      }
    });

  } catch (err) {
    console.error('❌ Cashout error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
