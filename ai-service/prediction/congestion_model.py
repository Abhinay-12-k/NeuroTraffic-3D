import os
import joblib
import pandas as pd

MODEL_PATH = os.getenv("MODEL_PATH", "models/congestion_model.pkl")

def predict_congestion(hour, day_of_week, vehicle_count, density, trend, is_rush_hour):
    if not os.path.exists(MODEL_PATH):
        # Fallback if model not trained yet
        level = 0
        if density > 0.8: level = 3
        elif density > 0.5: level = 2
        elif density > 0.3: level = 1
        
        return {
            "congestion_level": level,
            "congestion_label": ["LOW", "MEDIUM", "HIGH", "CRITICAL"][level],
            "probability": 0.85,
            "recommendation": "Adjust timings" if level > 1 else "Normal operation",
            "predicted_peak_in_minutes": 15 if level > 1 else 60
        }

    try:
        model = joblib.load(MODEL_PATH)
        df = pd.DataFrame([{
            'hour_of_day': hour,
            'day_of_week': day_of_week,
            'current_vehicle_count': vehicle_count,
            'current_density': density,
            'last_5min_trend': trend,
            'weather_factor': 1.0,
            'is_rush_hour': int(is_rush_hour)
        }])
        
        pred = model.predict(df)[0]
        probs = model.predict_proba(df)[0]
        max_prob = float(probs[pred])
        
        labels = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
        recs = [
            "Normal operation", 
            "Prepare for increased traffic", 
            "Increase green time for major flow", 
            "Implement extreme congestion mitigation"
        ]
        
        return {
            "congestion_level": int(pred),
            "congestion_label": labels[int(pred)],
            "probability": max_prob,
            "recommendation": recs[int(pred)],
            "predicted_peak_in_minutes": 15 if pred > 1 else 45
        }
    except Exception as e:
        print(f"Prediction error: {e}")
        # fallback
        return {
            "congestion_level": 1,
            "congestion_label": "MEDIUM",
            "probability": 0.5,
            "recommendation": "Fallback prediction",
            "predicted_peak_in_minutes": 30
        }
