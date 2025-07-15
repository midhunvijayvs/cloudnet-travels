import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import API from '../../../API'
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"

import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import './CartItemAddPopup.scss'


const CartItemAddPopup = ({ setterFunction, selectedItem, formData, setFormData, okClickedFunction }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const closeModal = () => {
    setterFunction(false);
  }
  

  const handleToppingChange1 = (toppingId) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      topping: toppingId,
    }));
  };

  const handleToppingChange = (toppingId, action) => {
    setFormData((prevFormData) => {
      let updatedToppings = prevFormData.toppings ? [...prevFormData.toppings] : [];

      const toppingIndex = updatedToppings.findIndex(topping => topping.topping === toppingId);

      if (toppingIndex !== -1) {
        updatedToppings = updatedToppings.map((topping, index) =>
          index === toppingIndex
            ? { ...topping, count: action === 'add' ? topping.count + 1 : Math.max(topping.count - 1, 0) }
            : topping
        ).filter(topping => topping.count > 0);
      } else if (action === 'add') {
        updatedToppings.push({ topping: toppingId, count: 1 });
      }

      return {
        ...prevFormData,
        toppings: updatedToppings
      };
    });
  };

  const handleVariantChange = (variantId) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      variant: variantId,
    }));
  };
  const submitButton = () => {

    okClickedFunction(formData);
    setterFunction(false)
  }


  return (
    <div className='custom-modal cartitem-add'>
      {(selectedItem?.topping_details?.length > 0 || selectedItem?.variants_details?.length > 0) &&
        <div className="bg-white customized-modal" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="container">
                <div className="filter-header">
                  <h5 className="title">
                    {selectedItem?.variants_details?.length > 0 && selectedItem?.topping_details?.length > 0
                      ? 'Choose Variant & Toppings'
                      : selectedItem?.variants_details?.length > 0
                        ? 'Choose Variant'
                        : 'Choose Toppings'}
                  </h5>
                  <button onClick={closeModal} className="btn-close" aria-label="Close"></button>
                </div>
                {selectedItem?.variants_details?.length > 0 &&
                  <div className='variant-container'>
                    <p className=''>Portion </p>
                    <div className="filter-body">
                      <ul className="filter-list border-0 variant-list">
                        <li >
                          <h6 className="product-size">{selectedItem.unit_details?.name}</h6>
                          <div className="form-check product-price">
                            <label className="form-check-label" htmlFor={`variant`}>
                              £{selectedItem.offer_price}
                            </label>
                            <input
                              className="form-check-input"
                              type="radio"
                              name="variant"
                              value={null}
                              checked={!formData?.variant}
                              id={`variant`}
                              onChange={() => handleVariantChange(null)}
                            />
                          </div>
                        </li>
                        {selectedItem?.variants_details?.map((item, index) => (
                          <li key={index}>
                            <h6 className="product-size">{item.quantity_name}</h6>
                            <div className="form-check product-price">
                              <label className="form-check-label" htmlFor={`variant${index}`}>
                                £{item.offer_price}
                              </label>
                              <input
                                className="form-check-input"
                                type="radio"
                                name="variant"
                                value={item.id}
                                id={`variant${index}`}
                                onChange={() => handleVariantChange(item.id)}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                }
                {selectedItem?.topping_details?.length > 0 &&
                  <div className='toppings-container'>
                    <p className=''>Enhance your meal with delicious toppings. </p>
                    <div className="filter-body">
                      <ul className="filter-list border-0 topping-list">
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
                              checked={!formData.topping}
                            />
                          </div>
                        </li>
                        {selectedItem?.topping_details?.map((item, index) => {
                          const toppingCount = formData.toppings?.find(t => t.topping === item.id)?.count || 0;
                          return (
                            <li key={index}>
                              <h6 className="product-size">
                                {item.description}
                              </h6>
                              <div>
                                {item.price && item.price >0 && `£${item.price}`}
                              </div>
                              <div className={`plus-minus ${toppingCount > 0 ? 'has-count' : ''}`}>
                                <i className="ri-subtract-line sub" onClick={() => handleToppingChange(item.id, 'subtract')}></i>
                                <input type="number" min="1" max="10" value={toppingCount} disabled />
                                <i className="ri-add-line add" onClick={() => handleToppingChange(item.id, 'add')}></i>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                }

                <div className='d-flex justify-content-center align-items-center'>
                  <button className='btn-primary add-btn' onClick={submitButton}>Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => navigate("/")} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => { }} />}

    </div>
  )
}

export default CartItemAddPopup