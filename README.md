# Career-Edge BackEnd

> A combined Node.js + Python backend for the Career Edge project providing authentication, mentor/mentee management, connections, appointments, AI recommendations.

## Technologies Used
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **JWT** - JSON Web Tokens for secure authentication
- **Mongoose** - MongoDB object modeling
- **Bcrypt** - Password hashing
- **Cors** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

## Repository Layout
- `server.js`, `index.js` — Node entry points
- `app.py` — Python entry (auxiliary service)
- `package.json` — Node scripts and dependencies
- `requirements.txt` — Python dependencies
- `config/` — configuration helpers (e.g. `db.js`)
- `controllers/`, `routes/`, `models/`, `services/`, `utils/`, `middleware/` — main app modules

## Features
- User authentication and token generation
- Mentor / mentee management and matchmaking
- Connection requests and appointments
- AI recommendation endpoints (`aiRecomendation`)
- Chat endpoints (Python/Node mixed components)

## Prerequisites
- Node.js (v16+ recommended)
- npm
- Python 3.8+
- MongoDB (Atlas or self-hosted)

## Installation
1. Clone the repository and change to the backend folder:

```bash
git clone <repo-url>
cd BackEnd
```

2. Install Node dependencies:

```bash
npm install
```

3. Install Python dependencies:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the project root with the variables below (example):

```env
# Server
PORT=5000

# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.example.com/dbname

# Auth
JWT_SECRET=your_jwt_secret_here

# AI / external APIs
GEMINI_API_KEY=your_gemini_api_key

# (optional) Google or other keys used by services
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

Note: `GEMINI_API_KEY`, `MONGO_URI`, and `JWT_SECRET` are referenced by the codebase.

## Running the app
- Run Node server only:

```bash
npm run start:node
```

- Run Python service only:

```bash
npm run start:python
```

- Run both (concurrently):

```bash
npm run start:all
```

- For development with auto-reload (Node):

```bash
npm run dev
```

## Scripts (from `package.json`)
- `start` — `node server.js`
- `dev` — `nodemon server.js`
- `start:python` — `python app.py`
- `start:node` — `node server.js`
- `start:all` — runs Python + Node concurrently

## Environment variables used (non-exhaustive)
- `PORT` — server port (default 5000)
- `MONGO_URI` — MongoDB connection string (required for DB features)
- `JWT_SECRET` — secret used to sign JWT tokens
- `GEMINI_API_KEY` — API key used by the AI components

## API Overview
Routes are defined under the `routes/` folder. Examples include:
- `authRoutes.js` — login, register
- `userRoutes.js` — user profile endpoints
- `mentorRoutes.js`, `menteeRoutes.js` — mentor/mentee actions
- `connectionRoutes.js` — connection requests
- `appointmentRoutes.js` — scheduling endpoints
- `aiRoutes.js` — AI recommendation endpoints
- `chatRoutes.js` / `chat.py` — chat functionality


