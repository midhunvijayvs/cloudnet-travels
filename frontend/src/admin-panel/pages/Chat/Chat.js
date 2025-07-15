import React, { useEffect, useRef, useState } from 'react';
import "./Chat.scss"
import API from '../../../API';
import { convertTo12HourTime, getFileNameFromUrl, getMediaTypeFromUrl, parseBotMessage } from '../../../GeneralFunctions';
import ErrorModal from '../../../ErrorModal';
import useWebSocket from 'react-use-websocket';
import ChatDetails from '../ChatDetails/ChatDetails';
import ChatUserSearchSelect from '../../common-components/Chats/ChatUserSearchSelect/ChatUserSearchSelect';
import ChatThreadList from '../ChatThreadList/ChatThreadList';
import ChatBlockLabel from '../../common-components/Chats/ChatBlockLabel/ChatBlockLabel';

const ChatClient = ({ primaryColor = '#004938', secondaryColor = '#ef3401' }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [settingsDropdownVisible, setSettingsDropdownVisible] = useState(false);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);

  const [message, setMessage] = useState('');
  const [activeChatId, setActiveChatId] = useState(null);
  const [conversationList, setConversationList] = useState([]); // leftside - list
  const [isLoading, setIsLoading] = useState(true);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const currentUserId = localStorage.getItem('userID')
  const [roomID, setRoomID] = useState('general');

  const [formData, setFormData] = useState({
    message: "",
    to_user: null,
  })

  const [threadStartChatId, setThreadStartChatId] = useState(null); // to track the thread
  const [fromThread, setFromThread] = useState(false);

  const handleViewThread = (userId, threadStartChatId) => {
    setActiveChatId(userId); // Set active chat ID
    setThreadStartChatId(threadStartChatId); // Set the start chat ID for scrolling
    setActiveTab('chat'); // Switch to the 'chat' tab
    setFromThread(true); // Indicate that we're coming from a thread
  };

  // Initialize WebSocket connection using react-use-websocket
  const WEBSOCKET_BASE_URL = process.env.REACT_APP_WEBSOCKET_BASE_URL
  const token = localStorage.getItem("accessToken");
  const { sendMessage, lastMessage, readyState } = useWebSocket(`${WEBSOCKET_BASE_URL}/newmessagealert/${currentUserId}/?token=${token}`, {
    onMessage: (event) => {
      const data = JSON.parse(event.data);
      // Update the messages state when a new message is received
      loadConversationList();
    },
    shouldReconnect: (closeEvent) => true, // Automatically reconnect when WebSocket closes
  });


  // WebSocket for the current room
  const { sendMessage: sendTypingMessage, readyState: typingReadyState } =
    useWebSocket(
      roomID
        ? `${WEBSOCKET_BASE_URL}/typing/${roomID}/?token=${token}`
        : null,
      {
        onMessage: (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "typing") {
            // Update typing status in the conversation list
            setConversationList((prevList) =>
              prevList.map((item) =>
                item.from_user === data.from_user && String(data.to_user) === String(currentUserId)
                  ? { ...item, is_typing: data.is_typing }
                  : item
              )
            );
          }
        },
        shouldReconnect: () => true,
      }
    );

  // Function to send typing status
  const sendTypingStatus = (isTyping) => {
    if (typingReadyState === WebSocket.OPEN) {
      sendTypingMessage(
        JSON.stringify({
          type: "typing",
          to_user: activeChatId,
          is_typing: isTyping,
        })
      );
    }
  };



  const loadConversationList = () => {
    setIsLoading(true)
    API.get(`/communication/conversations/`)
      .then(response => {
        setIsLoading(false);
        setConversationList(response.data)
      })
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true);
      });
  }


  // read message
  const readAllMessages = (id) => {
    API.post(`/communication/read-all-messages/${id}/`)
      .then(response => {
        loadConversationList()
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true);
      });
  }

  useEffect(() => {
    loadConversationList();
  }, []);



  const handleContactClick = (item) => {
    setActiveChatId(item.from_user);
    setFormData({ ...formData, to_user: item.from_user, });
  };
  const handleSearchContactClick = (item) => {
    // console.log(item.id, 'user');
    setFromThread(false)
    setActiveChatId(item.id);
    setFormData({ ...formData, to_user: item.id });

    // Update the conversation list
    setConversationList(prevList => {
      // Remove the first item with no `last_message`
      const filteredList = prevList.filter(
        (existingItem, index) => index !== 0 || existingItem.last_message
      );

      // Check if the user already exists in the filtered list
      if (!filteredList.find(existingItem => existingItem.from_user === item.id)) {
        // Add the new user to the top of the list
        return [
          {
            from_user: item.id,
            user_name: `${item.first_name} ${item.last_name}`,
            profile_image: item.profile_image || '/images/no-profile-image.png',
            last_message: null,
            unread_messages: 0,
          },
          ...filteredList,
        ];
      }

      return filteredList; // If the user already exists, just return the filtered list
    });
  };

  const handleSettingOptionClick = (option) => {
    if (option === 'tags') {
      setIsLabelModalOpen(true)
      setSettingsDropdownVisible(false)
    }

  }



  return (
    <div className="chat-page-container" style={{ '--primary-color': primaryColor, '--secondary-color': secondaryColor }}>
      <div className="page-body">
        <div className="container-fluid">
          {localStorage.getItem('userRole') !== 'driver' &&
            <div className="tabs">
              <div
                className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
                onClick={() => { setActiveTab('chat'); setActiveChatId(null) }}
              >
                Chat
              </div>
              <div
                className={`tab ${activeTab === 'threads' ? 'active' : ''}`}
                onClick={() => setActiveTab('threads')}
              >
                Threads
              </div>
              {localStorage.getItem('userRole') === 'admin' &&
                <div
                  className={`tab settings-tab ${settingsDropdownVisible ? 'active' : ''}`}
                  onClick={() => setSettingsDropdownVisible(!settingsDropdownVisible)}
                >
                  <img src='/images/chat/settings.svg' />
                </div>
              }
              {settingsDropdownVisible && (
                <div className="dropdown">
                  <ul>
                    <li onClick={() => handleSettingOptionClick('tags')}>Tags</li>
                    <li>General</li>
                    {/* Add more options as needed */}
                  </ul>
                </div>
              )}
            </div>
          }
          {activeTab === 'chat' && (
            <div className="row g-2">
              <div className="col-md-4">
                {window.innerWidth > 768 ?
                  <div className="contacts-container">
                    <ul className="nav nav-pills flex-column">
                      {localStorage.getItem('userRole') !== 'driver' &&
                        <div className='mb-2'>
                          <ChatUserSearchSelect
                            handleSelect={handleSearchContactClick}
                            changeKey={'to_user'}
                            apiGetUrl={
                              localStorage.getItem('userRole') === 'admin'
                                ? '/user/verified-users/'
                                : localStorage.getItem('userRole') === 'restaurant'
                                  ? '/restaurants/user-list/'
                                  : '/grocery/user-list/'
                            }
                          />

                        </div>
                      }


                      {conversationList.map((item, index) => {
                        return (
                          <li className="nav-item" key={index}>
                            <button
                              className={`nav-link ${activeChatId === item.from_user ? 'active' : ''}`}
                              onClick={() => handleContactClick(item)}
                            >
                              <img src={item.profile_image || '/images/no-profile-image.png'} className='profile-img'></img>
                              <div className='ms-2 me-auto d-grid'>
                                <p className='name'>{item.user_name}</p>
                                <div className='last-msg'>
                                  {/* Show typing indicator in the conversation list */}
                                  {item.is_typing ? (
                                    <span className="typing-indicator">Typing...</span>
                                  ) : item?.last_message?.media_file &&
                                    item?.last_message?.message ? (
                                    <>
                                      <img src={getMediaTypeFromUrl(item?.last_message?.media_file) === 'image'
                                        ? '/images/chat/photo-icon.svg'
                                        : '/images/chat/file-icon.svg'}
                                        alt="Media Icon"
                                        className="media-icon"
                                      />
                                      <span>
                                        {item?.last_message?.bot_question
                                          ? parseBotMessage(item?.last_message?.message)
                                          : item?.last_message?.message}
                                      </span>
                                    </>
                                    // only file
                                  ) : item?.last_message?.media_file ? (
                                    <>
                                      <img src={getMediaTypeFromUrl(item?.last_message?.media_file) === 'image'
                                        ? '/images/chat/photo-icon.svg'
                                        : '/images/chat/file-icon.svg'}
                                        alt="Media Icon"
                                        className="media-icon"
                                      />
                                      <span>{getFileNameFromUrl(item?.last_message?.media_file)}</span>
                                    </>
                                    // If only message exists
                                  ) : (
                                    <span>
                                      {item?.last_message?.bot_question
                                        ? parseBotMessage(item?.last_message?.message)
                                        : item?.last_message?.message}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className={`last-msg-time ${item.unread_messages > 0 && 'unread'}`}>
                                <time>
                                  {item?.last_message?.created_at && convertTo12HourTime(item?.last_message?.created_at)}
                                </time>
                                <div className='unread-count'>
                                  {item.unread_messages}
                                </div>
                              </div>


                            </button>
                          </li>
                        )
                      })}


                    </ul>
                  </div> :
                  activeChatId === null &&
                  <div className="contacts-container">
                    <ul className="nav nav-pills flex-column">
                      {conversationList.map((item, index) => {
                        return (
                          <li className="nav-item" key={index}>
                            <button
                              className={`nav-link ${activeChatId === item.from_user ? 'active' : ''}`}
                              onClick={() => handleContactClick(item)}
                            >
                              <img src={item.profile_image || '/images/no-profile-image.png'} className='profile-img'></img>
                              <div className='ms-2 me-auto d-grid'>
                                <p className='name'> {item.user_name}</p>
                                <div className='last-msg'>
                                  {/* if message and file */}
                                  {item?.last_message?.media_file && item?.last_message?.message ? (
                                    <>
                                      <img src={getMediaTypeFromUrl(item?.last_message?.media_file) === 'image'
                                        ? '/images/chat/photo-icon.svg'
                                        : '/images/chat/file-icon.svg'}
                                        alt="Media Icon"
                                        className="media-icon"
                                      />
                                      <span>{item?.last_message?.message}</span>
                                    </>
                                    // only file
                                  ) : item?.last_message?.media_file ? (
                                    <>
                                      <img src={getMediaTypeFromUrl(item?.last_message?.media_file) === 'image'
                                        ? '/images/chat/photo-icon.svg'
                                        : '/images/chat/file-icon.svg'}
                                        alt="Media Icon"
                                        className="media-icon"
                                      />
                                      <span>{getFileNameFromUrl(item?.last_message?.media_file)}</span>
                                    </>
                                    // If only message exists
                                  ) : (
                                    <span>{item?.last_message?.message}</span>
                                  )}
                                </div>
                              </div>
                              <div className={`last-msg-time ${item.unread_messages > 0 && 'unread'}`}>
                                <time>
                                  {item?.last_message?.created_at && convertTo12HourTime(item?.last_message?.created_at)}
                                </time>
                                <div className='unread-count'>
                                  {item.unread_messages}
                                </div>
                              </div>

                            </button>
                          </li>
                        )
                      })}


                    </ul>
                  </div>
                }

              </div>
              <div className="col-md-8">
                <ChatDetails
                  conversationList={conversationList}
                  setConversationList={setConversationList}
                  loadConversationList={loadConversationList}
                  activeChatId={activeChatId}
                  setActiveChatId={setActiveChatId}
                  formData={formData}
                  setFormData={setFormData}
                  sendTypingStatus={sendTypingStatus}
                  threadStartChatId={threadStartChatId} // thread-start
                  fromThread={fromThread}
                  setFromThread={setFromThread}
                />
              </div>
            </div>
          )}
          {activeTab === 'threads' && (
            <div >
              <ChatThreadList handleViewThread={handleViewThread} />
            </div>
          )}
        </div>

      </div>
      {
        isLabelModalOpen && <ChatBlockLabel setterFunction={setIsLabelModalOpen} />
      }
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
    </div>
  );
};

export default ChatClient;
