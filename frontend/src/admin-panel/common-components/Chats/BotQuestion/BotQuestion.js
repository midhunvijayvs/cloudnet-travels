import React, { useState } from 'react';
import './BotQuestion.scss'
import { convertTo12HourTime, parseBotMessage } from '../../../../GeneralFunctions';

const BotQuestion = ({ currentUserId, chatMessage, onOptionSelect, source, chat }) => {
  // State to track if the menu is open
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const getOptionsList = (message) => {
    try {
      const parsedMessage = typeof message === 'string' ? JSON.parse(message) : {};
      return parsedMessage.list || [];
    } catch (error) {
      // console.error('Error parsing JSON:', error, 'Message:', message);
      return [];
    }
  };


  // Function to handle option selection
  const handleOptionClick = (index, option) => {
    if (onOptionSelect &&  isLatestBotQuestion){
      onOptionSelect(index, option);
    }
    setIsMenuOpen(false); // Close the menu after an option is selected
  };

  // Function to toggle the menu visibility
  const toggleMenu = () => {
    if (isLatestBotQuestion) {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const lastBotQuestion = chat?.slice().reverse().find(msg => msg.bot_question);
  const isLatestBotQuestion = lastBotQuestion && lastBotQuestion.id === chatMessage.id;



  return (
    <div className="bot-question">
      <p className="bot-message">
        {parseBotMessage(chatMessage.message)}
      </p>

      {/* Show the "Menu" button initially */}
      {/* {getOptionsList(chatMessage.message)?.length > 0 &&
        <div className={`show-options-button ${!isLatestBotQuestion && 'disabled'}`} onClick={toggleMenu}>
          <img
            src='/images/chat/bot/menu.svg'
            className={`menu-icon ${isMenuOpen ? 'open' : ''}`}
            alt="Menu Icon"
          />
          <span>Menu</span>
          <img
            src='/images/chat/bot/arrow-down.svg'
            className={`arrow-icon ${isMenuOpen ? 'open' : ''}`}
            alt="Arrow Icon"
          />
        </div>
      } */}

      {/* Popup for menu options */}
      {(
        <div className="popup-menu">
          <ul className="bot-options-list">
            {getOptionsList(chatMessage.message).map((option, index) => (
              <li key={index} className={`bot-option ${!isLatestBotQuestion && 'disabled'}`}>
                <button
                  className="option-button"
                  onClick={() => handleOptionClick(index, option)}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="message-meta">
        <span className="time">
          {chatMessage.created_at && convertTo12HourTime(chatMessage.created_at)}
        </span>
        {String(chatMessage.from_user) === String(currentUserId) && (
          <span className={`status status-${chatMessage.delivery_status}`}>
            {chatMessage.delivery_status === 0
              ? <img src="/images/chat/tick-single.svg" className="status-tick" alt='Sent' />
              : chatMessage.delivery_status === 1
                ? <img src="/images/chat/tick-delivered.svg" className="status-tick" alt='Delivered' />
                : <img src="/images/chat/tick-read.svg" className="status-tick" alt='Read' />
            }
          </span>
        )}

      </div>
    </div>
  );
};

export default BotQuestion;
