const socket = io("https://crypto-crash-backend.onrender.com");// change this to your hosted backend later

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

  fetch('https://crypto-crash-backend.onrender.com/bet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, usdAmount, currency })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('response').textContent = JSON.stringify(data);
  });
}

function cashOut() {
  const username = document.getElementById('username').value;

  fetch('https://crypto-crash-backend.onrender.com/cashout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, roundNumber: currentRound })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('response').textContent = JSON.stringify(data);
  });
}
