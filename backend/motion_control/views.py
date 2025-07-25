from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import math

class IK2DView(APIView):
    """
    API endpoint for calculating the joint angles to reach (x, y).
    """
    def post(self, request):
        try:
            x = float(request.data.get("x"))
            y = float(request.data.get("y"))
            length1 = float(request.data.get("length1"))
            length2 = float(request.data.get("length2"))
        except (TypeError, ValueError):
            return Response({"error": "Invalid or missing input."}, status=400)

        # Inverse Kinematics Calculation
        try:
            # Distance to target
            r = math.hypot(x, y)

            # Check if the target is reachable
            if r > (length1 + length2):
                return Response({"error": "Target unreachable with given arm lengths."}, status=400)

            # Law of cosines for angle at joint 2 (elbow)
            cos_angle2 = (x**2 + y**2 - length1**2 - length2**2) / (2 * length1 * length2)
            cos_angle2 = max(min(cos_angle2, 1), -1)  # Clamp for safety
            angle2 = math.acos(cos_angle2)

            # Angle at joint 1 (shoulder)
            k1 = length1 + length2 * math.cos(angle2)
            k2 = length2 * math.sin(angle2)
            angle1 = math.atan2(y, x) - math.atan2(k2, k1)

            # Return in degrees for frontend
            angles = {
                "A1": 0,  # Base (assume 2D, set to 0 or compute if 3D)
                "A2": math.degrees(angle1),
                "A3": math.degrees(angle2),
                "A4": 0,
                "A5": 0,
                "A6": 0,
                "Gripper": 0,
            }
            return Response(angles)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
