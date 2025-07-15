import React, { useEffect, useState } from 'react';
import "./ChatThreadList.scss"
import API from '../../../API';
import ErrorModal from '../../../ErrorModal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Pagination from '../../../Pagination';
import { formatChatDate, formatDateTime, parseBotMessage } from '../../../GeneralFunctions';



const ChatThreadList = ({ handleViewThread }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const [chatLabels, setChatLabels] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, selectPageSize] = useState(12);
  const [filters, setFilters] = useState({
    keyword: null,
    tag: null,
    customer: null,
    date: null,
  });
  const [showFilters, setShowFilters] = useState(true);
  const [chatThreadList, setChatThreadList] = useState([]);

  const handleClearFilters = () => {
    setFilters({
      search_key: '',
      tag: '',
      customer: '',
      date: null,
    });
  };

  // load labels
  const loadThreadList = () => {
    let apiUrl = `/communication/chat-blocks/?page=${page}&page_size=${pageSize}`;
    // Loop through the filters object and append selected filters to the apiUrl
    for (let filter in filters) {
      if (filters[filter] !== null) {
        apiUrl += `&${filter}=${filters[filter]}`;
      }
    }
    setIsLoading(true)
    API.get(apiUrl)
      .then(response => {
        setChatThreadList(response.data);
        setIsLoading(false)
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
        setIsLoading(false)
      });
  }
  useEffect(() => {
    loadThreadList()
  }, [filters, pageSize, page])

  // load labels
  const loadLabels = () => {
    let apiUrl = `/communication/chatblocklabels/?page=${1}&page_size=${100}`;
    API.get(apiUrl)
      .then(response => {
        setChatLabels(response.data);
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
      });
  }
  useEffect(() => {
    loadLabels()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    const formattedDate = date.toISOString().split('T')[0]; // Formats to 'YYYY-MM-DD'
    setFilters((prevFilters) => ({
      ...prevFilters,
      date: formattedDate,
    }));
  };


  return (
    <div className='thread-list-page'>
      <div className="card">
        <div
          className={`search-threads d-none ${showFilters ? 'open' : 'closed'} `}
          onClick={() => setShowFilters(!showFilters)}
        >
          <div>
            Search for Threads
          </div>
          <img src='/images/chat/search.svg' />
        </div>
        {showFilters && (
          <div className='filters'>
            <input type="text"
              name="keyword"
              placeholder="Keyword"
              className="filter-input keyword"
              value={filters.keyword}
              onChange={handleInputChange} />
            <select
              name="tag"
              className="filter-input tags"
              value={filters.tag}
              onChange={handleInputChange}
            >
              <option value="">Select Tag</option>
              {chatLabels.map((label) => (
                <option key={label.id} value={label.id}>
                  {label.name}
                </option>
              ))}
            </select>

            {/* Customer ID / Name Input */}
            <input
              type="text"
              name="customer"
              placeholder="Customer ID / Name"
              className="filter-input customer-name"
              value={filters.customer}
              onChange={handleInputChange}
            />

            {/* Date Picker */}
            <DatePicker
              selected={filters.date}
              onChange={handleDateChange}
              className="filter-input date"
              placeholderText="Select a date"
            />
            <button className="find-btn">Find</button>
            <button className="clear-btn"
              onClick={handleClearFilters}>Clear Search</button>
          </div>
        )}

        {/* Chat Threads List */}
        <div className="chat-threads-list">
          {isLoading ? (
            <div className='d-flex w-100 justify-content-center items-center'>
              <div className="spinner-border spinner-border-sm " role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : chatThreadList?.results?.length === 0 ? (
            <div className="no-threads">No threads available!</div>
          ) : (
            chatThreadList?.results?.map((thread) => (
              <div key={thread.id} className={`chat-thread ${thread.is_closed ? 'closed' : ''}`}>
                {/* Main Content + View Button */}
                <div className="content">
                  {/* Basic Info */}
                  <div className="first-row">
                    <div className="customer-id">
                      <span>Customer ID:</span>
                      {thread.customer_id}
                    </div>
                    <div className="customer-name">
                      <span>Name:</span>
                      {thread.customer_name}
                    </div>

                    <div className="date">
                      <span>Created:</span>
                      {thread.created_at && formatDateTime(thread.created_at)}
                    </div>
                    <div className="tags">
                      <span>Tags:</span>
                      {
                        thread?.label_data?.length === 0 ?
                          <span>---</span> : (
                            thread?.label_data?.map((tag, index) => (
                              <span key={index} className="tag" style={{ backgroundColor: tag?.color || '#000' }}>
                                {tag?.name}
                              </span>
                            ))
                          )}
                    </div>
                  </div>
                  {/* Chats */}
                  <div className="chats">
                    {thread?.chat?.slice(0, 3).map((chat, index) => (
                      <div key={index} className="chat-message">
                        {chat?.bot_question
                          ? parseBotMessage(chat?.message)
                          : chat?.message}
                      </div>
                    ))}
                  </div>

                  {/* Note */}
                  {thread?.note &&
                    <div className="note">
                      <span>Note:</span> {thread.note}
                    </div>
                  }

                  {/* status */}
                  <div className='d-flex flex-column justify-content-start mt-3'>
                    <div className={`status-indicator ${thread.is_closed ? 'closed' : 'open'}`}>
                      {thread.is_closed ?
                        <span>Closed {thread.closed_on && formatDateTime(thread.closed_on)}</span> :
                        'Open'
                      }
                    </div>
                  </div>
                </div>

                {/* View Button */}
                <button className="view-btn"
                  onClick={() => handleViewThread(thread.customer_id, thread.start_chat_id)}
                >
                  View
                </button>


              </div>
            ))
          )}


        </div>
        {chatThreadList?.results?.length > 0 &&
          <Pagination
            totalItems={chatThreadList?.count || 0}
            pageSize={pageSize}
            currentPage={page}
            setCurrentPage={setPage}
            selectPageSize={selectPageSize}
          >

          </Pagination>
        }
      </div>
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
    </div>
  );
};

export default ChatThreadList;
