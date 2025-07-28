from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import math
import logging
from monitoring.models import RobotLog, SystemEvent

class MotionProfileView(APIView):
    """
    API endpoint for retrieving motion profiles.
    """
    def get(self, request, profile_name='default'):
        profiles = {
            "default": [
                {"time": 0, "position": 0, "velocity": 0, "acceleration": 0},
                {"time": 1, "position": 10, "velocity": 15, "acceleration": 5},
                {"time": 2, "position": 30, "velocity": 20, "acceleration": 5},
                {"time": 3, "position": 60, "velocity": 30, "acceleration": 10},
                {"time": 4, "position": 100, "velocity": 40, "acceleration": 10}
            ],
            "triangular": [
                {"time": 0, "position": 0, "velocity": 0},
                {"time": 1, "position": 25, "velocity": 50},
                {"time": 2, "position": 100, "velocity": 0}
            ],
            "s_curve": [
                {"time": 0, "position": 0, "velocity": 0},
                {"time": 1, "position": 10, "velocity": 20},
                {"time": 2, "position": 50, "velocity": 50},
                {"time": 3, "position": 90, "velocity": 20},
                {"time": 4, "position": 100, "velocity": 0}
            ],
            "trapezoidal": [
                {"time": 0, "position": 0, "velocity": 0},
                {"time": 1, "position": 20, "velocity": 40},
                {"time": 2, "position": 60, "velocity": 40},
                {"time": 3, "position": 80, "velocity": 0}
            ]
        }
        profile_data = profiles.get(profile_name)
        if profile_data:
            return Response(profile_data)
        return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

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
                SystemEvent.objects.create(
                    event_type='ROBOT_ERROR',
                    message=f"Target ({x}, {y}) is unreachable with arm lengths {length1}, {length2}."
                )
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
            # Log the movement
            RobotLog.objects.create(
                joint1=angles["A1"],
                joint2=angles["A2"],
                joint3=angles["A3"],
                joint4=angles["A4"],
                joint5=angles["A5"],
                joint6=angles["A6"],
            )
            logging.info(f"Robot moved to angles: {angles}")
            return Response(angles)
        except Exception as e:
            SystemEvent.objects.create(event_type='APP_ERROR', message=f"An error occurred during IK calculation: {e}")
            logging.error(f"Error in IK calculation: {e}")
            return Response({"error": str(e)}, status=400)
