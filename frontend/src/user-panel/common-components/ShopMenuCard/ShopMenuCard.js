import React, { useContext, useState } from 'react'
import { formatTimeFromMinutes } from '../../../GeneralFunctions'
import './ShopMenuCard.scss'
import API from '../../../API'
import { UserContext } from '../../../authentication/pages/UserContext'
import { useNavigate } from 'react-router-dom'
import ConfirmPopup from '../ConfirmPopup/ConfirmPopup'
import ErrorModal from '../../../ErrorModal'
import PositiveModal from '../../../PositiveModal'
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import ToppingAddPopup from '../ToppingAddPopup/ToppingAddPopup'
import CartItemAddPopup from '../CartItemAddPopup/CartItemAddPopup'
import MenuItemDetailstPopup from '../MenuItemDetailstPopup/MenuItemDetailstPopup'


const ShopMenuCard = ({ ticketItem, cartItems, loadCartDataForHeader, data, setData , isRestaurantOpened, loadMenuBasedData,wishList , loadWishList}) => {

  const navigate = useNavigate();

  const { isLoggedIn, login, logout } = useContext(UserContext);
  const [message, setMessage] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isToppingsModalOpen, setIsToppingsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [isDetailsPopupShown, showDetailsPopup] = useState(false);

  const [formData, setFormData] = useState({
    restaurant: null,
    menu_item: null,
    count: 1,
    topping: null
  });


  // Add to Cart Button
  const handleAddToCartButton = (item) => {
    // setIsToppingsModalOpen(true);
    // return
    if (!isLoggedIn) {
      localStorage.setItem('LoginRedirectURL', '/shop')
      navigate('/login');
      return
    }
    setIsLoading(true)
    if (selectedItem && selectedItem.id === item.id) {
      item = selectedItem
    }
    setFormData({
      restaurant: item.restaurant_details?.id,
      menu_item: item.id,
      count: 1,
    })

    // check toppings for the menu item
    if (item?.topping_details?.length > 0 || item?.variants_details?.length > 0) {
      setIsToppingsModalOpen(true);
      setIsLoading(false)
    }
    else {
      setIsToppingsModalOpen(false);
      API.post(`/order/add-to-cart/`, {
        restaurant: item.restaurant_details?.id,
        menu_item: item.id,
        count: 1,
      })
        .then(response => {
          // Handle the response
          setIsLoading(false)
          loadCartDataForHeader();
          if (response.data.warning) {
            setMessage(response.data.message);
            setIsWarningModalOpen(true)
          } else {
            setData(prevData => ({
              ...prevData,
              results: prevData.results.map(ticketItem =>
                ticketItem.id === item.id ? { ...ticketItem, cart_item: response.data } : ticketItem
              )
            }));

            setMessage("Item added to the cart successfully.")
            setIsMessageModalOpen(true)
          }
        })
        .catch(error => {
          // Handle the error
          setMessage(error.response?.data?.message || error.message)
          setIsErrorModalOpen(true)
          setIsLoading(false)
        });
    }


  }

  const AddToCart = () => {
    const bodyData = {
      restaurant: selectedItem.restaurant_details?.id,
      menu_item: formData.menu_item,
      count: 1,
      topping: formData.topping,
      variant: formData.variant,
    }
    API.post(`/order/add-to-cart/`, bodyData)
      .then(response => {
        // Handle the response
        setIsLoading(false)
        loadCartDataForHeader();
        setData(prevData => ({
          ...prevData,
          results: prevData.results.map(ticketItem =>
            ticketItem.id === formData.menu_item ? { ...ticketItem, cart_item: response.data } : ticketItem
          )
        }));

        setMessage("Item added to the cart successfully.")
        setIsMessageModalOpen(true)
      })
      .catch(error => {
        // Handle the error
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true)
        setIsLoading(false)
      });
  }

  const handleQtyChange = (direction, index, id, itemCount) => {
    let count = 0;
    if (itemCount !== undefined && itemCount !== null) {
      count = itemCount;
    } else if (cartItems[index]) {
      count = parseInt(cartItems[index].count) || 0;
    }


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
        // loadData();
        loadCartDataForHeader();
        setIsLoading(false);
        // ✅ Update ticketItem.cart_item with API response
        setData(prevData => ({
          ...prevData,
          results: prevData.results.map(ticketItem =>
            ticketItem.cart_item?.id === id
              ? { ...ticketItem, cart_item: count > 0 ? { ...ticketItem.cart_item, count } : null }
              : ticketItem
          )
        }));


      }
      )
      .catch(error => {
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true)
        setIsLoading(false)
      });
    // }
    // else {
    //   setMessage("Quantity should be a number greater than zero")
    //   setIsErrorModalOpen(true)
    // }
  }

  // delete cart Item
  const handleRemoveCartItem = (item) => {
    setIsLoading(true)
    API.put(`/order/cart/${item.id}/`, { "count": 0 })
      .then(response => {
        loadCartDataForHeader();
        setIsLoading(false);
        // ✅ Remove cart_item from ticketItem in existing data
        setData(prevData => ({
          ...prevData,
          results: prevData.results.map(ticketItem =>
            ticketItem.cart_item?.id === item.id ? { ...ticketItem, cart_item: null } : ticketItem
          )
        }));

      }
      )
      .catch(error => {
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true)
        setIsLoading(false)
      });
  }

  const redirectToLogin = () => {
    localStorage.setItem("LoginRedirectURL", "/restaurant-menu");
    navigate("/login");
  };
    // Reusable API Call for Add/Remove Actions
  const updateList = async (url, reloadFunction, method = "DELETE") => {
    setIsLoading(true);
    try {
      await API({ method, url, data: { menu_item: ticketItem.id } });
      reloadFunction();
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

   

   // Check if Item is in List
  const isInList = (list) => list.some((l_item) => String(l_item.menu_item) === String(ticketItem?.id));
  // Add or Remove from Wishlist
  const toggleWishList = () => {
    if (!isLoggedIn) {
      redirectToLogin();
      return;
    }
    const wishlistItem = wishList.find(l_item => String(l_item.menu_item) === String(ticketItem?.id));


    if (wishlistItem) {
      // If the restaurant is in wishlists, delete it using its unique ID
      updateList(`/restaurants/wishlisted-menu-items/${wishlistItem.id}/`, loadWishList, "DELETE");
    } else {
      // Otherwise, add it to wishlisted
      updateList(`/restaurants/wishlisted-menu-items/`, loadWishList, "POST");
    };
  };



  return (
  <div className='shop-menu-card'>

  <div className="vertical-product-box-img">
    <img className="product-img-top w-100 bg-img"
      src={
        ticketItem?.airline_logo ||
        '/images/shop/dummy-ticket.png'
      }
      alt="flight-logo">
    </img>

    {ticketItem?.isinternational &&
      <div className="seller-badge season-special-badge">
        <img className="img-fluid badge" src="/images/svg/medal-fill.svg" alt="medal" />
        <h6 className='seasonal-text'>International Flight</h6>
      </div>
    }
  </div>

  <div className="vertical-product-body">
    <div className="d-flex align-items-center justify-content-between">
      <h4 className="vertical-product-title">
        {ticketItem?.airline} - {ticketItem?.flight_number}
      </h4>
      <div className='wishlist-icon' onClick={toggleWishList}>
        {isInList(wishList) ?
          <i className="ri-heart-3-fill fill-icon"></i>
          :
          <i className="ri-heart-3-line text-grey outline-icon"></i>
        }
      </div>
    </div>

    <div className='product-price-box'>
      <p className='quantity'>
        {ticketItem?.origin} → {ticketItem?.destination}
      </p>

      <div className='d-flex align-items-center'>
        <p className='category me-5'>Route: {ticketItem?.flight_route}</p>
        <p className='cuisine'>
          {ticketItem?.departure_date} at {ticketItem?.departure_time}
        </p>
      </div>

      <div className='d-flex align-items-center justify-content-between'>
        <h2 className="theme-color fw-semibold">
          ₹{ticketItem?.price}
        </h2>
        <div>
          <img className="img-fluid" src="/images/svg/plane-fill.svg" alt="flight"></img>
        </div>
      </div>

      
        <button className="btn theme-outline add-btn mt-1"
          onClick={() => navigate("/checkout-payment", { state: { ticket_id: ticketItem.ticket_id, amount:ticketItem?.price } })}>
          BOOK THIS TICKET
        </button>
   
    </div>

    <div>
      <h5 className="more-details" type='button' onClick={() => showDetailsPopup(true)}>
        View More Details
      </h5>
    </div>
  </div>



      {/* Warning Modal */}
      {isWarningModalOpen &&
        <div className='custom-modal '>
          <div className='card'>
            <div className='first-screen'>
              <img src='/images/icons/svg/warning.svg'></img>
              <h1>Allergy Warning</h1>
              <p>{message}</p>
              <div className='footer justify-content-center'>
                {/* <button type='button' className='cancel-button' onClick={() => { setIsWarningModalOpen(false) }}>Cancel</button> */}
                <button type='button' className='ok-button' onClick={() => { setIsWarningModalOpen(false) }}>Proceed</button>
              </div>
            </div>
          </div>
        </div>
      }
      {/* {isToppingsModalOpen && <ToppingAddPopup setterFunction={setIsToppingsModalOpen} selectedItem={selectedItem?.id} formData={formData} setFormData={setFormData} okClickedFunction={AddToCart} />} */}
      {isToppingsModalOpen && <CartItemAddPopup setterFunction={setIsToppingsModalOpen} selectedItem={selectedItem} formData={formData} setFormData={setFormData} okClickedFunction={AddToCart} />}

      {isDeleteConfirmModalOpen &&
        <ConfirmPopup setterFunction={setIsDeleteConfirmModalOpen} okClickedFunction={() => handleRemoveCartItem(selectedItem)}
          title={'Remove'}
          message={'Are you sure you want to remove this item from your cart?'} />
      }
      {isDetailsPopupShown && <MenuItemDetailstPopup
        ticketItem={ticketItem}
        setterFunction={showDetailsPopup}
        handleQtyChange={handleQtyChange}
        setIsDeleteConfirmModalOpen={setIsDeleteConfirmModalOpen}
        setSelectedItem={setSelectedItem}
        handleAddToCartButton={handleAddToCartButton}
        isWarningModalOpen={isWarningModalOpen}
        setIsWarningModalOpen={setIsWarningModalOpen}
        isToppingsModalOpen={isToppingsModalOpen}
        CartItemAddPopup={CartItemAddPopup}
        setIsToppingsModalOpen={setIsToppingsModalOpen}
        selectedItem={selectedItem}
        formData={formData}
        setFormData={setFormData}
        AddToCart={AddToCart}
        isDeleteConfirmModalOpen={isDeleteConfirmModalOpen}
        ConfirmPopup={ConfirmPopup}
        handleRemoveCartItem={handleRemoveCartItem}
        isDetailsPopupShown={isDetailsPopupShown}
        isMessageModalOpen={isMessageModalOpen}
        PositiveModal={PositiveModal}
        setIsMessageModalOpen={setIsMessageModalOpen}
      ></MenuItemDetailstPopup>}

      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}

export default ShopMenuCard
