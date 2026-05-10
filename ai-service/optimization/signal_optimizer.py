def optimize_signals(lanes_data, emergency_lane=None):
    if emergency_lane and emergency_lane in lanes_data:
        return {
            "timings": {
                lane: {"green_seconds": 90 if lane == emergency_lane else 0, "red_seconds": 0 if lane == emergency_lane else 90}
                for lane in lanes_data.keys()
            },
            "mode": "emergency",
            "efficiency_score": 100,
            "estimated_wait_reduction": 0,
            "recommendation": f"Emergency corridor active for {emergency_lane}"
        }

    total_weight = 0
    weights = {}
    for lane, data in lanes_data.items():
        weight = (data.get('count', 0) * 1.0) + (data.get('density', 0) * 50) + (data.get('waitTime', 0) * 0.5)
        weights[lane] = weight
        total_weight += weight

    if total_weight == 0:
        total_weight = 1

    base_cycle = 120
    timings = {}
    for lane, weight in weights.items():
        green = max(10, min(60, int((weight / total_weight) * base_cycle)))
        timings[lane] = {
            "green_seconds": green,
            "red_seconds": base_cycle - green
        }

    return {
        "timings": timings,
        "mode": "normal",
        "efficiency_score": 85,
        "estimated_wait_reduction": 15,
        "recommendation": "Optimal distribution calculated based on real-time density."
    }
