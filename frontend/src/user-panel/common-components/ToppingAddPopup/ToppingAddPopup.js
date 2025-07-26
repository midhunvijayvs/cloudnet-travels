import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import API from '../../../API'
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"

import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import './ToppingAddPopup.scss'


const ToppingAddPopup = ({ setterFunction, selectedItem, formData, setFormData, okClickedFunction }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [toppings, setToppings] = useState([]);
  const closeModal = () => {
    setterFunction(false);
  }
  useEffect(() => {
    API.get(`/restaurants/topping/${selectedItem}/`)
      .then(response => {
        setToppings(response.data)
      })
      .catch(error => {

      });
  }, []);

  const handleToppingChange = (toppingId) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      topping: toppingId,
    }));    
  };
  const submitButton = () =>{
    console.log(formData);
    
    okClickedFunction(formData);
    setterFunction(false)    
  }


  return (
    <div className='custom-modal toppings-add'>
      <div className="bg-white customized-modal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="container">
              <div className="filter-header">
                <h5 className="title">Add Extra Toppings</h5>
                <button onClick={closeModal} className="btn-close" aria-label="Close"></button>
              </div>
              <p className=''>Enhance your meal with delicious toppings. </p>
              <div className="filter-body">
                <ul className="filter-list border-0">
                  <li>
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
                  {toppings && toppings.map((item, index) => (
                    <li key={index}>
                      <h6 className="product-size">{item.description}</h6>
                      <div className="form-check product-price">
                        <label className="form-check-label" htmlFor={`topping${index}`}>
                          ₹{item.price}
                        </label>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="topping"
                          value={item.id}
                          id={`topping${index}`}
                          onChange={() => handleToppingChange(item.id)}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <button className='btn-primary add-btn' onClick={submitButton}>Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => navigate("/")} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => { }} />}

    </div>
  )
}

export default ToppingAddPopup