import React, { useState, useEffect } from 'react';

const RobotStatus = () => {
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [command, setCommand] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const ws = new WebSocket(`ws://${window.location.host}/ws/robot/`);
        setSocket(ws);

        ws.onopen = () => {
            console.log('WebSocket connected');
            setIsConnected(true);
        };

        ws.onmessage = (event) => {
            setMessages((prevMessages) => [...prevMessages, event.data]);
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
        };

        ws.onerror = () => {
            console.error('WebSocket error');
            setIsConnected(false);
        };

        return () => {
            ws.close();
        };
    }, []);

    const handleSendCommand = () => {
        if (socket && command && isConnected) {
            socket.send(command);
            setCommand('');
        }
    };

    return (
        <div>
            <h2>Robot Status: {isConnected ? <span style={{ color: 'green' }}>Connected</span> : <span style={{ color: 'red' }}>Disconnected</span>}</h2>
            <div>
                <input
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    disabled={!isConnected}
                />
                <button onClick={handleSendCommand} disabled={!isConnected}>Send Command</button>
            </div>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    );
};

export default RobotStatus;
