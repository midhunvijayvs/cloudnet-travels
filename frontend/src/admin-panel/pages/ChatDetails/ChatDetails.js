import React, { useCallback, useEffect, useRef, useState } from 'react';
import "./ChatDetails.scss"
import API from '../../../API';

import { convertTo12HourTime, createRoomName, formatChatDate, formatDateTime, getFileNameFromUrl, getMediaTypeFromUrl } from '../../../GeneralFunctions';
import ErrorModal from '../../../ErrorModal';
import useWebSocket from 'react-use-websocket';
import EmojiPicker from 'emoji-picker-react';
import TypingIndicator from '../../common-components/Chats/TypingIndicator/TypingIndicator';
import ChatBlockClosePopup from '../../common-components/Chats/ChatBlockClosePopup/ChatBlockClosePopup';
import DeleteConfirmModal from '../../../DeleteConfirmModal';
import BotQuestion from '../../common-components/Chats/BotQuestion/BotQuestion';

const ChatDetails = ({
  conversationList, setConversationList, loadConversationList,
  activeChatId, setActiveChatId,
  formData, setFormData,
  sendTypingStatus,
  threadStartChatId, fromThread, setFromThread
}) => {
  const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const MAX_FILE_SIZE_MB = 3; // Max size in MB

  const fileInputRef = useRef(null);
  const [chat, setChat] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
  const [isBlockCloseModalOpen, setIsBlockCloseModalOpen] = useState(false);
  const currentUserId = localStorage.getItem('userID');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [dropdownMessageId, setDropdownMessageId] = useState(null);// Tracks if the dropdown is open for this message


  const messageRefs = useRef({}); // Store refs for each message
  const [showScrollButton, setShowScrollButton] = useState(false);
  const observer = useRef(null); // For Read Message
  // Find  unread message
  const unreadMessageRef = useRef(null);
  const chatEndRef = useRef(null);
  // State for tracking unread message visibility
  const [unreadCount, setUnreadCount] = useState(0); // Tracks the current unread count
  const [initialUnreadCount, setInitialUnreadCount] = useState(0); // Tracks the initial unread count when the chat is opened
  const [showUnreadIndicator, setShowUnreadIndicator] = useState(true); // Controls the visibility of unread message indicator
  const [hasScrolledToUnread, setHasScrolledToUnread] = useState(false);
  const [firstUnreadId, setFirstUnreadId] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  // Track whether the chat is opened or not
  useEffect(() => {
    setChatOpen(false);// Set chat as open when activeChatId changes
    setShowUnreadIndicator(true); // Show unread message indicator
    setHasScrolledToUnread(false); // Reset scroll tracking
    setFirstUnreadId(null); // Reset unread message tracking
    setInitialUnreadCount(0);
    setFormData({
      ...formData,
      message: "",
      media_file: null
    })
  }, [activeChatId]);

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
    if (!fromThread) {
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
    }
  }, [firstUnreadId, hasScrolledToUnread, chat]);

  // Scroll to the chat block when Thread threadStartChatId changes
  useEffect(() => {
    const scrollToStartChat = () => {
      if (fromThread && threadStartChatId && messageRefs.current[threadStartChatId]) {
        console.log('Scrolling to start of thread...', threadStartChatId, messageRefs.current[threadStartChatId]);
        messageRefs.current[threadStartChatId].scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        setFromThread(false);
      }
    };

    // Delay to ensure the component has rendered fully
    const delay = setTimeout(scrollToStartChat, 200); // Delay to ensure rendering
    return () => clearTimeout(delay); // Clean up the timeout
  }, [threadStartChatId, chat]);


  // Scroll to the last message
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  // Track scrolling to toggle the scroll button
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // Show the button when the user scrolls up from the bottom
    setShowScrollButton(scrollTop < scrollHeight - clientHeight - 200); // 100px offset from bottom
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
  }, []);


  // Initialize WebSocket connection using react-use-websocket (Message Update)
  const WEBSOCKET_BASE_URL = process.env.REACT_APP_WEBSOCKET_BASE_URL
  const token = localStorage.getItem("accessToken");
  const roomName = createRoomName(currentUserId, formData.to_user);
  const { sendMessage, lastMessage, readyState } = useWebSocket(`${WEBSOCKET_BASE_URL}/chat/${roomName}/?token=${token}`, {
    onMessage: (event) => {
      const data = JSON.parse(event.data);
      console.log('loading...data', data);

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
    },
    shouldReconnect: (closeEvent) => true, // Automatically reconnect when WebSocket closes
  });

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

  // load each chat
  const loadChat = (id) => {
    setIsLoading(true)
    API.get(`/communication/messages/?user=${id}`)
      .then(response => {
        setIsLoading(false);
        setChat(response.data);
        scrollToBottom()
      })
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true);
      });
  }

  useEffect(() => {
    if (activeChatId) {
      loadChat(activeChatId);
    }
    setFirstUnreadId(null)
  }, [activeChatId]);


  const handleSendMessage = () => {
    if (!formData.message.trim() && !formData.media_file) {
      return;
    }
    let apiUrl = `/communication/messages/`;
    const messageData = new FormData();
    messageData.append("message", formData.message);
    messageData.append("to_user", formData.to_user);
    if (formData.media_file) {
      messageData.append("media_file", formData.media_file);
    }

    setIsSending(true);
    API.post(apiUrl, messageData, { headers: { "Content-Type": "multipart/form-data" }, })
      .then(response => {
        setIsSending(false);
        setFormData({ ...formData, message: "", media_file: null });
        scrollToBottom()
      })
      .catch(error => {
        setIsSending(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true);
      });


  };

  const backClicked = () => {
    setActiveChatId(null);
    setChat([])
  }


  // ============= read message ====================
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
        loadConversationList()
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

  // ============= read message ====================
  const deleteMessage = () => {
    const msgId = selectedItem.id
    API.put(`/communication/messages/${msgId}/`, { is_deleted: true })
      .then(response => {
        // Update local state after a successful API call
        setChat((prevChat) =>
          prevChat.map((msg) =>
            String(msg.id) === String(msgId) ? { ...msg, is_deleted: true } : msg
          )
        );
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true);
      });
  };

  return (
    <div className='chat-details-page'>
      <div className="card">
        {activeChatId ?
          <div className="card-header">
            {window.innerWidth <= 768 && <button className='btn btn-borderless p-0 back-btn' onClick={backClicked}>
              <img src='/images/chat/back-icon.svg'></img></button>
            }
            <div className='title-sec'>
              <img src={conversationList.find(x => x.from_user === activeChatId)?.profile_image || '/images/no-profile-image.png'} className='profile-img'></img>
              <div>
                <p className='name'>
                  {conversationList.find(x => x.from_user === activeChatId)?.user_name || 'this user'}
                </p>
                {conversationList.find(x => x.from_user === activeChatId)?.is_typing &&
                  <div className='is-typing-text'> is typing...</div>
                }
              </div>
              {/* <time className='time'>{` ${conversationList.find(x => x.from_user === activeChatId).last_seen_time}`}</time> */}

            </div>

            <div className='d-none'>
              <button className='btn btn-small-dark'><img width="50" height="50" src="https://img.icons8.com/ios-filled/50/FFFFFF/phone.png" alt="phone" /></button>
              <button className='btn btn-small-dark'><img src='/images/chat/3-dot-icon.svg'></img></button>
            </div>

          </div>
          : window.innerWidth > 768 &&
          <div className="card-header">
            {localStorage.getItem('userRole') !== 'driver' ?
              <p className='name'>Select a Contact</p> :
              conversationList?.length > 0 ?
                <p className='name'>Select a Contact</p> :
                <p className='name'>No messages</p>
            }
          </div>
        }

        <div className="card-body chat-container" id='chat-container'>
          {
            isLoading && activeChatId ?
              <div className='d-flex w-100 justify-content-center items-center'>
                <div className="spinner-border spinner-border-sm " role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div> :

              activeChatId && chat.length === 0 ? (
                <div className="text-muted entry-msg">
                  Start a conversation with{' '}
                  {conversationList.find(x => x.from_user === activeChatId)?.user_name || 'this user'}
                </div>
              ) : (

                <>
                  {
                    activeChatId && chat.map((msg, index) => {

                      const isFirstUnread = String(msg.id) === String(firstUnreadId);

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
                            <div className="unread-messages-indicator" ref={isFirstUnread ? unreadMessageRef : null}>
                              <div>
                                {initialUnreadCount} unread {initialUnreadCount > 1 ? 'messages' : 'message'}
                              </div>
                            </div>
                          )}
                          {/* Show "Chat Block Started" indication only once */}
                          {isFirstMessageInBlock && (
                            <div className="chat-block-indicator active"
                              ref={(el) => {
                                if (isFirstMessageInBlock) {
                                  messageRefs.current[msg.id] = el; // Attach ref to "Thread Started" indicator
                                }
                              }}>
                              <span>Thread Started</span>
                              {chatBlock?.created_at && (
                                <div className="chat-block-time">
                                  {formatDateTime(chatBlock?.created_at)}
                                </div>
                              )}
                            </div>
                          )}

                          <div
                            className={`message ${String(msg.from_user) === String(currentUserId) ? "sent" : "received"}`}
                            data-id={msg.id} // Add a unique ID for tracking
                            data-status={msg.delivery_status} // Include delivery status for conditionally marking as read
                            data-from-user={msg.from_user} // Include the sender's ID for checking
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
                                  // onOptionSelect={(index, option) => handleSendBotReply(index, option)}
                                  onOptionSelect={(index, option) => console.log(index, option)}
                                  source={'admin'}
                                  chat={chat}
                                />
                              ) : (
                                <>
                                  {/* Delete option */}
                                  {localStorage.getItem('userRole') !== 'restaurant' &&
                                    <div
                                      onMouseEnter={() => setDropdownMessageId(msg.id)}
                                      onMouseLeave={() => setDropdownMessageId(null)} >
                                      <img src='/images/chat/down-arrow.svg' className='option-down-arrow'
                                        // onClick={() => setDropdownMessageId(dropdownMessageId === msg.id ? null : msg.id)}
                                        alt="Options" />
                                      {dropdownMessageId === msg.id && (
                                        <div className="option-dropdown-menu">
                                          <div
                                            className="dropdown-item"
                                            onClick={() => { setSelectedItem(msg); setIsDeleteConfModalOpen(true) }}
                                          >
                                            Delete
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  }
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

                          {/* Show "Chat Block Closed" indication only once */}
                          {isLastMessageInBlock && chatBlockClosed && (
                            <div className="chat-block-indicator closed">
                              <span>This thread has been closed</span>
                              {chatBlock?.closed_on && (
                                <div className="chat-block-time">
                                  {formatDateTime(chatBlock?.closed_on)}
                                </div>
                              )}

                            </div>
                          )}

                        </div>
                      )
                    })}
                  {conversationList.find(x => x.from_user === activeChatId)?.is_typing &&
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
              )}
        </div>

        {activeChatId && (
          <>
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
                      previewConfig={{ showPreview: false }}
                      height={350}
                      lazyLoadEmojis={true}
                    />
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
                {/* Close Chat Block Button */}
                {chat?.[chat.length - 1]?.chat_block_details && !chat[chat.length - 1].chat_block_details.is_closed && (

                  <button
                    type="button"
                    className="btn btn-borderless tooltip-button"
                    onClick={() => { setIsBlockCloseModalOpen(true) }}
                  >
                    Close
                    <img src='/images/chat/close-circle.svg' alt="Close Chat Block" />
                    <span className="tooltip-text">Close chat thread?</span>
                  </button>
                )}

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
          </>
        )}
      </div>
      {isBlockCloseModalOpen &&
        <ChatBlockClosePopup setterFunction={setIsBlockCloseModalOpen} chat={chat} loadData={() => loadChat(activeChatId)}
        />
      }
      {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'chat-msg'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteMessage}></DeleteConfirmModal>}

      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
    </div>
  );
};

export default ChatDetails;
