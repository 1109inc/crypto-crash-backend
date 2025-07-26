// utils/cryptoPrice.js

const axios = require('axios');

let cachedPrices = null;
let lastFetchTime = 0;

async function getCryptoPrices() {
  const now = Date.now();

  // Use cache if within 30 seconds
  if (cachedPrices && (now - lastFetchTime < 30000)) {
    return cachedPrices;
  }

  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'bitcoin,ethereum',
        vs_currencies: 'usd',
      }
    });

    cachedPrices = {
      BTC: response.data.bitcoin.usd,
      ETH: response.data.ethereum.usd,
    };

    lastFetchTime = now;
    return cachedPrices;
  } catch (err) {
    console.error('❌ Failed to fetch crypto prices:', err.message);
    return cachedPrices || { BTC: 0, ETH: 0 };
  }
}

module.exports = { getCryptoPrices };
