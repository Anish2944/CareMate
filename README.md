# 💙 CareMate — Smart Healthcare System

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue.svg?style=for-the-badge)](https://care-mate-bice.vercel.app/)
[![Tech Stack](https://img.shields.io/badge/Tech-MERN%20Stack-blueviolet?style=for-the-badge)](#tech-stack)
[![License](https://img.shields.io/github/license/Anish2944/caremate?style=for-the-badge)](./LICENSE)

CareMate is a full-fledged **Smart Healthcare Platform** designed to bridge the gap between patients and healthcare providers with **real-time video consultations**, **digital prescriptions**, **Stripe-based payments**, and even **AI-powered consultations**. Built with a modern MERN stack and scalable microservice approach.

---

## 🚀 Live Demo

🌐 [https://care-mate-bice.vercel.app/](https://care-mate-bice.vercel.app/)

---

## ⚙️ Features

### 🧑‍⚕️ Patient Side
- 🔐 Secure signup & login
- 🗓️ Book appointments with filters (specialty, availability, etc.)
- 🎥 Live video consultations with doctors (WebRTC + Socket.IO)
- 💬 Real-time chat during video session
- 📃 Instant prescription generation post-consultation
- ⭐ Rate and review doctors
- 🧠 AI-powered health advice chatbot using Custom GPT

### 👨‍⚕️ Doctor Side
- 📅 Manage availability and appointments
- 🩺 Conduct live consultations
- 📝 Create and save prescriptions to patient history
- 📊 Dashboard with upcoming & past appointments

### ⚙️ System Features
- 🔔 Real-time notifications
- 💳 Secure Stripe payment integration
- 🧾 Medical history tracking
- 🔎 Advanced search filters
- 📡 Scalable backend with modular architecture

---

## 🧱 Tech Stack

### 🌐 Frontend
- Next.js + Vite
- TailwindCSS + ShadCN
- Redux Toolkit (RTK Query)
- Socket.IO for real-time updates

### 🔧 Backend
- Node.js + Express
- MongoDB (Mongoose)
- JWT for Authentication
- Stripe API for payments
- WebRTC for live consultations
- REST APIs + Modular architecture

---

## 📁 Folder Structure (Quick Glance)
```bash
CareMate/
│
├── client/ # Frontend - React
│ └── src/
│ └── features/, components/, pages/, api/
│
├── server/ # Backend - Express
│ └── controllers/, routes/, models/, utils/
│
└── README.md
```

---

## 🧠 Installation & Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/caremate.git
cd caremate
cd server
npm install
npm run server
```
# Setup environment variables
```bash
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
CUSTOM_GPT_API=your_custom_gpt_endpoint (Frontend)
VITE_BACKEND_URL=your local or custom url (Frontend)
```
# setup Frontend
```bash
npm start
cd client
npm install
npm run dev
```

## 🧪 Future Enhancements

- Mobile app with React Native
- Admin panel for analytics and platform control
- Multi-language support
- PDF export for prescriptions
- Automated appointment reminders

## 🧑‍💻 Contributors
Built with 💻 by Anish Kushwaha and team as a Final Year Project.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 📬 Contact
Want to collaborate or hire me?
📧 Email: anishkh0276@gmail.com
🔗 LinkedIn: linkedin.com/in/anish-kushwaha-45857b227/

