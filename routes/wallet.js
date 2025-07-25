// routes/wallet.js

const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const { getCryptoPrices } = require('../utils/cryptoPrice');

router.get('/:username', async (req, res) => {
  try {
    const player = await Player.findOne({ username: req.params.username });
    if (!player) return res.status(404).json({ error: 'Player not found' });

    const prices = await getCryptoPrices();

    const usdBalance = {
      BTC: (player.wallet.BTC * prices.BTC).toFixed(2),
      ETH: (player.wallet.ETH * prices.ETH).toFixed(2),
    };

    res.json({
      username: player.username,
      wallet: {
        crypto: player.wallet,
        usdEquivalent: usdBalance,
      }
    });
  } catch (err) {
    console.error('❌ Wallet fetch error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
