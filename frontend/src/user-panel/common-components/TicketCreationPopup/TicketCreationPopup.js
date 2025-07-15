import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import API from '../../../API'
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"

import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import './TicketCreationPopup.scss'


const TicketCreationPopup = ({ setterFunction, order }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("entire");
  const [selectedItem, setSelectedItem] = useState("");
  const [errors, setErrors] = useState("");

  const closeModal = () => {
    setterFunction(false);
  }

  const handleSubmit = () => {
    if (selectedOption === "particular" && !selectedItem) {
      setErrors("Please select an item.");
      return;
    }

    setErrors("");
    localStorage.setItem("selectedId", order?.id);
    localStorage.setItem("selectedOrderItemId", selectedOption === "particular" ? selectedItem : "");
    const isGrocery = String(order?.id).startsWith("G");
    const path = isGrocery ? "/grocery/complaints-and-refund" : "/complaints-and-refund";
    navigate(path);
  };



  return (
    <div className='custom-modal ticket-creation-popup'>
      <div className="bg-white customized-modal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="container">
              <button onClick={closeModal} className="btn-close" aria-label="Close"></button>
              <div className="filter-header">
                <h5 className="title">Raise Support Ticket</h5>
              </div>
              <div className="filter-body">
                <p>Please choose whether you want to raise a ticket for the entire order or a particular item:</p>

                <div className="option-group">
                  <label
                    className={`${selectedOption === 'entire' ? 'active' : ''}`}
                    onClick={() => setSelectedOption("entire")}>
                    Entire Order
                  </label>
                  <label
                    className={`${selectedOption === 'particular' ? 'active' : ''}`}
                    onClick={() => setSelectedOption("particular")}>
                    Particular Item
                  </label>
                </div>
                {selectedOption === "particular" && (
                  <>
                    <select
                      value={selectedItem}
                      onChange={(e) => setSelectedItem(e.target.value)}
                      className="item-select"
                    >
                      <option value="">Select an Item</option>
                      {order?.items
                        .filter(item => item.final)
                        .map((item, idx) => (
                          <option key={idx} value={item.id}>
                            #{item?.id} {(String(order?.id).startsWith('G') ? item?.grocery_item_name : item?.menu_item_name)}
                          </option>

                        ))}
                    </select>
                    {errors && <div className="text-danger">{errors}</div>}
                  </>
                )}

              </div>
              <div className="popup-buttons">
                {/* <button className="cancel-button">
                  Cancel
                </button> */}
                <button onClick={handleSubmit} className='ok-btn' >Proceed</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}

    </div>
  )
}

export default TicketCreationPopup