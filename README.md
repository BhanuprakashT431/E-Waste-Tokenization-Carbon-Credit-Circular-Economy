# ♻️ EcoChain Protocol — E-Waste Tokenization & Carbon Credit Platform

<div align="center">

![EcoChain Banner](https://img.shields.io/badge/EcoChain-Protocol-00FF66?style=for-the-badge&logo=ethereum&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?style=for-the-badge)

**A blockchain-powered ESG dashboard that tokenizes e-waste recycling into Carbon Credit Tokens (CCT)**

[🚀 Live Demo](#) · [📖 Architecture](#architecture) · [⚡ Quick Start](#quick-start)

</div>

---

## 🌍 Overview

EcoChain Protocol is a **multi-million dollar ESG dashboard** simulation that demonstrates how blockchain technology can incentivize responsible e-waste disposal. Users earn **Carbon Credit Tokens (CCT)** when their discarded electronics are verified and recycled by certified facilities.

### The Circular Economy Flow

```
Consumer → Registers Device → Gets Tracking Hash (NFT-style)
    ↓
Dispatch → Shipped to Certified Recycler
    ↓
Recycler → Verifies Shipment → Smart Contract Executes
    ↓
Consumer Wallet → +50 CCT Minted Automatically 🪙
```

---

## ✨ Features

### 🟢 Consumer Dashboard (Origin Node)
- **Animated Wallet Card** — Live CCT balance with smooth count-up animation, USD equivalent, CO₂ offset tracking
- **E-Waste Registration Form** — Device type selector (6 categories), weight input, real-time hash preview
- **Cryptographic Hash Minting** — Simulates on-chain NFT-style tracking hash generation
- **Active Ledger Table** — Full device history with animated status pills (Pending → In Transit → Extracted/Rewarded)
- **Dispatch Action** — Send registered devices to the Recycler queue

### 🔵 Certified Recycler Dashboard (Final Node)
- **Incoming Shipment Queue** — All In-Transit devices with real-time queue management
- **Smart Contract Execution** — Animated blockchain validation overlay on verification
- **Auto CCT Minting** — Wallet balance updates atomically after smart contract confirms
- **Processed History** — Immutable log of all verified & rewarded devices

### 🎨 UI/UX Excellence
- **Dark Mode** with neon green (`#00FF66`) and cyber-blue (`#00BFFF`) accents
- **Glassmorphism** cards with backdrop-blur and subtle gradient borders
- **Framer Motion** animations — page transitions, staggered lists, spring physics
- **Role Toggle** — Instantly switch between Consumer ↔ Recycler views
- **Toast Notifications** — Animated success toasts with progress bars
- **Responsive** — Tailwind grid layouts, mobile-friendly

---

## 🏗️ Architecture

```
src/
├── app/
│   ├── context/
│   │   └── AppContext.tsx      # Global React Context (mock blockchain state)
│   ├── components/
│   │   ├── WalletCard.tsx      # Animated CCT balance with count-up hook
│   │   ├── RegisterEWasteForm.tsx  # Device registration + hash minting
│   │   ├── LedgerTable.tsx     # E-waste tracking table with status pills
│   │   ├── RecyclerQueue.tsx   # Incoming queue + smart contract execution
│   │   ├── ConsumerDashboard.tsx   # Consumer view layout
│   │   ├── RecyclerDashboard.tsx   # Recycler view layout
│   │   ├── RoleToggle.tsx      # Animated Consumer ↔ Recycler switch
│   │   └── ToastContainer.tsx  # Animated toast notifications
│   ├── globals.css             # Design system: neon theme, glassmorphism, animations
│   ├── layout.tsx              # Root layout with AppProvider + SEO metadata
│   └── page.tsx                # Main page with header, dashboards, footer
```

### Global State (AppContext)

```typescript
interface AppState {
  walletBalance: number;       // CCT balance (increases by 50 on each extraction)
  walletAddress: string;       // Mock Ethereum wallet address
  ewasteLedger: EWasteItem[];  // All registered devices
  activeRole: 'consumer' | 'recycler';
  toasts: Toast[];             // Notification queue
  totalCO2Offset: number;      // Total CO₂ offset in kg
  totalItemsProcessed: number;
}
```

### Device Status Flow

```
Pending → In Transit → Extracted/Rewarded
  (Registered)  (Dispatched)  (Verified by Recycler)
```

---

## ⚡ Quick Start

```bash
# Clone the repo
git clone https://github.com/BhanuprakashT431/E-Waste-Tokenization-Carbon-Credit-Circular-Economy.git
cd E-Waste-Tokenization-Carbon-Credit-Circular-Economy

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Requirements
- Node.js 18+
- npm 9+

---

## 🔧 Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** (App Router) | React framework with SSG |
| **TypeScript 5** | Type-safe development |
| **Tailwind CSS v4** | Utility-first styling |
| **Framer Motion 12** | Animations & transitions |
| **Lucide React** | Premium icon library |
| **React Context API** | Mock blockchain state management |

---

## 🎮 Demo Walkthrough

1. **Consumer View** (default): See your 250 CCT balance and 2 pre-loaded devices
2. **Dispatch a device**: Click "Dispatch" on pending "iPhone 12" → moves to In Transit
3. **Switch to Recycler**: Click the toggle in the header
4. **Verify & Extract**: Click "Verify & Extract Metals" → watch the smart contract overlay
5. **See the magic**: Toast notification + wallet balance updates from 250 → 300 CCT
6. **Switch back to Consumer**: Balance counter animates to new value

---

## 📦 Supported Device Types

| Category | Typical Weight | Reward |
|---|---|---|
| 💻 Laptop / Notebook | 1.0 - 3.5 kg | 50 CCT |
| 📱 Smartphone | 0.1 - 0.3 kg | 50 CCT |
| 🔋 Battery Pack | 0.2 - 2.0 kg | 50 CCT |
| 🖥️ Desktop / Tower | 4.0 - 15 kg | 50 CCT |
| 📟 Tablet / iPad | 0.3 - 0.8 kg | 50 CCT |
| 🖧 Server Hardware | 5.0 - 30 kg | 50 CCT |

---

## 🌱 Environmental Impact

Every device processed offsets approximately **2.4 kg CO₂ per kg of e-waste** through:
- Recovery of precious metals (Au, Ag, Cu, Pd)
- Preventing toxic landfill leaching (Pb, Hg, Cd)
- Reducing need for virgin material mining

---

<div align="center">

Made with 💚 for a sustainable future | **EcoChain Protocol**

*Ethereum Mainnet · Block #21,847,392*

</div>
