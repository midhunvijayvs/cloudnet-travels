
import React, { useState, useEffect } from 'react';
import "../../../CustomPopup.scss";
import './OrderReviewPopup.scss'
import API from '../../../API'
import PositiveModal from "../../../PositiveModal"
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import $ from 'jquery';
import { useNavigate } from 'react-router-dom'
import ErrorModal from "../../../ErrorModal";
import OrderItemReviewPopup from '../OrderItemReviewPopup/OrderItemReviewPopup';
import { sanitizeOffensiveText } from '../../../GeneralFunctions';

const OrderReviewPopup = ({ orderId, setterFunction }) => {

  const navigate = useNavigate()
  const [data, setData] = useState({
    overall_rating: 0,
    overall_review: "",
    accuracy_of_items_rating: 0,
    accuracy_of_items_review: '',
  })
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSecondScreenShown, showSecondScreen] = useState(false); // for item-review confirmation
  const [isItemReviewModalOpen, setIsItemReviewModalOpen] = useState(false); // for item-review Popup
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [orderItemData, setOrderItemData] = useState([]);
  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState({
    overall_review: "",
    accuracy_of_items_review: "",
  });

  const validateForm = (data) => {
    const errors = {};
    if (data.overall_rating === 0) {
      errors.overall_rating = "required.";
    }
    return errors;
  };

  const loadData = () => {
    let apiUrl = ''
    if (orderId) {
      apiUrl = `/order/order-review/${orderId}/`;
    } else {
      apiUrl = `/order/latest-order-review/`;
    }

    API.get(apiUrl)
      .then(response => {
        setOrderItemData(response.data.order_items_review || [])
        setData(response.data.order_review || {})
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false)
      });
  }
  useEffect(() => {
    loadData();

  }, []);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;

    const containsBadWords = value !== sanitizeOffensiveText(value); // Check if text was modified
    setWarnings((prev) => ({
      ...prev,
      [name]: containsBadWords ? "Inappropriate language detected!" : "",
    }));

    setData((prevData) => ({
      ...prevData,
      [name]: value, // Keep the original input to let the user correct it
    }));
  };


  const handleSubmit = async (e) => {
    const validationErrors = validateForm(data);
    if (Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = data;
    // Check for offensive words in review fields
    const fieldsToCheck = ["overall_review", "accuracy_of_items_review"];
    let hasOffensiveWords = false;
    let flaggedFields = [];
    fieldsToCheck.forEach((field) => {
      if (data[field] && data[field] !== sanitizeOffensiveText(data[field])) {
        hasOffensiveWords = true;
        flaggedFields.push(field);
      }
    });

    // If offensive words found, show an alert and prevent submission
    if (hasOffensiveWords) {
      setMessage(`Your review contains inappropriate language. Please edit your text before submitting.`);
      setIsErrorModalOpen(true)
      return;
    }
    // return


    setIsLoading(true);
    API.put(`/order/order-reviews/${data.id}/`, formData,)
      .then(response => {
        // setMessage("Thank you for your valuable feedback!")
        // setIsMessageModalOpen(true)
        setIsLoading(false)
        showSecondScreen(true)
      })
      .catch(error => {
        setIsLoading(false)
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true)

      });
  }
  const handleCancel = () => {
    API.put(`/order/order-reviews/${data.id}/`, { is_order_ratings_ignored: true })
      .then(response => {
        setIsLoading(false)
        setterFunction(false)
      })
      .catch(error => {
        console.log('-false');
        setIsLoading(false)
        setterFunction(false)
      });
  }

  const changeStars = (number, key) => {
    setData({ ...data, [key]: number })
  }

  return (

    <div className='custom-modal order-review-modal'>
      <div className={`card ${isSecondScreenShown ? 'd-none' : ''}`}>
        <div className='first-screen'>
          <div className='bg-gradlightbrick m-auto mb-2 w-h-100 radius-50 d-flex justify-content-center align-items-center'><i className="fa-solid fa-cart-shopping fa-3x white-clr"></i></div>
          <p>How is your order?</p>
          {/* overall Rating */}
          <div className='rating-sec'>
            <div className='f-xxs clr-565B67 fw-500 mb-2 mt-2'>Please give your overall rating & review.</div>
            <div className='star-box mb-3'>
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  width="33"
                  height="31"
                  viewBox="0 0 33 31"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => changeStars(star, 'overall_rating')}
                >
                  <path
                    className={data.overall_rating >= star ? "filled" : ""}
                    d="M14.0471 1.88531L10.9293 8.52294C10.8366 8.72034 10.7038 8.88237 10.5406 9.00038C10.3765 9.1191 10.18 9.19684 9.96248 9.22401L2.68825 10.1394C2.1827 10.1998 1.72842 10.3981 1.35988 10.7023C0.992252 11.0055 0.713381 11.4143 0.550152 11.9159C0.399122 12.4044 0.389986 12.8858 0.505896 13.3368C0.625784 13.7999 0.875401 14.228 1.24417 14.5733L6.59282 19.5906C6.75392 19.7417 6.86866 19.9189 6.93024 20.1093C6.99159 20.2987 7.00377 20.509 6.96138 20.7265L5.57775 27.9552C5.48807 28.4467 5.53747 28.93 5.70958 29.3651C5.88473 29.8081 6.18702 30.201 6.59891 30.5001C7.00869 30.7982 7.47698 30.9644 7.95443 30.9935C8.42884 31.0227 8.91216 30.9169 9.35515 30.6722L15.78 27.1352C15.9722 27.0294 16.1769 26.976 16.3783 26.976C16.5796 26.976 16.7831 27.0294 16.9754 27.1352L23.4002 30.6722C23.8444 30.9169 24.3267 31.0227 24.8009 30.9935C25.2802 30.9633 25.7464 30.7982 26.1574 30.5001C26.5693 30.2011 26.8713 29.8081 27.0467 29.3651C27.2219 28.923 27.2692 28.4315 27.1736 27.9321L25.7949 20.7256C25.7537 20.508 25.7647 20.2975 25.8261 20.1083C25.8874 19.918 26.0024 19.7407 26.1635 19.5897L31.5121 14.5724C31.8807 14.227 32.1294 13.7999 32.2493 13.3377C32.3691 12.8754 32.356 12.3809 32.1998 11.8995C32.0427 11.4131 31.7638 11.0052 31.3962 10.7011C31.0277 10.3969 30.5725 10.1976 30.0679 10.1342L22.793 9.22164C22.5746 9.19355 22.379 9.11698 22.2149 8.99802C22.0529 8.88024 21.9189 8.71797 21.8262 8.52058L18.7084 1.88295C18.4908 1.42072 18.1625 1.04912 17.7617 0.794359L17.7092 0.764152C17.3154 0.526485 16.8592 0.397461 16.3759 0.397461C15.8683 0.397461 15.3941 0.537485 14.9902 0.794358C14.5893 1.04912 14.261 1.41982 14.0435 1.88295L14.0471 1.88531Z"
                    stroke="#868790"
                    strokeWidth="0.916276"
                    fill="#E05A67"
                  />
                </svg>
              ))}
            </div>
          </div>
          <div className='w-100 mb-3'>
            <textarea placeholder='What did you like or dislike?' className={`form-control ${warnings.overall_review ? 'border border-danger' : ''}`}
              value={data.overall_review} name='overall_review'
              onChange={handleReviewChange}>
            </textarea>
            {warnings.overall_review && <div className='warning-text'>{warnings.overall_review}</div>}
          </div>

          {/* Accuracy of items Rating */}
          <div className='rating-sec no-2'>
            <div className='f-xxs clr-565B67 fw-500 mb-1'>How accurate was the ordered items?</div>
            <div className='star-box mb-3'>
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  width="33"
                  height="31"
                  viewBox="0 0 33 31"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => changeStars(star, 'accuracy_of_items_rating')}
                >
                  <path
                    className={data.accuracy_of_items_rating >= star ? "filled" : ""}
                    d="M14.0471 1.88531L10.9293 8.52294C10.8366 8.72034 10.7038 8.88237 10.5406 9.00038C10.3765 9.1191 10.18 9.19684 9.96248 9.22401L2.68825 10.1394C2.1827 10.1998 1.72842 10.3981 1.35988 10.7023C0.992252 11.0055 0.713381 11.4143 0.550152 11.9159C0.399122 12.4044 0.389986 12.8858 0.505896 13.3368C0.625784 13.7999 0.875401 14.228 1.24417 14.5733L6.59282 19.5906C6.75392 19.7417 6.86866 19.9189 6.93024 20.1093C6.99159 20.2987 7.00377 20.509 6.96138 20.7265L5.57775 27.9552C5.48807 28.4467 5.53747 28.93 5.70958 29.3651C5.88473 29.8081 6.18702 30.201 6.59891 30.5001C7.00869 30.7982 7.47698 30.9644 7.95443 30.9935C8.42884 31.0227 8.91216 30.9169 9.35515 30.6722L15.78 27.1352C15.9722 27.0294 16.1769 26.976 16.3783 26.976C16.5796 26.976 16.7831 27.0294 16.9754 27.1352L23.4002 30.6722C23.8444 30.9169 24.3267 31.0227 24.8009 30.9935C25.2802 30.9633 25.7464 30.7982 26.1574 30.5001C26.5693 30.2011 26.8713 29.8081 27.0467 29.3651C27.2219 28.923 27.2692 28.4315 27.1736 27.9321L25.7949 20.7256C25.7537 20.508 25.7647 20.2975 25.8261 20.1083C25.8874 19.918 26.0024 19.7407 26.1635 19.5897L31.5121 14.5724C31.8807 14.227 32.1294 13.7999 32.2493 13.3377C32.3691 12.8754 32.356 12.3809 32.1998 11.8995C32.0427 11.4131 31.7638 11.0052 31.3962 10.7011C31.0277 10.3969 30.5725 10.1976 30.0679 10.1342L22.793 9.22164C22.5746 9.19355 22.379 9.11698 22.2149 8.99802C22.0529 8.88024 21.9189 8.71797 21.8262 8.52058L18.7084 1.88295C18.4908 1.42072 18.1625 1.04912 17.7617 0.794359L17.7092 0.764152C17.3154 0.526485 16.8592 0.397461 16.3759 0.397461C15.8683 0.397461 15.3941 0.537485 14.9902 0.794358C14.5893 1.04912 14.261 1.41982 14.0435 1.88295L14.0471 1.88531Z"
                    stroke="#868790"
                    strokeWidth="0.916276"
                    fill="#E05A67"
                  />
                </svg>
              ))}
            </div>
          </div>
          <div className='w-100 mb-3'>
            <textarea placeholder='Feedback on the accuracy of the items...' className={`form-control ${warnings.accuracy_of_items_review ? 'border border-danger' : ''}`}
              value={data.accuracy_of_items_review} name='accuracy_of_items_review'
              onChange={handleReviewChange}>
            </textarea>
            {warnings.accuracy_of_items_review && <div className='warning-text'>{warnings.accuracy_of_items_review}</div>}
          </div>

        </div>

        <div className='footet vertical-footer'>
          <button className='ok-button' onClick={handleSubmit}>SUBMIT</button>
          <button className='cancel-button' onClick={handleCancel}>Cancel</button>
        </div>
        <div>

        </div>

      </div>

      {/* Item Review confirmation */}
      {isSecondScreenShown &&
        <div className={`card confirm ${isItemReviewModalOpen ? 'd-none' : ''}`}>
          <div className='first-screen ' >
            <div className='bg-gradlightbrick m-auto mb-2 w-h-100 radius-50 d-flex justify-content-center align-items-center'><i className="fa-solid fa-cart-shopping fa-3x white-clr"></i></div>
            <p>Thank you for your Valuable feedback!</p>
          </div>
          <div className='order-item-sec'>
            <div className='mt-2 mb-2 sub-heading' >
              Do you want to rate your dishes?
            </div>
          </div>
          <div className='footet vertical-footer'>
            <button className='cancel-button'
              onClick={() => { setterFunction(false); setMessage("Thank you for your Valuable feedback!"); setIsMessageModalOpen(true); }}>Cancel</button>
            <button className='ok-button' onClick={() => setIsItemReviewModalOpen(true)}>Continue</button>
          </div>
        </div>
      }

      {isItemReviewModalOpen && <OrderItemReviewPopup orderItemData={orderItemData} setterFunction={setterFunction} />}

      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setterFunction(false)} />}
      {isLoading && <FixedOverlayLoadingSpinner />}

    </div>

  );
};

export default OrderReviewPopup;