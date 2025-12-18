# 🏥 Aayu AI – Compassionate Elder Care Platform

<div align="center">

![Aayu AI](https://img.shields.io/badge/Aayu%20AI-Compassionate%20Elder%20Care-blue?style=for-the-badge&logo=heart)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge&logo=mongodb)
![WebRTC](https://img.shields.io/badge/Calls-WebRTC-orange?style=for-the-badge&logo=webrtc)
![AI Powered](https://img.shields.io/badge/AI-Gemini%202.0-purple?style=for-the-badge&logo=google)

**“Because every elder deserves dignity, safety, and companionship.”** 💙

</div>

---

## 🌟 Project Vision

**Aayu AI** is a mission-driven eldercare platform designed to bridge the gap between  
👵👴 **a growing elderly population** and  
👨‍⚕️👩‍⚕️ **limited caregiving resources**, especially in India.

Inspired by **Baymax (Big Hero 6)**, Aayu AI acts as a **gentle, voice-first medical and emotional companion**, available 24/7.

---

## 🎯 Problem Statement – Senior Care & Medical Support

Senior citizens today face:

- 💊 **Medication non-adherence** due to complex schedules  
- 🚨 **Delayed emergency response** during falls or health crises  
- 😔 **Loneliness & isolation** impacting mental health  
- 📱 **Tech-phobia** caused by complex, unfriendly apps  
- 👩‍⚕️ **Shortage of trained caregivers**

---

## ✨ Our Solution – Aayu AI

Aayu AI is a **three-role ecosystem** built to ensure **continuous, affordable, and dignified elder care**.

---

## 👵 For Elders – Your AI Health Companion

- 🤖 **Baymax-inspired AI Assistant**
  - Voice-first interaction
  - Empathetic, caring responses
  - Ask questions like:
    - “Which medicine should I take now?”
    - “What is this tablet for?”

- 💊 **Smart Medicine Management**
  - 📸 Scan prescriptions or medicine strips
  - 🤖 AI extracts dosage & frequency
  - ⏰ Automatic reminders & refill alerts

- 🆘 **Emergency SOS**
  - One-tap SOS button
  - Real-time alerts to caregivers & family
  - Auto voice/video call during emergencies

- 🌱 **Virtual Wellness Garden**
  - Grow digital plants by:
    - Taking medicines on time
    - Drinking water 🥤
    - Meditating 🧘
  - Encourages healthy habits through gamification

- 🌍 **Multilingual & Accessible**
  - 12+ Indian languages 🇮🇳
  - Large text, high contrast UI
  - Voice input + text-to-speech

---

## 👨‍👩‍👧 For Caregivers – Peace of Mind

- 📊 Real-time elder monitoring
- 🚨 Instant SOS & health alerts
- 💬 Chat, 📞 voice & 📹 video calls (WebRTC)
- 🤖 AI-generated health summaries
- 📈 Medication adherence & activity tracking

---

## 🏥 For Organizations – Smart Coordination

- 🏢 Centralized dashboard
- ✅ Caregiver approval & management
- 🚨 SOS monitoring & response history
- 📋 Activity logs & elder wellness insights

---

## 🛠️ Technology Architecture

```text
Frontend (React + Vite + Tailwind)
        │
        ▼
Node.js + Express API
        │
        ├── MongoDB (Health & User Data)
        ├── Socket.io (Real-time SOS & Chat)
        ├── WebRTC (P2P Voice & Video)
        └── AI Layer (Gemini 2.0 / ChatGPT)
````

---

## ⚙️ Tech Stack

| Layer     | Technology                           |
| --------- | ------------------------------------ |
| Frontend  | React, Vite, Tailwind CSS, Shadcn UI |
| Backend   | Node.js, Express                     |
| Database  | MongoDB (Mongoose)                   |
| Real-Time | Socket.io                            |
| Calls     | WebRTC                               |
| AI        | Google Gemini 2.0 (Vision + Text)    |
| Hosting   | Railway                              |

---

## 🚀 Installation & Setup

### 🔧 Prerequisites

* Node.js (v18+)
* MongoDB (Local or Atlas)
* Openrouter API

### ⚡ Quick Start

```bash
git clone https://github.com/ScienceGear/Aayu-Ai.git
cd Aayu-Ai
npm install
npm run dev
```

### 🔐 Environment Variables (`.env`)

```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_key
VITE_API_URL=http://localhost:3000
OPENROUTER_API=
```

---

## 📂 Project Structure

```
Aayu-Ai/
├── server/          # Node.js + Express backend
│   ├── models/      # MongoDB schemas
│   ├── routes/      # APIs
│   └── index.js     # Server + Socket.io
├── src/             # React frontend
│   ├── components/
│   ├── pages/
│   ├── contexts/
│   └── lib/
├── public/          # Assets (icons, logos)
└── package.json
```

---

## 🔐 Security & Performance

* 🔒 **Privacy-first** WebRTC (P2P calls, no media storage)
* ⚡ **Sub-second SOS latency** using Socket.io
* ♿ **Accessibility-focused design**
* 🔠 Adjustable text size & themes (Dark / Light)

---

## 👥 Team

| Name                     | Role                              |
| ------------------------ | --------------------------------- |
| **Parth Patil**          | 👑 Team Lead                      |
| **Pranay Tanpure**       | 💻 Full Stack + Android Developer |
| **Amartya**              | 🎨 UI/UX Designer                 |
| **Prathamesh Gangawane** | 🔧 Backend & Database             |
| **Shrikant Gangras**     | Clock    |

---

## 🏆 Why Aayu AI Stands Out

* ❤️ Accesible and easy to **use**.
* 🎙️ **Voice-first**, less experience
* 🌱 **Gamified wellness**, not clinical pressure
* 🤖 **Emotion-aware AI**, not a robotic chatbot
* 🚑 **Real-time SOS**

---

<div align="center">

### 💙 Built with care and love

**For a safer, healthier, and happier elder life**

</div>
