import serial
import argparse


def construct_command_frame(slave_id, angle, speed, profile):
    """
    Constructs a command frame to be sent to the STM32 master controller.
    Frame format:
    - Start Byte: 0xAA
    - Command: 0x01 (Set motion for single slave)
    - Slave ID: 1-6
    - Angle: 0-255
    - Speed: 0-65535 (sent as two bytes, LSB first)
    - Profile: 0-255
    - Checksum: Sum of bytes from Command to Profile
    - End Byte: 0x55
    """
    frame = bytearray(9)
    frame[0] = 0xAA  # Start byte
    
    # Payload
    frame[1] = 0x01  # Command
    frame[2] = slave_id
    frame[3] = angle
    frame[4] = speed & 0xFF  # Speed LSB
    frame[5] = (speed >> 8) & 0xFF  # Speed MSB
    frame[6] = profile
    
    # Checksum (from command to profile)
    checksum = sum(frame[1:7]) & 0xFF
    frame[7] = checksum
    
    frame[8] = 0x55  # End byte
    
    return frame


def send_command(port, baudrate, slave_id, angle, speed, profile):
    """
    Opens a serial port, sends a command frame, and prints the response.
    """
    try:
        with serial.Serial(port, baudrate, timeout=2) as ser:
            command_frame = construct_command_frame(
                slave_id, angle, speed, profile
            )
            
            print(f"Connecting to {port} at {baudrate} baud.")
            print(
                f"Sending command to Slave ID {slave_id}: Angle={angle}, "
                f"Speed={speed}, Profile={profile}"
            )
            print(
                f"Raw frame being sent: "
                f"{' '.join(f'0x{b:02X}' for b in command_frame)}"
            )
            
            ser.write(command_frame)
            print("Command sent.")
            
            # The STM32 code sends a 5-byte ACK:
            # {0xAA, 0x02, slave, chks, 0x55}
            print("Waiting for ACK from master controller...")
            response = ser.read(5)
            
            if response:
                print(
                    f"Received response: "
                    f"{' '.join(f'0x{b:02X}' for b in response)}"
                )
                # Optional: Add validation for the ACK response here
            else:
                print("No response received. Check connections and firmware.")
                
    except serial.SerialException as e:
        print(f"Error: Could not open serial port {port}. {e}")
        print(
            "Please ensure you have the correct port name (e.g., COM3 on "
            "Windows, /dev/ttyUSB0 on Linux)."
        )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Test script for STM32 master controller communication."
    )
    parser.add_argument("port", help="Serial port name (e.g., COM3).")
    parser.add_argument(
        "--baudrate",
        type=int,
        default=115200,
        help="Baud rate for the serial communication."
    )
    parser.add_argument(
        "--slave-id",
        type=int,
        default=1,
        choices=range(1, 7),
        help="Slave ID (1-6)."
    )
    parser.add_argument(
        "--angle", type=int, default=90, help="Angle (0-255)."
    )
    parser.add_argument(
        "--speed", type=int, default=1000, help="Speed (0-65535)."
    )
    parser.add_argument(
        "--profile",
        type=int,
        default=1,
        help="Motion profile ID (0-255)."
    )
    
    args = parser.parse_args()
    
    send_command(
        args.port,
        args.baudrate,
        args.slave_id,
        args.angle,
        args.speed,
        args.profile
    )
