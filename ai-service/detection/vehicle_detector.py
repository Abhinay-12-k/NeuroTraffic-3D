import random

def detect_vehicles(simulate=True, image_data=None):
    if simulate:
        cars = random.randint(5, 15)
        bikes = random.randint(0, 5)
        buses = random.randint(0, 2)
        trucks = random.randint(0, 2)
        ambulance = random.random() < 0.05
        
        counts = {"car": cars, "motorcycle": bikes, "bus": buses, "truck": trucks, "ambulance": 1 if ambulance else 0}
        
        return {
            "counts": counts,
            "total": sum(counts.values()),
            "ambulance_detected": ambulance,
            "bounding_boxes": [],  # Empty for simulated mode
            "confidence_avg": 0.89
        }
    else:
        # Here we would initialize YOLOv8 and run detection
        # from ultralytics import YOLO
        # model = YOLO('yolov8n.pt')
        # results = model(image_data)
        # Process results...
        return {
            "error": "Real detection not implemented. Use simulate=True."
        }
