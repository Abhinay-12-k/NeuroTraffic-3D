from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "ai-engine"}

def test_prediction_endpoint():
    # Test with typical congestion data
    payload = {
        "north_density": 0.8,
        "south_density": 0.7,
        "east_density": 0.3,
        "west_density": 0.4
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "congestion_level" in data
    assert "recommendation" in data
    assert data["congestion_label"] in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

def test_optimization_endpoint():
    payload = {
        "lanes": {
            "NORTH": {"vehicleCount": 15},
            "SOUTH": {"vehicleCount": 5},
            "EAST": {"vehicleCount": 2},
            "WEST": {"vehicleCount": 0}
        }
    }
    response = client.post("/optimize", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "signals" in data
    assert data["signals"]["NORTH"]["color"] == "green"
