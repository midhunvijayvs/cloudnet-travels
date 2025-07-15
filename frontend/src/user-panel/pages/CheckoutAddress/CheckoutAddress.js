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
import AddressAddPopup from '../../common-components/AddressAddPopup.js';
import './CheckoutAddress.scss'
import EmptyTableMessage from '../../../Empty.js';
import AddressLocationAdd from '../../common-components/AddressLocationAdd/AddressLocationAdd.js';
import ConfirmPopup from '../../common-components/ConfirmPopup/ConfirmPopup.js';
import UnlockCoupons from '../../common-components/UnlockCoupons/UnlockCoupons.js';
import ProcessFlowIllustrationForCheckout from '../../common-components/ProcessFlowIllustrationForCheckout/ProcessFlowIllustrationForCheckout.js'
import MiniBanner from '../../common-components/MiniBanner/MiniBanner.js'


const CheckoutAddress = ({ userData, loadLocationForHeader, setHeaderLocation, loadCartDataForHeader }) => {
  const navigate = useNavigate();

  const [tabSelected, selectTab] = useState(0);
  const [message, setMessage] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn, login, logout } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [cartData, setCartData] = useState(null);
  const [data, setData] = useState(null);
  const [selectedItem, setSelectedItem] = useState({
    first_name: "",
    last_name: "",
    postcode: "",
    posttown: "",
    country: "United Kingdom",
    phone_number: "",         // ✅ Add this
    country_code: "91",       // ✅ Optional, default to India
  });
  const [isMinimumCartAmount, setIsMinimumCartAmount] = useState(false);
  const [AddressSelected, setAddressSelected] = useState(null);
  const [isCartItemDeleteOpen, setIsCartItemDeleteOpen] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState({});

  useEffect(() => {
    // Retrieve the response data from localStorage
    const responseData = localStorage.getItem('createOrderResponseData');
    if (responseData) {
      const address = JSON.parse(responseData);
      // Check if the address exists and set AddressSelected state
      if (address) {
        const addressObject = {
          first_name: address.first_name,
          last_name: address.last_name,
          room_number: address.room_number,
          address_line1: address.address_line1,
          organisation: address.organisation,
          premise: address.premise,
          street: address.street,
          posttown: address.posttown,
          postcode: address.postcode,
          county: address.county,
          country: address.country,
          phone_number: address.phone_number,
          country_code: address.country_code,

        };
        setAddressSelected(addressObject);
      }
    }
  }, []);

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])


 

  // delete cart Item
  const handleRemoveCartItem = (item) => {
    setIsLoading(true)
    API.put(`/order/cart/${item.id}/`, { "count": 0 })
      .then(response => {
        loadCartData();
        loadCartDataForHeader();
        setIsLoading(false)
      }
      )
      .catch(error => {
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true)
        setIsLoading(false)
      });
  }


  const loadCartData = () => {

    let apiUrl = '/order/cart/';

    API.get(apiUrl)
      .then(response => {
        console.log("response.data",response.data)
        if(response.data.message){
          setMessage(response.data.message)
          setIsMessageModalOpen(true)
        }
        setCartItems(response.data.cart_items)
        setCartData(response.data)
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true)
        setIsLoading(false)
      });
  }
  useEffect(() => {
    loadCartData();
    loadCartDataForHeader();
  }, [userData])

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
        loadCartDataForHeader();
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
    let sum = 0;

    cartItems?.forEach((item) => {
      // Ensure base price is a valid number and multiply by count
      let itemBasePrice = (parseFloat(item.variant?.offer_price || item.menu_item.offer_price) || 0) * (item.count || 1);

      // Calculate toppings total safely, avoiding NaN issues
      let toppingsTotal = item.toppings?.reduce(
        (acc, t) => acc + ((parseFloat(t.topping?.price) || 0) * (t.count || 1)),
        0
      ) || 0;

      // Add menu item total and toppings total separately
      sum += itemBasePrice + toppingsTotal;
    });

    return Number(sum.toFixed(2)); // Ensure return type is a number
  };



  const subTotal = calculateSum();

  // Address
  const [isAddressAddModalOpen, openAddressAddModal] = useState();
  const [mode, setMode] = useState("add");
  const [selectedId, selectId] = useState(null)
  useEffect(() => {
    loadData()
    loadCreditPoints()
  }, []);
  const loadData = () => {
    setData(null)
    API.get(`user/address/`)
      .then(response => {
        setData(response.data.results)
        if (!AddressSelected && !localStorage.getItem('createOrderResponseData')) {
          const primaryAddress = response.data.results.find(x => x.is_primary === true);

          if (primaryAddress) {
            setAddressSelected({
              ...primaryAddress

            });
          }

        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  const initiateEdit = (id) => {
    // console.log(id, "id")
    setMode("edit");
    selectId(id);
    openAddressAddModal(true);

    setSelectedItem(data.find(x => x.id == id))
    // console.log(data.find(x => x.id == id), "selected")
  }

  // Set Delivery Address
  const handleDeliveryAddress = (item) => {
    console.log("function called")
    setAddressSelected({
      ...item
    });


    loadCartData();


  }

  const handleCheckOut = () => {


    AddressSelected.delivery_charge = cartData?.delivery_charge ?? 0



    setIsLoading(true);
    API.post(`/order/orders/`, AddressSelected)
      .then(response => {
        setIsLoading(false);
        localStorage.setItem("createOrderResponseData", JSON.stringify(response.data))
        localStorage.setItem("createOrderResponse_order_id", response.data.id)
        localStorage.setItem("createOrderResponse_total", response.data.total_amount)
        localStorage.setItem("createOrderDeliveryCharge", AddressSelected.delivery_charge) // for toggling pickup
        if (response?.data?.warning) {
          setMessage(response.data.warning)
          setIsMessageModalOpen(true)
        } else {
          navigate('/checkout-options');
        }
      }
      )
      .catch(error => {
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true)
        setIsLoading(false)
      });
  }
  const handleAddMoreItem = () => {

    navigate('/shop')


  }

  // user credit data
  const loadCreditPoints = () => {
    API.get(`/payments/credit-balance/`)
      .then(response => {
      })
      .catch(error => {

      });
  }



  return (
    <div className='checkout-address-page'>



      <MiniBanner title="Checkout Address" breadcrumb={[{ name: "Home", link: "/" }, { name: "Checkout Address", link: "#" }]}></MiniBanner>

      <section className="sec-2">

        <div className="lhs">

          <ProcessFlowIllustrationForCheckout currentState={0}></ProcessFlowIllustrationForCheckout>
          <div className="address-section">
            <div className="title">
              <div className="loader-line"></div>
              <h3>Select Saved Address</h3>
              <h6>
                You’ve add some address before, You can select one of below.
              </h6>
            </div>


            <div className="cards-container">
              {/* selected Address */}
              <div className="address-card selected">
                <div className="address-header">
                  <h6>Selected Address</h6>
                </div>
                {AddressSelected ?
                  <div className='body'>
                    <div className="title">
                      <div className="d-flex align-items-center gap-2">
                        <i className="ri-account-circle-fill icon"></i>
                        <h6>{AddressSelected.first_name} {AddressSelected.last_name}</h6>
                      </div>
                      {/* <a className="selected-label" >Selected Address</a> */}
                    </div>
                    <div className="address-details">
                      <h6>
                        {[
                          AddressSelected?.room_number,
                          AddressSelected?.address_line1,
                          AddressSelected?.organisation,
                          AddressSelected?.premise,
                          AddressSelected?.street,
                          AddressSelected?.posttown,
                          AddressSelected?.postcode,
                          AddressSelected?.county,
                          AddressSelected?.country,
                        ].filter(part => part).join(', ')}

                      </h6>
                      <h6 className="phone-number">+{AddressSelected.phone_number}</h6>
                      <div className="option-section">
                        {/* <a href="payment.html" className="btn gray-btn rounded-2 mt-0">Deliver
                              Here</a> */}
                      </div>
                    </div>
                  </div>
                  :
                  <div className='body'>

                    <img style={{ height: "40px", marginBottom: "10px" }} src="/images/no-data.png"></img>
                    <p style={{ fontSize: "11px", color: "grey", textDecoration: "italic", width: "300px" }}>No Address Selected!</p>

                  </div>
                }

              </div>

              {data && data.length > 0 &&
                data.map((address, index) => {
                  return (
                    <div className="address-card">
                      <div className="address-header">

                        <>
                          <i className={address.is_office ? "ri-briefcase-4-fill icon" : "ri-home-4-fill icon"}></i>
                          <h6>{address.first_name} {address.last_name}</h6>
                        </>

                        <button onClick={() => initiateEdit(address.id)} className="edit-btn" >Edit</button>
                      </div>
                      <div className="body">
                        <h6>
                          {/* {address.first_name}, {address.last_name}<br /> */}
                          {[
                            address?.room_number,
                            address?.address_line1,
                            address?.organisation,
                            address?.premise,
                            address?.street,
                            address?.posttown,
                            address?.postcode,
                            address?.county,
                            address?.country,
                          ].filter(part => part).join(', ')}
                        </h6>
                        {/* <h6 className="phone-number">+33 (907) 555-0101</h6> */}
                        {address.phone_number &&
                          <h6 className="phone-number">+{address.phone_number}</h6>
                        }
                        <div className="option-section">
                          {AddressSelected && AddressSelected.id === address.id ?
                            < button disabled={true} className="btn-primary address-selected-btn">
                              Address Selected
                            </button> :
                            <button onClick={() => handleDeliveryAddress(address)} className="btn-primary deliver-btn">
                              Deliver Here
                            </button>
                          }
                        </div>
                      </div>
                    </div>
                  )
                })}

              <div className="address-card new">
                <div className='body'>
                  <button onClick={(e) => { setMode("add"); openAddressAddModal(true); setSelectedItem({ first_name: "", last_name: "", postcode: "", posttown: "", country: "United Kingdom" }) }} className="btn-primary add-new-btn" >
                    Add New Address</button>

                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="rhs">
          {/* Add More Items */}
          {cartItems && cartItems.length > 0 &&
            <button className="add-more-btn"
              onClick={handleAddMoreItem}>
              Add More Items +



            </button>
          }

          {cartItems && cartItems.length > 0 ?
            <div className="order-summery-section">
              <div className="checkout-detail">
                <h3 className="checkout-title">
                  Cart Items
                </h3>



                <ul>
                  {cartItems && cartItems.length > 0 && cartItems.map((item, index) => (
                    <li key={index}>
                      <div className="horizontal-product-box">
                        <div className="product-content">
                          <div className="d-flex align-items-center justify-content-between">
                            {item.menu_item?.is_gift_card ?
                              <h5>Gift Card</h5> :
                              <h5>{item.menu_item && item.menu_item.name}</h5>
                            }
                            <h6 className="product-price">£{item.variant?.offer_price || item.menu_item.offer_price}</h6>
                          </div>
                          {/* <h6 className="ingredients-text">Hot Nacho Chips</h6> */}
                          {/* {item.topping &&
                                      <div className='d-flex justify-content-between align-items-center'>
                                        <h6 className="ingredients-text">{item.topping.description}</h6>
                                        <span>£{item.topping.price}</span>
                                      </div>
                                    } */}
                          {item.toppings?.length > 0 &&
                            item.toppings.map((top, index) => (
                              <div key={index} className='d-flex justify-content-between align-items-center'>
                                <h6 className="ingredients-text">{top.topping?.description} (x{top.count}) </h6>
                                {top.topping?.price > 0 &&
                                  <span>£{top.topping?.price}</span>
                                }
                              </div>
                            ))
                          }
                          <div
                            className="d-flex align-items-center justify-content-between mt-md-2 mt-1 gap-1">
                            <h6 className="place">
                              {item.variant?.quantity_name || item.menu_item?.unit_details?.name}
                            </h6>

                            <div className='d-flex align-items-center justify-content-between gap-2'>
                              <div className="plus-minus">
                                <i className="ri-subtract-line sub" onClick={(e) => handleQtyChange('minus', index, item.id, null)}></i>
                                <input type="number" value={item.count} min="1" max="10"></input>
                                <i className="ri-add-line add" onClick={(e) => handleQtyChange('plus', index, item.id, null)}></i>
                              </div>
                              <i className="ri-delete-bin-line delete"
                                onClick={() => { setIsCartItemDeleteOpen(true); setSelectedCartItem(item) }}>
                              </i>
                            </div>
                          </div>
                          <div className='d-flex justify-content-between align-items-center' >
                            {!item.menu_item.is_available &&
                              <div className='mt-2 closed-tag p-0' >Not Available</div>
                            }
                            <h6 className='product-price mt-2'>
                              Sub Total:
                              £{(
                                (parseFloat(item.variant?.offer_price || item.menu_item.offer_price) * (item.count || 1)) + // Multiply menu item price by count
                                (item.toppings?.reduce(
                                  (sum, t) => sum + ((parseFloat(t.topping?.price) || 0) * (t.count || 1)),
                                  0
                                ) || 0) // Sum up toppings separately
                              ).toFixed(2)}
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
                    £ {Math.round(((subTotal) + Number.EPSILON) * 100) / 100}
                  </h6>
                </div>
                <div className="sub-total">
                  <h6 className="content-color fw-normal">
                    Delivery Charge
                  </h6>
                  {cartData?.free_delivery_eligibility !== true ?
                    <h6 className="fw-semibold success-color">
                      £ {cartData?.delivery_charge?.toFixed(1)}
                    </h6> :
                    <h6 className="fw-semibold success-color">
                      Free Delivery
                    </h6>
                  }
                </div>
                {(cartData?.message && cartData?.free_delivery_eligibility !== true) &&
                  <div className='cart-msg'>
                    {cartData?.message}
                  </div>
                }
                {/* <div className="sub-total">
                          <h6 className="content-color fw-normal">Discount (10%)</h6>
                          <h6 className="fw-semibold">$10</h6>
                        </div> */}
                <div className="grand-total">
                  <h6 className="fw-semibold dark-text">To Pay</h6>
                  <h6 className="fw-semibold amount">
                    £{(subTotal + (cartData?.delivery_charge || 0)).toFixed(2)}
                  </h6>
                </div>

                <button disabled={!AddressSelected} onClick={handleCheckOut}
                  className="btn-primary w-100 checkout-btn">
                  CHECKOUT</button>
                <img className="dots-design" src="/images/svg/dots-design.svg" alt="dots"></img>
              </div>
              <div>
                <UnlockCoupons />
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

      </section >

      {/* Address Add/edit */}
      {isAddressAddModalOpen &&
        <AddressAddPopup resourceName={'user'} setterFunction={openAddressAddModal} mode={mode} selectedId={selectedItem.id} loadData={loadData} selectedItem={selectedItem} setSelectedItem={setSelectedItem}
          setAddressSelected={setAddressSelected} AddressSelected={AddressSelected}></AddressAddPopup>
      }

      {isCartItemDeleteOpen &&
        <ConfirmPopup setterFunction={setIsCartItemDeleteOpen} okClickedFunction={() => handleRemoveCartItem(selectedCartItem)}
          title={'Remove'}
          message={'Are you sure you want to remove this item from your cart?'} />
      }

      
      {isLoading && <FixedOverlayLoadingSpinner />}


      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => navigate('/checkout-options')} />}

    </div >

  );


}

export default CheckoutAddress