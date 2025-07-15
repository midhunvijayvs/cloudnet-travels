import React, { useEffect, useState } from 'react'
import './ChatBlockLabel.scss'

import API from '../../../../API';
import ErrorModal from '../../../../ErrorModal';
import ColorPicker from '../../ColorPicker/ColorPicker';
import DeleteConfirmModal from '../../../../DeleteConfirmModal';

const ChatBlockLabel = ({ setterFunction }) => {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [chatLabels, setChatLabels] = useState([]);

  const [newLabel, setNewLabel] = useState('');
  const [labelColor, setLabelColor] = useState('#a1a1a1');
  const [isLabelAddMode, setIsLabelAddMode] = useState(false);
  const [isLabelEditMode, setIsLabelEditMode] = useState(false);
  const [editLabelIndex, setEditLabelIndex] = useState(null);
  const [selectedLabels, setSelectedLabels] = useState([]);

  // load labels
  const loadLabels = () => {
    let apiUrl = `/communication/chatblocklabels/?page=${1}&page_size=${100}`;
    setIsLoading(true)
    API.get(apiUrl)
      .then(response => {
        setChatLabels(response.data);
        setIsLoading(false)
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
        setIsLoading(false)
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
  const handleEditLabel = (item) => {
    if (newLabel.trim()) {
      const newLabelData = {
        name: newLabel,
        color: labelColor,
      };
      API.put(`/communication/chatblocklabels/${item.id}/`, newLabelData)
        .then((response) => {
          setNewLabel("");
          setLabelColor('#a1a1a1'); 
          setIsLabelEditMode(false);
          loadLabels();  // Reload the labels to include the new one
        })
        .catch((error) => {
          setIsLoading(false)
          setMessage(error.response?.data?.message || error.message);
          setIsErrorModalOpen(true);
        })
    }
  }


  const handleEditClick = (label, index) => {
    setIsLabelEditMode(true);
    setEditLabelIndex(index);
    setNewLabel(label.name);
    setLabelColor(label.color);
  };

  const handleDeleteItem = () => {
    API.delete(`/communication/chatblocklabels/${selectedItem.id}`,)
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

  };


  return (
    <div className='custom-modal chatblock-label'>
      <div className='card'>
        <div className='first-screen'>

          {/* New Section: Add Tags for Chatblock */}
          <div className="chatblock-tags mt-2">
            <h3>Chat Thread Tags</h3>
            <div className='add-section'>
              {!isLabelAddMode ? (
                <div className="item add" onClick={() => setIsLabelAddMode(true)}>
                  <span className="plus-icon">+</span> Add Tag
                </div>
              ) : (
                <div className="item add-input">
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
            </div>

            {/* List of chatblock labels (multi-select) */}
            <div className="tag-list">
              {isLoading ?
                <div className='d-flex w-100 justify-content-center align-items-center'>
                  <div className="spinner-border spinner-border-sm " role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
                : (
                  <>
                    {chatLabels?.map((label, index) => (
                      <div key={index} className={`tag-item ${editLabelIndex === index && isLabelEditMode && 'is_edit'}`} style={{ backgroundColor: label.color }}>
                        {editLabelIndex === index && isLabelEditMode ? (
                          <div className="tag-item add-input">
                            <input
                              type="text"
                              value={newLabel}
                              onChange={(e) => setNewLabel(e.target.value)}
                              placeholder="Enter new tag"
                            />
                            <ColorPicker
                              initialColor={labelColor}
                              onColorChange={(color) => setLabelColor(color.hex)}
                            />
                            <button onClick={()=>handleEditLabel(label)} className="add-button">Save</button>
                            <button onClick={() => {
                              setIsLabelEditMode(false);
                              setEditLabelIndex(null);
                            }} className="cancel-button">x</button>
                          </div>
                        ) : (
                          <>
                            {label.name}
                            <img
                              src='/images/chat/labels/edit.svg'
                              onClick={() => handleEditClick(label, index)}
                              alt="Edit"
                            />
                            <img
                              src='/images/chat/labels/delete.svg'
                              onClick={() => {
                                setSelectedItem(label);
                                setIsDeleteConfModalOpen(true);
                              }}
                              alt="Delete"
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </>
                )}
            </div>


          </div>

          <div className='footer mt-2'>

            <button type='button' className='cancel-btn' onClick={() => { setterFunction(false) }}>Close</button>

          </div>
        </div>
      </div >
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'chatlabels'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={handleDeleteItem}></DeleteConfirmModal>}

    </div >
  )
}

export default ChatBlockLabel