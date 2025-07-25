import './App.css';
import React, { useState } from 'react';

function App() {
  const [gmail, setGmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Confirm dialog
    const confirm = window.confirm(`Submit this email?\n${gmail}`);
    if (!confirm) return;

    const password = window.prompt("Enter a password:");
    if (password !== 'Noob') return;

    // Gmail format validation
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(gmail)) {
      setError('Please enter a valid Gmail address');
      setMessage('');
      return;
    }

    try {
      const res = await fetch('https://n8n-email-job-apply-node-js.onrender.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: gmail })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Server Error');
      }

      // If data.message is a JSON string, parse it
      const response = typeof data.message === 'string' ? JSON.parse(data.message) : data.message;

      setMessage(response.message || 'Submitted successfully!');
      setError('');
      setGmail('');

      setTimeout(() => {
        setMessage('');
      }, 3000);

    } catch (err) {
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 p-4">
      <div className="bg-green-500 shadow-xl rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-4 text-center">Enter Your Gmail</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="you@gmail.com"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
            className="w-full border bg-violet-300 border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
          >
            Submit
          </button>
          {message && <p className="text-green-900 text-center mt-2">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default App;
