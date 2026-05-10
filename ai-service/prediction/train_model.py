import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

def generate_synthetic_data(n_samples=10000):
    np.random.seed(42)
    
    hour_of_day = np.random.randint(0, 24, n_samples)
    day_of_week = np.random.randint(0, 7, n_samples)
    
    # Simulate rush hour
    is_rush_hour = ((hour_of_day >= 8) & (hour_of_day <= 10)) | ((hour_of_day >= 17) & (hour_of_day <= 20))
    is_rush_hour = is_rush_hour.astype(int)
    
    vehicle_count = np.random.randint(5, 20, n_samples)
    vehicle_count = vehicle_count + (is_rush_hour * np.random.randint(20, 40, n_samples))
    
    density = np.clip(vehicle_count / 80.0 + np.random.normal(0, 0.1, n_samples), 0.0, 1.0)
    trend = np.random.choice([-1, 0, 1], n_samples, p=[0.2, 0.5, 0.3])
    weather_factor = np.random.uniform(0.8, 1.2, n_samples)
    
    # Calculate target (congestion level 0-3)
    score = (density * 2) + (is_rush_hour * 0.5) + (trend * 0.2) + ((weather_factor - 1) * 0.5)
    
    congestion_level = np.zeros(n_samples, dtype=int)
    congestion_level[score > 1.2] = 1
    congestion_level[score > 1.8] = 2
    congestion_level[score > 2.2] = 3
    
    data = pd.DataFrame({
        'hour_of_day': hour_of_day,
        'day_of_week': day_of_week,
        'current_vehicle_count': vehicle_count,
        'current_density': density,
        'last_5min_trend': trend,
        'weather_factor': weather_factor,
        'is_rush_hour': is_rush_hour,
        'congestion_level': congestion_level
    })
    
    return data

def train():
    print("Generating synthetic data...")
    df = generate_synthetic_data()
    
    X = df.drop('congestion_level', axis=1)
    y = df['congestion_level']
    
    print("Training RandomForest model...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    print(f"Accuracy on training set: {model.score(X, y):.4f}")
    
    os.makedirs('models', exist_ok=True)
    model_path = 'models/congestion_model.pkl'
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train()
