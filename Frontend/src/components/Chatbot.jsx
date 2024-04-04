import React, { useState } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [message, setMessage] = useState('');

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      console.log("User message: ", message)
      const response = await fetch('http://127.0.0.1:8000/chats/1234/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
      });
      let msg = await response.json();
      console.log("Chatbot response: ", msg.data);
      
      if (!response.ok) {
        throw new Error('Failed to submit message');
      }
      
    
      setMessage('');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={handleMessageChange}
          className="input-box"
        />
        <button onClick={handleSubmit} className="submit-button">Submit</button>
      </div>
    </div>
  );
};

export default Chatbot;
