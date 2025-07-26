import React from "react";
import { useEffect, useState } from "react";

import $, { event } from 'jquery';
import { useNavigate } from 'react-router-dom';

import ImageUploader from '../../common-components/ImageUploaderMenuItem/ImageUploaderMenuItem'
import API from '../../../API';
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";

import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"

import './MenuItemAdd.scss'
const View = ({ mode }) => {

  let navigate = useNavigate();

  const [data, setData] = useState({
    "name": null,
    "description": null,
    "base_price": 0.01,
    "category": 0,
    "restaurant": 0,
    "cuisine": 0,
    "quantity": 1,
    "unit": 0,
    "is_published": false,
    "offer_price": 0.01,
    "is_veg": false,
    "spiciness_rank": 0,
    "stock": 0,
    ingredients: [],
    toppings: [],
    custom_notes: []
  });

  const [images, setImages] = useState([])

  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessagerModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [formFrrors, setFormErrors] = useState({});

  const [categories, setCategories] = useState(null);
  const [restaurants, setRestaurants] = useState(null);
  const [brands, setBrands] = useState(null);
  const [subCategories, setSubCategories] = useState(null);
  const [units, setUnits] = useState(null);
  const [cuisines, setCuisines] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);
  const [cookingInstructionTemplates, setCookingInstructionTemplates] = useState([
    'No sugar', 'Add Lemon', 'Extra Souce',
  ]);

  const [activeTab, setActiveTab] = useState('basic');


  const [showImageUploader, setShowImageUploader] = useState(false)

  const [variantCount, setVariantCount] = useState(0);

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])

  useEffect(() => {

    API.get('/restaurants/menu-categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error(error);
      });



    API.get('/restaurants/units/')
      .then(response => {
        setUnits(response.data);
      })
      .catch(error => {
        console.error(error);
      });

    API.get('/restaurants/cuisines/')
      .then(response => {
        setCuisines(response.data);
      })
      .catch(error => {
        console.error(error);
      });

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
        setRestaurantId(response.data.id);
      })
      .catch(error => {
        console.error(error);
      });




  }, [])


  useEffect(() => {
    if (data.category) {

      API.get(`/restaurants/cuisines/`)
        .then(response => {
          setSubCategories(response.data);
        })
        .catch(error => {
          console.error(error);
        });

    }
  }, [data])

  ///////////////////////////////////////////////////////////////////////////////////
  // const [customNotes, setCustomNotes] = useState([]);
  const [inputNotesValue, setInputNotesValue] = useState('');

  const handleNotesInputChange = (event) => {
    setInputNotesValue(event.target.value);
  };

  const handleNotesInputKeyDown = (event) => {
    if (event.key === 'Enter' && inputNotesValue.trim() !== '') {
      event.preventDefault();
      addCustomeNotes(inputNotesValue.trim());
    }
  };
  const handleTemplateClick = (template) => {
    addCustomeNotes(template.trim());
  };

  const addCustomeNotes = (item) => {
    // setCustomNotes((prevItem) => [...prevItem, item]);
    setData((prevData) => ({
      ...prevData,
      custom_notes: [...prevData.custom_notes, item],
    }));
    setInputNotesValue('');
  };

  const removeCustomNotes = (index) => {
    // setCustomNotes((prevItems) => prevItems.filter((_, i) => i !== index));
    setData((prevData) => ({
      ...prevData,
      custom_notes: prevData.custom_notes.filter((_, i) => i !== index),
    }));
  };

  ///////////////////////////////////////////////////////////////////////////////////
  // const [ingredients, setIngredients] = useState([]);
  const [inputIngredientValue, setInputIngredientValue] = useState('');

  const handleIngredientInputChange = (event) => {
    setInputIngredientValue(event.target.value);
  };

  const handleIngredientInputKeyDown = (event) => {
    if (event.key === 'Enter' && inputIngredientValue.trim() !== '') {
      event.preventDefault();
      addIngredient(inputIngredientValue.trim());
    }
  };

  const addIngredient = (item) => {
    // setIngredients((prevItem) => [...prevItem, item]);
    setData((prevData) => ({
      ...prevData,
      ingredients: [...prevData.ingredients, item],
    }));
    setInputIngredientValue('');
  };

  const removeIngredient = (index) => {
    // setIngredients((prevItems) => prevItems.filter((_, i) => i !== index));
    setData((prevData) => ({
      ...prevData,
      ingredients: prevData.ingredients.filter((_, i) => i !== index),
    }));
  };

  //////////////////////////////////////////////////////////////////////////////
  // const [toppings, setToppings] = useState([]);
  const [inputToppingDescription, setInputToppingDescription] = useState('');
  const [inputToppingPrice, setInputToppingPrice] = useState('');

  const handleToppingDescriptionChange = (event) => {
    setInputToppingDescription(event.target.value);
  };

  const handleToppingPriceChange = (event) => {
    setInputToppingPrice(event.target.value);
  };

  const addTopping = () => {
    if (inputToppingDescription.trim() !== '' && inputToppingPrice.trim() !== '') {
      // setToppings((prevItems) => [
      //   ...prevItems,
      //   { description: inputToppingDescription.trim(), price: parseFloat(inputToppingPrice.trim()) },
      // ]);
      setData((prevData) => ({
        ...prevData,
        toppings: [
          ...prevData.toppings,
          { description: inputToppingDescription.trim(), price: parseFloat(inputToppingPrice.trim()) },
        ],
      }));
      setInputToppingDescription('');
      setInputToppingPrice('');
    }
  };

  const removeTopping = (index) => {
    // setToppings((prevItems) => prevItems.filter((_, i) => i !== index));
    setData((prevData) => ({
      ...prevData,
      toppings: prevData.toppings.filter((_, i) => i !== index),
    }));
  };

  //////////////////////////////////////////////////////////////////////////////


  useEffect(() => {
    if (mode !== "add") {
      console.log("mode entered", mode)
      API.get(`/restaurants/menu-items/${localStorage.getItem("itemSelectedId")}`)
        .then(response => {
          setData({
            ...response.data,
            ingredients: response.data.ingredients || [],
            toppings: response.data.toppings || [],
            custom_notes: response.data.custom_notes || [],
          });


          if (response.data.variant3_quantity) {
            setVariantCount(3)
          }
          else if (response.data.variant2_quantity) {
            setVariantCount(2)
          }
          else if (response.data.variant1_quantity) {
            setVariantCount(1)
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, []);

  const onFieldChange = (e, key) => {
    var temp = { ...data };
    if (["is_veg", "is_special"].includes(key)) {
      temp[key] = e.target.checked
    }
    else {
      temp[key] = e.target.value;
      // Automatically set offer_price when base_price is changed
      if (key === "base_price") {
        const basePrice = parseFloat(e.target.value);
        temp["offer_price"] = basePrice;
      }
    }
    setData(temp)
  }


  const [editorState, setEditorState] = useState()

  const onEditorStateChange = (newState) => {
    setEditorState(newState)


    var temp = { ...data };
    temp.description = newState.getCurrentContent().getPlainText();
    setData(temp)

  }



  const validateForm = (data) => {
    const errors = {};

    // Validate each field and add errors if necessary
    if (!data.name) {
      errors.name = "Product name is required.";
    }


    if (!data.description) {
      errors.description = "Description is required.";
    }

    // if (!data.regular_price || data.regular_price < 0.01) {
    //   errors.regular_price = "Should be a minimum of 0.01";
    // }

    if (!data.base_price || data.base_price < 0.01) {
      errors.base_price = "Should be a minimum of 0.01";
    }
    if (!data.offer_price || data.offer_price == 0.01) {
      errors.offer_price = "set offer price";
    }
    if (!data.offer_price || parseFloat(data.offer_price) > parseFloat(data.base_price)) {
      errors.offer_price = "Should be less than base price";
    }


    // if (data.discount === null || parseInt(data.discount) < 0) {
    //     console.log("discount is", data.discount)
    //     errors.discount = "Discount should be a number greater than or equal to 0.";
    // }
    // if (!data.discount_end_date) {
    //     errors.price = "This field should not be empty.";
    // }
    if (parseInt(data.category) === 0) {
      errors.category = "Please Choose a Category.";
    }
    if (parseInt(data.cuisine) === 0) {
      errors.cuisine = "Please choose a cuisine";
    }
    // no need of restaurant if role= restaurant
    if (localStorage.getItem('userRole') !== 'restaurant' && parseInt(data.restaurant) === 0) {
      errors.restaurant = "Please choose a restaurant";
    }
    if (parseInt(data.unit) === 0) {
      errors.unit = "Please choose a Unit";
    }
    if (!data.quantity || data.quantity < 0.01) {
      errors.quantity = "Quantity  should be a minimum of 0.01";
    }

    if (parseInt(data.unit) === 0) {
      errors.unit = "Please choose a unit";
    }



    return errors;
  };

  const validateImageCount = (data) => {
    const errors = {};
    if (!images.length > 0) {
      errors.image = "Minimum 1 image is required.";
    }
    return errors;
  };

  const post = (DATA) => {
    const validationErrors = validateForm(DATA);
    setFormErrors(validationErrors);
    console.log("validation Errors", validationErrors)
    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      API.post(`/restaurants/menu-items/`, DATA)
        .then(response => {
          // Handle the response
          setIsLoading(false);
          localStorage.setItem("itemSelectedId", response.data.id);
          setMessage("Food saved successfully.");
          setShowImageUploader(true)
        })
        .catch(error => {
          // Handle the error
          setMessage(error.response?.data?.message || error.message);
          setIsLoading(false);
          setIsErrorModalOpen(true)
        });

    }
  }

  const put = (DATA) => {

    const validationErrors = validateForm(DATA);

    setFormErrors(validationErrors);
    console.log(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      API.put(`/restaurants/menu-items/${window.localStorage.getItem("itemSelectedId")}/`, DATA)
        .then(response => {
          // Handle the response
          setIsLoading(false);
          setMessage("Product details updated successfully.");
          setShowImageUploader(true)
        })
        .catch(error => {
          // Handle the error
          setMessage(error.response?.data?.message || error.message);
          setIsLoading(false);
          setIsErrorModalOpen(true)
        });

    }
  }

  const putWithImageValidation = (DATA) => {
    const validationErrors = validateImageCount(DATA);

    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      API.put(`/restaurants/menu-items/${window.localStorage.getItem("itemSelectedId")}/`, DATA)
        .then(response => {
          // Handle the response

          setIsLoading(false);
          window.localStorage.setItem("itemSelectedId", null);
          if (DATA.is_published) {
            setMessage("Food item published successfully.");
          }
          else {
            setMessage("Food item saved as draft successfully.");

          }

          setIsMessageModalOpen(true);
        })
        .catch(error => {
          // Handle the error
          // console.error('Error saving Product:', error);
          setMessage(error.response?.data?.message || error.message);
          setIsLoading(false);
          setIsErrorModalOpen(true)
        });

    }
  }

  const handlesaveProduct = () => {
    var temp = { ...data };
    temp.is_published = false;
    if (restaurantId) {
      temp.restaurant = restaurantId
    }
    if (mode === "add") {
      post(temp);
    }
    else {
      put(temp);
    }

  }





  const handleSaveDraft = () => {
    // Create the API call for saving the draft
    var temp = { ...data };
    temp.is_published = false;
    if (restaurantId) {
      temp.restaurant = restaurantId
    }
    putWithImageValidation(temp);

  };

  const handlePublishProduct = () => {
    // Create the API call for publishing the product
    var temp = { ...data };
    temp.is_published = true;
    if (restaurantId) {
      temp.restaurant = restaurantId
    }

    putWithImageValidation(temp);
  };


  const handleDiscad = () => {

    navigate('/admin/menu-item/list')


  }





  return (

    <div className="page-body">
      <div className="container-fluid">
        <div className="card">
          <div className="card-header">
          </div>
          <div className="card-body">
            <div className="w-100" onSubmit={(event) => event.preventDefault()}>
              <div className="admin-panel-add-product-sec-1 container">
                <div className="row">
                  <div className="col-lg-6 card-header">
                    {mode == "add" ? <h5>Add Food</h5> : <h5>Edit Food</h5>}

                  </div>
                  {window.innerWidth > 768 ? <div className="col-lg-6 d-none">
                    <div className="d-flex justify-content-end mb-3 submit-btn-container">
                      <button className=" btn btn-small-dark" type="button" onClick={handleDiscad}>Cancel </button>
                      <button className=" btn save-button" type="button" onClick={handlesaveProduct}>{mode == "add" ? "Save Food" : "Update Food"}</button>
                    </div>
                  </div> : null}
                </div>

                {/* tabs */}
                <div className="row">
                  <div class="col-12">
                    <ul class="nav nav-pills flex-wrap mb-3" >
                      <li class="nav-item m-0" role="presentation">
                        <button class="nav-link active"
                          className={`nav-link ${activeTab === 'basic' ? 'active' : ''}`}
                          type="button"
                          onClick={() => setActiveTab('basic')} >
                          Basic </button>
                      </li>
                      <li class="nav-item m-0" role="presentation">
                        <button class="nav-link"
                          className={`nav-link ${activeTab === 'ingredients' ? 'active' : ''}`}
                          type="button"
                          onClick={() => setActiveTab('ingredients')} >
                          Ingredients </button>
                      </li>
                      <li class="nav-item m-0" role="presentation">
                        <button class="nav-link"
                          className={`nav-link ${activeTab === 'toppings' ? 'active' : ''}`}
                          type="button"
                          onClick={() => setActiveTab('toppings')} >
                          Toppings </button>
                      </li>
                      <li class="nav-item m-0" role="presentation">
                        <button class="nav-link"
                          className={`nav-link ${activeTab === 'custom_notes' ? 'active' : ''}`}
                          type="button"
                          onClick={() => setActiveTab('custom_notes')} >
                          Custom Notes</button>
                      </li>
                    </ul>
                  </div>

                </div>

                {/* Basic Details */}
                <div className={`row tab-content ${activeTab === 'basic' ? 'active' : 'd-none'}`}>
                  <div className="col-lg-7 ">
                    <div className="card p-4">
                      <div className="mb-2">
                        <label htmlFor="exampleFormControlInput1" className="form-label title-label">Food Name
                        </label>
                        <div className="d-flex w-100">
                          <input type="text" className="form-control form-control-sm" value={data.name} id="name" placeholder="Write product title" onChange={(e) => onFieldChange(e, "name")}></input>

                        </div>
                      </div>
                      {formFrrors.name && <div className="text-danger">{formFrrors.name}</div>}

                      {/* Check boxes */}
                      <div className="d-flex mb-2 mt-2">
                        <div className="halal-box">
                          <div>
                            <input
                              className="custom-checkbox"
                              type="checkbox"
                              name="text"
                              id={`is_veg`}
                              checked={data.is_veg}
                              onChange={(e) => onFieldChange(e, "is_veg")}
                            />
                            {/* <input type='checkbox' checked={data.is_veg} className='form-check' onChange={(e) => onFieldChange(e, "is_veg")}></input> */}
                          </div>
                          <div>
                            <img src="/images/admin-panel/veg-icon.svg"></img>
                            <span className="m-2" style={{ fontSize: "13px" }}>Veg</span>
                          </div>
                        </div>
                        <div className="halal-box ms-4">
                          <div>
                            <input
                              className="custom-checkbox"
                              type="checkbox"
                              name="text"
                              id={`is_special`}
                              checked={data.is_special}
                              onChange={(e) => onFieldChange(e, "is_special")}
                            />
                          </div>
                          <div>
                            <span className="m-2" style={{ fontSize: "13px" }}>Special</span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="exampleFormControlTextarea1" className="form-label title-label">Food Description</label>
                        <textarea type="text" className="form-control" value={data.description} id="description" placeholder="Write product description" onChange={(e) => onFieldChange(e, "description")}></textarea>
                        {formFrrors.description && <div className="text-danger">{formFrrors.description}</div>}

                      </div>
                      <div className="mb-3">
                        <label htmlFor="exampleFormControlTextarea1" className="form-label title-label">Pricing</label>
                        <div className="card inventory-card">
                          <div className="row w-100">
                            <div className="col-12 my-3">
                              <div className="row">

                                <div className="col-6">
                                  <label htmlFor="price" className="form-label">Base Price </label>
                                  <div className="d-flex align-items-center">
                                    <input type="number" min={0.01} step={0.01} className="form-control form-control-sm" id="base_price" name="base_price" placeholder="Enter Sales Price" value={data.base_price} onChange={(e) => onFieldChange(e, "base_price")}></input>
                                    {/* <span className="f-xxs w-100 ms-3 mb-0">Per Bag</span> */}
                                  </div>{formFrrors.base_price && <div className="text-danger">{formFrrors.base_price}</div>}
                                </div>
                                <div className="col-6">
                                  <label htmlFor="offerPrice" className="form-label">Offer Price</label>
                                  <input type="number" min={0.01} step={0.01} className="form-control form-control-sm" id="offerPrice" name="offerPrice" placeholder="Enter Offer Price" value={data.offer_price} onChange={(e) => onFieldChange(e, "offer_price")}></input>
                                  {formFrrors.offer_price && <div className="text-danger">{formFrrors.offer_price}</div>}
                                </div>
                              </div>
                              <div className="row d-none">
                                <div className="col-6">
                                  <label htmlFor="price" className="form-label">Stock </label>
                                  <div className="d-flex align-items-center">
                                    <input type="number" min={0} step={1} className="form-control form-control-sm" id="stock" name="stock" placeholder="Available stock" value={data.stock} onChange={(e) => onFieldChange(e, "stock")}></input>
                                    {/* <span className="f-xxs w-100 ms-3 mb-0">Per Bag</span> */}
                                  </div>{formFrrors.stock && <div className="text-danger">{formFrrors.stock}</div>}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {showImageUploader && <ImageUploader setterFunction={setImages} state={images} setLoading={setIsLoading} formFrrors={formFrrors} setFormErrors={setFormErrors} handlePublishProduct={handlePublishProduct} handleSaveDraft={handleSaveDraft}></ImageUploader>}



                  </div>
                  <div className="col-lg-5">
                    {/* <label class="form-check-label title-label">Organize</label> */}
                    <div className="card w-100">
                      <div className="row w-100">
                        {localStorage.getItem('userRole') !== 'restaurant' &&
                          <div className="col-12">
                            <div className="mb-3">
                              <label htmlFor="exampleFormControlInput1" className="form-label">Restaurant
                              </label>

                              <select class="form-select form-select-sm" aria-label=".form-select-sm example" value={data.restaurant} onChange={(e) => onFieldChange(e, "restaurant")}>
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
                        <div className="col-12">
                          <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Category
                            </label>
                            <select class="form-select form-select-sm" aria-label=".form-select-sm example" value={data.category} onChange={(e) => onFieldChange(e, "category")}>
                              <option value={0} selected>Select Category</option>
                              {categories && categories.results.map((item, index) => {
                                return (
                                  <option value={item.id} key={index}>{item.name}</option>
                                )
                              })}
                            </select>
                            {formFrrors.category && <div className="text-danger">{formFrrors.category}</div>}
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Cuisine
                            </label>

                            <select class="form-select form-select-sm" aria-label=".form-select-sm example" value={data.cuisine} onChange={(e) => onFieldChange(e, "cuisine")}>
                              <option value={0} selected>Select Cuisine</option>
                              {cuisines && cuisines.results.map((item, index) => {
                                return (
                                  <option value={item.id} key={index}>{item.name}</option>
                                )
                              })}
                            </select>
                            {formFrrors.cuisine && <div className="text-danger">{formFrrors.cuisine}</div>}
                          </div>
                        </div>

                        <div className="col-6">
                          <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Quantity
                            </label>
                            <input className="form-control form-control-sm" type="number" min={0.01} step={0.01} value={data.quantity} onChange={(e) => onFieldChange(e, "quantity")} ></input>
                            {formFrrors.quantity && <div className="text-danger">{formFrrors.quantity}</div>}
                            {/* {data.unit && data.unit!=0 && <span className="f-xxs">
                              Per {units && units.results.find(unit => unit.id === data.unit).name}
                            </span>} */}
                          </div>

                        </div>
                        <div className="col-6">
                          <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Unit
                            </label>
                            <select class="form-select form-select-sm" aria-label=".form-select-sm example" value={data.unit} onChange={(e) => onFieldChange(e, "unit")}>
                              <option value={0} selected>Select Unit</option>
                              {units && units.results.map((item, index) => {
                                return (
                                  <option value={item.id} key={index}>{item.name}</option>
                                )
                              })}
                            </select>
                            {formFrrors.unit && <div className="text-danger">{formFrrors.unit}</div>}</div>
                        </div>

                        <div className="col-12 mb-3">
                          {formFrrors.gross_weight && <div className="text-danger">{formFrrors.gross_weight}</div>}
                        </div>

                        <div className="col-12">
                          <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Spiciness Rank
                              <span>(Enter a number between 0 to 3)</span>
                            </label>
                            <input className="form-control form-control-sm" type="number" min={0} max={3} step={1} value={data.spiciness_rank} onChange={(e) => onFieldChange(e, "spiciness_rank")} ></input>
                            {formFrrors.spiciness_rank && <div className="text-danger">{formFrrors.spiciness_rank}</div>}
                          </div>
                        </div>


                      </div>
                    </div>

                  </div>

                  <div className="d-flex justify-content-center mb-3 submit-btn-container">
                    <button className=" btn btn-small-dark" type="button" onClick={handleDiscad}>Cancel </button>
                    <button className=" btn save-button" type="button" onClick={handlesaveProduct}>{mode == "add" ? "Save Food" : "Update Food"}</button>
                  </div>
                </div>
                {/* Toppings */}
                <div className={`row tab-content ${activeTab === 'toppings' ? 'active' : 'd-none'}`}>
                  <div className="card w-100 tags">
                    <div className="row w-100">
                      {/* Toppings */}
                      <div className="col-12">
                        <div className="mb-3">
                          <div className="">
                            <label>Toppings</label>
                          </div>
                          <div className="tag-select toppings">
                            <div className="row d-flex w-100 align-items-center mt-2">
                              <div className="col-md-8">
                                <input
                                  type="text"
                                  className="tag-input"
                                  value={inputToppingDescription}
                                  onChange={handleToppingDescriptionChange}
                                  placeholder="Enter topping name"
                                />
                              </div>
                              <div className="col-md-3 col-sm-6">
                                <input
                                  type="number"
                                  min={0.01} step={0.01}
                                  className="tag-input"
                                  value={inputToppingPrice}
                                  onChange={handleToppingPriceChange}
                                  placeholder="Price..."
                                />
                              </div>
                              <div className="col-md-1 col-sm-6">
                                <div className="add-btn" onClick={addTopping}>
                                  <img src="/images/icons/svg/add.svg" />
                                </div>
                              </div>
                            </div>
                            <div className="tags-container m-2">
                              {data.toppings && data.toppings.map((item, index) => (
                                <div key={index} className="tag topping">
                                  <span className="tag-label">{item.description} ( ₹{item.price} )</span>
                                  <span className="tag-remove" onClick={() => removeTopping(index)}>
                                    &times;
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* ingredients */}
                <div className={`row tab-content ${activeTab === 'ingredients' ? 'active' : 'd-none'}`}>
                  <div className="col-12">
                    <div className="card w-100 tags">
                      <div className="row w-100">
                        {/* Ingredients */}
                        <div className="col-12">
                          <div className="mb-3">
                            <div className="">
                              <label>Ingredients</label>
                            </div>
                            <div className="tag-select w-100">
                              <div className="tags-container">
                                <input
                                  type="text"
                                  className="tag-input w-100"
                                  value={inputIngredientValue}
                                  onChange={handleIngredientInputChange}
                                  onKeyDown={handleIngredientInputKeyDown}
                                  placeholder="Enter Ingredient..."
                                />{data.ingredients && data.ingredients.map((item, index) => (
                                  <div key={index} className="tag ingredient">
                                    <span className="tag-label">{item}</span>
                                    <span className="tag-remove" onClick={() => removeIngredient(index)}>
                                      &times;
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Customization Notes */}
                <div className={`row tab-content ${activeTab === 'custom_notes' ? 'active' : 'd-none'}`}>
                  <div className="col-12">
                    <div className="card w-100 tags">
                      <div className="row w-100">
                        {/* Customization Notes */}
                        <div className="col-12 ">
                          <div className="mb-3">
                            <div className="">
                              <label>Customization Notes</label>
                            </div>
                            <div className="tag-select w-100">
                              <div className="tags-container">
                                {data.custom_notes && data.custom_notes.map((item, index) => (
                                  <div key={index} className="tag ingredient">
                                    <span className="tag-label">{item}</span>
                                    <span className="tag-remove" onClick={() => removeCustomNotes(index)}>
                                      &times;
                                    </span>
                                  </div>
                                ))}
                                <input
                                  type="text"
                                  className="tag-input w-100"
                                  value={inputNotesValue}
                                  onChange={handleNotesInputChange}
                                  onKeyDown={handleNotesInputKeyDown}
                                  placeholder="Enter any special instructions for this food item."
                                />
                              </div>

                              <div className="mt-2 mb-2 ">
                                <div className="eg">Example:</div>
                                <div className="d-flex flex-wrap">
                                  {cookingInstructionTemplates.map((template, index) => (
                                    <button
                                      type="button"
                                      key={index}
                                      className="btn theme-outline btn-sm me-2 mt-1"
                                      onClick={() => handleTemplateClick(template)}
                                    >
                                      {template}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>


                        {/* reviews */}
                        <div className="mb-3 d-none">
                          <label htmlFor="exampleFormControlTextarea1" className="form-label title-label">Reviews</label>
                          <div className="d-flex flex-column justify-content-between w-100 review-btn-container">
                            <button className="btn btn-secondary" onClick={() => { navigate('/admin/reviews/list') }}>All Reviews</button>
                            <button className="btn btn-secondary" onClick={() => { navigate('/admin/reviews/list') }}>Positive Reviews</button>
                            <button className="btn btn-secondary" onClick={() => { navigate('/admin/reviews/list') }}>Hide Reviews</button>

                          </div>
                        </div>


                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  {window.innerWidth <= 768 ? <div className="col-lg-6">
                    <div className="d-flex justify-content-end mb-3 submit-btn-container">
                      <button className=" btn btn-small-dark" type="button" onClick={() => navigate('/admin/menu-item/list')}>Discard </button>
                      <button className=" btn btn-small-dark" type="button" onClick={handleSaveDraft}>Save Draft </button>
                      <button className=" btn btn-small-dark" type="button" onClick={handlePublishProduct}>Publish Food </button>
                    </div>
                  </div> : null}
                </div>
              </div>


            </div >
          </div>
        </div>
      </div>
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => { }} />
      {isMessagerModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => { navigate('/admin/menu-item/list') }} />}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>

  )
}

export default View;