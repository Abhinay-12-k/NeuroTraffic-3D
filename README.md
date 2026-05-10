# NEXUS AI: Adaptive Smart Junction Management System

═══════════════════════════════════════════════════════════════
   AI-POWERED ADAPTIVE SMART JUNCTION MANAGEMENT SYSTEM
   With Emergency Awareness · Predictive Intelligence · 3D Simulation
═══════════════════════════════════════════════════════════════

![Dashboard Preview](frontend/public/vite.svg)

## 🚨 Problem Statement
Urban traffic congestion costs cities billions of dollars annually, increases carbon emissions, and delays critical emergency services. Traditional traffic light systems operate on fixed timers or simple inductive loops, failing to adapt to real-time traffic conditions, unpredictable events, or emergency vehicles.

## 💡 Solution Overview
**Nexus AI** is a complete, production-grade smart city platform that replaces static traffic signals with an intelligent, adaptive ecosystem. Using computer vision, machine learning, and real-time socket communication, it dynamically optimizes junction flow, predicts congestion before it happens, and automatically establishes green corridors for first responders.

## 🏗️ Architecture
```
[ Cameras / Video Feeds ] ---> [ AI Microservice (Python/FastAPI) ]
                                    - YOLOv8 Vehicle Detection
                                    - Congestion Prediction (RandomForest)
                                            |
                                            v
[ Smart Traffic Signals ] <--- [ Node.js Backend Server (Express) ]
                                    - Signal Optimizer Algorithm
                                    - Real-time Socket Handler
                                            |
                                            v
[ Web Dashboard ] <----------- [ React Frontend (Vite/TS) ]
                                    - 3D Digital Twin (Three.js)
                                    - Live Analytics & Control
```

## ✨ Features
- **🟢 Adaptive Signal Optimization**: Real-time cycle adjustment based on lane density.
- **🚑 Emergency Green Corridor**: Automatic detection of ambulances, triggering immediate priority routing.
- **🔮 Predictive Congestion AI**: Machine learning forecasts traffic conditions 30 minutes ahead.
- **🏢 3D Digital Twin**: Live, 60fps WebGL simulation of the junction mirroring real-world state.
- **📊 Real-time Analytics**: Live metrics, emission estimation, and congestion heatmaps.
- **🌙 Night Mode & Eco Mode**: Automatic adjustments for low-traffic hours to save energy.

## 🛠️ Tech Stack
| Component | Technologies Used |
|-----------|-------------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Three.js, Recharts, Zustand |
| **Backend** | Node.js, Express.js, Socket.io, Firebase Admin SDK |
| **AI Service** | Python, FastAPI, YOLOv8 (Ultralytics), OpenCV, scikit-learn, Pandas |
| **Database** | Firebase Firestore, Firebase Realtime Database |

## 🚀 Setup Instructions

1. **Install Dependencies**
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables**
   - Create `.env` in `backend/`, `frontend/`, and `ai-service/` using the provided structures.
   - Add your Firebase Admin credentials to the backend.

3. **Train the AI Model**
   ```bash
   cd ai-service
   python prediction/train_model.py
   ```

4. **Run the Full Stack**
   ```bash
   npm run dev
   ```
   This command starts the Frontend (5173), Backend (5000), and AI Service (8000) concurrently.

## 🎬 Demo Guide
1. **The Dashboard**: Open `http://localhost:5173`. Observe the live data flowing, the AI insights updating, and the emission savings calculating.
2. **3D Simulation**: Navigate to the 3D view. Watch the digital twin handle traffic. Toggle Night Mode.
3. **The Wow Moment**: While in the 3D view, click **TRIGGER EMERGENCY**. Watch the ambulance spawn, the signals immediately adapt to create a green corridor, and the UI flash red.
4. **Analytics**: Show the prediction charts and explain how the ML model forecasts congestion.

## 📚 API Documentation
- `GET /api/traffic/current` - Returns live state of all 4 lanes
- `POST /api/signals/override` - Manual override of traffic light
- `GET /api/analytics/stats` - Live system performance metrics
- `POST /predict` (Python) - Returns congestion forecast based on current density

## 👥 Team
Built for the **Deknek 3D Hackathon**.

## 📄 License
MIT License.
