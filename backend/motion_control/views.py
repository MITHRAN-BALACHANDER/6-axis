from django.http import JsonResponse

def run_motion_profile(request, profile_type):
    print(f"[DEBUG] Button clicked: {profile_type}")
    if profile_type == "default":
        data = [
            {"time": 0, "position": 0, "velocity": 0, "acceleration": 0},
            {"time": 1, "position": 10, "velocity": 5, "acceleration": 5},
            {"time": 2, "position": 20, "velocity": 8, "acceleration": 3},
        ]
    elif profile_type == "triangular":
        data = [
            {"time": 0, "position": 0, "velocity": 0, "acceleration": 2},
            {"time": 1, "position": 5, "velocity": 4, "acceleration": 0},
            {"time": 2, "position": 10, "velocity": 0, "acceleration": -2},
        ]
    elif profile_type == "trapezoidal":
        data = [
            {"time": 0, "position": 0, "velocity": 0, "acceleration": 3},
            {"time": 1, "position": 5, "velocity": 5, "acceleration": 0},
            {"time": 2, "position": 10, "velocity": 0, "acceleration": -3},
        ]
    elif profile_type == "s_curve":
        data = [
            {"time": 0, "position": 0, "velocity": 0, "acceleration": 0},
            {"time": 1, "position": 3, "velocity": 2, "acceleration": 2},
            {"time": 2, "position": 10, "velocity": 0, "acceleration": -2},
        ]
    else:
        print(f"[ERROR] Invalid profile type: {profile_type}")
        return JsonResponse({"error": "Invalid profile type"}, status=400)

    return JsonResponse(data, safe=False)
