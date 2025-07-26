import React, { useState, useEffect } from 'react'
import './OrderModifyPopup.scss'
import API from '../../../API';
import ErrorModal from '../../../ErrorModal';
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import { useNavigate } from 'react-router-dom';


const OrderModifyPopup = ({ setterFunction, data, loadData, loadTableData, orderConfirmPopup }) => {
  let navigate = useNavigate();
  const okClicked = () => {
    setterFunction(false)
  }
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [confirmResource, setConfirmResource] = useState('');
  const [selectedItem, setSelectedItem] = useState({});

  const [menuData, setMenuData] = useState(null);
  const [ItemSearchInput, setItemSearchInput] = useState('');



  const handleButtonClick = (mode) => {
    updateOrderStatus();

  }

  const handleItemStatusChange = (e, item) => {
    const { value } = e.target;
    setSelectedItem(item);

    // suggest
    if (value === '3') {
      setIsNewItemModalOpen(true)
    }
    // unavailable
    else if (value === '2') {
      handleAvailable(item, '2')
    }
    // Accept
    else if (value === '1') {
      handleAvailable(item, '1')
    }
  };


  // menuitem search
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setItemSearchInput(value);
  };

  // Handle selecting an item
  const handleSelectItem = (item) => {
    setItemSearchInput("");
    addAlternative(item.id)
  };

  const loadMenuData = () => {
    let apiUrl = `/restaurants/menu-items/?page_size=100&is_available=True`;
    if (ItemSearchInput) {
      apiUrl += `&search_key=${ItemSearchInput}`;
    }
    if (data.restaurant) {
      apiUrl += `&restaurant=${data.restaurant}`;
    }
    setIsLoading(true)
    API.get(apiUrl)
      .then(response => {
        setIsLoading(false)
        setMenuData(response.data);
      })
      .catch(error => {
        setIsLoading(false)
        console.error(error);
      });
  }

  useEffect(() => {
    loadMenuData();
  }, [ItemSearchInput])

  const handleAvailable = (item, status) => {
    setIsLoading(true)
    API.put(`/order/order-item/${item.id}/`, { alternative_menu_item: null, decision_by_restaurant: status })
      .then(response => {
        setIsLoading(false);
        loadData();
      })
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true);
      });
  }

  const removeAlternative = (item) => {
    setIsLoading(true)
    API.put(`/order/order-item/${item.id}/`, { alternative_menu_item: null, decision_by_restaurant: '1' })
      .then(response => {
        setIsLoading(false);
        loadData();
      })
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true);
      });
  }

  const addAlternative = (newItem) => {
    setIsLoading(true)
    API.put(`/order/order-item/${selectedItem.id}/`, { alternative_menu_item: newItem, decision_by_restaurant: '3' })
      .then(response => {
        setIsLoading(false);
        loadData();
        setIsNewItemModalOpen(false)
      })
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true);
      });
  }

  const updateOrderStatus = () => {
    setIsLoading(true)
    API.post(`/order/update-order-status/${data.id}/`)
      .then(response => {
        setIsLoading(false);
        loadData();
        loadTableData();
        setterFunction(false);
        orderConfirmPopup(false)
      })
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true);
      });
  }

  const handleCancel = () => {
    setterFunction(false);
    return
    setIsLoading(true)
    API.put(`/order/revert-the-changes/${data.id}/`)
      .then(response => {
        setIsLoading(false);
        loadData();
        loadTableData();
        setterFunction(false);
        // orderConfirmPopup(false)
      })
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true);
      });
  }


  return (
    <div className='custom-modal order-modify-popup'>
      <div className='card'>
        <div className='close-btn' >
          <button onClick={okClicked}>
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.49951 7.5L22.4995 22.5" stroke="#263238" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M22.5005 7.5L7.50049 22.5" stroke="#263238" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>

        <div className='card-content'>
          <div className="sec-2">
            <div className="table2 mt-4">
              <table className=" w-100">
                <thead>
                  <tr>
                    <th>Sl No</th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items?.map((item, index) => (
                    <>
                      <tr className={`${item.alternative_item ? 'alter' : ''}`}>
                        <td>{index + 1}</td>
                        <td>
                          <div className='menu-item'>
                            {item?.menu_item_name}
                            <div>
                              {item.topping &&
                                <span >+({item.topping_details?.description})</span>
                              }
                            </div>
                          </div>
                        </td>
                        <td>{item.count}</td>
                        <td>₹{item.price}</td>
                        <td>
                          <div className="d-flex justify-content-center align-items-center">
                            <select className={`form-select status-${item.decision_by_restaurant || '0'}`}
                              value={item.decision_by_restaurant || '0'}
                              onChange={(e) => handleItemStatusChange(e, item)} >
                              <option value={'1'} className={``}>Accept</option>
                              <option value={'3'} className={``}>Suggest Alternative</option>
                              <option value={'2'} className={``}>Unavailable</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                      {item.alternative_item &&
                        <tr className='alternative'>
                          <td colSpan={2}>
                            <div >
                              {item.alternative_item?.name}
                            </div>
                          </td>
                          <td>
                            {item.count}
                          </td>
                          <td>
                            ₹{item.alternative_item?.offer_price}
                          </td>
                          <td>
                            <i onClick={() => { setIsNewItemModalOpen(true); setSelectedItem(item) }} className="ri-pencil-line"></i>
                            <i className="ms-4 ri-delete-bin-line" onClick={() => removeAlternative(item)}></i>
                          </td>
                        </tr>
                      }
                    </>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="total-summary mt-2">
              <div className="sub-total">
                <div>
                  Sub Total
                </div>
                ₹{data.sub_total}
              </div>
              {data?.to_pay_extra > 0 ? (
                data.is_second_payment_to_refunded ? (
                  <div className="sub-total refund">
                    <div>
                      To Refund
                    </div>
                    ₹{data.to_pay_extra && data.to_pay_extra.toFixed(2)}
                  </div>
                ) : (
                  <div className="sub-total pay-extra">
                    <div>
                      To Pay Extra
                    </div>
                    ₹{data.to_pay_extra && data.to_pay_extra.toFixed(2)}
                  </div>
                )
              ) : (
                null
              )}

              <div className="sub-total">
                <div>
                  Total Amount
                </div>
                ₹{data.total_amount}
              </div>
            </div>
          </div>
          <div className='btns'>
            <button className="btn theme-outline" onClick={() => handleCancel()}>
              Cancel
            </button>
            <button className="btn theme-btn modify" onClick={() => handleButtonClick('modify')}>Save</button>
          </div>
        </div>
      </div>


      {/* Alternative Item Modal */}
      {isNewItemModalOpen &&
        <div className='custom-modal alter-item-popup'>
          <div className='card'>
            <div className='close-btn' >
              <button onClick={() => setIsNewItemModalOpen(false)}>
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.49951 7.5L22.4995 22.5" stroke="#263238" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M22.5005 7.5L7.50049 22.5" stroke="#263238" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>
            <div className='first-screen'>
              <p>The selected item is currently unavailable. Please choose an alternative item from the list below</p>
              <div className="tag-select w-100">
                <div className="tags-container">
                  <input
                    type="text"
                    value={ItemSearchInput}
                    className="tag-input w-100"
                    onChange={handleSearchInputChange}
                    placeholder="Search food item ..."
                  />
                  {menuData && menuData.results?.length > 0 && (
                    <ul className="dropdown">
                      {menuData.results.map((item, index) => (
                        <li
                          key={index}
                          className="dropdown-item"
                          onClick={() => handleSelectItem(item)}
                        >
                          <div className='item-content'>
                            <img src={item?.images?.[0]?.image_url}></img>
                            {item.name}
                          </div>
                          <div>
                            ₹{item.offer_price}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                </div>
              </div>

            </div>
          </div>
        </div>
      }

      {/* Confirm Modal */}
      {isConfirmModalOpen &&
        <div className='custom-modal '>
          <div className='card'>
            <div className='first-screen'>
              <img src='/images/icons/svg/warning.svg'></img>
              <h1>Modify</h1>
              <p>Are you sure you want to Modify this order?</p>
              <div className='footer mt-2'>
                <button type='button' className='btn-outlined' onClick={() => { setIsConfirmModalOpen(false) }}>Cancel</button>
                <button type='button' className='btn-primary'
                >Proceed</button>
              </div>
            </div>
          </div>
        </div>
      }

      {isLoading && <FixedOverlayLoadingSpinner />}
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
    </div>
  )
}

export default OrderModifyPopup;