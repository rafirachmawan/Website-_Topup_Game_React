import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:4000');

function App() {
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    socket.on('balanceUpdated', ({ userId: updatedUserId, newBalance }) => {
      if (updatedUserId === userId) {
        setBalance(newBalance);
      }
    });

    return () => {
      socket.off('balanceUpdated');
    };
  }, [userId]);

  const handleTopup = async () => {
    try {
      const response = await axios.post('http://localhost:4000/topup', {
        userId,
        amount: parseInt(amount, 10),
      });
      setBalance(response.data.newBalance);
    } catch (error) {
      console.error('Error topping up', error);
    }
  };

  return (
    <div>
      <h1>Top Up Game</h1>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleTopup}>Top Up</button>
      <h2>Current Balance: {balance}</h2>
    </div>
  );
}

export default App;
