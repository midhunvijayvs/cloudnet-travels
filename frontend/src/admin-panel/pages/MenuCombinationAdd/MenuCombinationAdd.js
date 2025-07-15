import React from "react";
import { useEffect, useState } from "react";

import $, { event } from 'jquery';
import { useNavigate } from 'react-router-dom';

import API from '../../../API';
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";

import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"

import './MenuCombinationAdd.scss'
const MenuCombinationAdd = ({ mode }) => {

  let navigate = useNavigate();

  const [data, setData] = useState({
    menuitems: [],
    restaurant: 0
  });
  const [menuData, setMenuData] = useState(null);
  const [restaurants, setRestaurants] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessagerModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [formFrrors, setFormErrors] = useState({});

  const [restaurantId, setRestaurantId] = useState(null);
  const [ItemSearchInput, setItemSearchInput] = useState('');

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])


  useEffect(() => {
    if (mode !== "add") {
      API.get(`/restaurants/combinations/${localStorage.getItem("itemSelectedId")}`)
        .then(response => {
          setData({
            ...data,
            restaurant: response.data.restaurant,
            menuitems: response.data.menuitems,
            id: response.data.id
          })
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, []);


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
    API.get('/restaurants/')
      .then(response => {
        setRestaurants(response.data);
      })
      .catch(error => {
        console.error(error);
      });

    // set restaurant Id
    API.get(`/restaurants/user-restaurant/${localStorage.getItem('userID')}`)
      .then(response => {
        setData({
          ...data,
          restaurant: response.data.id,
        })
        setRestaurantId(response.data.id);
      })
      .catch(error => {
        console.error(error);
      });
  }, [])

  useEffect(() => {
    if (ItemSearchInput) {
      loadMenuData();
    }
  }, [ItemSearchInput, data])


  // Handle input change
  const onFieldChange = (e, key) => {
    var temp = { ...data }
    temp[key] = e.target.value;
    setData(temp)
  }

  const handleSearchInputChange = (e) => {
    if (localStorage.getItem('userRole') !== 'restaurant' && parseInt(data.restaurant) === 0) {
      setFormErrors({restaurant:"Please choose a restaurant"});
      return;
    }else{
      setFormErrors({});
    }

    const value = e.target.value;
    setItemSearchInput(value);
  };

  // Handle selecting an item
  const handleSelectItem = (item) => {
    setData((prevData) => {
      const updatedMenuItems = prevData.menuitems.some(
        (menuItem) => menuItem.id === item.id
      )
        ? prevData.menuitems // Don't add if already exists
        : [...prevData.menuitems, item]; // Add new item to the list

      return {
        ...prevData,
        menuitems: updatedMenuItems,
      };
    });
    setItemSearchInput("");
  };

  const handleRemoveItem = (itemId) => {
    setData((prevData) => {
      const updatedMenuItems = prevData.menuitems.filter(
        (menuItem) => menuItem.id !== itemId
      );

      return {
        ...prevData,
        menuitems: updatedMenuItems,
      };
    });
  };

  const validateForm = (data) => {
    const errors = {};
    // Validate each field and add errors if necessary
    if (!data.menuitems || data.menuitems.length < 2) {
      errors.menuitems = "Please select atleast 2 items";
    }
    // no need of restaurant if role= restaurant
    if (localStorage.getItem('userRole') !== 'restaurant' && parseInt(data.restaurant) === 0) {
      errors.restaurant = "Please choose a restaurant";
    }
    return errors;
  };



  const handleSaveProduct = () => {
    const menuIds = data.menuitems.map(item => item.id);
    var temp = { ...data };
    temp.menuitems = menuIds
    if (restaurantId) {
      temp.restaurant = restaurantId
    }
    const validationErrors = validateForm(temp);

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }
    const method = mode === 'edit' ? 'put' : 'post';
    const apiUrl = mode === 'edit'
      ? `/restaurants/combinations/${temp.id}/`
      : '/restaurants/combinations/';
    setIsLoading(true);


    API[method](apiUrl, temp)
      .then(response => {
        setMessage(mode === 'add' ? "Combination added successfully!" : "Combination updated successfully!")
        setIsMessageModalOpen(true)
        setIsLoading(false)
      })
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true);
      });

  };


  const handleDiscad = () => {
    navigate('/admin/menu-combination/list')
  }


  return (

    <div className="add-combination page-body">
      <div className="container-fluid">
        <div className="card">
          <div className="card-header">
          </div>
          <div className="card-body">
            <div className="w-100" onSubmit={(event) => event.preventDefault()}>
              <div className="admin-panel-add-product-sec-1 container">
                <div className="row">
                  <div className="col-lg-6 card-header">
                    {mode == "add" ? <h5>Add Combination</h5> : <h5>Edit Combination</h5>}

                  </div>
                  <div className="col-lg-6">
                    <div className="d-flex justify-content-end mb-3 submit-btn-container">
                      <button className=" btn btn-small-dark" type="button" onClick={handleDiscad}>Cancel </button>
                      <button className=" btn save-button" type="button" onClick={handleSaveProduct}>{mode == "add" ? "Save" : "Update"}</button>
                    </div>
                  </div>
                </div>
                <div className="card w-100">
                  {localStorage.getItem('userRole') !== 'restaurant' &&
                    <div className="col-12">
                      <div className="mb-3">
                        <label htmlFor="exampleFormControlInput1" className="form-label">Restaurant
                        </label>

                        <select className="form-select form-select-sm" aria-label=".form-select-sm example" value={data.restaurant} onChange={(e) => onFieldChange(e, "restaurant")}>
                          <option value={0} selected>Select Restaurant</option>
                          {restaurants && restaurants.results.map((item, index) => {
                            return (
                              <option value={item.id} key={index}>{item.name}</option>
                            )
                          })}
                        </select>
                        {formFrrors.restaurant && <div className="text-danger">{formFrrors.restaurant}</div>}
                      </div>
                    </div>
                  }
                  {/* Menu Items */}
                  <div className="mb-3">
                    <div className="">
                      <label>Menu Items</label>
                    </div>
                    <div className="tag-select w-100">
                      <div className="tags-container">
                        <input
                          type="text"
                          value={ItemSearchInput}
                          className="tag-input w-100"
                          onChange={handleSearchInputChange}
                          placeholder="Search food item ..."
                        />
                        {ItemSearchInput && menuData && menuData.results?.length > 0 && (
                          <ul className="dropdown">
                            {menuData.results.map((item, index) => (
                              <li
                                key={index}
                                className="dropdown-item"
                                onClick={() => handleSelectItem(item)}
                              >
                                <img src={item?.images?.[0]?.image_url}></img>
                                {item.name}
                              </li>
                            ))}
                          </ul>
                        )}

                      </div>
                    </div>
                    {formFrrors.menuitems && <div className="text-danger">{formFrrors.menuitems}</div>}
                    <div className="selected-container">
                      {data.menuitems?.length > 0 && (
                        <div className="selected-items">
                          {data.menuitems.map((item) => (
                            <div key={item.id} className="selected-item">
                              <img src={item?.images?.[0]?.image_url}></img>
                              {item.name}
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                className="remove-button"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div >
          </div>
        </div>
      </div>
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => { }} />
      {isMessagerModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => { navigate('/admin/menu-combination/list') }} />}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>

  )
}

export default MenuCombinationAdd;