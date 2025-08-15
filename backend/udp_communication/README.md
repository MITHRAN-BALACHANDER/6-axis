# UDP Communication for 6-Axis Robot Control

This document outlines the UDP (User Datagram Protocol) communication implemented for the 6-axis robot project, detailing how data is sent from the Django backend and received by a Python script, with a conceptual example for a microcontroller.

## 1. Overview of UDP Communication

UDP is a connectionless protocol that provides a simple and fast way to send data packets. Unlike TCP, UDP does not guarantee delivery, order, or error-checking, making it suitable for applications where speed is critical and some data loss is acceptable, such as real-time robot control.

In this system, UDP is used to transmit robot joint data and receive feedback/error messages, primarily for real-time monitoring and control.

## 2. Sending Data from the Django Backend

The Django backend, specifically the `IK6DView` in `backend/motion_control/views.py`, is responsible for calculating the inverse kinematics and then sending the resulting joint angles via UDP. This ensures that live robot joint data is transmitted as soon as a new target pose is calculated (e.g., when a user interacts with the 3D model or sends an IK request).

**Source File:** `backend/motion_control/views.py`

**Data Sent:** Robot joint positions, along with current speed and acceleration settings fetched from the `RobotSettings` model.

**UDP Host & Port:** `127.0.0.1:12345` (configurable)

**JSON Data Format (Sent):**

The data is sent as a JSON object with the following structure:

```json
{
    "timestamp": 1723312413.39, // Unix timestamp of when the data was sent
    "joints": [
        {"id": 1, "name": "A1", "pos": 45.0, "vel": 12.0, "accel": 2.0},
        {"id": 2, "name": "A2", "pos": 22.5, "vel": 10.0, "accel": 1.8},
        {"id": 3, "name": "A3", "pos": 90.0, "vel": 15.0, "accel": 2.1},
        {"id": 4, "name": "A4", "pos": 0.0,  "vel": 0.0,  "accel": 0.0},
        {"id": 5, "name": "A5", "pos": -10.0,"vel": 7.0,  "accel": 1.5},
        {"id": 6, "name": "A6", "pos": 60.0, "vel": 8.2,  "accel": 1.7}
    ],
    "gripper": { "position": 0.0, "force": 0.0 }, // Gripper position and force
    "profile": "IK_calculated", // Indicates the source/profile of motion
    "status": "active" // Current status of the robot/motion
}
```
- `timestamp`: Unix timestamp (float) indicating when the data was generated.
- `joints`: An array of objects, each representing a robot joint.
    - `id`: Integer identifier for the joint (1 to 6).
    - `name`: String name of the joint (e.g., "A1", "A2").
    - `pos`: Float value of the joint's current position (angle in degrees).
    - `vel`: Float value of the joint's current velocity (derived from `RobotSettings`).
    - `accel`: Float value of the joint's current acceleration (derived from `RobotSettings`).
- `gripper`: Object containing gripper status.
    - `position`: Float value of the gripper's position.
    - `force`: Float value of the gripper's force.
- `profile`: String indicating the motion profile or source of the data (e.g., "IK_calculated").
- `status`: String indicating the robot's status (e.g., "active").

## 3. Receiving Data with Python UDP Receiver

A dedicated Python script acts as a UDP receiver, listening for incoming packets. This script is designed to receive both regular joint data and specific error messages, logging only the latter to the Django `Feedback` model for review in the web interface.

**Source File:** `backend/udp_communication/udp_receiver.py`

**Functionality:**
- Listens on a specified host and port (`127.0.0.1:12345` by default).
- Decodes incoming UDP packets as UTF-8 strings.
- Parses the string as a JSON object.
- Prints all received data to the console.
- **Conditionally logs to Django Feedback:**
    - If the received JSON contains `"error"` and `"code"` keys, it's treated as an error message and logged to the `monitoring.models.Feedback` model with `type='HARDWARE'`.
    - If the received data is not valid JSON, it's also logged as a `HARDWARE` feedback message, indicating a potential communication issue.
    - Regular joint data messages (not containing "error" and "code") are printed to the console but *not* logged to the Django Feedback model, keeping the feedback log clean for critical issues.

**JSON Error Message Format (Received):**

The receiver is configured to specifically parse and log error messages in this format:

```json
{
  "error": "Checksum failed", // Description of the error
  "code": 101,                // Numeric error code
  "joint": 3,                 // Optional: if relevant to a specific joint
  "packet_id": 42             // Optional: if tracking packets
}
```

## 4. Conceptual C Code Example for Microcontroller Receiver

For direct communication with hardware, a microcontroller would need its own UDP receiving implementation. A conceptual C code example is provided, demonstrating the basic socket setup and data reception.

**Source File:** `backend/udp_communication/udp_receiver_microcontroller.c`

**Key Considerations for Microcontroller Implementation:**
- **Network Stack:** Requires a lightweight TCP/IP stack (e.g., LwIP, FreeRTOS+TCP) compatible with the microcontroller's RTOS (if any) and hardware.
- **JSON Parsing:** A lightweight JSON parsing library (e.g., JSMN, cJSON) adapted for embedded systems would be necessary to extract joint data from the received JSON string.
- **Hardware Integration:** The received joint data would then be used to control the robot's motors via appropriate hardware interfaces (e.g., PWM, step/direction signals).
- **Error Handling:** Robust error handling for network issues and data parsing is crucial for reliable operation.

This conceptual example provides a starting point; the actual implementation will vary significantly based on the chosen microcontroller, its peripherals, and the specific network and RTOS environment.

## How to Test

1.  **Start Django Backend:**
    ```bash
    python backend/manage.py runserver
    ```
2.  **Start Python UDP Receiver:**
    Navigate to `backend/udp_communication/` and run:
    ```bash
    python udp_receiver.py
    ```
3.  **Trigger Joint Data Send:**
    Interact with your robot's IK functionality via the web interface (e.g., move the end-effector target). This will cause `backend/motion_control/views.py` to send UDP packets.
    - Observe the `udp_receiver.py` console for received joint data.
    - Check the Django admin or your web interface's "Feedback" section; these messages should *not* appear there.
4.  **Send Dummy Error Message:**
    In a new terminal, navigate to `backend/udp_communication/` and run:
    ```bash
    python send_dummy_error.py
    ```
    - Observe the `udp_receiver.py` console for the received error message.
    - Check the Django admin or your web interface's "Feedback" section; this error message *should* appear there.
