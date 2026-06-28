# TaskFlow — MERN Task Tracker

A full-stack Task Tracker built with the MERN stack (MongoDB, Express, React, Node.js).

## Project Structure

```
task-tracker/
├── server/                  # Express + Node.js backend
│   ├── models/Task.js       # Mongoose model
│   ├── controllers/         # Business logic (MVC)
│   ├── routes/taskRoutes.js # REST API routes
│   ├── index.js             # App entry + DB connect
│   └── .env                 # MONGO_URI, PORT
│
└── client/                  # React + Vite frontend
    ├── src/
    │   ├── components/
    │   │   ├── TaskCard.jsx  # Reusable task card
    │   │   ├── TaskForm.jsx  # Reusable create/edit form
    │   │   └── Toast.jsx     # Notification system
    │   ├── App.jsx           # Main app + state + API calls
    │   ├── index.css         # All styles
    │   └── main.jsx          # React entry
    ├── .env                  # VITE_API_URL
    └── vite.config.js        # Dev proxy config
```

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express.js (MVC pattern)
- **Database**: MongoDB + Mongoose

## Features

- ✅ Full CRUD (Create, View, Update, Delete)
- ✅ Form validation (client + server)
- ✅ REST API with proper status codes
- ✅ MongoDB integration via Mongoose
- ✅ Responsive dark UI
- ✅ Dynamic updates without page refresh
- ✅ Filter by status & priority
- ✅ Sort by date, due date, or priority
- ✅ Live search
- ✅ Reusable components (TaskCard, TaskForm, Toast)
- ✅ Environment variables (.env on both sides)

## API Endpoints

| Method | Endpoint       | Description            |
|--------|----------------|------------------------|
| GET    | /api/tasks     | Get all tasks (+ filter/sort query) |
| GET    | /api/tasks/:id | Get single task        |
| POST   | /api/tasks     | Create task            |
| PUT    | /api/tasks/:id | Update task            |
| DELETE | /api/tasks/:id | Delete task            |

Query params for GET /api/tasks: `?status=todo&priority=high&sort=dueDate`

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally (or provide a MongoDB Atlas URI)

### 1. Install dependencies

```bash
# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### 2. Configure environment

**server/.env**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/tasktracker
```

**client/.env**
```
VITE_API_URL=/api/tasks
```

### 3. Run the app

Open two terminals:

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Visit **http://localhost:5173**

The Vite dev server proxies `/api` requests to `http://localhost:5000`, so no CORS issues.


