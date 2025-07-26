# CodeJury - An Online Judge Platform

A full-stack Online Judge platform built with the **MERN stack** that allows users to practice coding problems, submit solutions, get real-time AI hints/feedback, and compete with friends.

## 🚀 Features

- 👤 **User Authentication** (JWT-based)
- 🧩 **Problem Management** (Create, Edit, Delete for admins)
- 📥 **Code Submission & Evaluation** (Docker isolated execution)
- 🧠 **AI-powered Hints & Feedback** (using Gemini API)
- 🏆 **Leaderboards & Friend Ratings**
- 👥 **Friend System** (Add/Remove friends, view their profiles)
- 🎯 **Contest Timer & Profile Badges**
- 🌗 **Dark/Light Theme Toggle**
- 🛠️ **Admin Panel** with full CRUD access

---

## 🧠 AI Features
- Get Hint analyzes the problem description and gives a clue.
- Get Code Feedback checks the logic and suggests improvements.
- Get Time Complexity gives the Time Complexity of the submitted code

---

## 🖼️ Demo

- 🔗 Live Link: [https://codejury.info/](#)
- 📹 Demo Video: [https://www.loom.com/share/089d4fb100ec4b12a932ffb926708370?sid=0c2ae2d7-1386-48c6-b000-e64197593cd2](#)

---

## ⚙️ Tech Stack

| Layer         | Tech                                    |
|---------------|------------------------------------------|
| Frontend      | React, Tailwind CSS, Axios               |
| Backend       | Node.js, Express.js                      |
| Database      | MongoDB with Mongoose                    |
| Code Runner   | Docker-based sandbox environment         |
| AI Features   | Google Gemini API                        |

---

## 🛠️ Installation

### 🖥️ Frontend

```bash
cd frontend
npm install
npm run dev
```

### 🖥️ Backend

```bash
cd backend
npm install
node index.js
```

⚙️ Compiler Server

```bash
cd compiler
npm install
node index.js
```

🔐 Environment Variables
Create .env files in backend/ and compiler/ folders:

```bash
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=your_port
```
