import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import API from '../../../API';
import '../../common-components/ImageUploader.css'
import './MyOrders.scss'
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import Pagination from '../../../Pagination';
import { convertTimeString12Hour, fetchInvoiceDataAndGeneratePdf, formatDateTime, getTimeLeft } from '../../../GeneralFunctions';
import { DELIVERY_STATUSES,  MAX_CANCELLATION_TIME } from '../../../Constants';
import OrderReviewPopup from '../../common-components/OrderReviewPopup/OrderReviewPopup';
import DeliveryReviewPopup from '../../common-components/DeliveryReviewPopup/DeliveryReviewPopup';
import NewOrderUpdate from '../../common-components/NewOrderUpdate/NewOrderUpdate';
import ChatPopup from '../../common-components/ChatPopup/ChatPopup';
import NewOrderModificationUpdate from '../../common-components/NewOrderModificationUpdate/NewOrderModificationUpdate';
import TicketCreationPopup from '../../common-components/TicketCreationPopup/TicketCreationPopup';
import SupportPagesLayout from '../../common-components/SupportPagesLayout/SupportPagesLayout.js'

const MyOrders = ({ userData, orderUpdate }) => {

  const navigate = useNavigate()
  const maxCancellationTime = MAX_CANCELLATION_TIME

  const deliveryStatusList = DELIVERY_STATUSES;
  const [data, setData] = useState(null);
  const [onGoingData, setOnGoingData] = useState(null);
  

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isOrderReviewModalOpen, setIsOrderReviewModalOpen] = useState(false);
  const [isDeliveryReviewModalOpen, setIsDeliveryReviewModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isNewOrderUpdateShow, setNewOrderUpdateShow] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    search_key: null,
    is_favourite: null,
    delivery_status: null,
  });
  const [page, setPage] = useState(1);
  const [pageSize, selectPageSize] = useState(12);
  const [isOnGoingOrderOpen, setIsOnGoingOrderOpen] = useState(true);

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])

  // Filters
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // const toggleFilterDropdown = () => {
  //   setIsFilterOpen(!isFilterOpen);
  // };
  const onFilterChange = (filterType, filterValue, displayText) => {
    setFilters(prevFilters => {
      // Create a new filters object with all values set to null
      const newFilters = {
        search_key: null,
        is_favourite: null,
        delivery_status: null,
      };
      // Set the specific filter to its new value
      newFilters[filterType] = filterValue;

      return newFilters;
    });
    setSelectedFilter(displayText);
    setIsFilterOpen(false);
  };

  const toggleOngoingOrders = () => {
    setIsOnGoingOrderOpen(!isOnGoingOrderOpen)
    console.log("isOnGoingOrderOpen",isOnGoingOrderOpen)
  }

  useEffect(() => {
    loadData();

  }, [filters, orderUpdate, page, pageSize]);

  // useEffect(() => {

  // }, []);

  const toggleOrderTab = (type) => {
    if (type === 'food') {
      // setData
    }
  }



  const loadData = () => {
    let apiUrl = `/order/orders/?page=${page}&page_size=${pageSize}`;
    // Loop through the filters object and append selected filters to the apiUrl
    for (let filter in filters) {
      if (filters[filter] !== null) {
        apiUrl += `&${filter}=${filters[filter]}`;
      }
    }
    setIsLoading(true)
    API.get(apiUrl)
      .then(response => {
        if (!data) {
          setOnGoingData(response.data)
        }
        setData(response.data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false)
      });
  }

 

  const handleFavourite = (item, value, orderType) => {
    let apiUrl = `order/orders/${item.id}/`;
    
    setIsLoading(true);
    API.put(apiUrl, { is_favourite: value })
      .then(response => {
        setIsLoading(false);
        
          setData(prevData => ({
            ...prevData,
            results: prevData?.results?.map(item =>
              item.id === item.id
                ? { ...item, is_favourite: value }
                : item
            )
          }));
          setOnGoingData(prevData => ({
            ...prevData,
            results: prevData?.results?.map(item =>
              item.id === item.id
                ? { ...item, is_favourite: value }
                : item
            )
          }));
        
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false)
      });
  }
  const handleCancelOrder = (item, orderType) => {
    let apiUrl = `order/orders/${item.id}/`;
    
    setIsLoading(true);
    API.put(apiUrl, { delivery_status: "0" })
      .then(response => {
        setIsLoading(false);
        setIsConfirmModalOpen(false);
        setMessage('Order cancelled.')
        setIsMessageModalOpen(true)
        
          loadData();
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
        setIsLoading(false)
      });
  }
  // ReOrder
  const handleReOrder = (item, orderType) => {
    let deleteApiUrl = `order/cart/delete/`;
    
    let cartPostApi = '/order/add-to-cart/';
    
    let orderPostApi = `order/orders/`;
    

    // data for creating order
    const orderBodyData = {
      // address
      first_name: item.first_name,
      last_name: item.last_name,
      room_number: item.room_number,
      address_line1: item.address_line1,
      organisation: item.organisation,
      premise: item.premise,
      street: item.street,
      posttown: item.posttown,
      postcode: item.postcode,
      county: item.county,
      country: item.country,
      phone_number: item.phone_number,
      country_code: item.country_code,
      delivery_latitude: item.delivery_latitude,
      delivery_longitude: item.delivery_longitude,
      delivery_charge: item.delivery_charge,
      estimated_delivery_time: item.estimated_delivery_time,
      // options
      cooking_instructions: item.cooking_instructions,
      delivery_instructions: item.delivery_instructions,
      is_pickup: item.is_pickup,
      is_contactless_delivery: item.is_contactless_delivery,
      user_pickup_request_date: item.user_pickup_request_date,
      user_pickup_request_time: item.user_pickup_request_time,
      is_pickup_time_required: item.is_pickup_time_required,
      tip: item.tip,
    }
    setIsLoading(true);
    // Remove ALl items from Cart
    API.delete(deleteApiUrl)
      .then(response => {
        // Add Items From prev-order to Cart
        const addToCartPromises = item.items
          .filter(item => item.final)
          .map(cartItem => {
            
              return API.post(cartPostApi, {
                restaurant: cartItem.restaurant,
                menu_item: cartItem.menu_item,
                count: cartItem.count,
                topping: cartItem.topping
              });
            
          });

        // Wait for all add-to-cart API calls to complete
        Promise.all(addToCartPromises)
          .then(responses => {
            // Create New Order
            API.post(orderPostApi, orderBodyData)
              .then(response => {
                setIsLoading(false);
                localStorage.setItem('createOrderResponseData', JSON.stringify(item))
                
                  navigate('/checkout-address')
                
              })
              .catch(error => {
                setMessage(error.response?.data?.message || error.message)
                setIsErrorModalOpen(true)
                setIsLoading(false)
              });
          })
          .catch(error => {
            setIsLoading(false);
            setMessage(error.response?.data?.message || error.message)
            setIsErrorModalOpen(true)
          });
      })
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true)
      });

  }

  // handle Time left for cancel
  const [timeLeft, setTimeLeft] = useState(null); // Time left in seconds
  const [isCancelable, setIsCancelable] = useState(false);
  useEffect(() => {
    const initialTimeLeft = getTimeLeft(selectedItem?.order_placed_datetime, maxCancellationTime);
    setTimeLeft(initialTimeLeft);
    setIsCancelable(initialTimeLeft > 0);

    // Update timer every second if still cancellable
    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev > 0) return prev - 1;
        clearInterval(timerInterval);
        setIsCancelable(false); // Disable cancel after max time
        return 0;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [selectedItem]);

  const formatTimeLeft = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };
  // Remaining time for accept modification
  const [remainingTime, setRemainingTime] = useState(null);
  useEffect(() => {
    if (selectedItem?.delivery_status === '14') {
      const initialTimeLeft = getTimeLeft(selectedItem?.restaurant_modification_time, 5);
      setRemainingTime(initialTimeLeft);
      // Update timer every second if still cancellable
      const timerInterval = setInterval(() => {
        setRemainingTime(prev => {
          if (prev > 0) return prev - 1;
          clearInterval(timerInterval);
          return 0;
        });
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [selectedItem]);


  // For ChatMessage
  const [selectedChatRestaurant, setSelectedChatRestaurant] = useState(null);
  const [selectedChatOrder, setSelectedChatOrder] = useState(null);

  const handleChatClick = (orderItem, orderType) => {
    setSelectedChatOrder(orderItem)
    
      setSelectedChatRestaurant(orderItem?.items?.[0]?.restaurant_name);
    
  };

  const handleRestaurantClick = (id, orderType) => {
    localStorage.setItem('selectedItemID', id); // Store item as a string
    
      navigate('/restaurant-menu')
  }

  const handleRaiseTicket = (order) => {
    console.log(order.id, order.items);
    setSelectedItem(order)
    setIsTicketModalOpen(true);

    // localStorage.setItem('selectedId', item.id);
    // navigate('/complaints-and-refund'); 
  }


  return (
    <div className='order-list-page'>

      <section className="sec-2">
            <div className="lhs">
            </div>
            <div className="rhs">
              
              {/* Foods */}
             
                <div className="my-order-content">
                  {/* Ongoing Orders */}

                  {onGoingData?.results?.length > 0 &&
                    onGoingData.results.filter(item => ['1', '2', '3', '4', '5', '14', '17']
                      .includes(item.delivery_status)).length > 0 &&
                    <>
                      <div className="title">
                        <div className="loader-line"></div>
                        <h3>Ongoing Orders
                          {/* <img onClick={toggleOngoingOrders}
                            className={`down-arrow ${isOnGoingOrderOpen ? 'rotate' : ''}`}
                            src='/images/orders/down-arrow.svg' /> */}
                        </h3>
                      </div>
            
                      {isOnGoingOrderOpen &&
                        <ul className="order-box-list ongoing mb-4">
                          {onGoingData.results.map((item, index) => (
                            ['1', '2', '3', '4', '5', '14', '17'].includes(item.delivery_status) &&

                            <li key={index} className={`${item?.is_priority_delivery ? 'prior' : ''}`}>
                              {item?.is_priority_delivery &&
                                <div className='prior-tag'>
                                  Priority Delivery
                                </div>
                              }
                              <div className="order-box">
                                <div className="order-box-content">
                                  <div className="brand-icon" onClick={() => handleRestaurantClick(item?.items?.[0]?.restaurant_name?.id, 'food')}>
                                    <img className="img-fluid icon"
                                      src={
                                        item?.items?.[0]?.restaurant_name?.is_gift_card_store
                                          ? '/images/restaurant-menu/gift-card.svg'
                                          : item?.items?.[0]?.restaurant_name?.logo
                                            ? item?.items?.[0]?.restaurant_name?.logo
                                            : '/images/orders/order-placed-purchased-icon.svg'
                                      }
                                      alt="logo" />
                                  </div>
                                  <div className="order-details">
                                    <div className="d-flex align-items-center justify-content-between w-100">
                                      <h5 className="brand-name dark-text fw-medium" >
                                       Order Id : #{item.id}
                                      </h5>
                                      <h6 className="fw-medium content-color text-end">
                                        {item.order_placed_datetime && formatDateTime(item.order_placed_datetime)}
                                      </h6>
                                    </div>
                                    <h6 className="fw-medium dark-text">
                                      <span className="fw-normal content-color">
                                      </span>
                                     
                                    </h6>
                                    {item.payment_reference_number &&
                                      <h6 className="fw-medium dark-text">
                                        <span className="fw-normal content-color">Transaction Id :
                                        </span>
                                        #{item.payment_reference_number}
                                      </h6>
                                    }
                                    <h6 className={`delivery-status status-${item.delivery_status}`}>
                                      {DELIVERY_STATUSES[parseInt(item.delivery_status)].replace(/_/g, ' ')}
                                    </h6>
                                  </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between mt-sm-3 mt-2">
                                  <h6 className="fw-medium dark-text">
                                    <span className="fw-normal content-color">Total Amount : </span>
                                    ₹{item.total_amount}
                                  </h6>
                                  {item?.earned_points > 0 &&
                                    <div className='earned-points'>
                                      <img src='/images/orders/points.svg'></img>
                                      +{item?.earned_points}
                                    </div>
                                  }
                                  <div className='d-flex justify-content-center align-items-center'>
                                    {/* <div className='me-2'>
                                      {item.is_favourite ?
                                        <img src='/images/orders/favourites-filled.svg' role='button' className='fav-icon'
                                          onClick={() => handleFavourite(item, false)} ></img>
                                        :
                                        <img src='/images/orders/favourites.svg' role='button' onClick={() => handleFavourite(item, true)}  ></img>
                                      }
                                    </div> */}
                                    {['7', '9'].includes(item.delivery_status) ?
                                      <button className="btn-primary me-2" onClick={() => navigate('/shop')} >Order Again</button>
                                      : ['1', '2', '3', '4', '5', '14'].includes(item.delivery_status) ?
                                        <button className="btn-primary me-2"
                                          onClick={() => { navigate('/contact-us'); localStorage.setItem('itemSelectedId', item.id) }} >Contact For Tracking
                                        </button>
                                        :
                                        <></>
                                    }

                                    {/* <a href="#order" className="btn-primary " onClick={() => setSelectedItem(item)}
                                      data-bs-toggle="modal">Details</a> */}
                                    {/* <a className="btn-primary " onClick={() =>{setIsDetailsModalOpen(true); setSelectedItem(item)}}>Details</a> */}

                                  </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between mt-sm-3 mt-2">
                                  <div className='d-flex'>
                                    {/* <div className='me-2'>
                                      <img src='/images/orders/chat-round.svg' role='button' className='chat-icon' onClick={() => handleChatClick(item, 'restaurant')} ></img>
                                    </div> */}
                                    {/* delivered/ refunded */}
                                    {['7', '9'].includes(item.delivery_status) &&
                                      item.invoices && item.invoices.length > 0 &&
                                      <u className='text-secondary me-5'
                                        style={{ cursor: 'pointer', textDecoration: 'none' }}
                                        onClick={() => fetchInvoiceDataAndGeneratePdf(item.invoices[0])}>
                                        <span className='me-1 '>Invoice</span>
                                        <i className="fa-solid fa-download"></i>
                                      </u>
                                    }
                                    <u className='text-black-50' style={{ cursor: 'pointer' }} onClick={() => navigate('/contact-us')}>Need Help?</u>
                                  </div>
                                </div>

                              </div>
                            </li>
                          ))}
                        </ul>
                      }
                    </>
                  }
                  {/* --------- */}
                  <div className='d-flex justify-content-between align-items-center'>
                    <div className="title">
                      <div className="loader-line"></div>
                      <h3 className='all-order' onClick={() => setFilters({})}>
                        All Orders
                      </h3>
                    </div>
                    <div className='filters-tab'>
                      {/* <div onClick={() => onFilterChange('is_favourite', 'true', 'Favourite')}
                        className={`tab ${filters.is_favourite == 'true' ? 'active' : ''}`}>
                        Favourite
                      </div> */}
                      {/* <div onClick={() => onFilterChange('delivery_status', '0', 'Cancelled')}
                      className={`tab ${filters.delivery_status == '0' ? 'active' : ''}`}>
                      Cancelled
                    </div> */}
                      <div onClick={() => onFilterChange('delivery_status', '7', 'Delivered')}
                        className={`tab ${filters.delivery_status == '7' ? 'active' : ''}`}>
                        Delivered
                      </div>                                           
                    </div>
                  </div>
                  {data && data.results && data.results.length > 0 ?

                    <ul className="order-box-list">
                      {data.results.map((item, index) => (
                        <li key={index}>
                          <div className="order-box">
                            <div className="order-box-content">
                                 <div className="brand-icon" onClick={() => handleRestaurantClick(item?.items?.[0]?.restaurant_name?.id, 'food')}>
                                <img className="img-fluid icon"
                                  src={
                                    item?.items?.[0]?.restaurant_name?.is_gift_card_store
                                      ? '/images/restaurant-menu/gift-card.svg'
                                      : item?.items?.[0]?.restaurant_name?.logo
                                        ? item?.items?.[0]?.restaurant_name?.logo
                                        : '/images/orders/order-placed-purchased-icon.svg'
                                  }
                                  alt="logo" />
                              </div>
                              <div className="order-details">
                                <div className="d-flex align-items-center justify-content-between w-100">
                                  <h5 className="brand-name dark-text fw-medium" onClick={() => handleRestaurantClick(item?.items?.[0]?.restaurant_name?.id, 'food')}>
                       Order Id : #{item.id}
                                  </h5>
                                  <h6 className="fw-medium content-color text-end">
                                    {item.order_placed_datetime && formatDateTime(item.order_placed_datetime)}
                                  </h6>
                                </div>
                                <h6 className="fw-medium dark-text">
                                  
                                </h6>
                                {item.payment_reference_number &&
                                  <h6 className="fw-medium dark-text">
                                    <span className="fw-normal content-color">Transaction Id :
                                    </span>
                                    #{item.payment_reference_number}
                                  </h6>
                                }
                                <h6 className={`delivery-status status-${item.delivery_status}`}>
                                  {DELIVERY_STATUSES[parseInt(item.delivery_status)].replace(/_/g, ' ')}
                                </h6>
                              </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mt-sm-3 mt-2">
                              <h6 className="fw-medium dark-text">
                                <span className="fw-normal content-color">Total Amount : </span>
                                ₹{item.total_amount}
                              </h6>
                              {item?.earned_points > 0 &&
                                <div className='earned-points'>
                                  <img src='/images/orders/points.svg'></img>
                                  +{item?.earned_points}
                                </div>
                              }
                              <div className='d-flex justify-content-center align-items-center'>
                                {/* <div className='me-2'>
                                  {item.is_favourite ?
                                    <img src='/images/orders/favourites-filled.svg' role='button' onClick={() => handleFavourite(item, false)} ></img>
                                    :
                                    <img src='/images/orders/favourites.svg' role='button' onClick={() => handleFavourite(item, true)}  ></img>
                                  }
                                </div> */}
                                {['7', '9'].includes(item.delivery_status) ?
                                  <>
                                    {!item.is_gift_card &&
                                      <button className="btn-primary me-2" onClick={() => navigate('/shop')} >Order Again</button>
                                    }
                                  </>
                                  : ['1', '2', '3', '4', '5', '14'].includes(item.delivery_status) ?
                                    <button className="btn-primary me-2"
                                      onClick={() => { navigate('/contact-us')}} >Contact For Tracking
                                    </button>
                                    :
                                    <></>
                                }

                                {/* <a href="#order" className="btn-primary " onClick={() => setSelectedItem(item)}
                                  data-bs-toggle="modal">Details</a> */}
                                {/* <a className="btn-primary " onClick={() =>{setIsDetailsModalOpen(true); setSelectedItem(item)}}>Details</a> */}

                              </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mt-sm-3 mt-2">
                              {['7', '9'].includes(item.delivery_status) ?
                                // <div className='d-flex'>
                                //   <button className='text-secondary me-3 review-btn' onClick={() => { setIsOrderReviewModalOpen(true); setSelectedItem(item) }}>
                                //     Order Review
                                //   </button>
                                //   {!item.is_gift_card &&
                                //     <button className='text-secondary review-btn' onClick={() => { setIsDeliveryReviewModalOpen(true); setSelectedItem(item) }}>
                                //       Delivery Review
                                //     </button>
                                //   }
                                // </div>
                                 <div></div> :
                                <div></div>
                              }

                              <div className='d-flex'>
                                {/* {!item.is_gift_card &&
                                  <div className='me-2'>
                                    <img src='/images/orders/chat-round.svg' role='button' className='chat-icon'
                                      onClick={() => handleChatClick(item, 'restaurant')} ></img>
                                  </div>
                                } */}
                                {/* delivered/ refunded */}
                                {['7', '9'].includes(item.delivery_status) &&
                                  item.invoices && item.invoices.length > 0 &&
                                  <u className='text-secondary me-5'
                                    style={{ cursor: 'pointer', textDecoration: 'none' }}
                                    onClick={() => fetchInvoiceDataAndGeneratePdf(item.invoices[0])}>
                                    <span className='me-1 '>Invoice</span>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 3V15M12 15L6 9M12 15L18 9" stroke="#f02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M5 21H19" stroke="#f02" stroke-width="2" stroke-linecap="round"/>
</svg>

                                  </u>
                                }
                                <u className='text-black-50' style={{ cursor: 'pointer' }} onClick={() => navigate('/contact-us')}>Need Help?</u>
                              </div>
                            </div>

                          </div>
                        </li>
                      ))}
                    </ul>
                    :
                    <div className='d-flex justify-content-center align-items-center' style={{ width: '100%', height: '200px' }}>
                      No orders.
                    </div>
                  }

                  {data &&
                    <Pagination
                      totalItems={data.count}
                      pageSize={pageSize}
                      currentPage={page}
                      setCurrentPage={setPage}
                      selectPageSize={selectPageSize}
                    >

                    </Pagination>
                  }
                </div>
              

             
            </div>
      </section>

     
       
        


      {selectedChatRestaurant && (
        <ChatPopup
          primaryColor='#004938'
          secondaryColor='#ef3401'
          heading={`Chat with ${selectedChatRestaurant?.name ?? 'Restaurant'}`}
          currentUserId={localStorage.getItem('userID')}
          toUserId={selectedChatRestaurant?.user} // Pass the selected restaurant's ID
          source={'orders'}
          orderData={selectedChatOrder}
          entryTitle={`Start a conversation with ${selectedChatRestaurant?.name ?? 'Restaurant'}`}
        />
      )}

      {isOrderReviewModalOpen && <OrderReviewPopup setterFunction={setIsOrderReviewModalOpen} orderId={selectedItem.id} />}
      {isDeliveryReviewModalOpen && <DeliveryReviewPopup setterFunction={setIsDeliveryReviewModalOpen} orderId={selectedItem.id} />}
      {isTicketModalOpen && <TicketCreationPopup setterFunction={setIsTicketModalOpen} order={selectedItem} />}

      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={loadData} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsDetailsModalOpen(false)} />}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )

}

export default MyOrders