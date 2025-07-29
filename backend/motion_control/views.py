from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import numpy as np
import math
import logging
from monitoring.models import RobotLog, SystemEvent


class MotionProfileView(APIView):
    """
    Dynamic API endpoint for various motion profiles.
    """
    def get(self, request, profile_name='default'):
        # Extract params with defaults
        total_time = float(request.GET.get('total_time', 4))
        steps = int(request.GET.get('steps', 20))
        max_vel = float(request.GET.get('max_vel', 40))
        max_accel = float(request.GET.get('max_accel', 10))

        profiles = {
            "default": self.default_profile,
            "triangular": self.triangular_profile,
            "trapezoidal": self.trapezoidal_profile,
            "s_curve": self.s_curve_profile,
        }
        generator = profiles.get(profile_name)
        if generator:
            data = generator(total_time, steps, max_vel, max_accel)
            return Response(data)
        return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

    def default_profile(self, total_time, steps, max_vel, max_accel):
        times = np.linspace(0, total_time, steps)
        velocities = np.linspace(0, max_vel, steps)
        positions = np.cumsum(velocities) * (total_time / steps)
        accel = np.gradient(velocities, total_time / steps)
        return [
            {"time": float(t), "position": float(p), "velocity": float(v), "acceleration": float(a)}
            for t, p, v, a in zip(times, positions, velocities, accel)
        ]

    def triangular_profile(self, total_time, steps, max_vel, max_accel):
        times = np.linspace(0, total_time, steps)
        half = steps // 2
        v_asc = np.linspace(0, max_vel, half)
        v_desc = np.linspace(max_vel, 0, steps - half)
        velocities = np.concatenate([v_asc, v_desc])
        positions = np.cumsum(velocities) * (total_time / steps)
        return [
            {"time": float(t), "position": float(p), "velocity": float(v)}
            for t, p, v in zip(times, positions, velocities)
        ]

    def trapezoidal_profile(self, total_time, steps, max_vel, max_accel):
        accel_time = max_vel / max_accel
        cruise_time = total_time - 2 * accel_time
        if cruise_time < 0:
            return self.triangular_profile(total_time, steps, max_vel, max_accel)
        times = np.linspace(0, total_time, steps)
        velocities = []
        for t in times:
            if t < accel_time:
                v = max_accel * t
            elif t < accel_time + cruise_time:
                v = max_vel
            else:
                v = max_vel - max_accel * (t - (accel_time + cruise_time))
            velocities.append(max(0, v))
        positions = np.cumsum(velocities) * (total_time / steps)
        return [
            {"time": float(t), "position": float(p), "velocity": float(v)}
            for t, p, v in zip(times, positions, velocities)
        ]

    def s_curve_profile(self, total_time, steps, max_vel, max_accel):
        times = np.linspace(0, total_time, steps)
        k = 6  # steepness
        t_mid = total_time / 2
        velocities = max_vel / (1 + np.exp(-k * (times - t_mid) / total_time))
        velocities = velocities - velocities[0]
        velocities = velocities * (max_vel / np.max(velocities))
        positions = np.cumsum(velocities) * (total_time / steps)
        return [
            {"time": float(t), "position": float(p), "velocity": float(v)}
            for t, p, v in zip(times, positions, velocities)
        ]


class IK2DView(APIView):
    """
    API endpoint for calculating joint angles to reach (x, y).
    """
    def post(self, request):
        try:
            x = float(request.data.get("x"))
            y = float(request.data.get("y"))
            length1 = float(request.data.get("length1"))
            length2 = float(request.data.get("length2"))
        except (TypeError, ValueError):
            return Response({"error": "Invalid or missing input."}, status=400)

        try:
            r = math.hypot(x, y)
            if r > (length1 + length2):
                SystemEvent.objects.create(
                    event_type='ROBOT_ERROR',
                    message=f"Target ({x}, {y}) is unreachable with arm lengths {length1}, {length2}."
                )
                return Response({"error": "Target unreachable with given arm lengths."}, status=400)

            cos_angle2 = (x ** 2 + y ** 2 - length1 ** 2 - length2 ** 2) / (2 * length1 * length2)
            cos_angle2 = max(min(cos_angle2, 1), -1)
            angle2 = math.acos(cos_angle2)

            k1 = length1 + length2 * math.cos(angle2)
            k2 = length2 * math.sin(angle2)
            angle1 = math.atan2(y, x) - math.atan2(k2, k1)

            angles = {
                "A1": 0,
                "A2": math.degrees(angle1),
                "A3": math.degrees(angle2),
                "A4": 0,
                "A5": 0,
                "A6": 0,
                "Gripper": 0,
            }

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
