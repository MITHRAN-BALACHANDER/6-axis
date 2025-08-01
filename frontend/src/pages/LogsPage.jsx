import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const LogsPage = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [movementLogs, setMovementLogs] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      await axios.post('/api/auth/verify-log-password/', { password });
      setIsLocked(false);
    } catch (error) {
      console.error('Incorrect password', error);
      alert('Incorrect password');
    } finally {
      setIsVerifying(false);
    }
  };

  const fetchData = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true);
    }
    try {
      const [movementResponse, systemResponse, hardwareFeedbackResponse, softwareFeedbackResponse] = await Promise.all([
        axios.get('/api/monitoring/logs/'),
        axios.get('/api/monitoring/system-events/'),
        axios.get('/api/monitoring/feedback/hardware/'),
        axios.get('/api/monitoring/feedback/software/')
      ]);
      setMovementLogs(Array.isArray(movementResponse.data) ? movementResponse.data : []);
      setSystemLogs(Array.isArray(systemResponse.data) ? systemResponse.data : []);
      
      const hardwareFeedback = Array.isArray(hardwareFeedbackResponse.data) ? hardwareFeedbackResponse.data.map(item => ({ ...item, type: 'Hardware' })) : [];
      const softwareFeedback = Array.isArray(softwareFeedbackResponse.data) ? softwareFeedbackResponse.data.map(item => ({ ...item, type: 'Software' })) : [];
      
      setFeedback([...hardwareFeedback, ...softwareFeedback].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));

    } catch (error) {
      console.error('Error fetching data:', error);
      setMovementLogs([]);
      setSystemLogs([]);
      setFeedback([]);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!isLocked) {
      fetchData(true); // Initial fetch with loading state
      const interval = setInterval(() => {
        fetchData(false); // Subsequent fetches without loading state
      }, 5000); // Refresh every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isLocked, fetchData]);

  if (isLocked) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handlePasswordSubmit} className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Enter Password to View Logs</h2>
          <div className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border rounded"
              placeholder="Password"
              required
              disabled={isVerifying}
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={isVerifying}>
              {isVerifying ? 'Verifying...' : 'Unlock'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-auto bg-gray-100">
      <main className="p-6 flex flex-col gap-6">
        {/* Movement Logs Section */}
        <div className="container mx-auto bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Robot Movement Logs</h2>
          <div className="overflow-y-auto max-h-96">
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
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
            )}
          </div>
        </div>
        
      {/* Feedback Section */}
        <div className="container mx-auto bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Feedback</h2>
          <div className="overflow-y-auto max-h-96">
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Timestamp</th>
                    <th className="py-2 px-4 border-b">Type</th>
                    <th className="py-2 px-4 border-b">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {feedback.length > 0 ? (
                    feedback.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2 px-4 border-b">{new Date(item.timestamp).toLocaleString()}</td>
                        <td className="py-2 px-4 border-b">{item.type}</td>
                        <td className="py-2 px-4 border-b">{item.message}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4">No feedback found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* System Events Section */}
        <div className="container mx-auto bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">System Events</h2>
          <div className="overflow-y-auto max-h-96">
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LogsPage;
