# 💳 Rewards Optimizer

**Stop leaving money on the table. The smart way to pick the best credit card for every purchase.**

Tired of swiping the wrong credit card and missing out on rewards? Rewards Optimizer automatically recommends which card in your wallet earns you the most points, cash back, or miles — *before* you pay.

> No manual lookup. No second-guessing. Just pick the card your phone tells you to use.

---

## 🎯 The Problem

You own multiple credit cards, each with different rewards categories:
- Chase Sapphire Reserve: 3x on travel
- Amex Gold Card: 4x on dining & groceries
- Citi Double Cash: 2% flat cashback

But when you're at a restaurant, grocery store, or gas station, which card should you actually use? Most people default to one card and leave rewards on the table.

**Rewards Optimizer solves this.**

---

## ✨ Features

### ✅ Current (MVP)
- **📱 Add Your Cards** – Store the credit cards in your wallet (no sensitive data, just card types)
- **🔍 Find Best Card** – Enter a merchant name, get instant recommendation
- **💾 Local Storage** – Your card data stays on your phone, nowhere else
- **🎨 Beautiful UI** – Clean, fast, intuitive design
- **🔐 Private** – Works entirely offline with local storage

### 🚀 Coming Soon (Next Phases)
- **📍 Geolocation Magic** – Walk into a store → automatically get notified which card to use
- **🔔 Smart Notifications** – Passive recommendations while you shop (no manual input needed)
- **🧠 AI-Powered** – Claude AI reasons about which card is truly best for you
- **💰 Real Rewards Data** – Live sync of card benefits from issuers
- **📊 Savings Tracker** – See how much you've earned vs. if you used the wrong card

---

## 🏗️ How It Works

### Phase 1: Smart Recommendations (Current)
```
1. Add your cards to your wallet
2. About to make a purchase? Type the merchant name
3. Get instant recommendation with reasoning
4. Use that card, earn maximum rewards
```

### Phase 2: Passive Notifications (Coming)
```
1. You walk into a Starbucks
2. After a minute, your phone buzzes
3. "Use Amex Gold for 4x points here"
4. Tap to confirm, or swipe to dismiss
```

---

## 📱 Tech Stack

### Frontend
- **React Native** with Expo (TypeScript)
- **React Navigation** for tab-based UI
- **AsyncStorage** for local card data persistence
- **Axios** for API calls
- Works on iOS & Android

### Backend (Planned)
- **Spring Boot** (Java 21) – API server
- **PostgreSQL** – Card & user data
- **AWS/Railway** – Cloud hosting

### AI & Data
- **Anthropic Claude API** – Smart recommendations
- **CardAPI/RewardsCC** – Card rewards data sync
- **Google Places API** – Merchant geolocation & detection

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ 
- Git
- Expo Go app (on your phone)

### Installation

```bash
# Clone the repo
git clone https://github.com/rohitsrirammuniganti-p1/rewards-app.git
cd rewards-app

# Install dependencies
npm install
npx expo install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
npx expo install @react-native-async-storage/async-storage
npx expo install @react-navigation/bottom-tabs

# Start the dev server
npx expo start
```

### Running on Your Phone

1. Install **Expo Go** from the App Store or Play Store
2. Scan the QR code that appears in your terminal
3. App loads instantly on your phone

---

## 📖 Usage

### Add a Card
1. Tap the **Wallet** tab
2. Tap **+ Add Card**
3. Select a card from the catalog
4. Optionally give it a nickname (e.g., "Travel card")
5. Tap **Add Card**

### Get a Recommendation
1. Tap the **Recommend** tab
2. Type where you're shopping (e.g., "Whole Foods", "Starbucks", "Delta Airlines")
3. Tap **Find Best Card**
4. See which card earns the most rewards

### Edit or Delete a Card
1. In the **Wallet** tab, long-press a card
2. Choose **Edit Nickname** or **Delete Card**

---

## 🎨 Screenshots

