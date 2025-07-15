
import { useEffect, useState } from "react";
import "./ChatUserSearchSelect.scss"

import API from '../../../../API';
import LoadingSpinner from "../../../../LoadingSpinner";
import ErrorModal from "../../../../ErrorModal";
import PositiveModal from "../../../../PositiveModal";
import FixedOverlayLoadingSpinner from "../../../../FixedOverlayLoadingSpinner"


const CustomSearchSelectBox = ({ handleSelect, apiGetUrl }) => {
  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState(null);
  const [ItemSearchInput, setItemSearchInput] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState('');
 
  const loadData = () => {
    setIsMessageModalOpen(false);
    let apiUrl = apiGetUrl || ``;
    apiUrl += apiUrl.includes('?') ? `&page_size=${1000}` : `?page_size=${1000}`;
    if (ItemSearchInput) {
      apiUrl += `&search_key=${ItemSearchInput}`;
    }
    setIsLoading(true)
    API.get(apiUrl)
      .then(response => {
        setData(response.data.results);
        setIsLoading(false);
      })
      .catch(error => {
        // setMessage(error.response?.data?.message || error.message);
        // setIsErrorModalOpen(true);
        setIsLoading(false)

      });
  }


  useEffect(() => {
    loadData();
  }, [ItemSearchInput])

  const handleItemSearchInputChange = (e) => {
    const value = e.target.value;
    setShowSearchDropdown(value.trim().length > 0);
    setItemSearchInput(value);
  };
  

  // Show dropdown if there's text
  const handleInputFocus = () => {
    setShowSearchDropdown(ItemSearchInput.length > 0);
  };

  const handleInputBlur = () => {
    // Delay hiding the dropdown to allow click on items
    setTimeout(() => {
      setShowSearchDropdown(false);
    }, 200);
  };

  const handleClearSearch = () => {
    setShowSearchDropdown(false);
    setItemSearchInput('');
  };

  
  const handleSelectItem = (item) => {
    handleSelect(item)
    setShowSearchDropdown(false);
    setItemSearchInput("")
  };



  return (
    <div className="chatuser-search-select">
      <div className='input-group'>
        <input
          type='text'
          placeholder='Search Users'
          value={ItemSearchInput}
          className='inp-D9D9D9 f-xs fw-500 w-100'
          required
          onFocus={handleInputFocus}
          // onBlur={handleInputBlur}
          onChange={handleItemSearchInputChange}
        />
        {ItemSearchInput && (
          <button
            type='button'
            className='btn-clear'
            onClick={handleClearSearch}
          >
            x
          </button>
        )}
      </div>
      
      {showSearchDropdown && data && (
        <ul className='dropdown-list'>
          {data.length > 0 ? (
            data.map((item, index) => (
              <li key={index} onClick={() => handleSelectItem(item)}>
                <img src={item?.profile_image || '/images/no-profile-image.png'} className='profile-img'></img>
                {`${item.first_name} ${item.last_name}`}
              </li>
            ))
          ) : (
            <li className=''>No results found</li>
          )}
        </ul>
      )}

      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}

export default CustomSearchSelectBox