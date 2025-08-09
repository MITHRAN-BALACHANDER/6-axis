import socket
import json


def udp_receiver(host='127.0.0.1', port=12345):
    """
    Receives JSON-encoded robot joint data over UDP.
    """
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)  # UDP
    sock.bind((host, port))

    print(f"Listening for UDP packets on {host}:{port}...")

    try:
        while True:
            data, addr = sock.recvfrom(1024)  # Buffer size is 1024 bytes
            decoded_data = data.decode('utf-8')
            try:
                received_data = json.loads(decoded_data)
                if "error" in received_data and "code" in received_data:
                    print(f"Received error from {addr}:")
                    print(f"  Error: {received_data.get('error')}")
                    print(f"  Code: {received_data.get('code')}")
                    if "joint" in received_data:
                        print(f"  Joint: {received_data.get('joint')}")
                    if "packet_id" in received_data:
                        print(f"  Packet ID: {received_data.get('packet_id')}")
                else:
                    print(f"Received from {addr}: {received_data}")
            except json.JSONDecodeError:
                print(f"Received non-JSON or malformed data from {addr}: {decoded_data}")
    except KeyboardInterrupt:
        print("Receiver stopped.")
    finally:
        sock.close()


if __name__ == "__main__":
    udp_receiver()
