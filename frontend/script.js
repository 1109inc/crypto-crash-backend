const BASE_URL = "https://crypto-crash-backend.onrender.com";
const socket = io(BASE_URL); // Change to Render link when deploying

let currentRound = 1;
let multiplier = 1;

socket.on('round_start', (data) => {
  currentRound = data.roundNumber;
  document.getElementById('round').textContent = `Round: ${currentRound}`;
});

socket.on('multiplier_update', (data) => {
  multiplier = data.multiplier;
  document.getElementById('multiplier').textContent = `📈 Multiplier: ${multiplier}x`;
});

socket.on('round_crash', (data) => {
  document.getElementById('multiplier').textContent = `💥 Crashed at ${data.crashPoint}x`;
});

function placeBet() {
  const username = document.getElementById('username').value;
  const usdAmount = document.getElementById('usd').value;
  const currency = document.getElementById('currency').value;

  fetch(`${BASE_URL}/bet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, usdAmount, currency })
  })
    .then(res => res.json())
    .then(data => {
      const resDiv = document.getElementById('response');
      if (data.message) {
        resDiv.textContent = `✅ Bet placed: $${usdAmount} in ${currency}`;
      } else {
        resDiv.textContent = `❌ ${data.error || 'Failed to place bet'}`;
      }
    });
}

function cashOut() {
  const username = document.getElementById('username').value;

  fetch(`${BASE_URL}/cashout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, roundNumber: currentRound })
  })
    .then(res => res.json())
    .then(data => {
      const resDiv = document.getElementById('response');
      if (data.payout) {
        const { multiplier, usd, crypto } = data.payout;
        resDiv.textContent = `✅ Cashout at ${multiplier}x — $${usd} / ${crypto} crypto`;
      } else {
        resDiv.textContent = `❌ ${data.error || 'Cashout failed'}`;
      }
    });
}
function fetchWallet() {
  const walletUser = document.getElementById('walletUser').value;

  fetch(`${BASE_URL}/wallet/${walletUser}`)
    .then(res => res.json())
    .then(data => {
      const display = document.getElementById('walletDisplay');
      if (data.wallet) {
        display.textContent =
          `Username: ${data.username}\n` +
          `BTC: ${data.wallet.crypto.BTC} ($${data.wallet.usdEquivalent.BTC})\n` +
          `ETH: ${data.wallet.crypto.ETH} ($${data.wallet.usdEquivalent.ETH})`;
      } else {
        display.textContent = `❌ ${data.error || 'User not found'}`;
      }
    });
}

fetch(`${BASE_URL}/round`)
  .then(res => res.json())
  .then(data => {
    if (data.roundNumber) {
      currentRound = data.roundNumber;
      document.getElementById('round').textContent = `Round: ${currentRound}`;
    }
  });
