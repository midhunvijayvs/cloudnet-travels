import React, { useState, useEffect } from 'react'
import './OrderModifyPopup.scss'
import API from '../../../API';
import ErrorModal from '../../../ErrorModal';
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import { useNavigate } from 'react-router-dom';


// ("1", "accepted"),
// ("2", "unavailable"),
// ("3", "modification_suggestion"), 
// ("4", "rejected"), 

const OrderModifyPopup = ({ setterFunction, data, loadData, loadTableData,setTableData, orderConfirmPopup }) => {
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
  const [orderData, setOrderData] = useState(data || {});
  const [ItemSearchInput, setItemSearchInput] = useState('');


  // menuitem search
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setItemSearchInput(value);
  };

  // Handle selecting Menu item
  const handleSelectItem = (item, variant) => {
    setItemSearchInput("");
    addAlternative(item, variant)
  };

  // dropddown change
  const handleItemStatusChange = (e, item) => {
    const { value } = e.target;
    setSelectedItem(item);
    // unavailable
    if (value === '2') {
      handleAvailable(item, '2')
    }
    // Accept
    else if (value === '1') {
      handleAvailable(item, '1')
    }
  };


  // Add Alternative Item
  const addAlternative = (newItem, variant) => {
    setIsNewItemModalOpen(false);
    // Remove any existing alternative item related to the selected item
    let filteredItems = orderData.items.filter(item => item.related_order_item !== selectedItem.id);

    // Create the new alternative item object
    const newItemObject = {
      price: newItem.offer_price,
      final: true,
      menu_item: newItem.id,
      menu_item_details: newItem,
      menu_item_name: newItem?.name,
      order: selectedItem.order,
      count: selectedItem.count,
      restaurant: selectedItem.restaurant,
      restaurant_name: selectedItem.restaurant_name,
      related_order_item: selectedItem.id,
      decision: '3',
    };
    if (variant) {
      newItemObject.variant = variant?.id
      newItemObject.variant_details = variant.quantity_name
      newItemObject.price = variant.offer_price
    }

    // Update the main item to mark it as having an alternative (Unavailable)
    const updatedItems = filteredItems.map(item =>
      item.id === selectedItem.id ? { ...item, decision: '2', final: false } : item
    );

    // Add the new alternative item
    updatedItems.push(newItemObject);

    // Update state with the modified items list
    setOrderData(prevData => ({
      ...prevData,
      items: updatedItems
    }));
    console.log(updatedItems);

  };

  // Remove Alternative Item
  const removeAlternative = (mainItem) => {
    // Filter out the alternative item
    const updatedItems = orderData.items.filter(item => item.related_order_item !== mainItem.id);

    // Restore the main item’s decision if it was set to '2' (Unavailable) due to an alternative
    // const restoredItems = updatedItems.map(item =>
    //   item.id === mainItem.id ? { ...item, decision: '1', final: true } : item
    // );

    // Update state
    setOrderData(prevData => ({
      ...prevData,
      items: updatedItems
    }));
  };

  // Set as Available
  const handleAvailable = (orderItem, status) => {
    const final = status === '1' ? true : false;
    // Create a new items array with the updated item and the new alternative added
    const updatedItems = orderData.items.map(item =>
      item.id === orderItem.id ? { ...item, decision: status, final: final } : item
    );
    // Update the state with the new items list
    setOrderData(prevData => ({
      ...prevData,
      items: updatedItems
    }));

  }

  const handleModifyClick = (mode) => {
    // updateOrderStatus();
    updateOrderItems()
  }

  const updateOrderItems = async () => {
    const url = "/order/order-item/";
    const orderUrl = `/order/orders/${data.id}/update-delivery-status/`;

    setIsLoading(true); // Start loading before processing

    // Create a map of existing items by ID for quick lookup
    const existingItemsMap = new Map(data.items.map(item => [item.id, item]));

    let updatePromises = [];
    let hasChanges = false;  // Flag to track if any item has been updated or added
    for (const item of orderData.items) {
      if (item.id && existingItemsMap.has(item.id)) {
        // Check if item has changed compared to existing data
        const existingItem = existingItemsMap.get(item.id);
        if (JSON.stringify(existingItem) !== JSON.stringify(item)) {
          console.log(item.menu_item_name, '...updating');
          hasChanges = true;
          const updatePromise = API.put(`${url}${item.id}/`, { decision: item.decision, final: item.final })
            .then(async () => {
              // If the item is accepted, delete alternative items
              if (item.decision === "accepted") {
                const deletePromises = [];

                for (const altItem of existingItemsMap.values()) {
                  if (
                    altItem.main_item_id === item.id &&
                    (altItem.decision === "unavailable" || altItem.decision === "modification_suggestion")
                  ) {
                    console.log(altItem.menu_item_name, '...deleting alternative item');
                    deletePromises.push(
                      API.delete(`${url}${altItem.id}/`).catch(error => {
                        setMessage(error.response?.data?.message || error.message);
                        setIsErrorModalOpen(true);
                      })
                    );
                  }
                }

                await Promise.all(deletePromises); // Ensure all deletions complete
              }
            })
            .catch(error => {
              setMessage(error.response?.data?.message || error.message);
              setIsErrorModalOpen(true);
            });

          updatePromises.push(updatePromise);
        }
      } else {
        console.log(item.menu_item_name, '...adding');
        hasChanges = true;
        // New item (no existing ID)
        const addPromise = API.post(url, item).catch(error => {
          setMessage(error.response?.data?.message || error.message);
          setIsErrorModalOpen(true);
        });

        updatePromises.push(addPromise);
      }
    }

    // Wait for all updates (add, update, delete) to complete
    await Promise.all(updatePromises);

    // After everything is done, update order delivery_status
    if (hasChanges) {
      try {
        const response = await API.put(orderUrl, { delivery_status: '14' });
        console.log("Order delivery status updated to 14.");
        loadData();
        // loadTableData();
        setTableData(prevData => {
          const updatedResults = prevData.results.map(order =>
            order.id === data.id
              ? { ...order, ...response.data } // Merge updated data with the existing order
              : order
          );

          // Return updated data with modified results
          return {
            ...prevData,
            results: updatedResults,
          };
        });
        setterFunction(false);
        orderConfirmPopup(false)
      } catch (error) {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
      }
    }

    setIsLoading(false); // Stop loading after all API calls complete
  };





  const loadMenuData = () => {
    let apiUrl = `/restaurants/menu-items/?page_size=100&is_available=True&is_published=true`;
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

  const handleCancel = () => {
    setterFunction(false);
  }


  const calculateSubTotal = (orderData) => {
    return orderData?.items?.filter(item => item.final === true)
      .reduce((acc, item) => {
        // Add the base item price
        let itemTotal = item.price * item.count;

        // Add the price of toppings if they exist
        if (item.topping_details?.length > 0) {
          itemTotal += item.topping_details.reduce((toppingAcc, top) => {
            return toppingAcc + (top.price * top.count);
          }, 0);
        }

        return acc + itemTotal;
      }, 0).toFixed(2);
  };



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
                    <th className='text-center'>Quantity</th>
                    <th>Price</th>
                    <th>Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData?.items?.map((item, index) => {
                    // Find the alternative item using related_order_item
                    const alternativeItem = orderData.items.find(altItem => altItem.related_order_item === item.id);
                    return (
                      <React.Fragment key={item.id || `main-${index}`}>
                        {!item.related_order_item && (
                          <tr key={`main-${item.id}`} className={`${item.alternative_item ? 'alter' : ''}`}>
                            <td>{index + 1}</td>
                            <td>
                              <div className='menu-item'>
                                {item?.menu_item_name} {item?.variant_details && `(${item.variant_details})`}
                                {/* <div>
                                  {item.topping && <span>+({item.topping_details?.description})</span>}
                                </div> */}
                                {item.topping_details?.length > 0 &&
                                  item.topping_details.map((top, index) => (
                                    <div key={index} className='d-flex justify-content-between align-items-center'>
                                      <h6 className="ingredients-text">+ {top.topping?.description} (x{top.count}) </h6>
                                      {top.price > 0 &&
                                        <span className='ms-3'>₹{top?.price}</span>
                                      }
                                    </div>
                                  ))
                                }
                              </div>
                            </td>
                            <td className='text-center'>{item.count}</td>
                            <td className=''>₹{item.price}</td>
                            <td>
                              <div className="d-flex justify-content-center align-items-center">
                                <select
                                  className={`form-select status-${item.decision || '1'}`}
                                  value={item.decision || '1'}
                                  onChange={(e) => handleItemStatusChange(e, item)}
                                >
                                  <option value={'1'}>Accept</option>
                                  {/* <option value={'3'}>Unavailable & Suggest</option> */}
                                  <option value={'2'}>Unavailable</option>
                                </select>
                              </div>
                            </td>
                          </tr>
                        )}
                        {/* Display alternative item if it exists */}
                        {item.decision === '2' &&
                          (alternativeItem ?
                            <tr key={`alt-${alternativeItem.id}`} className='alternative'>
                              <td></td>
                              <td className='menu-item' >
                                <div>
                                  {alternativeItem?.menu_item_name} {alternativeItem?.variant_details && `(${alternativeItem.variant_details})`}
                                </div>
                              </td>
                              <td className='text-center'>{alternativeItem?.count}</td>
                              <td>₹{alternativeItem?.price}</td>
                              <td>
                                <i onClick={() => { setIsNewItemModalOpen(true); setSelectedItem(item); }} className="ri-pencil-line">
                                </i>
                                <i className="ms-4 ri-delete-bin-line" onClick={() => removeAlternative(item)}></i>
                              </td>
                            </tr>
                            :
                            <tr key={`suggest-${item.id}`} className='alternative'>
                              <td colSpan={5} className='menu-item' >
                                <div className='d-flex justify-content-center'>
                                  <div className='suggest-btn'
                                    onClick={() => { setSelectedItem(item); setIsNewItemModalOpen(true) }} >
                                    Suggest Alternative
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )
                        }
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="total-summary mt-2">
              <div className="sub-total">
                <div>
                  Sub Total 
                </div>
                ₹{calculateSubTotal(orderData)}
                {/* {orderData?.items?.filter(item => item.final === true)
                  .reduce((acc, item) => acc + (item.price * item.count), 0).toFixed(2)} */}

              </div>
              <div className="sub-total d-none">
                <div>
                  Delivery Charge
                </div>
                ₹{data.delivery_charge}
              </div>
              <div className="sub-total total d-none">
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
            <button className="btn theme-btn modify" onClick={() => handleModifyClick('modify')}>Save</button>
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
                        <div className='menu-item' key={index}>
                          <li
                            className="dropdown-item"
                            onClick={() => handleSelectItem(item, null)}
                          >
                            <div className='item-content'>
                              <img src={item?.images?.[0]?.image_url}></img>
                              {item.name}
                            </div>
                            <div>
                              ₹{item.offer_price}
                            </div>
                          </li>
                          {item.variants_details?.length > 0 &&
                            item.variants_details.map((variant, idx) => (
                              <li className='dropdown-item variant' key={idx}
                                onClick={() => handleSelectItem(item, variant)} >
                                <div className='item-content'>
                                  {/* <img src={item?.images?.[0]?.image_url}></img> */}
                                  {variant.quantity_name}
                                </div>
                                <div>
                                  ₹{variant.offer_price}
                                </div>
                              </li>
                            ))}
                        </div>
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