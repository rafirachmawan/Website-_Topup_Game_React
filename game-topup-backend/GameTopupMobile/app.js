import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:4000');

const App = () => {
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
    <View style={{ padding: 20 }}>
      <Text>Top Up Game</Text>
      <TextInput
        placeholder="User ID"
        value={userId}
        onChangeText={setUserId}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
      />
      <Button title="Top Up" onPress={handleTopup} />
      <Text>Current Balance: {balance}</Text>
    </View>
  );
};

export default App;
