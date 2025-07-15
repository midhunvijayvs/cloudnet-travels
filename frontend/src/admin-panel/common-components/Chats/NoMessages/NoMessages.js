import React from 'react';
import './NoMessages.scss';

const NoMessages = ({ sendMessage }) => {
  const greetings = [
    { text: "👋 Hi" },
    { text: "Hello" },
    { text: "Hi, I need help" },
    { text: "Hey, I have a question." }
  ];

  const handleSendMsg = (msg) => {
    sendMessage(msg)
  }
  return (
    <div className="no-messages-container">
      <div className='message-card'>
        <p className="no-messages-title">No Messages here yet..</p>
        <p className="no-messages-subtitle">Send a msg or tap on the greeting below.</p>
        <div className="greetings-container">
          {greetings.map((greeting, index) => (
            <div
              key={index}
              className="msg"
              onClick={() => handleSendMsg(greeting.text)}
            >
              {greeting.text}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default NoMessages;
