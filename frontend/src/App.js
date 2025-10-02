// App.js
import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [userId, setUserId] = useState(null);

  return (
    <div>
      {!userId ? (
        <Login setUserId={setUserId} />
      ) : (
        <Dashboard userId={userId} />
      )}
    </div>
  );
}

export default App;
