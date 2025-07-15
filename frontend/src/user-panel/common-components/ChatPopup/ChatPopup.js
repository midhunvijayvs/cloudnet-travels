import React, { useCallback, useEffect, useRef, useState } from "react";
import "./ChatPopup.scss";
import API from '../../../API';
import ErrorModal from "../../../ErrorModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import { convertTo12HourTime, createRoomName, formatChatDate, getFileNameFromUrl } from "../../../GeneralFunctions";
import useWebSocket from "react-use-websocket";
import EmojiPicker from "emoji-picker-react";
import TypingIndicator from "../../../admin-panel/common-components/Chats/TypingIndicator/TypingIndicator";
import ChatBlockClosePopup from "../../../admin-panel/common-components/Chats/ChatBlockClosePopup/ChatBlockClosePopup";
import UserChatBlockClosePopup from "../../../admin-panel/common-components/Chats/UserChatBlockClosePopup/UserChatBlockClosePopup";
import BotQuestion from "../../../admin-panel/common-components/Chats/BotQuestion/BotQuestion";
import NoMessages from "../../../admin-panel/common-components/Chats/NoMessages/NoMessages";


const ChatPopup = ({
  primaryColor = '#004938',
  secondaryColor = '#ef3401',
  heading = "Chat with us",
  currentUserId = 1,
  toUserId = 2,
  source = 'home',
  entryTitle = 'Start a conversation with Admin.',
  orderData = null,
  isChatOpen = false
}) => {


  const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const MAX_FILE_SIZE_MB = 3; // Max size in MB


  const [isOpen, setIsOpen] = useState(isChatOpen);
  const [chat, setChat] = useState([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
    to_user: toUserId,
  })
  const fileInputRef = useRef(null);
  const observer = useRef(null); // For Read Message

  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isBlockCloseModalOpen, setIsBlockCloseModalOpen] = useState(false);


  const [otherUserTyping, setOtherUserTyping] = useState(false); //is_typing

  // Find  unread message
  const unreadMessageRef = useRef(null);
  const chatEndRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // State for tracking unread message visibility
  const [unreadCount, setUnreadCount] = useState(0); // Tracks the current unread count
  const [initialUnreadCount, setInitialUnreadCount] = useState(0); // Tracks the initial unread count when the chat is opened
  const [showUnreadIndicator, setShowUnreadIndicator] = useState(true); // Controls the visibility of unread message indicator
  const [hasScrolledToUnread, setHasScrolledToUnread] = useState(false);
  const [firstUnreadId, setFirstUnreadId] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  const [isOrderMsgLoading, setIsOrderMsgLoading] = useState(false)
  // Reopen chat only when orderData changes AND source is 'orders'
  useEffect(() => {
    const handleChatLogic = async () => {
      if (orderData && source === 'orders') {
        setIsOrderMsgLoading(true)
        try {
          await loadData();
          // If chat has messages, close the last chat block first
          if (chat.length > 0) {
            await closeChatBlockObject(chat[chat.length - 1].chat_block);
          }
          // Send a message regarding the specific order
          const message = `Hello, I have a question regarding my order #${orderData.id}.`;
          await API.post('/communication/messages/', {
            to_user: toUserId,
            message: message,
            order_id: orderData.id,
            bot_reply: true,
            bot_question_id: '1',
            bot_question_id_list: [1],
          });
        } catch (error) {
          setIsOrderMsgLoading(false)
          console.error('Error closing chat block or sending message:', error);
        }
        setIsOrderMsgLoading(false)
        setIsOpen(true); // Open the chat after all logic is complete
      }
    };

    handleChatLogic();
  }, [orderData, source]);


  useEffect(() => {
    setFormData({
      message: "",
      to_user: toUserId,
    });

  }, [toUserId]);



  // Track whether the chat is opened or not
  useEffect(() => {
    setChatOpen(false);// Set chat as open when activeChatId changes
    setShowUnreadIndicator(true); // Show unread message indicator
    setHasScrolledToUnread(false); // Reset scroll tracking
    setFirstUnreadId(null); // Reset unread message tracking
    setInitialUnreadCount(0)
  }, [isOpen, orderData]);


  // Calculate unread messages and set the first unread message flag
  useEffect(() => {
    const unreadMessages = chat.filter(
      (msg) =>
        (msg.delivery_status === 0 || msg.delivery_status === 1) &&
        String(msg.from_user) !== String(currentUserId)
    );

    if (unreadMessages.length > 0 && firstUnreadId === null) {
      // Set initial unread count only when chat is first opened
      if (initialUnreadCount === 0) {
        setInitialUnreadCount(unreadMessages.length); // Store the initial unread count
      }
      setUnreadCount(unreadMessages.length);
      setFirstUnreadId(unreadMessages[0].id);
      setHasScrolledToUnread(false); // Reset scrolling tracking
    } else if (unreadMessages.length === 0 && showUnreadIndicator) {
      // Hide the unread message indicator if no unread messages and chat is still open
      setShowUnreadIndicator(false);
    }
  }, [chat, initialUnreadCount]);

  // Scroll to first unread message or end
  useEffect(() => {
    if (firstUnreadId !== null && !hasScrolledToUnread) {
      const unreadMessageElement = unreadMessageRef.current;
      if (unreadMessageElement) {
        setTimeout(() => {
          console.log("Scrolling to first unread message...");
          unreadMessageElement.scrollIntoView({ behavior: "smooth", block: "start" });
          setHasScrolledToUnread(true);
        }, 100); // Add a small delay to ensure the DOM is fully rendered
      }
    } else if (!hasScrolledToUnread && chatEndRef.current && !chatOpen) {
      setChatOpen(true);
      setTimeout(() => {
        console.log("Scrolling to end...");
        chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
    }
  }, [firstUnreadId, hasScrolledToUnread, chat]);

  // Scroll to the last message
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  // Track scrolling to toggle the scroll button
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // Show the button when the user scrolls up from the bottom
    setShowScrollButton(scrollTop < scrollHeight - clientHeight - 100); // 100px offset from bottom
  };
  // Attach the scroll event listener to the chat container
  useEffect(() => {
    const chatContainer = document.getElementById('chat-container'); // Ensure container has an ID
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isOpen]);


  // Initialize WebSocket connection using react-use-websocket
  const WEBSOCKET_BASE_URL = process.env.REACT_APP_WEBSOCKET_BASE_URL
  const token = localStorage.getItem("accessToken");
  const roomName = createRoomName(currentUserId, toUserId);
  const { sendMessage, lastMessage, readyState } = useWebSocket(`${WEBSOCKET_BASE_URL}/chat/${roomName}/?token=${token}`, {
    onMessage: (event) => {
      const data = JSON.parse(event.data);
      console.log('loading...messages', data);
      // Check if the message is a new one or an update
      if (data.type === 'send_chat_message') {
        // It's a new message, so add it to the chat
        setChat((prevMessages) => [...prevMessages, data.chat_message]);
      } else if (data.type === 'updated_message') {
        // It's an update, so update the existing message in the state
        setChat((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === data.chat_message.id
              ? { ...msg, ...data.chat_message } // Update the existing message with new data
              : msg
          )
        );
      }

      // Update the messages state when a new message is received
      // setChat((prevMessages) => [...prevMessages, data.chat_message]);
      // // Mark messages as read if the chat popup is open
      // if (isOpen && String(data.chat_message.from_user) === String(toUserId)) {
      //   readAllMessages(toUserId);
      // }
    },
    shouldReconnect: (closeEvent) => true, // Automatically reconnect when WebSocket closes
  });


  // For is_Typing Indication
  // Initialize WebSocket for typing indicator
  const { sendMessage: sendTypingMessage, lastMessage: typingLastMessage, readyState: typingReadyState } =
    useWebSocket(`${WEBSOCKET_BASE_URL}/typing/${'general'}/?token=${token}`, {
      onMessage: (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "typing" && data.from_user === toUserId && String(data.to_user) === String(currentUserId)) {
          setOtherUserTyping(data.is_typing);
        }
      },
      shouldReconnect: () => true, // Automatically reconnect
    });
  // Function to send typing status
  const sendTypingStatus = (isTyping) => {
    if (typingReadyState === WebSocket.OPEN) {
      sendTypingMessage(
        JSON.stringify({
          type: "typing",
          to_user: formData.to_user,
          is_typing: isTyping,
        })
      );
    }
  };


  const loadData = () => {
    setIsLoading(true)
    API.get(`/communication/messages/?user=${toUserId}&latest=True`)
      .then(response => {
        setIsLoading(false);
        setChat(response.data)
      })
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true);
      });
  }


  useEffect(() => {
    setFirstUnreadId(null)
    setUnreadCount(0)
    loadData();
    // if (isOpen){
    //   readAllMessages(toUserId);
    // }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Send typing status only if the input is not empty
    if (value.trim() === "") {
      sendTypingStatus(false);
    } else {
      sendTypingStatus(true);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setFormData({
      ...formData,
      message: formData.message + emojiObject.emoji, // Append emoji to the message
    });
  };

  // handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      // Check file type
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        setMessage(`Invalid file type. Accepted types are: PNG, JPEG, PDF, DOCX.`)
        setIsErrorModalOpen(true)
        return;
      }

      // Check file size
      const fileSizeMB = file.size / (1024 * 1024); // Convert size to MB
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        setMessage(`File size exceeds the limit of ${MAX_FILE_SIZE_MB} MB.`)
        setIsErrorModalOpen(true)
        return;
      }

      // If valid, update formData
      setFormData({
        ...formData,
        media_file: file,
      });
    }
  };


  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (!formData.message.trim() && !formData.media_file) {
      return;
    }
    // Find the latest message that is a bot question
    const latestMessage = chat[chat.length - 1];  // Get the last message in the chat array
    const isLatestMessageBotQuestion = latestMessage?.bot_question === true;  // Check if it's a bot question


    let apiUrl = `/communication/messages/`;
    const messageData = new FormData();
    messageData.append("message", formData.message);
    messageData.append("to_user", formData.to_user);
    if (formData.media_file) {
      messageData.append("media_file", formData.media_file);
    }
    // If it's a reply to a bot question, mark it as a bot reply
    if (isLatestMessageBotQuestion) {
      messageData.append("bot_reply", true);
    }
    if (chat.length === 0 || isLatestMessageBotQuestion) {
      messageData.append("delivery_status", 2);
    }

    setIsSending(true);
    API.post(apiUrl, messageData, { headers: { "Content-Type": "multipart/form-data" }, })
      .then(response => {
        setIsSending(false);
        setFormData({ message: "", to_user: toUserId });
        scrollToBottom()
      })
      .catch(error => {
        setIsSending(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true);
      });

  };

  const handleSendInititialMessage = (msg) => {
    
    let apiUrl = `/communication/messages/`;
    const messageData ={message: msg, to_user: toUserId, delivery_status: 2}

    setIsSending(true);
    API.post(apiUrl, messageData)
      .then(response => {
        setIsSending(false);
        setFormData({ message: "", to_user: toUserId });
        scrollToBottom()
      })
      .catch(error => {
        setIsSending(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true);
      });

  };

  // send bot message reply
  const handleSendBotReply = (currentIndex, option) => {
    let apiUrl = `/communication/messages/`;
    const lastBotQuestion = chat.slice().reverse().find(msg => msg.bot_reply);
    // return;
    const prevIndices = lastBotQuestion?.bot_question_id?.split("-") || []; // Get previous indices from the last bot question

    // Step 2: Ensure the index path is an array and add the current index
    const updatedBotQuestionId = Array.isArray(prevIndices) ? [...prevIndices, currentIndex] : [currentIndex];
    const botQuestionId = updatedBotQuestionId.join('-');
    // return;
    const messageData = {
      message: option,
      to_user: formData.to_user,
      bot_reply: true,
      bot_question_id_list: updatedBotQuestionId,
      bot_question_id: botQuestionId,
      delivery_status: 2
    }
    setIsSending(true);
    API.post(apiUrl, messageData,)
      .then(response => {
        setIsSending(false);
        scrollToBottom()
      })
      .catch(error => {
        setIsSending(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true);
      });

  };



  // read message
  const updateMessageStatus = (msgId, newStatus) => {
    const message = chat.find(msg => String(msg.id) === String(msgId));
    if (!message) {
      console.log(`Message with id ${msgId} not found`);
      return; // Exit if the message is not found
    }
    // If the message's status is the same as the newStatus, return early
    if (Number(message.delivery_status) === Number(newStatus)) { // Ensure both are numbers
      return;
    }

    API.put(`/communication/messages/${msgId}/`, { delivery_status: newStatus })
      .then(response => {
        // Update local state after a successful API call
        setChat((prevChat) =>
          prevChat.map((msg) =>
            String(msg.id) === String(msgId) ? { ...msg, delivery_status: newStatus } : msg
          )
        );
      })
      .catch(error => {
        // setMessage(error.response?.data?.message || error.message)
        // setIsErrorModalOpen(true);
      });
  };


  // IntersectionObserver callback to handle marking messages as read
  const handleIntersection = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const messageId = entry.target.dataset.id;
        const deliveryStatus = entry.target.dataset.status;
        const fromUser = entry.target.dataset.fromUser;

        // Check if the message is received (not from the current user) and unread (status !== 2)
        if (fromUser !== String(currentUserId) && deliveryStatus !== '2') {
          // Update the message status to 'read' (status = 2)
          updateMessageStatus(messageId, 2);

          // Unobserve this message after updating to prevent multiple API calls
          if (observer.current) {
            observer.current.unobserve(entry.target);
          }
        }
      }
    });
  }, [currentUserId, chat]);

  // Set up IntersectionObserver and observe message elements
  useEffect(() => {
    // Initialize the observer when the component mounts
    observer.current = new IntersectionObserver(handleIntersection, {
      root: null,
      threshold: 0.5, // Trigger when at least 50% of the message is visible
    });

    // Observe only messages received from others and not already marked as 'read'
    chat.forEach((message, index) => {
      const element = document.querySelector(`.message[data-id="${message.id}"]`);
      if (element && message.from_user !== currentUserId && message.delivery_status !== 2) {
        observer.current.observe(element);
      }
    });

    return () => {
      // Cleanup the observer on component unmount
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [chat, handleIntersection, currentUserId]);


  const closeChatBlockObject = (chatBlockId) => {
    const dataToSubmit = { is_closed: true };
    API.put(`/communication/chat-blocks/${chatBlockId}/`, dataToSubmit)
      .then((response) => {
        loadData();
      })
      .catch((error) => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
      });
  }

  const handleCloseWindow = () => {
    const lastChatBlockId = chat?.length > 0 ? chat[chat.length - 1].chat_block : null;
    if (!lastChatBlockId) {
      setIsOpen(false)
      return;
    }
    setIsBlockCloseModalOpen(true)
  }

  return (
    <div className="chat-popup-container" style={{ '--primary-color': primaryColor, '--secondary-color': secondaryColor }}>
      <div
        className={`chat-popup ${isOpen ? "open" : ""}`}
        style={{ borderColor: secondaryColor }}
      >
        {isOpen && (
          <div className="chat-window">
            <div
              className="chat-header"
              style={{ backgroundColor: secondaryColor, color: primaryColor }}
            >
              <h4>{heading}</h4>
              <div className="close-buttons">
                <button
                  className="minimize-btn"
                  onClick={toggleChat}
                  style={{ color: primaryColor }}
                >
                  <img src="/images/chat/popup/minimize-circle.svg" className="minimize" />
                </button>
                <button
                  className="close-btn"
                  onClick={handleCloseWindow}
                  style={{ color: primaryColor }}
                >
                  <img src="/images/chat/close.svg" className="close" />
                </button>
              </div>
            </div>

            <div className="chat-container" id="chat-container">
              {isLoading ?
                <div className="d-flex justify-content-center align-items-center h-100">
                  <img style={{ height: "25px", width: '25px', alignSelf: 'center' }} src='/images/gif/loader.gif'></img>
                </div>
                :
                chat?.length === 0 ? (
                  <>
                    <NoMessages sendMessage={handleSendInititialMessage} />
                  </>
                ) : (
                  <>
                    {chat.map((msg, index) => {
                      const isUnread =
                        (msg.delivery_status === 0 || msg.delivery_status === 1) &&
                        String(msg.from_user) !== String(currentUserId);

                      const isFirstUnread = msg.id === firstUnreadId;
                      // Check if the current message's date differs from the previous message
                      const currentDate = new Date(msg.created_at).toDateString();
                      const previousDate = index > 0 ? new Date(chat[index - 1].created_at).toDateString() : null;
                      const showDateSeparator = currentDate !== previousDate;

                      // Get the related chat block for this message (if exists)
                      const chatBlock = msg.chat_block_details;  // Access the chat_block_details field
                      // const chatBlockStarted = chatBlock && !chatBlock.is_closed;
                      const chatBlockClosed = chatBlock && chatBlock.is_closed;
                      // Track if this is the first message in the chat block (using start_chat_id)
                      const isFirstMessageInBlock = msg.id === chatBlock?.start_chat_id;
                      // Track if this is the last message in the chat block
                      const isLastMessageInBlock = msg.id === chatBlock?.end_chat_id;

                      return (
                        <div key={index} style={{ display: 'contents' }}>
                          {/* Show the date separator */}
                          {showDateSeparator && (
                            <div className="date-separator">
                              {formatChatDate(msg.created_at)}
                            </div>
                          )}
                          {/* Show the unread messages indicator if this is the first unread message */}
                          {isFirstUnread && showUnreadIndicator && initialUnreadCount > 0 && (
                            <div className="unread-messages-indicator">
                              <div>
                                {initialUnreadCount} unread {initialUnreadCount > 1 ? 'messages' : 'message'}
                              </div>
                            </div>
                          )}
                          <div
                            className={`message ${String(msg.from_user) === String(currentUserId) ? "sent" : "received"}`}
                            data-id={msg.id} // Add a unique ID for tracking
                            data-status={msg.delivery_status} // Include delivery status for conditionally marking as read
                            data-from-user={msg.from_user} // Include the sender's ID for checking
                            ref={isFirstUnread ? unreadMessageRef : null}
                          >
                            {msg.is_deleted ? (
                              <>
                                <p className="deleted-message">This message was deleted</p>
                                <div className="message-meta">
                                  <span className="time">
                                    {msg.created_at && convertTo12HourTime(msg.created_at)}
                                  </span>
                                </div>
                              </>
                            ) :
                              msg.bot_question ? (
                                <BotQuestion
                                  currentUserId={currentUserId}
                                  chatMessage={msg}
                                  onOptionSelect={(index, option) => handleSendBotReply(index, option)}
                                  source={source}
                                  chat={chat}
                                />
                              ) :
                                (
                                  <>
                                    <div className="message-content">
                                      {msg.message && <p>{msg.message}</p>}
                                      {msg.media_file && (
                                        <div className="media">
                                          {/\.(png|jpe?g|gif|bmp|webp)$/i.test(msg.media_file) ? (
                                            <img src={msg.media_file} alt="Media" />
                                          ) : /\.(pdf)$/i.test(msg.media_file) ? (
                                            <div className="media-link">
                                              <img src="/images/chat/pdf-icon.svg" alt="PDF File" className="media-icon" />
                                              <span className="file-name">{getFileNameFromUrl(msg.media_file)}</span>
                                              <a href={msg.media_file} target="_blank" download className="download-btn">
                                                <img src="/images/chat/download-icon.svg" alt="Download" className="download-icon" />
                                              </a>
                                            </div>
                                          ) : /\.(docx?)$/i.test(msg.media_file) ? (
                                            <div className="media-link">
                                              <img src="/images/chat/doc-icon.svg" alt="Document File" className="media-icon" />
                                              <span className="file-name">{getFileNameFromUrl(msg.media_file)}</span>
                                              <a href={msg.media_file} target="_blank" download className="download-btn">
                                                <img src="/images/chat/download-icon.svg" alt="Download" className="download-icon" />
                                              </a>
                                            </div>
                                          ) : (
                                            <div className="media-link">
                                              <img src="/images/chat/file-icon.svg" alt="File" className="media-icon" />
                                              <span className="file-name">{getFileNameFromUrl(msg.media_file)}</span>
                                              <a href={msg.media_file} download className="download-btn">
                                                <img src="/images/chat/download-icon.svg" alt="Download" className="download-icon" />
                                              </a>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    <div className="message-meta">
                                      <span className="time">
                                        {msg.created_at && convertTo12HourTime(msg.created_at)}
                                      </span>
                                      {String(msg.from_user) === String(currentUserId) && (
                                        <span className={`status status-${msg.delivery_status}`}>
                                          {msg.delivery_status === 0
                                            ? <img src="/images/chat/tick-single.svg" className="status-tick" alt='Sent' />
                                            : msg.delivery_status === 1
                                              ? <img src="/images/chat/tick-delivered.svg" className="status-tick" alt='Delivered' />
                                              : <img src="/images/chat/tick-read.svg" className="status-tick" alt='Read' />
                                          }
                                        </span>
                                      )}

                                    </div>
                                  </>
                                )}
                          </div>
                        </div>
                      )
                    })}
                    {otherUserTyping &&
                      <div className='message received typing'>
                        <TypingIndicator />
                      </div>
                    }
                    {/* Reference to last message for scrolling */}
                    <div ref={chatEndRef}></div>
                    {/* Scroll-to-bottom button */}
                    {showScrollButton && (
                      <div
                        className="scroll-to-bottom-button"
                        onClick={scrollToBottom}
                      >
                        <img src='/images/chat/scroll-down.svg' />
                      </div>
                    )}
                  </>
                )
              }

            </div>
            {/* file preview */}
            {formData.media_file && (
              <div className="file-preview">
                <p>{formData.media_file.name}</p>
                <button type="button" onClick={() => setFormData({ ...formData, media_file: null })}>
                  <img src="/images/chat/close.svg" style={{ width: '10px', height: '10px' }} />
                </button>
              </div>
            )}

            <div className="card-footer">
              <div className="input-group">
                <button type='button' className="btn btn-borderless"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)} >
                  <img src='/images/chat/smilie-icon.svg'></img>
                </button>
                {showEmojiPicker && (
                  <div className="emoji-picker-container">
                    <EmojiPicker onEmojiClick={handleEmojiClick}
                      skinTonesDisabled={true}
                      // searchDisabled={true}
                      previewConfig={{ showPreview: false }}
                      height={300}
                      lazyLoadEmojis={true}
                      width={'100%'} />
                  </div>
                )}
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type a message..."
                  value={formData.message}
                  name="message"
                  onChange={handleInputChange}
                  onFocus={() => { setShowEmojiPicker(false); sendTypingStatus(true) }}
                  onBlur={() => sendTypingStatus(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {  // Send on Enter key press, not Shift+Enter
                      e.preventDefault();  // Prevent default Enter behavior (new line in text box)
                      handleSendMessage(); // Call your send message function
                    }
                  }}
                />
                {/* file upload */}
                <input
                  type="file"
                  className="d-none"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".png, .jpeg, .jpg, .pdf, .docx"
                />

                <button onClick={() => fileInputRef.current.click()} type='button' className="btn btn-borderless">
                  <img src='/images/chat/attach-icon.svg'></img>
                </button>
                {/* <button type='button' className="btn btn-borderless"><img src='/images/chat/image-icon.svg'></img></button> */}
                <button type="submit" className="btn btn-borderless"
                  onClick={handleSendMessage}
                  disabled={isSending}
                >
                  {isSending ? (
                    <div className="spinner-border spinner-border-sm " role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <img src="/images/chat/send-icon.svg" alt="Send" />
                  )}
                </button>
              </div>
            </div>


            {isBlockCloseModalOpen &&
              <UserChatBlockClosePopup setterFunction={setIsBlockCloseModalOpen} chat={chat} loadData={() => loadData()}
              />
            }
          </div>
        )}
      </div>
      <button
        className={`chat-toggle-btn ${isOpen ? "rotate" : ""}`}
        onClick={toggleChat}
        style={{ backgroundColor: secondaryColor, color: primaryColor }}
      >
        {isOpen ? (
          <div>
            <img src="/images/chat/popup/minimize.svg" className="close" />
          </div>
        ) :

          isOrderMsgLoading ? (
            <>
              <div className="spinner-border spinner-border-sm " role="status">
                <span className="visually-hidden">Loading...</span>
              </div></>
          ) : (
            <div>
              {unreadCount > 0 &&
                <div className="unread-badge">
                  {unreadCount}
                </div>
              }
              <img src="/images/chat/chat.svg" className="chat" />
            </div>
          )

        }
      </button>




      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {/* {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => { window.location.reload() }} />} */}

    </div>
  );
};

export default ChatPopup;
