import React, { useEffect, useState } from 'react'
import './ChatBlockClosePopup.scss'

import API from '../../../../API';
import ErrorModal from '../../../../ErrorModal';
import ColorPicker from '../../ColorPicker/ColorPicker';

const ChatBlockClosePopup = ({ setterFunction, chat, loadData }) => {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const lastChatBlockId = chat.length > 0 ? chat[chat.length - 1].chat_block : null;
  const [formData, setFormData] = useState({
    labels: [],
    note: "",
    is_closed: false
  });

  const [chatLabels, setChatLabels] = useState([]);

  const [newLabel, setNewLabel] = useState('');
  const [labelColor, setLabelColor] = useState('#a1a1a1');
  const [isLabelAddMode, setIsLabelAddMode] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState([]);

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

  const handleAddLabel = () => {
    if (newLabel.trim()) {
      const newLabelData = {
        name: newLabel,
        color: labelColor,
      };
      API.post('/communication/chatblocklabels/', newLabelData)
        .then((response) => {
          setNewLabel("");
          setLabelColor('#a1a1a1');  // Reset color after adding
          setIsLabelAddMode(false);
          loadLabels();  // Reload the labels to include the new one
        })
        .catch((error) => {
          setIsLoading(false)
          setMessage(error.response?.data?.message || error.message);
          setIsErrorModalOpen(true);
        })
    }
  }


  const handleLabelSelect = (label) => {
    const updatedLabels = selectedLabels.includes(label)
      ? selectedLabels.filter((item) => item !== label)
      : [...selectedLabels, label];

    setSelectedLabels(updatedLabels);
    setFormData((prevData) => ({
      ...prevData,
      labels: updatedLabels
    }));
  };
  const handleRemoveLabel = (labelToRemove) => {
    const updatedLabels = selectedLabels.filter((label) => label !== labelToRemove);
    setSelectedLabels(updatedLabels);
    setFormData((prevData) => ({
      ...prevData,
      labels: updatedLabels,
    }));
  };




  const handleNoteChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      note: e.target.value
    }));
  };



  const handleSubmit = () => {
    if (!lastChatBlockId) {
      console.warn('No Conversation ID found to close the chat block.');
      return;
    }
    // Validation: Check if at least one tag is selected
    if (formData?.labels?.length === 0) {
      setMessage("Please select at least one tag.");
      setIsErrorModalOpen(true);
      return;  // Prevent submission if no tags are selected
    }

    setIsLoading(true);
    const dataToSubmit = {
      ...formData,
      labels: formData.labels.map(label => label.id),
      is_closed: true,
    };
    API.put(`/communication/chat-blocks/${lastChatBlockId}/`, dataToSubmit)
      .then((response) => {
        setIsLoading(false);
        loadData();
        setterFunction(false)
      })
      .catch((error) => {
        setIsLoading(false)
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
      });
  }

  return (
    <div className='custom-modal chat-block-close'>
      <div className='card'>
        <div className='first-screen'>
          <img src='/images/icons/svg/warning.svg'></img>
          <h1>Close Thread</h1>
          {/* New Section: Add Tags for Chatblock */}
          <div className="chatblock-tags mt-2">
            <h3>What is this chat thread about?</h3>

            {/* List of chatblock labels (multi-select) */}
            <div className="tag-list">
              {localStorage.getItem('userRole') === 'admin' &&
                <>
                  {!isLabelAddMode ? (
                    <div className="tag-item add" onClick={() => setIsLabelAddMode(true)}>
                      <span className="plus-icon">+</span> Add Tag
                    </div>
                  ) : (
                    <div className="tag-item add-input">
                      <input
                        type="text"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        placeholder="Enter new tag"
                      />
                      <ColorPicker initialColor={labelColor} onColorChange={(color) => setLabelColor(color.hex)} />
                      <button onClick={handleAddLabel} className="add-button">Add</button>
                    </div>
                  )}
                </>
              }
              {chatLabels.map((label, index) => (
                <div
                  key={index}
                  className={`tag-item ${selectedLabels.includes(label) ? 'selected' : ''}`}
                  onClick={() => handleLabelSelect(label)}
                  style={{ backgroundColor: label.color }}
                >
                  {label.name}
                  {selectedLabels.includes(label) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveLabel(label);
                      }}
                      className="remove-button"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>


          </div>

          {/* New Section: Add Notes for the Chatblock */}
          <div className="chatblock-notes">
            <h3>Have anything to note about this chat?</h3>
            <textarea
              rows="3"
              placeholder="Add your notes here..."
              value={formData.note}
              onChange={handleNoteChange}
            />
          </div>
          <div className='d-flex w-100 mt-4'>
            <p>Are you sure you want to close the conversation?</p>
          </div>
          <div className='footer mt-2'>

            <button type='button' className='cancel-btn' onClick={() => { setterFunction(false) }}>Cancel</button>
            <button type='button' className='submit'
              onClick={handleSubmit}>
              {isLoading ? (
                <div className="spinner-border spinner-border-sm " role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                'Close Thread'
              )}
            </button>
          </div>
        </div>
      </div >
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />

    </div >
  )
}

export default ChatBlockClosePopup