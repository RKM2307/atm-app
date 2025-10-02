import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function ChangePin({ userId, onBack }) {
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [message, setMessage] = useState(null);
  const oldRef = useRef(null);

  useEffect(() => oldRef.current.focus(), []);

  const handleChangePin = async () => {
    if (newPin !== confirmPin) return setMessage({ type: 'error', text: 'New PIN and confirmation do not match' });
    if (newPin.length !== 4) return setMessage({ type: 'error', text: 'PIN must be 4 digits' });
    try {
      await axios.post('http://localhost:5000/api/changePin', {
        userId,
        oldPin: Number(oldPin),
        newPin: Number(newPin),
      });
      setMessage({ type: 'success', text: 'PIN changed successfully!' });
      setOldPin(''); setNewPin(''); setConfirmPin('');
      setTimeout(() => onBack(), 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Change PIN failed' });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleChangePin();
    else if (e.key === 'Escape') onBack();
  };

  return (
    <div className="atm-container">
      <h2 className="atm-header">🔑 Change PIN</h2>
      <input ref={oldRef} type="password" placeholder="Current PIN" value={oldPin} onChange={(e) => setOldPin(e.target.value.slice(0, 4))} onKeyDown={handleKeyDown} />
      <input type="password" placeholder="New PIN" value={newPin} onChange={(e) => setNewPin(e.target.value.slice(0, 4))} onKeyDown={handleKeyDown} />
      <input type="password" placeholder="Confirm New PIN" value={confirmPin} onChange={(e) => setConfirmPin(e.target.value.slice(0, 4))} onKeyDown={handleKeyDown} />
      {message && <p className={`message ${message.type}`}>{message.text}</p>}
      <div className="flex justify-center gap-4 mt-4">
        <button onClick={handleChangePin} className="btn-primary w-full">Change PIN</button>
        <button onClick={onBack} className="btn-secondary w-full">Back</button>
      </div>
    </div>
  );
}
