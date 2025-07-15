import React, { useEffect, useState, useContext } from 'react'


import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import ErrorModal from "../../../ErrorModal.js";
import PositiveModal from "../../../PositiveModal.js";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner.js"
import $ from 'jquery';
import { UserContext } from '../../../authentication/pages/UserContext.js';
import API from '../../../API.js';





const CheckoutCart = ({ userData, loadUserData }) => {
  const navigate = useNavigate();

  const { isLoggedIn, login, logout } = useContext(UserContext);
  const [tabSelected, selectTab] = useState(0);

  const [message, setMessage] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);


  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])

  const loadCartData = () => {
    if (isLoggedIn) {
      API.get(`/order/cart/`)
        .then(response => {
          setCartItems(response.data.cart_items)
        })
        .catch(error => {
          setMessage(error.response?.data?.message || error.message)
          setIsErrorModalOpen(true)
          setIsLoading(false)
        });
    }
  }
  useEffect(() => {
    loadCartData();
  }, [])

  const handleQtyChange = (direction, index, id) => {
    // console.log("cartData from cart update", cartData)
    let count = parseInt(cartItems[index].count);
    if (direction === "plus") {
      count = count + 1
    }
    else {
      count = count - 1
    }
    // if (count > 0) {
    setIsLoading(true)
    API.put(`/order/cart/${id}/`, { "count": count })
      .then(response => {
        loadCartData();
        setIsLoading(false)
      }
      )
      .catch(error => {
        setMessage(error.response.data.message)
        setIsErrorModalOpen(true)
        setIsLoading(false)
      });
    // }
    // else {
    //   setMessage("Quantity should be a number greater than zero")
    //   setIsErrorModalOpen(true)
    // }
  }


  const calculateSum = () => {
    var sum = 0;
    cartItems.forEach(
      (item) => {
        sum += (parseFloat(item.menu_item.offer_price) + (item.topping ? parseFloat(item.topping.price) : 0)) * parseInt(item.count)
      }
    )
    return sum
  }
  const subTotal = calculateSum();


  return (
    <div className='cart-page'>


      <section className="page-head-section">
        <div className="container page-heading">
          <h2 className="h3 mb-3 text-white text-center">Checkout</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb flex-lg-nowrap justify-content-center justify-content-lg-star">
              <li className="breadcrumb-item">
                <a onClick={() => navigate('/')}><i className="ri-home-line"></i>Home</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Checkout</li>
            </ol>
          </nav>
        </div>
      </section>

      <section className="account-section section-b-space pt-0">
        <div className="container">
          <div className="layout-sec">
            <div className="row g-lg-4 g-4">
              <div className="col-lg-8">
                <div className="process-section">
                  <ul className="process-list">
                    <li className="active">
                      <button>
                        <div className="process-icon">
                          <img className="img-fluid icon" src="/images/svg/user.svg" alt="user"></img>
                        </div>
                        <h6>Account</h6>
                      </button>
                    </li>
                    <li>
                    <button>
                        <div className="process-icon">
                          <img className="img-fluid icon" src="/images/svg/location.svg"
                            alt="location"></img>
                        </div>
                        <h6>Address</h6>
                      </button>
                    </li>
                    <li>
                    <button>
                        <div className="process-icon">
                          <img className="img-fluid icon" src="/images/svg/wallet-add.svg"
                            alt="wallet-add"></img>
                        </div>
                        <h6>Payment</h6>
                      </button>
                    </li>
                    <li>
                    <button >
                        <div className="process-icon">
                          <img className="img-fluid icon" src="/images/svg/verify.svg" alt="verify"></img>
                        </div>
                        <h6>Confirm</h6>
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="account-part">
                  <img className="img-fluid account-img" src="/images/account.svg" alt="account"></img>
                  <div className="title mb-0">
                    <div className="loader-line"></div>
                    <h3>Account</h3>
                    <p>
                      To place your order now, log in to in your existing account
                      or sign up
                    </p>
                    <div className="account-btn d-flex justify-content-center gap-2">
                      <a target="_blank" href="signin.html" className="btn theme-outline mt-0">SIGN IN</a>
                      <a target="_blank" href="signup.html" className="btn theme-outline mt-0">SIGN UP</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                {cartItems && cartItems.length > 0 ?
                  <div className="order-summery-section">
                    <div className="checkout-detail">
                      {/* <h3 className="fw-semibold dark-text checkout-title">
                        Cart Items
                      </h3> */}

                      <div className="order-summery-section mt-0">
                        <div className="checkout-detail p-0">
                          <ul>
                            {cartItems && cartItems.length > 0 && cartItems.map((item, index) => (
                              <li key={index}>
                                <div className="horizontal-product-box">
                                  <div className="product-content">
                                    <div className="d-flex align-items-center justify-content-between">
                                      <h5>{item.menu_item && item.menu_item.name}</h5>
                                      <h6 className="product-price">£{item.menu_item.offer_price}</h6>
                                    </div>
                                    {/* <h6 className="ingredients-text">Hot Nacho Chips</h6> */}
                                    {item.topping &&
                                      <div className='d-flex justify-content-between align-items-center'>
                                        <h6 className="ingredients-text">{item.topping.description}</h6>
                                        <span>{item.topping.price}</span>
                                      </div>
                                    }
                                    <div
                                      className="d-flex align-items-center justify-content-between mt-md-2 mt-1 gap-1">
                                      <h6 className="place">{item.menu_item.unit_details.name}</h6>
                                      <div className="plus-minus">
                                        <i className="ri-subtract-line sub" onClick={(e) => handleQtyChange('minus', index, item.id)}></i>
                                        <input type="number" value={item.count} min="1" max="10"></input>
                                        <i className="ri-add-line add" onClick={(e) => handleQtyChange('plus', index, item.id)}></i>
                                      </div>
                                    </div>
                                    <div className='d-flex justify-content-end' >
                                      <h6 className='product-price mt-2'>
                                        Sub Total:
                                        £{(parseFloat(item.menu_item.offer_price) + (item.topping ? parseFloat(item.topping.price) : 0)) * parseInt(item.count)}
                                      </h6>
                                    </div>
                                  </div>
                                </div>
                              </li>

                            ))}
                          </ul>
                          <h5 className="bill-details-title fw-semibold dark-text">
                            Bill Details
                          </h5>
                          <div className="sub-total">
                            <h6 className="content-color fw-normal">Sub Total</h6>
                            <h6 className="fw-semibold">
                              £ {subTotal}
                            </h6>
                          </div>
                          <div className="sub-total">
                            <h6 className="content-color fw-normal">
                              Delivery Charge (2 kms)
                            </h6>
                            <h6 className="fw-semibold success-color">Undefined</h6>
                          </div>
                          {/* <div className="sub-total">
                          <h6 className="content-color fw-normal">Discount (10%)</h6>
                          <h6 className="fw-semibold">$10</h6>
                        </div> */}
                          <div className="grand-total">
                            <h6 className="fw-semibold dark-text">To Pay</h6>
                            <h6 className="fw-semibold amount">£ {subTotal}</h6>
                          </div>
                        </div>
                      </div>
                      <a href="checkout-cart" className="btn theme-btn restaurant-btn w-100 rounded-2">CHECKOUT</a>
                      <img className="dots-design" src="/images/svg/dots-design.svg" alt="dots"></img>
                    </div>
                  </div>
                  :
                  <div className="order-summery-section">
                    <div className="checkout-detail">
                      {/* <h3 className="fw-semibold dark-text checkout-title">
                        Cart Items
                      </h3> */}
                      <section className="empty-cart-section section-b-space">
                        <div className="container">
                          <div className="empty-cart-image">
                            <div>
                              <img className="img-fluid img" src="/images/empty-cart.svg" alt="empty-cart" />
                              <h5 className='mt-4'>It’s empty in your cart!</h5>
                              {/* <h5>To browse more restaurants, visit the main page.</h5> */}
                              {/* <a onClick={() => navigate('/')} className="btn theme-outline restaurant-btn">see restaurant near you</a> */}
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>

                }
              </div>
            </div>
          </div>
        </div>
      </section>






      {isLoading && <FixedOverlayLoadingSpinner />}


      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => navigate("/")} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => { }} />}

    </div >

  );


}

export default CheckoutCart