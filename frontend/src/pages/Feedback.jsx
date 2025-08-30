import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const FeedbackPage = () => {
  console.log("FeedbackPage rendered");
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true);
    }
    try {
      const [hardwareResponse, softwareResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/monitoring/feedback/hardware/`),
        axios.get(`${API_BASE_URL}/api/monitoring/feedback/software/`)
      ]);

      const hardwareFeedback = Array.isArray(hardwareResponse.data) ? hardwareResponse.data.map(item => ({ ...item, type: 'Hardware' })) : [];
      const softwareFeedback = Array.isArray(softwareResponse.data) ? softwareResponse.data.map(item => ({ ...item, type: 'Software' })) : [];
      
      setFeedback([...hardwareFeedback, ...softwareFeedback].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));

    } catch (error) {
      console.error('Error fetching feedback:', error);
      setFeedback([]);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => {
      fetchData(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="h-screen overflow-auto bg-gray-100">
      <main className="p-6">
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
      </main>
    </div>
  );
};

export default FeedbackPage;