```
Login Screen          Recommend Screen       Wallet Screen
┌─────────────┐      ┌─────────────┐        ┌─────────────┐
│     💳      │      │  🛍️ Shopp  │        │  My Wallet  │
│  Rewards    │      │  Where are  │        │             │
│ Optimizer   │      │  you shop?  │        │  + Add Card │
│             │      │  [Starbuck] │        │             │
│ [Log In]    │      │  [Find Best]│        │  [Chase]    │
│ [Try Demo]  │      │             │        │  [Amex]     │
│             │      │  Amex Gold  │        │  [Citi]     │
└─────────────┘      │  4x Dining  │        │             │
                     │  "4x points" │        │ [Log Out]   │
                     └─────────────┘        └─────────────┘
```

---

## 🧠 The Vision

**Problem:** People with multiple cards don't use them optimally. They default to one card, leaving thousands of dollars in unclaimed rewards annually.

**Solution:** Make it effortless. Push a notification at the right time, in the right place, with the right card recommendation. No thinking required.

**Market Opportunity:**
- 150M+ credit cardholders in the US alone
- Average person has 3-4 cards
- Estimated $30B+ in unclaimed rewards annually
- Competitors exist (MaxRewards, CardPointers) but lack the passive geolocation magic

**Differentiation:** Geolocation + AI-powered recommendations = passive, frictionless experience.

---

## 📊 Roadmap

| Phase | Timeline | Features | Status |
|-------|----------|----------|--------|
| **MVP** | Weeks 1-2 | Card storage, manual recommendations, mock data | ✅ Done |
| **AI Integration** | Week 3 | Claude API for smart reasoning | 🔄 In Progress |
| **Geolocation** | Weeks 4-5 | Location tracking, geofencing, merchant detection | 📋 Planned |
| **Push Notifications** | Week 6 | Passive recommendations via notifications | 📋 Planned |
| **Backend** | Weeks 7-8 | Spring Boot API, real user auth, database | 📋 Planned |
| **Real Data** | Week 9-10 | CardAPI integration, live rewards sync | 📋 Planned |
| **Launch** | Month 3 | iOS & Android App Store/Play Store release | 🎯 Target |

---

## 🔐 Privacy & Security

- **No card numbers stored** – Just card types (e.g., "Chase Sapphire Reserve")
- **No sensitive data** – Expiry dates, CVV, or full card numbers are never collected
- **Local-first** – Your data lives on your phone until you sync with a backend
- **GDPR compliant** – Privacy-first design from the start
- **Open source** – Transparency in how we handle your data

---

## 💰 Monetization (Future)

- **Freemium model** – Basic recommendations free, premium features paid
- **Affiliate commissions** – Earn when users apply for recommended cards
- **B2B partnerships** – License data to card issuers
- **Subscription tier** – Advanced analytics, spending insights, savings tracking

---

## 🤝 Contributing

This is an early-stage project. Contributions are welcome!

```bash
# Fork the repo
# Create a branch: git checkout -b feature/your-feature
# Commit: git commit -m "Add feature"
# Push: git push origin feature/your-feature
# Open a Pull Request
```

---

## 📧 Contact & Feedback

- **Email:** rohitsrirammuniganti@gmail.com
- **GitHub Issues:** Report bugs or request features
- **Twitter:** [@rohitsrirammun](https://twitter.com/rohitsrirammun) (if applicable)

---

## 📄 License

MIT License — feel free to use this code for personal or commercial projects.

---

## 🙏 Acknowledgments

- Built with **React Native** & **Expo**
- Powered by **Anthropic Claude** (coming soon)
- Card data from **CardAPI** (planned)
- UI inspired by modern fintech apps

---

## 💡 Questions?

This is an MVP. Things will change. Have ideas? Open an issue or reach out!

**Last updated:** October 2026  
**Author:** Rohit Sriram Muniganti  
**Status:** Early development, actively building 🚀
