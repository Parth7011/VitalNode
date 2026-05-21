<div align="center">
  <img src="./vitalnode/public/vite.svg" alt="VitalNode Logo" width="100" height="100">

  # VitalNode 🩺
  
  **Next-Generation Telemedicine & Healthcare Management Platform**

  [![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
  [![WebRTC](https://img.shields.io/badge/WebRTC-Live_Video-red?style=for-the-badge&logo=webrtc)](https://webrtc.org/)
  [![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-black?style=for-the-badge&logo=socketdotio)](https://socket.io/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
</div>

<br />

VitalNode is a premium, full-stack healthcare platform designed to bridge the gap between patients and medical professionals. With an emphasis on modern design aesthetics, it features real-time video consultations via WebRTC, instant messaging, dynamic treatment tracking, and intuitive dashboards for both doctors and patients.

---

## ✨ Key Features

### 🧑‍⚕️ For Doctors
- **Smart Dashboard:** Monitor busyness, pending requests, and upcoming consultations visually.
- **Patient Management:** Track active patients, review medical histories, and add custom treatment prescriptions.
- **Consultation Console:** A dedicated live-session room featuring real-time video (WebRTC), chat (Socket.io), and patient vitals at a glance.

### 🤒 For Patients
- **AI-Powered Symptoms:** Smart recommendations for specialists based on reported symptoms.
- **Seamless Booking:** Browse verified doctors, check their specialties, and book appointments (Video or In-Person).
- **Treatment Overview:** A dynamic timeline tracking visit progress, prescribed medicines, and doctor's notes.
- **Live Consultation Room:** Connect with doctors remotely via secure peer-to-peer video streams.

### ⚙️ Core Technology
- **Real-Time Video:** Powered by native WebRTC with Socket.io signaling.
- **Dynamic Progress Tracking:** Treatment progress bars that automatically update as visits are completed.
- **Premium UI/UX:** Built with TailwindCSS featuring glassmorphism, responsive micro-animations, and vibrant color palettes.

---

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- React Router DOM
- Context API (State Management)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) for Authentication
- Socket.io (Signaling & Chat)
- WebRTC (P2P Video)

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (Local instance or MongoDB Atlas)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/VitalNode.git
cd VitalNode
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and configure environment variables.
```bash
cd backend
npm install
```
Create a `.env` file in the `/backend` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vitalnode
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```
Seed the database with sample doctors and users:
```bash
node seed.js
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies.
```bash
cd vitalnode
npm install
```
Start the Vite development server:
```bash
npm run dev
```

### 4. Access the Application
The frontend will be running on `http://localhost:5173`.
The backend API and Socket.io server will be running on `http://localhost:5000`.

---

## 📸 Sneak Peek

*(Add your screenshots here by placing images in a `/docs` or `/public` folder and linking them below)*

| Patient Dashboard | Doctor Live Console |
| :---: | :---: |
| `<img src="vitalnode/public/images/dashboard-preview.png" width="400" />` | `<img src="vitalnode/public/images/console-preview.png" width="400" />` |

*(Replace the `src` with actual screenshot paths once captured)*

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check the [issues page](https://github.com/yourusername/VitalNode/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <i>Built with ❤️ for a healthier tomorrow.</i>
</div>
