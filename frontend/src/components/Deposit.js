import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function Deposit({ userId, refresh, onBack }) {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => inputRef.current.focus(), []);

  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) {
      setMessage({ type: 'error', text: 'Enter a valid amount' });
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/deposit', { userId, amount: Number(amount) });
      setAmount('');
      setMessage({ type: 'success', text: 'Deposit successful!' });
      refresh();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Deposit failed' });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleDeposit();
    else if (e.key === 'Escape') onBack();
  };

  return (
    <div className="atm-container">
      <h2 className="atm-header">💰 Deposit Money</h2>
      <input
        ref={inputRef}
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {message && <p className={`message ${message.type}`}>{message.text}</p>}
      <div className="flex flex-col gap-2 mt-4">
        <button onClick={handleDeposit} className="btn-primary w-full">Deposit</button>
        <button onClick={onBack} className="btn-secondary w-full">Back</button>
      </div>
    </div>
  );
}
