
import { useEffect, useState } from "react";
import "./CustomSearchSelectBox.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"


const CustomSearchSelectBox = ({ formData, setFormData, changeKey, apiGetUrl, resourceName, placeHolder }) => {
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
        if (formData[changeKey]) {
          const selectedItem = response.data.results.find(item => item.id === formData[changeKey]);
          // If a matching item is found, set the input value
          if (selectedItem) {
            if (resourceName === 'user') {
              setItemSearchInput(selectedItem.first_name ? `${selectedItem.first_name} ${selectedItem.last_name}` : `${selectedItem.email}`);
            }
            else if (resourceName === 'driver') {
              setItemSearchInput(
                selectedItem.user_info?.first_name
                  ? `${selectedItem.user_info.first_name} ${selectedItem.user_info.last_name}`
                  : `${selectedItem.user_info?.email}`
              );
            }
            else if (resourceName === 'combination') {
              const comboItems = selectedItem.menuitems.map((menu) => menu.name).join(', ');
              setItemSearchInput(`${comboItems}`);
            } else {
              setItemSearchInput(selectedItem.name);
            }
          }
        }

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
  }, [formData[changeKey], ItemSearchInput])

  const handleItemSearchInputChange = (e) => {
    const value = e.target.value;
    setShowSearchDropdown(value.trim().length > 0);
    setItemSearchInput(value);
  };
  const handleSelectItem = (item) => {
    setFormData({
      ...formData,
      [changeKey]: item.id,
    });
    setShowSearchDropdown(false);
    if (resourceName === 'user') {
      setItemSearchInput(
        item.first_name ? `${item.first_name} ${item.last_name}` : `${item.email}`
      );
    } else if (resourceName === 'driver') {
      setItemSearchInput(
        item.user_info?.first_name
          ? `${item.user_info.first_name} ${item.user_info.last_name}`
          : `${item.user_info?.email}`
      );
    }
    else if (resourceName === 'combination') {
      const comboItems = item.menuitems.map((menu) => menu.name).join(', ');
      setItemSearchInput(`${comboItems}`);
    }
    else {
      setItemSearchInput(`${item.name}`);
    }
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

  useEffect(() => {
    if (!formData[changeKey]) {
      setItemSearchInput('')
    }
  }, [formData])



  return (
    <div className="custom-search-select">
      <div className='input-group'>
        <input
          type='text'
          placeholder={placeHolder ?? 'Search'}
          value={ItemSearchInput}
          className='inp-D9D9D9 f-xs fw-500 w-100'
          required
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          disabled={formData[changeKey] || ''}
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
                {
                  resourceName === 'user'
                    ? item.first_name
                      ? `${item.first_name} ${item.last_name}`
                      : `${item.email}`
                    : resourceName === 'driver'
                      ? item.user_info?.first_name
                        ? `${item.user_info.first_name} ${item.user_info.last_name}`
                        : `${item.user_info?.email}`
                      : resourceName === 'combination'
                        ? item.menuitems.map((menu) => menu.name).join(', ')
                        : item.name
                }
              </li>
            ))
          ) : (
            <li className=''>No results found</li>
          )}
        </ul>
      )}

      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}
      {/* {isLoading && <FixedOverlayLoadingSpinner />} */}
    </div>
  )
}

export default CustomSearchSelectBox