import React, { useState, useEffect, useRef } from 'react';
import Deposit from './Deposit';
import Withdraw from './Withdraw';
import ChangePin from './ChangePin';
import Transactions from './Transactions';

export default function Dashboard({ userId }) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [view, setView] = useState('menu');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef(null);

  const menuOptions = [
    { label: 'Deposit Money', view: 'deposit' },
    { label: 'Withdraw Money', view: 'withdraw' },
    { label: 'Transaction History', view: 'transactions' },
    { label: 'Change PIN', view: 'changepin' },
    { label: 'Logout', action: () => window.location.reload() }
  ];

  useEffect(() => {
    containerRef.current.focus();
    refreshBalance();
  }, [view]);

  const refreshBalance = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/${userId}`);
      const data = await res.json();
      setBalance(data.balance);
      setTransactions(data.transactions || []);
    } catch (err) { console.error(err); }
  };

  const handleKeyDown = (e) => {
    if (view !== 'menu') {
      if (e.key === 'Escape') setView('menu');
      return;
    }

    if (e.key === 'ArrowDown') setSelectedIndex((prev) => (prev + 1) % menuOptions.length);
    else if (e.key === 'ArrowUp') setSelectedIndex((prev) => (prev - 1 + menuOptions.length) % menuOptions.length);
    else if (e.key === 'Enter') {
      const option = menuOptions[selectedIndex];
      if (option.view) setView(option.view);
      else if (option.action) option.action();
    } else if (e.key === 'Escape') setView('menu');
  };

  const renderMenu = () => (
    <div className="space-y-2 text-center">
      {menuOptions.map((option, index) => (
        <button
          key={index}
          onClick={() => option.view ? setView(option.view) : option.action()}
          className={`btn-primary w-full ${selectedIndex === index ? 'selected' : ''}`}
        >
          {option.label}
        </button>
      ))}
      <p className="text-sm mt-2 text-gray-500">Use ↑/↓ to navigate, Enter to select, Esc to go back</p>
    </div>
  );

  return (
    <div className="atm-container" ref={containerRef} tabIndex="0" onKeyDown={handleKeyDown}>
      <h2 className="atm-header">💳 ATM Dashboard</h2>
      <h3>Balance: <span className="text-green-500 font-bold">₹{balance}</span></h3>

      {view === 'menu' && renderMenu()}
      {view === 'deposit' && <Deposit userId={userId} refresh={refreshBalance} onBack={() => setView('menu')} />}
      {view === 'withdraw' && <Withdraw userId={userId} refresh={refreshBalance} onBack={() => setView('menu')} />}
      {view === 'changepin' && <ChangePin userId={userId} onBack={() => setView('menu')} />}
      {view === 'transactions' && <Transactions transactions={transactions} onBack={() => setView('menu')} />}
    </div>
  );
}
