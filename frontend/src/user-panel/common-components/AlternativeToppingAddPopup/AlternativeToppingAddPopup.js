import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import API from '../../../API'
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"

import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import './AlternativeToppingAddPopup.scss'


const AlternativeToppingAddPopup = ({ setterFunction, selectedItem, setSelectedItem, addAlternative }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [toppingSelected, setToppingSelected] = useState(null);
  const [toppingData, setToppingData] = useState({});
  const closeModal = () => {
    setterFunction(false);
  }

  const handleChangeCount = (type) => {
    setSelectedItem((prev) => {
      let newCount = type === "increase" ? prev.count + 1 : prev.count - 1;
      return { ...prev, count: newCount < 1 ? 1 : newCount }; // Restrict min to 1
    });
  };

  const handleToppingChange1 = (toppingItem) => {
    setToppingSelected(toppingItem)
  };
  const submitButton = () => {
    // setSelectedItem((prevData) => ({
    //   ...prevData,
    //   addedTopping: toppingSelected?.id,
    //   addedToppingDetails: toppingSelected,
    // }));
    // const updatedItem = { ...selectedItem, addedTopping: toppingSelected?.id, addedToppingDetails: toppingSelected, };
    setSelectedItem((prevData) => ({
      ...prevData,
      addedToppings: toppingData?.toppings_list,
      addedToppingDetails: toppingData?.topping_details,
    }));
    const updatedItem = { ...selectedItem, addedToppings: toppingData?.toppings_list, addedToppingDetails: toppingData?.topping_details, };

    addAlternative(updatedItem)
    // setterFunction(false)
  }

  const handleToppingChange = (toppingDetail, action) => {
    setToppingData((prevToppingData) => {
      let updatedToppings = prevToppingData.toppings_list ? [...prevToppingData.toppings_list] : [];

      const toppingIndex = updatedToppings.findIndex(topping => topping.topping === toppingDetail.id);

      if (toppingIndex !== -1) {
        updatedToppings = updatedToppings.map((topping, index) =>
          index === toppingIndex
            ? { ...topping, count: action === 'add' ? topping.count + 1 : Math.max(topping.count - 1, 0) }
            : topping
        ).filter(topping => topping.count > 0);
      } else if (action === 'add') {
        updatedToppings.push({ topping: toppingDetail.id, count: 1, price: toppingDetail.price });
      }

      // Updating topping_details list
      let updatedToppingDetails = prevToppingData.topping_details ? [...prevToppingData.topping_details] : [];
      const toppingDetailIndex = updatedToppingDetails.findIndex(detail => detail.topping.id === toppingDetail.id);

      if (toppingDetailIndex !== -1) {
        updatedToppingDetails = updatedToppingDetails.map((detail, index) =>
          index === toppingDetailIndex
            ? { ...detail, price: detail.price, count: action === 'add' ? detail.count + 1 : Math.max(detail.count - 1, 0) }
            : detail
        ).filter(detail => detail.count > 0);
      } else if (action === 'add') {
        updatedToppingDetails.push({ count: 1, topping: toppingDetail,price: toppingDetail.price, });
      }

      return {
        ...prevToppingData,
        toppings_list: updatedToppings,
        topping_details: updatedToppingDetails
      };
    });
  };


  return (
    <div className='custom-modal toppings-alternative-add'>
      <div className="bg-white customized-modal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="container main-container">
              <div className="filter-header">
                <h5 className="title">Menu Item</h5>
                <button onClick={closeModal} className="btn-close" aria-label="Close"></button>
              </div>
              <div className='product-name'>
                {selectedItem?.name} {selectedItem?.variant_details && `( ${selectedItem?.variant_details} )`}
              </div>
              <div className='quantity-container'>
                <div className="plus-minus">
                  <i className="ri-subtract-line sub" onClick={() => handleChangeCount("decrease")}></i>
                  <input type="text" value={selectedItem?.count} disabled />
                  <i className="ri-add-line add" onClick={() => handleChangeCount("increase")}></i>
                </div>

              </div>
              {selectedItem?.topping_details?.length > 0 &&
                <div className='topping-container'>
                  <p className=''>Enhance your meal with delicious toppings. </p>
                  <div className="filter-body">
                    <ul className="filter-list border-0">
                      <li className='d-none'>
                        <h6 className="product-size">No Toppings</h6>
                        <div className="form-check product-price">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="topping"
                            value={null}
                            id="noTopping"
                            onChange={() => handleToppingChange(null)}
                            checked={!toppingSelected}
                          />
                        </div>
                      </li>
                      {selectedItem?.topping_details?.map((item, index) => {
                        const toppingCount = toppingData.toppings_list?.find(t => t.topping === item.id)?.count || 0;
                        return (
                          <li key={index}>
                            <h6 className="product-size">
                              {item.description}
                            </h6>
                            <div>
                              {item.price && item.price > 0 && `₹${item.price}`}
                            </div>
                            <div className={`plus-minus ${toppingCount > 0 ? 'has-count' : ''}`}>
                              <i className="ri-subtract-line sub" onClick={() => handleToppingChange(item, 'subtract')}></i>
                              <input type="number" min="1" max="10" value={toppingCount} disabled />
                              <i className="ri-add-line add" onClick={() => handleToppingChange(item, 'add')}></i>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              }
              <div className='d-flex justify-content-center mt-3'>
                <button className='btn-primary add-btn' onClick={submitButton}>Add Item</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => navigate("/")} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => { }} />}

    </div>
  )
}

export default AlternativeToppingAddPopup