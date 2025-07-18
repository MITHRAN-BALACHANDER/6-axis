import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

// Example mixed logs: staff & students, logins, logouts, robot moves
const logs = [
  {
    time: '2024-06-01 09:16:10',
    event: 'Staff Login',
    user: 'prof.1',
    details: 'Staff logged in to admin dashboard.',
  },
  {
    time: '2024-06-01 09:18:36',
    event: 'Student Login',
    user: 'student3',
    details: 'Logged in from Lab-PC-3.',
  },
  {
    time: '2024-06-01 09:21:12',
    event: 'Move Robot',
    user: 'student3',
    details: 'Moved Axis 3 from -46° to +22°',
  },
  {
    time: '2024-06-01 09:22:05',
    event: 'Profile Start',
    user: 'student2',
    details: 'Started S-Curve profile.',
  },
  {
    time: '2024-06-01 09:25:33',
    event: 'Move Robot',
    user: 'student1',
    details: 'Moved Axis 1 from 0° to 31°',
  },
  {
    time: '2024-06-01 09:45:45',
    event: 'Staff Logout',
    user: 'prof.1',
    details: 'Logged out from Admin panel.',
  },
  {
    time: '2024-06-01 09:48:18',
    event: 'Robot Stop',
    user: 'student1',
    details: 'Emergency stop triggered.',
  },
  {
    time: '2024-06-01 09:49:01',
    event: 'Download Logs',
    user: 'student2',
    details: 'Logs downloaded as CSV.',
  },
  // ...add more as needed
];

// Function to generate CSV and trigger download
function downloadLogs() {
  const csvRows = [
    ['Time', 'Event', 'User', 'Details'],
    ...logs.map(log =>
      [log.time, log.event, log.user, log.details].map(field => `"${field}"`).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvRows], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'robot_activity_logs.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const LogsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex flex-col">
      <Header />
      <Navbar />
      <main className="flex-1 flex flex-col items-center px-2 py-8">
        <section className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-6 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
            <h1 className="text-2xl font-bold text-green-800">Robot & Staff Activity Logs</h1>
            <Button buttonText="Download Logs" onClick={downloadLogs} />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-slate-200 rounded-lg">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Time</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Event</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">User</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="px-4 py-2">{log.time}</td>
                    <td className="px-4 py-2">{log.event}</td>
                    <td className="px-4 py-2">{log.user}</td>
                    <td className="px-4 py-2">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 text-sm text-gray-600">
            <p>
              <span className="font-semibold">Tip:</span> This log includes both staff logins and all robot movement/actions. Download for past  records.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LogsPage;
