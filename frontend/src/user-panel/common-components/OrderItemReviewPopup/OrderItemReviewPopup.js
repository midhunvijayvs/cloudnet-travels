
import React, { useState, useEffect } from 'react';
import "../../../CustomPopup.scss";
import './OrderItemReviewPopup.scss'
import API from '../../../API'
import PositiveModal from "../../../PositiveModal"
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import $ from 'jquery';
import { useNavigate } from 'react-router-dom'
import ErrorModal from "../../../ErrorModal";
import { sanitizeOffensiveText } from '../../../GeneralFunctions';

const OrderItemReviewPopup = ({ orderItemData, setterFunction }) => {

  const navigate = useNavigate()
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState(orderItemData);
  const [reviews, setReviews] = useState({});
  const validateForm = (data) => {
    const errors = {};

    return errors;
  };

  // Handle review change
  const handleReviewChange = (index, value) => {
    const updatedData = [...data];
    updatedData[index].overall_review = value;
    setData(updatedData);
  };

  const handleSubmit = (index) => {
    const reviewItem = data[index];
    if (reviewItem?.overall_review) {
      setIsLoading(true)
      API.put(`/order/order-item-reviews/${reviewItem.id}/`,
        { overall_review: reviewItem.overall_review, order_item: reviewItem?.order_item })
        .then(response => {
          setIsLoading(false)
        })
        .catch(error => {
          setIsLoading(false)
          setMessage(error.response?.data?.message || error.message)
          setIsErrorModalOpen(true)
        });
    } else {
      return
    }
  }

  const changeStars = (star, ratingType, index) => {
    // setIsLoading(true)
    setData(prevData => {
      const updatedData = [...prevData];
      updatedData[index] = {
        ...updatedData[index],
        [ratingType]: star
      };
      return updatedData;
    });

    // const payload = {
    //   ...data[index],
    //   [ratingType]: star
    // };

    // API.put(`/order/order-item-reviews/${data[index].id}/`, payload)
    //   .then(response => {
    //     setIsLoading(false)
    //   })
    //   .catch(error => {
    //     setIsLoading(false)
    //     setMessage(error.response?.data?.message || error.message)
    //     setIsErrorModalOpen(true)
    //   });
  };


  const handleAllReviewsSubmit = () => {
    setIsLoading(true);

    // Filter out items with reviews
    const reviewItems = data.filter(item => item.overall_review);

    // if (reviewItems.length === 0) {
    //   setIsLoading(false);
    //   return;
    // }
    // Check for offensive words in any of the reviews
    let hasOffensiveWords = false;
    let flaggedItems = [];

    data.forEach((item, index) => {
        if (item.overall_review && item.overall_review !== sanitizeOffensiveText(item.overall_review)) {
            hasOffensiveWords = true;
            flaggedItems.push(`${item.menu_item_name}`); // Add index to identify which item has issues
        }
    });

    // If offensive words are found, alert and prevent submission
    if (hasOffensiveWords) {
        setMessage(`Some reviews contain inappropriate language. Please review the following items: ${flaggedItems.join(", ")}`);
        setIsErrorModalOpen(true)
        setIsLoading(false)
        return;
    }


    // Create an array of API promises for batch updates
    const updatePromises = data.map(item =>
      API.put(`/order/order-item-reviews/${item.id}/`, {
        overall_review: item.overall_review,
        order_item: item.order_item,
        overall_rating: item.overall_rating || 0,
        taste_rating: item.taste_rating || 0,
        freshness_rating: item.freshness_rating || 0
      })
    );

    // Execute all API calls
    Promise.all(updatePromises)
      .then(() => {
        setIsLoading(false);
        setMessage("Thank you for your valuable feedback!")
        setIsMessageModalOpen(true)
      })
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
      });
  };


  return (

    <div className='custom-modal order-item-review-modal'>
      <div className='card'>

        <div className='order-item-sec'>

          {data && data.length > 0 &&
            data.map((item, index) => (
              <div className='order-item'>
                <div className='name'>{item.menu_item_name}</div>
                <div className='rating-container'>
                  {/* overall */}
                  <div className='d-flex flex-column align-items-center'>
                    <div className='star-box mb-1 me-2'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          width="33"
                          height="31"
                          viewBox="0 0 33 31"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() => changeStars(star, 'overall_rating', index)}
                        >
                          <path
                            className={(item?.overall_rating >= star) ? "filled" : ""}
                            d="M14.0471 1.88531L10.9293 8.52294C10.8366 8.72034 10.7038 8.88237 10.5406 9.00038C10.3765 9.1191 10.18 9.19684 9.96248 9.22401L2.68825 10.1394C2.1827 10.1998 1.72842 10.3981 1.35988 10.7023C0.992252 11.0055 0.713381 11.4143 0.550152 11.9159C0.399122 12.4044 0.389986 12.8858 0.505896 13.3368C0.625784 13.7999 0.875401 14.228 1.24417 14.5733L6.59282 19.5906C6.75392 19.7417 6.86866 19.9189 6.93024 20.1093C6.99159 20.2987 7.00377 20.509 6.96138 20.7265L5.57775 27.9552C5.48807 28.4467 5.53747 28.93 5.70958 29.3651C5.88473 29.8081 6.18702 30.201 6.59891 30.5001C7.00869 30.7982 7.47698 30.9644 7.95443 30.9935C8.42884 31.0227 8.91216 30.9169 9.35515 30.6722L15.78 27.1352C15.9722 27.0294 16.1769 26.976 16.3783 26.976C16.5796 26.976 16.7831 27.0294 16.9754 27.1352L23.4002 30.6722C23.8444 30.9169 24.3267 31.0227 24.8009 30.9935C25.2802 30.9633 25.7464 30.7982 26.1574 30.5001C26.5693 30.2011 26.8713 29.8081 27.0467 29.3651C27.2219 28.923 27.2692 28.4315 27.1736 27.9321L25.7949 20.7256C25.7537 20.508 25.7647 20.2975 25.8261 20.1083C25.8874 19.918 26.0024 19.7407 26.1635 19.5897L31.5121 14.5724C31.8807 14.227 32.1294 13.7999 32.2493 13.3377C32.3691 12.8754 32.356 12.3809 32.1998 11.8995C32.0427 11.4131 31.7638 11.0052 31.3962 10.7011C31.0277 10.3969 30.5725 10.1976 30.0679 10.1342L22.793 9.22164C22.5746 9.19355 22.379 9.11698 22.2149 8.99802C22.0529 8.88024 21.9189 8.71797 21.8262 8.52058L18.7084 1.88295C18.4908 1.42072 18.1625 1.04912 17.7617 0.794359L17.7092 0.764152C17.3154 0.526485 16.8592 0.397461 16.3759 0.397461C15.8683 0.397461 15.3941 0.537485 14.9902 0.794358C14.5893 1.04912 14.261 1.41982 14.0435 1.88295L14.0471 1.88531Z"
                            stroke="#868790"
                            strokeWidth="0.916276"
                            fill="#E05A67"
                          />
                        </svg>
                      ))}
                    </div>
                    <div className='rating-name me-3'>Overall Rating</div>
                  </div>
                  {/* Taste */}
                  <div className='d-flex flex-column align-items-center'>
                    <div className='star-box mb-1 me-2'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          width="33"
                          height="31"
                          viewBox="0 0 33 31"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() => changeStars(star, 'taste_rating', index)}
                        >
                          <path
                            className={(item?.taste_rating >= star) ? "filled" : ""}
                            d="M14.0471 1.88531L10.9293 8.52294C10.8366 8.72034 10.7038 8.88237 10.5406 9.00038C10.3765 9.1191 10.18 9.19684 9.96248 9.22401L2.68825 10.1394C2.1827 10.1998 1.72842 10.3981 1.35988 10.7023C0.992252 11.0055 0.713381 11.4143 0.550152 11.9159C0.399122 12.4044 0.389986 12.8858 0.505896 13.3368C0.625784 13.7999 0.875401 14.228 1.24417 14.5733L6.59282 19.5906C6.75392 19.7417 6.86866 19.9189 6.93024 20.1093C6.99159 20.2987 7.00377 20.509 6.96138 20.7265L5.57775 27.9552C5.48807 28.4467 5.53747 28.93 5.70958 29.3651C5.88473 29.8081 6.18702 30.201 6.59891 30.5001C7.00869 30.7982 7.47698 30.9644 7.95443 30.9935C8.42884 31.0227 8.91216 30.9169 9.35515 30.6722L15.78 27.1352C15.9722 27.0294 16.1769 26.976 16.3783 26.976C16.5796 26.976 16.7831 27.0294 16.9754 27.1352L23.4002 30.6722C23.8444 30.9169 24.3267 31.0227 24.8009 30.9935C25.2802 30.9633 25.7464 30.7982 26.1574 30.5001C26.5693 30.2011 26.8713 29.8081 27.0467 29.3651C27.2219 28.923 27.2692 28.4315 27.1736 27.9321L25.7949 20.7256C25.7537 20.508 25.7647 20.2975 25.8261 20.1083C25.8874 19.918 26.0024 19.7407 26.1635 19.5897L31.5121 14.5724C31.8807 14.227 32.1294 13.7999 32.2493 13.3377C32.3691 12.8754 32.356 12.3809 32.1998 11.8995C32.0427 11.4131 31.7638 11.0052 31.3962 10.7011C31.0277 10.3969 30.5725 10.1976 30.0679 10.1342L22.793 9.22164C22.5746 9.19355 22.379 9.11698 22.2149 8.99802C22.0529 8.88024 21.9189 8.71797 21.8262 8.52058L18.7084 1.88295C18.4908 1.42072 18.1625 1.04912 17.7617 0.794359L17.7092 0.764152C17.3154 0.526485 16.8592 0.397461 16.3759 0.397461C15.8683 0.397461 15.3941 0.537485 14.9902 0.794358C14.5893 1.04912 14.261 1.41982 14.0435 1.88295L14.0471 1.88531Z"
                            stroke="#868790"
                            strokeWidth="0.916276"
                            fill="#E05A67"
                          />
                        </svg>
                      ))}
                    </div>
                    <div className='rating-name me-3'>Taste</div>
                  </div>
                  {/* Freshness */}
                  <div className='d-flex flex-column align-items-center '>
                    <div className='star-box mb-1 me-2'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          width="33"
                          height="31"
                          viewBox="0 0 33 31"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() => changeStars(star, 'freshness_rating', index)}
                        >
                          <path
                            className={(item?.freshness_rating >= star) ? "filled" : ""}
                            d="M14.0471 1.88531L10.9293 8.52294C10.8366 8.72034 10.7038 8.88237 10.5406 9.00038C10.3765 9.1191 10.18 9.19684 9.96248 9.22401L2.68825 10.1394C2.1827 10.1998 1.72842 10.3981 1.35988 10.7023C0.992252 11.0055 0.713381 11.4143 0.550152 11.9159C0.399122 12.4044 0.389986 12.8858 0.505896 13.3368C0.625784 13.7999 0.875401 14.228 1.24417 14.5733L6.59282 19.5906C6.75392 19.7417 6.86866 19.9189 6.93024 20.1093C6.99159 20.2987 7.00377 20.509 6.96138 20.7265L5.57775 27.9552C5.48807 28.4467 5.53747 28.93 5.70958 29.3651C5.88473 29.8081 6.18702 30.201 6.59891 30.5001C7.00869 30.7982 7.47698 30.9644 7.95443 30.9935C8.42884 31.0227 8.91216 30.9169 9.35515 30.6722L15.78 27.1352C15.9722 27.0294 16.1769 26.976 16.3783 26.976C16.5796 26.976 16.7831 27.0294 16.9754 27.1352L23.4002 30.6722C23.8444 30.9169 24.3267 31.0227 24.8009 30.9935C25.2802 30.9633 25.7464 30.7982 26.1574 30.5001C26.5693 30.2011 26.8713 29.8081 27.0467 29.3651C27.2219 28.923 27.2692 28.4315 27.1736 27.9321L25.7949 20.7256C25.7537 20.508 25.7647 20.2975 25.8261 20.1083C25.8874 19.918 26.0024 19.7407 26.1635 19.5897L31.5121 14.5724C31.8807 14.227 32.1294 13.7999 32.2493 13.3377C32.3691 12.8754 32.356 12.3809 32.1998 11.8995C32.0427 11.4131 31.7638 11.0052 31.3962 10.7011C31.0277 10.3969 30.5725 10.1976 30.0679 10.1342L22.793 9.22164C22.5746 9.19355 22.379 9.11698 22.2149 8.99802C22.0529 8.88024 21.9189 8.71797 21.8262 8.52058L18.7084 1.88295C18.4908 1.42072 18.1625 1.04912 17.7617 0.794359L17.7092 0.764152C17.3154 0.526485 16.8592 0.397461 16.3759 0.397461C15.8683 0.397461 15.3941 0.537485 14.9902 0.794358C14.5893 1.04912 14.261 1.41982 14.0435 1.88295L14.0471 1.88531Z"
                            stroke="#868790"
                            strokeWidth="0.916276"
                            fill="#E05A67"
                          />
                        </svg>
                      ))}
                    </div>
                    <div className='rating-name me-3'>Freshness</div>
                  </div>

                </div>

                <textarea placeholder='Write your reviews...'
                  className={`form-control mt-2 ${errors.overall_review ? 'border border-danger' : ''}`}
                  value={item.overall_review || ""}
                  onChange={(e) => handleReviewChange(index, e.target.value)}
                >
                </textarea>
                {/* <button
                  className="ok-btn"
                  onClick={() => handleSubmit(index)}
                >
                  Submit Review
                </button> */}
              </div>
            ))
          }
        </div>

        <div className='footet vertical-footer'>
          <button className='cancel-button' onClick={() => setterFunction(false)}>Close</button>
          <button className='ok-button' onClick={handleAllReviewsSubmit}>Submit</button>
        </div>
        <div>

        </div>

      </div>
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setterFunction(false)} />}
      {isLoading && <FixedOverlayLoadingSpinner />}

    </div>

  );
};

export default OrderItemReviewPopup;