// routes/bet.js

const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const Bet = require('../models/Bet');
const { getCryptoPrices } = require('../utils/cryptoPrice');
const { getCurrentRoundNumber } = require('../utils/gameEngine'); // ✅ Import

router.post('/', async (req, res) => {
  const { username, usdAmount, currency } = req.body;

  if (!username || !usdAmount || !currency) {
    return res.status(400).json({ error: 'Missing username, usdAmount, or currency' });
  }

  if (!['BTC', 'ETH'].includes(currency)) {
    return res.status(400).json({ error: 'Currency must be BTC or ETH' });
  }

  try {
    const player = await Player.findOne({ username });
    if (!player) return res.status(404).json({ error: 'Player not found' });

    const prices = await getCryptoPrices();
    const cryptoPrice = prices[currency];
    const cryptoAmount = usdAmount / cryptoPrice;

    // Check if player has enough balance
    if (player.wallet[currency] < cryptoAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Deduct from wallet
    player.wallet[currency] -= cryptoAmount;
    await player.save();

    // ✅ Get correct live round
    const roundNumber = getCurrentRoundNumber();

    // Save bet
    const bet = new Bet({
      username,
      usdAmount,
      cryptoAmount,
      currency,
      roundNumber
    });
    await bet.save();

    console.log(`✅ Bet placed for ${username} in round ${roundNumber}`);

    res.json({
      message: '✅ Bet placed successfully',
      betId: bet._id,
      cryptoAmount,
      priceAtTime: cryptoPrice
    });
  } catch (err) {
    console.error('❌ Bet error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
