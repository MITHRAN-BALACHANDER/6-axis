from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import numpy as np
import math
import logging
import socket  # Import socket for UDP communication
from monitoring.models import RobotLog, SystemEvent
from motion_control.models import RobotSettings  # Import RobotSettings


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
            {"time": float(t), "position": float(p), "velocity": float(v),
             "acceleration": float(a)}
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


class IK6DView(APIView):
    """
    API endpoint for calculating joint angles for a 6-axis robot to reach (x, y, z) with specified orientation.
    """
    def post(self, request):
        try:
            x = float(request.data.get("x"))
            y = float(request.data.get("y"))
            z = float(request.data.get("z"))
            roll = math.radians(float(request.data.get("roll", 0)))
            pitch = math.radians(float(request.data.get("pitch", 0)))
            yaw = math.radians(float(request.data.get("yaw", 0)))
            
            l1 = float(request.data.get("l1", 1.0))
            l2 = float(request.data.get("l2", 1.0))
            l3 = float(request.data.get("l3", 1.0))
            l4 = float(request.data.get("l4", 0.5)) # Wrist length
            
        except (TypeError, ValueError):
            return Response({"error": "Invalid or missing input."}, status=400)

        try:
            # Rotation matrix from Euler angles
            Rx = np.array([[1, 0, 0], [0, math.cos(roll), -math.sin(roll)], [0, math.sin(roll), math.cos(roll)]])
            Ry = np.array([[math.cos(pitch), 0, math.sin(pitch)], [0, 1, 0], [-math.sin(pitch), 0, math.cos(pitch)]])
            Rz = np.array([[math.cos(yaw), -math.sin(yaw), 0], [math.sin(yaw), math.cos(yaw), 0], [0, 0, 1]])
            R0_6 = Rz @ Ry @ Rx

            # Wrist center (xc, yc, zc)
            p0_5 = np.array([x, y, z]) - l4 * R0_6[:, 2]
            xc, yc, zc = p0_5

            # Theta 1
            theta1 = math.atan2(yc, xc)

            # Theta 3
            r_sq = (xc - l1 * math.cos(theta1))**2 + (yc - l1 * math.sin(theta1))**2 + zc**2
            cos_theta3 = (r_sq - l2**2 - l3**2) / (2 * l2 * l3)
            if not (-1 <= cos_theta3 <= 1):
                return Response({"error": "Target unreachable (Elbow)."}, status=400)
            theta3 = math.acos(cos_theta3)

            # Theta 2
            s_theta3 = math.sin(theta3)
            c_theta3 = math.cos(theta3)
            k1 = l2 + l3 * c_theta3
            k2 = l3 * s_theta3
            theta2 = math.atan2(zc, math.sqrt(xc**2 + yc**2)) - math.atan2(k2, k1)

            # Rotation matrix from base to wrist
            R0_3 = np.array([
                [math.cos(theta1)*math.cos(theta2+theta3), -math.cos(theta1)*math.sin(theta2+theta3), -math.sin(theta1)],
                [math.sin(theta1)*math.cos(theta2+theta3), -math.sin(theta1)*math.sin(theta2+theta3), math.cos(theta1)],
                [math.sin(theta2+theta3), math.cos(theta2+theta3), 0]
            ])

            R3_6 = np.linalg.inv(R0_3) @ R0_6
            
            # Theta 5
            theta5 = math.acos(R3_6[2, 2])
            
            # Theta 4 and 6
            if abs(math.sin(theta5)) > 1e-6:
                theta4 = math.atan2(R3_6[1, 2], R3_6[0, 2])
                theta6 = math.atan2(R3_6[2, 1], -R3_6[2, 0])
            else: # Gimbal lock
                theta4 = 0
                theta6 = math.atan2(-R3_6[0, 1], R3_6[0, 0])


            angles = {
                "A1": math.degrees(theta1), "A2": math.degrees(theta2),
                "A3": math.degrees(theta3), "A4": math.degrees(theta4),
                "A5": math.degrees(theta5), "A6": math.degrees(theta6),
                "Gripper": 0,
            }

            RobotLog.objects.create(**{f"joint{i+1}": v for i, v in enumerate(angles.values()) if i < 6})
            logging.info(f"Robot moved to angles: {angles}")

            # Send joint data via UDP
            udp_host = '127.0.0.1'  # Or configure this via settings
            udp_port = 12345  # Or configure this via settings
            udp_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            try:
                # Fetch latest robot settings for velocity and acceleration
                latest_settings = RobotSettings.objects.order_by(
                    '-timestamp').first()

                # Default values if no settings are found
                speed_percentage = (latest_settings.speed_percentage
                                    if latest_settings else 50.0)
                acceleration_percentage = (
                    latest_settings.acceleration_percentage
                    if latest_settings else 50.0
                )

                # Convert percentages to actual values (assuming max values for scaling)
                MAX_VELOCITY_UNIT = 100.0  # e.g., 100 degrees/second
                MAX_ACCELERATION_UNIT = 100.0  # e.g., 100 degrees/second^2

                current_vel = (speed_percentage / 100.0) * MAX_VELOCITY_UNIT
                current_accel = (acceleration_percentage / 100.0) * MAX_ACCELERATION_UNIT

                # Construct data in the specified comma-separated format: A1,A2,A3,A4,A5,A6,Vel,Accel,Gripper
                a1 = float(angles.get("A1", 0.0))
                a2 = float(angles.get("A2", 0.0))
                a3 = float(angles.get("A3", 0.0))
                a4 = float(angles.get("A4", 0.0))
                a5 = float(angles.get("A5", 0.0))
                a6 = float(angles.get("A6", 0.0))
                gripper_pos = float(angles.get("Gripper", 0.0))
                
                data_string = (f"{a1},{a2},{a3},{a4},{a5},{a6},"
                               f"{current_vel},{current_accel},{gripper_pos}")
                
                message = data_string.encode('utf-8')
                udp_sock.sendto(message, (udp_host, udp_port))
                logging.info(f"Sent UDP: {data_string}")
            except Exception as udp_e:
                logging.error(f"Error sending UDP data: {udp_e}")
            finally:
                udp_sock.close()


            return Response(angles)

        except Exception as e:
            SystemEvent.objects.create(event_type='APP_ERROR', message=f"IK calculation error: {e}")
            logging.error(f"Error in IK calculation: {e}")
            return Response({"error": str(e)}, status=500)
