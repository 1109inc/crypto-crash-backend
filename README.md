# Crypto Crash Backend

A real-time backend for a cryptocurrency crash betting game. Built using **Node.js**, **Express**, **Socket.IO**, and **MongoDB**, this backend supports placing bets, cashing out with multipliers, real-time multiplier updates, and live game rounds.

---

## 🚀 Features

- Real-time multiplier updates via WebSocket
- Provably fair crash logic with secure hash-based randomness
- Cryptocurrency wallet (BTC/ETH) with live price conversion
- Place bets and cash out before the crash
- MongoDB storage for players and bets

---

## 🛠️ Tech Stack

- Node.js / Express
- MongoDB / Mongoose
- Socket.IO
- CoinGecko API for crypto prices
- Dotenv for config

---

## 📦 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/1109inc/crypto-crash-backend.git
cd crypto-crash-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` File

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

### 4. Run Server Locally

```bash
npm run dev   # uses nodemon
```

---

## 🔄 Switching Frontend to Local (For Testing)

If you're testing **locally** instead of using the hosted backend on Render:

1. Start the backend (`npm run dev`)
2. In the frontend `script.js`, replace BASE_URL like this:

```js
// Replace this:
const BASE_URL = "https://crypto-crash-backend.onrender.com";

// With:
const BASE_URL = "http://localhost:3000";
```

3. Open `index.html` from the frontend folder directly in your browser.

---

## 🥺 Deployment (Live Hosting)

- **Frontend** is deployed on **Netlify**: [Live Game Frontend](https://statuesque-fenglisu-55a0b9.netlify.app/)
- **Backend** is deployed on **Render**: [Live Backend API](https://crypto-crash-backend.onrender.com)

> Note: If you'd like to test from **Round 1**, you can request a redeployment of the backend.

---

## 🦖 API Endpoints

> ⚠️ **Important:** Place bets and cashouts within the same round. Watch server logs or listen to `round_start` events to track the current round.

### `GET /wallet/:username`

Fetch user's crypto and USD balance.

**Response:**

```json
{
  "username": "alice",
  "wallet": {
    "crypto": { "BTC": 0.01, "ETH": 0.5 },
    "usdEquivalent": { "BTC": "1163.62", "ETH": "1858.12" }
  }
}
```

---

### `POST /bet`

Place a bet before the crash round.

**Request Body:**

```json
{
  "username": "alice",
  "usdAmount": 10,
  "currency": "BTC"
}
```

**Response:**

```json
{
  "message": "✅ Bet placed successfully",
  "betId": "...",
  "cryptoAmount": 0.0000857,
  "priceAtTime": 116541
}
```

---

### `POST /cashout`

Cash out during the round before crash.

**Request Body:**

```json
{
  "username": "alice",
  "roundNumber": 4
}
```

**Response:**

```json
{
  "message": "✅ Cashout successful",
  "payout": {
    "crypto": "0.00011414",
    "usd": "13.30",
    "multiplier": 1.33
  }
}
```

---

## 🔌 WebSocket Events

### Client Receives:

- `round_start` – Round begins

```json
{ "roundNumber": 4, "crashPoint": 2.71 }
```

- `multiplier_update` – Live multiplier

```json
{ "multiplier": 1.45 }
```

- `round_crash` – Crash occurred

```json
{ "roundNumber": 4, "crashPoint": 2.71 }
```

---

## 🧰 Provably Fair Logic

Crash point is calculated using a SHA256 hash of a random seed and round number. Ensures fairness and reproducibility.

```js
function generateCrashPoint(seed, roundNumber) {
  const hash = crypto
    .createHash("sha256")
    .update(seed + roundNumber)
    .digest("hex");
  const decimal = parseInt(hash.substring(0, 8), 16) / 0xffffffff;
  const crash = Math.max(1.0, Math.floor((1 / (1 - decimal)) * 100) / 100);
  return Math.min(crash, 120);
}
```

---

## 🌱 Seeding Sample Players

Run the following to create sample players:

```bash
node scripts/seedPlayers.js
```

Creates 3 test users:

- `alice` – 0.01 BTC, 0.5 ETH
- `bob` – 0.005 BTC, 1 ETH
- `carol` – 0.02 BTC, 0.2 ETH

---

## 📬 Postman Collection

A Postman collection is included in the repo as `postman_collection.json` for testing all API endpoints.

---

## 📀 Basic WebSocket Frontend

A simple HTML frontend is included (see `index.html`) which connects to the backend via WebSocket, displays the live multiplier, and allows users to:

- View wallet
- Place bets
- Cash out

This is also deployed via Netlify.

---

## 📌 Future improvements

- Build UI with React for enhanced experience

---

## 👨‍💼 Author

**Pragat Sharma**

---
