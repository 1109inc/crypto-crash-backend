// scripts/seedPlayers.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Player = require('../models/Player');

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Optional: Clear existing players
    await Player.deleteMany();

    const players = [
      { username: 'alice', wallet: { BTC: 0.01, ETH: 0.5 } },
      { username: 'bob', wallet: { BTC: 0.02, ETH: 0.3 } },
      { username: 'charlie', wallet: { BTC: 0.005, ETH: 0.1 } }
    ];

    await Player.insertMany(players);
    console.log('✅ Sample players seeded.');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();
