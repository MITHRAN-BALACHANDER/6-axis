import asyncio
import serial
import serial_asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
import json
import platform
from serial.tools import list_ports


class RobotConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.serial_port = None
        self.serial_thread = None
        self.send_queue = queue.Queue()
        self.receive_queue = queue.Queue()
        self.running = False
        self.stop_event = threading.Event()

    async def connect(self):
        await self.accept()
        
        self.port_name = (
            "COM4" if platform.system() == "Windows" else "/dev/ttyUSB0"
        )  # Default serial port
        device_description = "Unknown Device"  # Initialize
        # with a default value

        ports = list_ports.comports()
        for p in ports:
            if p.device == self.port_name:
                device_description = p.description
                break
        
        try:
            self.serial_port = serial.Serial(
                self.port_name, baudrate=115200, timeout=0.1
            )
            self.serial_thread = threading.Thread(
                target=self.serial_worker, daemon=True
            )
            self.serial_thread.start()
            
            await self.send(text_data=json.dumps({
                'status': 'connected',
                'device': self.port_name,
                'description': device_description
            }))
            
            self.receive_task = asyncio.create_task(self.read_from_queue())
            self.check_connection_task = asyncio.create_task(
                self.check_serial_connection()
            )
        except serial.SerialException as e:
            await self.send(text_data=json.dumps({'status': 'error', 'error': f"Could not open port '{self.port_name}': {e}"}))
            await self.close()

    async def disconnect(self, close_code):
        self.running = False
        self.stop_event.set()  # Signal the serial worker to stop
        if hasattr(self, 'check_connection_task'):
            self.check_connection_task.cancel()
        if hasattr(self, 'receive_task'):
            self.receive_task.cancel()
        if self.serial_thread and self.serial_thread.is_alive():
            # Give thread a bit more time, though event should make it faster
            self.serial_thread.join(timeout=2)
        if self.serial_port and self.serial_port.is_open:
            self.serial_port.close()

    async def read_from_queue(self):
        while self.running:
            try:
                data = await asyncio.to_thread(self.receive_queue.get, timeout=0.1)
                await self.send(text_data=data)
            except queue.Empty:
                await asyncio.sleep(0.01)  # Small sleep to prevent busy-waiting
            except asyncio.CancelledError:
                break

    def serial_worker(self):
        while self.running:
            try:
                # Read from serial
                if self.serial_port.in_waiting > 0:
                    line = (
                        self.serial_port.readline()
                        .decode('utf-8', errors='ignore')
                        .strip()
                    )
                    if line:
                        self.receive_queue.put(line)
                
                # Write to serial
                try:
                    data_to_send = self.send_queue.get_nowait()
                    self.serial_port.write(data_to_send.encode())
                except queue.Empty:
                    pass  # No data to send
            except serial.SerialException as e:
                print(f"Serial worker error: {e}")
                self.running = False
                break
            except Exception as e:
                print(f"Unexpected serial worker error: {e}")
                self.running = False
                break
            
            # Wait for a short period or until signaled to stop
            self.stop_event.wait(0.01)

    async def check_serial_connection(self):
        while True:
            await asyncio.sleep(2)  # Check every 2 seconds
            if self.port_name not in [p.device for p in list_ports.comports()]:
                await self.send(text_data=json.dumps({'status': 'disconnected', 'error': f"Device {self.port_name} disconnected"}))
                if hasattr(self, 'transport') and self.transport:
                    self.transport.close()
                break

    async def receive(self, text_data):
        data = json.loads(text_data)
        if not (hasattr(self, 'protocol') and self.protocol and hasattr(self.protocol, 'transport')):
            print("Serial connection not available.")
            return

        if data.get("type") == "comment":
            comment_text = data.get('payload', '')
            print(f"Received comment: {comment_text}")
            self.protocol.transport.write(comment_text.encode())
        elif data.get("type") == "angles":
            angles = data.get("payload")
            angle_str = ",".join(
                f"{key}:{value}" for key, value in angles.items()
            )
            print(f"Sending angles: {angle_str}")
            self.protocol.transport.write(angle_str.encode())
        else:
            # Fallback for other data
            self.protocol.transport.write(text_data.encode())

    async def send_robot_data(self, data):
        await self.send(text_data=data)

class SerialReader(asyncio.Protocol):
    def __init__(self, consumer):
        self.consumer = consumer
        self.buffer = b""
        self.transport = None

    def connection_made(self, transport):
        self.transport = transport

    def data_received(self, data):
        self.buffer += data
        if b"\n" in self.buffer:
            line, self.buffer = self.buffer.split(b"\n", 1)
            asyncio.create_task(self.consumer.send_robot_data(line.decode().strip()))
