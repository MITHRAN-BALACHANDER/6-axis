import asyncio
import serial
import serial_asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
import json
import platform
from serial.tools import list_ports

class RobotConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        
        self.port_name = "COM5" if platform.system() == "Windows" else "/dev/ttyUSB0"
        device_description = "Unknown Device"

        # Find the description of the serial port
        ports = list_ports.comports()
        for p in ports:
            if p.device == self.port_name:
                device_description = p.description
                break
        
        # Start serial reader task
        loop = asyncio.get_event_loop()
        try:
            self.transport, self.protocol = await serial_asyncio.create_serial_connection(
                loop, lambda: SerialReader(self), self.port_name, baudrate=115200
            )
            await self.send(text_data=json.dumps({'status': 'connected', 'device': self.port_name, 'description': device_description}))
            # Start the connection checker
            self.check_connection_task = asyncio.create_task(self.check_serial_connection())
        except serial.SerialException as e:
            await self.send(text_data=json.dumps({'status': 'error', 'error': f"Could not open port '{self.port_name}': {e}"}))
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, 'check_connection_task'):
            self.check_connection_task.cancel()
        if hasattr(self, 'transport') and self.transport:
            self.transport.close()

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
            angle_str = ",".join([f"{key}:{value}" for key, value in angles.items()])
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
