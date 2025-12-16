# Aayu AI (Aayu Connect Assist) 🏥🤖👴👵

> **Your Personal AI Health Companion** - Bridging the gap between elders and caregivers with intelligent health monitoring, multilingual AI assistance, and compassionate care coordination.

## 🌟 About

**Aayu AI** is a comprehensive elder care platform designed to make technology accessible and helpful for the elderly. It acts as a bridge between elders, their families (caregivers), and medical organizations.

With a **Baymax-inspired AI assistant**, Aayu AI speaks **10+ Indian languages**, making it easy for elders to interact using just their voice. It manages medicines, tracks health vitals, enables video calls with caregivers, and even provides a virtual garden for relaxation.

## ✨ Key Features

- **🤖 AI Health Assistant**: A voice-first, multilingual AI companion that understands health needs and speaks local languages (Hindi, Tamil, Telugu, etc.).
- **💊 Smart Medicine Management**: Intelligent reminders, prescription scanning with AI, and inventory tracking.
- **❤️ Health Monitoring**: Easy interfaces for tracking vitals (blood pressure, sugar, etc.) and mood.
- **🆘 Emergency SOS**: One-tap emergency alerts to family members and caregivers.
- **🌳 Virtual Garden**: A gamified, therapeutic space for meditation and mindfulness to reduce loneliness.
- **📹 Caregiver Connect**: Seamless video calls and chat between elders and their assigned caregivers.
- **🛡️ Multi-Role System**: Dedicated dashboards for **Elders**, **Caregivers**, and **Organizations**.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Shadcn UI, Lucide React
- **Backend**: Node.js, Express, Socket.io (for real-time chat & calls)
- **Database**: MongoDB (Mongoose)
- **AI Integration**: Google Gemini AI (Generative AI)
- **Package Manager**: Bun (compatible with npm)

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Bun](https://bun.sh/) (Recommended) or npm
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URL)

### 📥 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/aayu-connect-assist.git
   cd aayu-connect-assist-main
   ```

2. **Install Dependencies**
   Since this project uses a merged dependency structure (frontend and backend deps are in the root):
   ```bash
   npm install
   # or
   bun install
   ```

### ⚙️ Environment Configuration

Create a `.env` file in the root directory. You can copy the structure below:

```env
# Server Configuration
PORT=3000

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/aayu-db

# AI API Key (Google Gemini)
GEMINI_API_KEY=your_gemini_api_key_here

# JWT Secret (for authentication security)
JWT_SECRET=your_super_secret_jwt_key

# Optional: Frontend API URL (if running separately)
VITE_API_URL=http://localhost:3000
```

### 🏃‍♂️ Running the App

This project is set up to run both the specific backend server and the React frontend concurrently.

**Development Mode:**
Runs the backend with `nodemon` (auto-restart) and frontend with `vite`.
```bash
npm run dev
```
- Frontend will be available at: `http://localhost:8080` (or `http://localhost:5173 / 5174` depending on availability)
- Backend will be running at: `http://localhost:3000`

**Production Build:**
Builds the frontend and runs the server which serves the static files.
```bash
npm start
```

## 📂 Project Structure

```
├── public/              # Static assets
├── server/              # Backend Node/Express code
│   ├── models/          # Mongoose Database Models
│   ├── routes/          # API Routes (auth, users, care, etc.)
│   └── index.js         # Server entry point
├── src/                 # Frontend React code
│   ├── components/      # Reusable UI components
│   ├── pages/           # Application pages (Landing, Dashboard, etc.)
│   ├── lib/             # Utilities and helpers
│   └── App.tsx          # Main React component
├── package.json         # Project dependencies and scripts
└── vite.config.ts       # Vite configuration
```

## ☁️ Deployment

This is a **monorepo-style** Full Stack application (MERN). The easiest way to deploy it is as a single web service where the Node.js server serves the React frontend.

### Option 1: Render / Railway / Heroku (Recommended)

1. **Build Scripts**: The `package.json` already has a `start` script (`npm run build && node server/index.js`), which is perfect for these platforms.
2. **Environment Variables**: Add your `MONGODB_URI`, `GEMINI_API_KEY`, and `JWT_SECRET` in the deployment platform's dashboard.
3. **Deploy**: Connect your GitHub repo. The platform will automatically run `npm install`, `npm run build`, and then start the server.

### Option 2: Vercel (Frontend Only / Complex)

Since this app uses **Socket.io** for real-time features (like video calls and chat), deploying solely to Vercel (serverless) can be challenging because Vercel Serverless functions don't support persistent WebSocket connections easily.

**Recommendation:** Use **Render** or **Railway** for a seamless full-stack deployment with working video calls and chat.

---

Made with ❤️ by the Aayu AI Team.
