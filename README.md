# TRINETRA - Geological Event Monitoring System

A comprehensive geological event monitoring system that provides real-time sensor data visualization and risk assessment for rockfall, rainfall, and landslide prevention. Built for mine safety and geological hazard monitoring.

---

## Overview

TRINETRA combines a **FastAPI backend** (sensor simulation, ML-ready APIs, WebSocket live stream) with a **React dashboard** to monitor seismic, displacement, hydrological, and environmental sensors. The system supports event simulation (rockfall, rainfall, landslide), risk-level alerts, and live data visualization.

---

## Project Structure

```
├── .gitignore
├── backend/
│   ├── main.py                 # FastAPI app, WebSocket, API routes
│   ├── requirements.txt        # Python dependencies
│   ├── sensors/                # Sensor simulation
│   │   ├── __init__.py
│   │   ├── sensors.py          # Aggregated readings, event triggers
│   │   ├── seismic.py          # Accelerometer, geophone, seismometer
│   │   ├── displacement.py     # Crack, inclinometer, extensometer
│   │   ├── hydro.py            # Moisture, piezometer
│   │   └── environmental.py    # Rain, temperature, humidity
│   └── ml_model/               # Optional ML (CNN, weather)
│       ├── sensors/            # Rockfall CNN model
│       └── weather/            # Weather forecasting
└── frontend/
    ├── public/
    ├── src/
    │   ├── config.ts           # API / WebSocket base URLs
    │   ├── App.tsx
    │   ├── index.tsx
    │   ├── components/         # Dashboard UI
    │   │   ├── Header.tsx
    │   │   ├── SensorGraphs.tsx
    │   │   ├── WeatherForecast.tsx
    │   │   ├── RiskIndicator.tsx
    │   │   ├── AlertPanel.tsx
    │   │   ├── ImageModel.tsx
    │   │   ├── EventLog.tsx
    │   │   └── ...
    │   ├── providers/          # WebSocket provider
    │   └── services/
    ├── package.json
    └── tsconfig.json
```

---

## Technology Stack

### Backend
- **FastAPI** – REST API and WebSocket
- **Uvicorn** – ASGI server
- **Python 3.8+** – NumPy, Pandas, scikit-learn; optional PyTorch for CNN/weather models

### Frontend
- **React 19** with **TypeScript**
- **Create React App** (react-scripts)
- **Recharts** – Charts and graphs
- **Tailwind CSS** – Styling (if used in project)

---

## Features

### Backend
- **REST API**
  - `GET /api/sensors` – Current sensor readings
  - `GET /api/sensor_groups` – Grouped sensor list
  - `GET /api/status` – CNN/weather model status
  - `GET /alert` – Current risk/alert level
  - `POST /alert/{mode}` – Set alert mode (safe / warning / emergency)
  - `POST /api/trigger_event/{event_type}` – Trigger rockfall, rainfall, or landslide simulation
- **WebSocket** – `WS /ws/live` – Live sensor stream with optional ML prediction and weather forecast
- **Sensors** – Seismic, displacement, hydro, and environmental (simulated)
- **Optional ML** – CNN for rockfall prediction, weather forecasting (when PyTorch and model files are present)

### Frontend
- Real-time sensor charts via WebSocket
- Risk indicator (safe / warning / emergency) with optional siren
- Alert panel and event log
- Trigger buttons for rockfall, rainfall, landslide simulation
- Weather forecast (Open-Meteo API) and dashboard layout for mine safety

---

## Getting Started

### Prerequisites
- **Python 3.8+**
- **Node.js 18+**
- (Optional) PyTorch and model files for ML features

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

- API: **http://localhost:8000**
- Docs: **http://localhost:8000/docs**
- ReDoc: **http://localhost:8000/redoc**

### Frontend

```bash
cd frontend
npm install
npm start
```

- App: **http://localhost:3000** (or the port shown in the terminal)

### Environment (optional)

For frontend, you can set:
- `REACT_APP_API_URL` – Backend base URL (default: `http://localhost:8000`)
- `REACT_APP_WS_URL` – WebSocket URL (default: derived from API URL + `/ws/live`)

---

## API Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sensors` | All current sensor readings |
| GET | `/api/sensor_groups` | Sensor groups (Seismic, Displacement, Hydro, Environmental) |
| GET | `/api/status` | Backend status (CNN/weather loaded) |
| GET | `/alert` | Current alert/risk level |
| POST | `/alert/{mode}` | Set alert mode |
| POST | `/api/trigger_event/{event_type}` | Trigger event (rockfall, rainfall, landslide) |
| WS | `/ws/live` | Live sensor + prediction stream |

---

## Project Purpose

TRINETRA is designed to support geological monitoring and mine safety by:

1. Monitoring critical parameters across multiple sensor types
2. Providing early warning for rockfall, rainfall, and landslide risks
3. Visualizing trends and live data for operators
4. Supporting risk assessment and event simulation for training and demos

---


