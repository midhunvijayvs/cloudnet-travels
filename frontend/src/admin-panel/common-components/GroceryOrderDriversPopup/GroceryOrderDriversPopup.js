import React, { useState, useEffect } from 'react'
import './GroceryOrderDriversPopup.scss'
import API from '../../../API';
import ErrorModal from '../../../ErrorModal';
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import { useNavigate } from 'react-router-dom';


const GroceryOrderDriversPopup = ({ setterFunction, data, loadData, loadTableData,setTableData, orderConfirmPopup,confirmResource,setIsOrderModifyModalOpen }) => {
  let navigate = useNavigate();
  const okClicked = () => {
    setterFunction(false)
  }
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  const [driverData, setDriverData] = useState(null);
  const [ItemSearchInput, setItemSearchInput] = useState('');
  useEffect(() => {
    if (data?.delivery_person){
      setSelectedItem({id: data.delivery_person})
    }
  }, [])
  

  const handleButtonClick = (mode) => {
    if (selectedItem?.id){
      updateOrderStatus();
    }else{
      setMessage('Please select a delivery partner.')
      setIsErrorModalOpen(true)
    }
  }

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setItemSearchInput(value);
  };

  // Handle selecting an item
  const handleSelectItem = (item) => {
    setSelectedItem(item)
    setItemSearchInput("");
  };

  const loadDriverData = () => {
    let apiUrl = `/delivery_person/?grocery_store_user=${localStorage.getItem("userID")}&page_size=100&is_registration_completed=True`;
    if (ItemSearchInput) {
      apiUrl += `&search_key=${ItemSearchInput}`;
    }
    setIsLoading(true)
    API.get(apiUrl)
      .then(response => {
        setIsLoading(false)
        setDriverData(response.data);
      })
      .catch(error => {
        setIsLoading(false)
        console.error(error);
      });
  }

  useEffect(() => {
    loadDriverData();
  }, [ItemSearchInput])


  const updateOrderStatus = () => {
    let payLoad = { delivery_status: null };
    let apiUrl = ""
    const method ='put';
    if (confirmResource === 'modify') {
      if (data?.delivery_person === selectedItem.id){
        setterFunction(false);
        setIsOrderModifyModalOpen(true)
        return
      }
      apiUrl = `/grocery/orders/${data.id}/`
      payLoad = { delivery_person: selectedItem.id }; // confirmed
    } else {
      apiUrl = `/grocery/orders/${data.id}/`
      payLoad = { delivery_status: 2, delivery_person: selectedItem.id }; // confirmed
    }
    setIsLoading(true)
    API[method](apiUrl, payLoad)
      .then(response => {
        setIsLoading(false);
        loadData();
        if (payLoad?.delivery_status == 2){
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
        }
        setterFunction(false);
        if (confirmResource == 'modify'){
          setIsOrderModifyModalOpen(true)
        }else{
          orderConfirmPopup(false)
        }
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
    API.put(`/grocery/revert-the-changes/${data.id}/`)
      .then(response => {
        setIsLoading(false);
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
        // orderConfirmPopup(false)
      })
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true);
      });
  }


  return (
    <div className='custom-modal order-driver-popup'>
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
            <div className='first-screen'>
              <p>Please assign delivery person from the list below</p>
              <div className="tag-select w-100">
                <div className="tags-container">
                  <input
                    type="text"
                    value={ItemSearchInput}
                    className="tag-input w-100"
                    onChange={handleSearchInputChange}
                    placeholder="Search delivery partner ..."
                  />
                  {(
                    <ul className="dropdown">
                      {driverData?.results.map((item, index) => (
                        <li
                          key={index}
                          className={`dropdown-item ${item.id === selectedItem.id && 'active'}`}
                          onClick={() => handleSelectItem(item)}
                        >
                          <div className='item-content'>
                            {item?.user_info.profile_image ?
                              <img className="" src={item?.user_info?.profile_image} alt=""></img> :
                              <img className="" src="/images/no-profile-image.png" alt=""></img>
                            }
                            {item.user_info?.first_name} {item.user_info?.last_name}
                          </div>
                        </li>
                      ))}
                      {driverData?.results?.length > 0 ?
                        <div>  </div> :
                        <div className='no-data'>
                          No delivery partners available.
                        </div>
                      }
                    </ul>
                  )}

                </div>
              </div>

            </div>
          </div>
          <div className='btns'>
            <button className="btn theme-outline" onClick={() => handleCancel()}>
              Cancel
            </button>
            <button className="btn theme-btn modify" onClick={() => handleButtonClick('accept')}>Save</button>
          </div>
        </div>
      </div>



      {/* Confirm Modal */}
      {isConfirmModalOpen &&
        <div className='custom-modal '>
          <div className='card'>
            <div className='first-screen'>
              <img src='/images/icons/svg/warning.svg'></img>
              <h1>Modify</h1>
              {confirmResource === 'reject' ?
                <>
                  <h1>Reject</h1>
                  <p>Are you sure you want to modify this order?</p>
                </>
                :
                <>
                  <h1>Accept</h1>
                  <p>Are you sure you want to accept this order?</p>
                </>
              }
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

export default GroceryOrderDriversPopup;