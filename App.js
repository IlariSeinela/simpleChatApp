// client/src/App.js

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

const SOCKET_SERVER_URL = "http://localhost:5000"; // Backend server URL

function App() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Listen for incoming messages
    newSocket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Cleanup on component unmount
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    // Scroll to the bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
    const fullMessage = `${username}: ${message}`;
    // Emit the message to the server
    socket.emit('chat message', fullMessage);
    setMessage("");
  };

  const handleSetUsername = (e) => {
    e.preventDefault();
    if (username.trim() === "") return;
    setIsUsernameSet(true);
  };

  if (!isUsernameSet) {
    return (
      <div className="App">
        <h1>Welcome to Simple Chat!</h1>
        <form onSubmit={handleSetUsername} className="username-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username..."
            className="username-input"
          />
          <button type="submit" className="username-button">Join Chat</button>
        </form>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Simple Chat Application</h1>
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              {msg}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="message-form">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="message-input"
          />
          <button type="submit" className="send-button">Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
