import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

const faqs = [
  {
    question: "How do I control the 6-axis robot?",
    answer: "Navigate to the Dashboard. Use the simulation controls and sliders to move each robot axis. You can also use the settings panel for precise configuration."
  },
  {
    question: "How can I visualize motion profiles?",
    answer: "Go to the Graph page to view and analyze robot motion profiles. You can choose different profile types and save graph images."
  },
  {
    question: "What if the robot interface is not loading?",
    answer: "Check your internet connection and ensure your browser is updated. If the issue persists, contact support."
  },
  {
    question: "How do I reset the robot to default settings?",
    answer: "Click the 'Reset' button in the Control Panel inside the Dashboard page."
  }
];

const Help = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex flex-col">
    <Header />
    <Navbar />
    <main className="flex-1 flex justify-center items-start px-2 py-8">
      <section className="bg-white rounded-2xl shadow-lg max-w-2xl w-full p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">Help & Support</h1>
        
        <div className="mb-4">
          <p className="text-gray-800 mb-2">
            If you need assistance, please refer to the resources below:
          </p>
          <ul className="mb-5 space-y-2">
            <li>
              <a
                href="/faq"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Frequently Asked Questions
              </a>
            </li>
            <li>
              <a
                href="/guides"
                className="text-blue-600 underline hover:text-blue-800"
              >
                User Guides
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Contact Support
              </a>
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-slate-50 rounded-lg p-4 shadow-sm">
                <div className="font-semibold text-gray-900 mb-1">{faq.question}</div>
                <div className="text-gray-700 text-base">{faq.answer}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-gray-700 mb-2">
            Still have questions or need individual assistance? Reach out to our support team:
          </p>
          <a
            href="mailto:admin@siet.ac.in"
            className="text-blue-700 underline font-medium"
          >
            admin@siet.ac.in
          </a>
        </div>
      </section>
    </main>
  </div>
);

export default Help;
