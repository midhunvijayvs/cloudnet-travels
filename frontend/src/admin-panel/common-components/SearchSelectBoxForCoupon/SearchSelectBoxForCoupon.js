
import { useEffect, useState } from "react";
import "./SearchSelectBoxForCoupon.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"


const SearchSelectBoxForCoupon = ({ formData, setFormData, changeKey, apiGetUrl, resourceName }) => {
  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
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
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
        setIsLoading(false)

      });
  }


  useEffect(() => {
    loadData();
  }, [ItemSearchInput])

  const handleItemSearchInputChange = (e) => {
    const value = e.target.value;
    setShowSearchDropdown(value.length > 0);
    setItemSearchInput(value);
  };

  const handleSelectItem = (item) => {
    setFormData((prevData) => {
      const updatedItems = prevData[changeKey].some(
        (listItem) => listItem.id === item.id
      )
        ? prevData[changeKey] // Don't add if already exists
        : [...prevData[changeKey], item]; // Add new item to the list

      return {
        ...prevData,
        [changeKey]: updatedItems,
      };
    });

    setShowSearchDropdown(false);
    if (resourceName === 'user') {
      setItemSearchInput(`${item.username}`);
    } else {
      setItemSearchInput(`${item.name}`);
    }
    setItemSearchInput('');
  };
  const handleClearSearch = () => {
    setFormData({
      ...formData,
      [changeKey]: null,
    });
    setShowSearchDropdown(false);
    setItemSearchInput('');
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



  return (
    <div className="custom-search-select coupon">
      <div className='input-group'>
        <input
          type='text'
          placeholder='Type to search'
          value={ItemSearchInput}
          className='inp-D9D9D9 f-xs fw-500 w-100'
          required
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          // disabled={formData[changeKey] || ''}
          onChange={handleItemSearchInputChange}
        />
        {/* {ItemSearchInput && (
          <button
            type='button'
            className='btn-clear'
            onClick={handleClearSearch}
          >
            x
          </button>
        )} */}
      </div>
      {showSearchDropdown && data && (
        <ul className='dropdown-list'>
          {data.length > 0 ? (
            data.map((item, index) => (
              <li key={index} onClick={() => handleSelectItem(item)}>
                {resourceName === 'user' ? item.username : item.name}
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

export default SearchSelectBoxForCoupon