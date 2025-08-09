import socket
import json
import os
import sys

# Add the 'backend' directory to the Python path
# This allows Django to find the 'robotics' project's settings
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(current_dir, '..')
sys.path.insert(0, backend_dir)

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'robotics.settings')
django.setup()

from monitoring.models import Feedback


def udp_receiver(host='127.0.0.1', port=12345):
    """
    Receives JSON-encoded robot joint data over UDP and logs it to Django
    Feedback model.
    """
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)  # UDP
    sock.bind((host, port))

    print(f"Listening for UDP packets on {host}:{port}...")

    try:
        while True:
            data, addr = sock.recvfrom(1024)  # Buffer size is 1024 bytes
            decoded_data = data.decode('utf-8')

            log_message = ""
            try:
                received_data = json.loads(decoded_data)
                if "error" in received_data and "code" in received_data:
                    log_message = (f"Received error from {addr}: "
                                   f"Error: {received_data.get('error')}, "
                                   f"Code: {received_data.get('code')}")
                    if "joint" in received_data:
                        log_message += f", Joint: {received_data.get('joint')}"
                    if "packet_id" in received_data:
                        log_message += (f", Packet ID: "
                                        f"{received_data.get('packet_id')}")
                else:
                    log_message = f"Received from {addr}: {received_data}"

                print(log_message)  # Always print to console for immediate feedback
                if "error" in received_data and "code" in received_data:
                    Feedback.objects.create(type='HARDWARE', message=log_message)
                
            except json.JSONDecodeError:
                log_message = (f"Received non-JSON or malformed data from "
                               f"{addr}: {decoded_data}")
                print(log_message)  # Always print to console
                # Log non-JSON data as a potential hardware issue/error
                Feedback.objects.create(type='HARDWARE', message=log_message)
                
    except KeyboardInterrupt:
        print("Receiver stopped.")
    finally:
        sock.close()


if __name__ == "__main__":
    udp_receiver()
