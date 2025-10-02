import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function Login({ setUserId }) {
  const [pin, setPin] = useState('');
  const [message, setMessage] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => inputRef.current.focus(), []);

  const handleLogin = async () => {
    if (pin.length !== 4) return setMessage({ type: 'error', text: 'Enter 4-digit PIN' });
    try {
      const res = await axios.post('http://localhost:5000/api/login', { pin: Number(pin) });
      if (res.data.success) setUserId(res.data.userId);
      else { setMessage({ type: 'error', text: 'Invalid PIN' }); setPin(''); }
    } catch {
      setMessage({ type: 'error', text: 'Login failed' }); setPin('');
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleLogin(); };

  return (
    <div className="atm-container">
      <h2 className="atm-header">💳 ATM Login</h2>
      <input
        ref={inputRef}
        type="number"
        placeholder="Enter PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value.slice(0, 4))}
        onKeyDown={handleKeyDown}
      />
      {message && <p className={`message ${message.type}`}>{message.text}</p>}
      <button onClick={handleLogin} className="btn-primary mt-4 w-full">Enter</button>
    </div>
  );
}
