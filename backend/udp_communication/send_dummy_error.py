import socket
import json
import time

def send_dummy_error(host='127.0.0.1', port=12345):
    """
    Sends a dummy JSON-encoded error message over UDP.
    """
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) # UDP

    error_message = {
      "error": "Dummy Hardware Error",
      "code": 500,
      "joint": 1,
      "packet_id": int(time.time())
    }
    message = json.dumps(error_message).encode('utf-8')

    try:
        sock.sendto(message, (host, port))
        print(f"Sent dummy error: {message.decode('utf-8')}")
    except Exception as e:
        print(f"Error sending dummy error: {e}")
    finally:
        sock.close()

if __name__ == "__main__":
    send_dummy_error()
