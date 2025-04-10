# import numpy as np

# def run_triangular_profile():
#     print("Generating triangular profile...")

#     # Simple linear acceleration and deceleration
#     time = np.linspace(0, 1, num=100)
#     position = np.where(time < 0.5, 2 * time, 2 * (1 - time))  # Triangle shape

#     trajectory = {
#         'type': 'triangular',
#         'time': time.tolist(),
#         'position': position.tolist()
#     }
#     return trajectory


# def run_trapezoidal_profile():
#     print("Generating trapezoidal profile...")

#     time = np.linspace(0, 1, num=100)
#     position = []

#     for t in time:
#         if t < 0.25:
#             pos = 4 * t  # accelerate
#         elif t < 0.75:
#             pos = 1.0  # constant speed
#         else:
#             pos = 4 * (1 - t)  # decelerate
#         position.append(pos)

#     trajectory = {
#         'type': 'trapezoidal',
#         'time': time.tolist(),
#         'position': position
#     }
#     return trajectory


# def run_s_curve_profile():
#     print("Generating S-curve profile...")

#     time = np.linspace(0, 1, num=100)
#     # Smooth sigmoid-based S-curve
#     position = 1 / (1 + np.exp(-10 * (time - 0.5)))

#     trajectory = {
#         'type': 's_curve',
#         'time': time.tolist(),
#         'position': position.tolist()
#     }
#     return trajectory
