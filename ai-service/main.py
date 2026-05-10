from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from prediction.congestion_model import predict_congestion
from optimization.signal_optimizer import optimize_signals
from detection.vehicle_detector import detect_vehicles

load_dotenv()

app = FastAPI(title="NeuroTraffic AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    hour: int
    day_of_week: int
    vehicle_count: int
    density: float
    trend: int
    is_rush_hour: bool

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "model_loaded": os.path.exists(os.getenv("MODEL_PATH", "models/congestion_model.pkl")),
        "message": "AI Service is running"
    }

@app.post("/predict")
def predict(data: PredictionRequest):
    try:
        result = predict_congestion(
            data.hour, 
            data.day_of_week, 
            data.vehicle_count, 
            data.density, 
            data.trend, 
            data.is_rush_hour
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/optimize")
def optimize(data: dict = Body(...)):
    try:
        lanes = data.get("lanes", {})
        emergency_lane = data.get("emergency_lane", None)
        result = optimize_signals(lanes, emergency_lane)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/detect/simulate")
def detect_simulate():
    # Returns simulated realistic detection output
    try:
        result = detect_vehicles(simulate=True)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
