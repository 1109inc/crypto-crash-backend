const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  username: { type: String, required: true },
  usdAmount: { type: Number, required: true },
  cryptoAmount: { type: Number, required: true },
  currency: { type: String, enum: ['BTC', 'ETH'], required: true },
  roundNumber: { type: Number, required: true },
  cashedOut: { type: Boolean, default: false },
  multiplierAtCashout: { type: Number, default: null },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bet', betSchema);
