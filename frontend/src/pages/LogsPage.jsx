import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

const LogsPage = () => {
  const [movementLogs, setMovementLogs] = useState([]);
  const [systemLogs, setSystemLogs] = useState('');

  useEffect(() => {
    const fetchMovementLogs = async () => {
      try {
        const response = await axios.get('/api/monitoring/logs/');
        if (Array.isArray(response.data)) {
          setMovementLogs(response.data);
        } else {
          setMovementLogs([]);
        }
      } catch (error) {
        console.error('Error fetching movement logs:', error);
        setMovementLogs([]);
      }
    };

    const fetchSystemLogs = async () => {
      try {
        const response = await axios.get('/api/monitoring/system-events/');
        if (Array.isArray(response.data)) {
          setSystemLogs(response.data);
        } else {
          setSystemLogs([]);
        }
      } catch (error) {
        console.error('Error fetching system events:', error);
        setSystemLogs([]);
      }
    };

    fetchMovementLogs();
    fetchSystemLogs();

    const interval = setInterval(() => {
      fetchMovementLogs();
      fetchSystemLogs();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen overflow-auto bg-gray-100">
      <Header />
      <Navbar />
      <main className="p-6 flex flex-col gap-6">
        {/* Movement Logs Section */}
        <div className="container mx-auto bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Robot Movement Logs</h2>
          <div className="overflow-y-auto max-h-96">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Timestamp</th>
                  <th className="py-2 px-4 border-b">J1</th>
                  <th className="py-2 px-4 border-b">J2</th>
                  <th className="py-2 px-4 border-b">J3</th>
                  <th className="py-2 px-4 border-b">J4</th>
                  <th className="py-2 px-4 border-b">J5</th>
                  <th className="py-2 px-4 border-b">J6</th>
                </tr>
              </thead>
              <tbody>
                {movementLogs.length > 0 ? (
                  movementLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="py-2 px-4 border-b">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="py-2 px-4 border-b">{log.joint1.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">{log.joint2.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">{log.joint3.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">{log.joint4.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">{log.joint5.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">{log.joint6.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">No movement logs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Events Section */}
        <div className="container mx-auto bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">System Events</h2>
          <div className="overflow-y-auto max-h-96">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Timestamp</th>
                  <th className="py-2 px-4 border-b">Event Type</th>
                  <th className="py-2 px-4 border-b">Message</th>
                </tr>
              </thead>
              <tbody>
                {systemLogs.length > 0 ? (
                  systemLogs.map((event) => (
                    <tr key={event.id}>
                      <td className="py-2 px-4 border-b">{new Date(event.timestamp).toLocaleString()}</td>
                      <td className="py-2 px-4 border-b">{event.event_type}</td>
                      <td className="py-2 px-4 border-b">{event.message}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4">No system events found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LogsPage;
