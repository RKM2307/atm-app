import React from 'react';

export default function Transactions({ transactions, onBack }) {
  return (
    <div className="atm-container">
      <h2 className="atm-header">📄 Transaction History</h2>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{t.type === 'credit' ? 'Deposit' : 'Withdraw'}</td>
                <td>{t.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={onBack} className="btn-secondary mt-4 w-full">Back</button>
    </div>
  );
}
