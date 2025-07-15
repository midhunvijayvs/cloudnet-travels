import React from "react";
import { useEffect, useState } from "react";

import $, { error, event } from 'jquery';
import { useNavigate } from 'react-router-dom';

import ImageUploader from '../../common-components/ImageUploaderMenuItem/ImageUploaderMenuItem'
import API from '../../../API';
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";

import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"

import './MenuItemAdd.scss'
import { SEASONAL_MENU_OPTIONS } from "../../../Constants";
const View = ({ mode }) => {

  let navigate = useNavigate();

  const [data, setData] = useState({
    "name": null,
    "description": null,
    "base_price": 0.01,
    "category": 0,
    // "restaurant": 0,
    "cuisine": 0,
    "quantity": 1,
    "unit": 0,
    "is_published": false,
    "offer_price": null,
    "is_veg": false,
    "spiciness_rank": 0,
    "stock": 0,
    is_alcohol: false,
    is_available: true,
    is_seasonal: false,
    // ingredients: [],
    // toppings: [],
    // custom_notes: [],
    // variants: [],
    nutritions: [],
  });

  const [images, setImages] = useState([])

  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessagerModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [formFrrors, setFormErrors] = useState({});
  // const [toppingErrors, setToppingErrors] = useState({});
  const [nutritionErrors, setNutritionErrors] = useState({});
  // const [CustomNoteErrors, setCustomNoteErrors] = useState(null);
  // const [variantErrors, setVariantErrors] = useState(null);
  // const [newVariant, setNewVariant] = useState({ quantity_name: "", base_price: "", offer_price: "" });



  const [categories, setCategories] = useState(null);
  const [mealTimings, setMealTimings] = useState([
    { label: 'Breakfast', value: 'breakfast' },
    { label: 'Brunch', value: 'brunch', },
    { label: 'Lunch', value: 'lunch', },
    { label: 'Dinner', value: 'dinner', },
  ]);

  // const [restaurants, setRestaurants] = useState(null);
  const [brands, setBrands] = useState(null);
  const [subCategories, setSubCategories] = useState(null);
  const [units, setUnits] = useState(null);
  const [cuisines, setCuisines] = useState(null);
  // const [allergens, setAllergens] = useState(null);
  // const [restaurantId, setRestaurantId] = useState(null);
  const [isSellingAlcohol, setIsSellingAlcohol] = useState(false);
  const [cookingInstructionTemplates, setCookingInstructionTemplates] = useState([
    'No sugar', 'Add Lemon', 'Extra Souce',
  ]);


  const [showImageUploader, setShowImageUploader] = useState(false)

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])

  useEffect(() => {

    API.get('/restaurants/menu-categories/?page_size=100')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error(error);
      });

    // API.get('/user/allergies?page_size=100')
    //   .then(response => {
    //     setAllergens(response.data);
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   });


    API.get('/restaurants/units/?page_size=100')
      .then(response => {
        setUnits(response.data);
      })
      .catch(error => {
        console.error(error);
      });

    API.get('/restaurants/cuisines/?page_size=100')
      .then(response => {
        setCuisines(response.data);
      })
      .catch(error => {
        console.error(error);
      });

    if (localStorage.getItem('userRole') !== 'restaurant') {
      // API.get('/restaurants/?page_size=1000')
      //   .then(response => {
      //     setRestaurants(response.data);
      //   })
      //   .catch(error => {
      //     console.error(error);
      //   });
    } else {
      // set restaurant Id
      // API.get(`/restaurants/user-restaurant/${localStorage.getItem('userID')}`)
      //   .then(response => {
      //     setRestaurantId(response.data.id);
      //     setIsSellingAlcohol(response.data?.selling_alcohol || false)
      //   })
      //   .catch(error => {
      //     console.error(error);
      //   });
    }

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
  // const [inputNotesValue, setInputNotesValue] = useState('');

  // const handleNotesInputChange = (event) => {
  //   setInputNotesValue(event.target.value);
  // };

  // const handleNotesInputKeyDown = (event) => {
  //   setCustomNoteErrors(null)
  //   if (event.key === 'Enter' && inputNotesValue.trim() !== '') {
  //     event.preventDefault();
  //     addCustomNotes({ description: inputNotesValue.trim() });
  //   }
  // };
  // const handleNotesAddButton = (event) => {
  //   setCustomNoteErrors(null)
  //   if (inputNotesValue.trim() !== '') {
  //     event.preventDefault();
  //     addCustomNotes({ description: inputNotesValue.trim() });
  //   }
  // };

  // const handleTemplateClick = (template) => {
  //   addCustomNotes({ description: template.trim() });
  // };

  // const addCustomNotes = (item) => {
  //   setData((prevData) => {
  //     // Check for duplicate note
  //     const isDuplicate = prevData.custom_notes.some(
  //       (note) => note.description.toLowerCase() === item.description.toLowerCase()
  //     );
  //     if (isDuplicate) {
  //       setCustomNoteErrors('This note already exists!')
  //       return prevData; // Don't add duplicate
  //     }
  //     setCustomNoteErrors(null)
  //     return {
  //       ...prevData,
  //       custom_notes: [...prevData.custom_notes, item],
  //     };
  //   });

  //   setInputNotesValue('');
  // };


  // const removeCustomNotes = (index) => {
  //   setData((prevData) => ({
  //     ...prevData,
  //     custom_notes: prevData.custom_notes.filter((_, i) => i !== index),
  //   }));
  // };

  ///////////////////////////////////////////////////////////////////////////////////
  // const [ingredients, setIngredients] = useState([]);
  // const [inputIngredientValue, setInputIngredientValue] = useState('');
  // const [selectedAllergen, setSelectedAllergen] = useState({ id: 0, name: '' });
  // const [isAllergic, setIsAllergic] = useState(false);

  // const handleIngredientInputChange = (event) => {
  //   setInputIngredientValue(event.target.value);
  // };
  // const handleAllergenChange = (id, name) => {
  //   setSelectedAllergen({ id, name });
  // };

  // const addIngredient = () => {
  //   if (inputIngredientValue.trim() !== '') {
  //     setFormErrors({ ingredients: '' })
  //     if (isAllergic && selectedAllergen?.id === 0) {
  //       setFormErrors({ allergy: 'Please select allergen.' })
  //       return;
  //     } else {
  //       setFormErrors({ allergy: '' })
  //     }
  //     const newIngredient = {
  //       name: inputIngredientValue.trim(),
  //       ...(selectedAllergen?.id && { allergy: selectedAllergen?.id, allergy_details: selectedAllergen?.name }),
  //     };

  //     setData((prevData) => ({
  //       ...prevData,
  //       ingredients: [...prevData.ingredients, newIngredient],
  //     }));

  //     setInputIngredientValue('');
  //     setSelectedAllergen({ id: 0, name: '' });
  //     setIsAllergic(false)
  //   } else {
  //     setFormErrors({ ingredients: 'Enter ingredient.' })
  //   }
  // };

  // const removeIngredient = (index) => {
  //   setData((prevData) => ({
  //     ...prevData,
  //     ingredients: prevData.ingredients.filter((_, i) => i !== index),
  //   }));
  // };

  //////////////////////////////////////////////////////////////////////////////
  // const [toppings, setToppings] = useState([]);
  // const [inputToppingDescription, setInputToppingDescription] = useState('');
  // const [inputToppingPrice, setInputToppingPrice] = useState(null);

  // const handleToppingDescriptionChange = (event) => {
  //   setInputToppingDescription(event.target.value);
  // };

  // const handleToppingPriceChange = (event) => {
  //   const value = event.target.value;
  //   // Allow numbers with up to 2 decimal places
  //   if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
  //     setInputToppingPrice(value);
  //   }
  // };

  // const addTopping = () => {
  //   // if (inputToppingDescription.trim() !== '' && inputToppingPrice.trim() !== '') {
  //   if (inputToppingDescription.trim() !== '') {
  //     // setToppings((prevItems) => [
  //     //   ...prevItems,
  //     //   { description: inputToppingDescription.trim(), price: parseFloat(inputToppingPrice.trim()) },
  //     // ]);
  //     setToppingErrors({})
  //     setData((prevData) => ({
  //       ...prevData,
  //       toppings: [
  //         ...prevData.toppings,
  //         { description: inputToppingDescription.trim(), price: inputToppingPrice ? parseFloat(inputToppingPrice) : null },
  //       ],
  //     }));
  //     setInputToppingDescription('');
  //     setInputToppingPrice('');
  //   } else {
  //     const errors = {}
  //     if (!inputToppingDescription.trim()) {
  //       errors.toppingDescription = 'Enter description'
  //     }
  //     // if (!inputToppingPrice.trim()) {
  //     //   errors.toppingPrice = 'Enter price'
  //     // }
  //     setToppingErrors(errors)
  //   }
  // };

  // const removeTopping = (index) => {
  //   // setToppings((prevItems) => prevItems.filter((_, i) => i !== index));
  //   setData((prevData) => ({
  //     ...prevData,
  //     toppings: prevData.toppings.filter((_, i) => i !== index),
  //   }));
  //   setToppingErrors({})
  // };

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  const [inputNutritionName, setInputNutritionName] = useState('');
  const [inputNutritionValue, setNutritionValue] = useState('');

  const handleNutritionNameChange = (event) => {
    setInputNutritionName(event.target.value);
  };

  const handleNutritionValueChange = (event) => {
    const value = event.target.value;
    setNutritionValue(value);
  };

  const addNutrition = () => {
    const errors = {};
    const nutritionPattern = /^\d+(\.\d+)?\s?[a-zA-Z]+$/; // Number + optional space + unit

    if (!inputNutritionName.trim()) {
      errors.nutritionName = 'Enter attribute name';
    }

    if (!inputNutritionValue.trim()) {
      errors.nutritionValue = 'Enter value.';
    } else if (!nutritionPattern.test(inputNutritionValue.trim())) {
      errors.nutritionValue = "Invalid format (eg: 2mg, 15g)";
    }

    if (Object.keys(errors).length > 0) {
      setNutritionErrors(errors);
      return;
    }

    // If valid, add nutrition and reset errors
    setNutritionErrors({});
    setData((prevData) => ({
      ...prevData,
      nutritions: [
        ...prevData.nutritions,
        { attribute_name: inputNutritionName.trim(), value: inputNutritionValue.trim() },
      ],
    }));

    // Clear inputs
    setInputNutritionName('');
    setNutritionValue('');
  };


  const removeNutrition = (index) => {
    setData((prevData) => ({
      ...prevData,
      nutritions: prevData?.nutritions?.filter((_, i) => i !== index),
    }));
    setNutritionErrors({});
  };

  //////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (mode !== "add") {
      console.log("mode entered", mode)
      API.get(`/restaurants/menu-items/${localStorage.getItem("itemSelectedId")}`)
        .then(response => {
          setData({
            ...response.data,
            // ingredients: response.data.ingredient_details || [],
            // toppings: response.data.topping_details || [],
            // custom_notes: response.data.custom_template_details || [],
            nutritions: response.data.nutrition_details || [],
            // variants: response.data.variants_details || [],
          });
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, []);

  const onFieldChange = (e, key) => {
    var temp = { ...data };
    const value = e.target.value;

    if (["is_veg", "is_special", "is_alcohol", "is_seasonal"].includes(key)) {
      temp[key] = e.target.checked;
    }
    // Handling base_price and offer_price with validation
    else if (["base_price", "offer_price", "alcohol_content"].includes(key)) {
      // Allow numbers with up to 2 decimal places
      if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
        let floatValue = parseFloat(value);

        if (key === "alcohol_content") {
          if (value === "") {
            temp[key] = 0; // Set to 0 when cleared
          } else if (floatValue >= 0 && floatValue <= 100) {
            temp[key] = floatValue;
          }
        } else {
          temp[key] = value;
        }
      }
    }
    // Handling quantity with integer-only validation
    else if (key === "quantity") {
      if (value === "" || /^\d+$/.test(value)) {
        temp[key] = value; // Keep it as a string during input
      }
    }
    // Handling spiciness_rank (allow only 0 to 3 and auto-adjust if greater than 3)
    else if (key === "spiciness_rank") {
      if (/^\d+$/.test(value)) {
        const intValue = parseInt(value, 10);
        temp[key] = intValue > 3 ? 3 : intValue;
      } else if (value === "") {
        temp[key] = 0; // Allow empty value for clearing input
      }
    }
    // Handling other fields
    else {
      temp[key] = value;
    }

    setData(temp);
  };



  const handleMealTimeChange = (value) => {
    // Default to an empty array if meal_time is undefined
    let selectedValues = data.meal_time ? data.meal_time.split(",") : [];
    if (selectedValues.includes(value)) {
      selectedValues = selectedValues.filter((item) => item !== value);
    } else {
      selectedValues.push(value);
    }

    setData({ ...data, meal_time: selectedValues.length ? selectedValues.join(",") : undefined });
  };

  // Variants
  // Handle input change for the new variant row
  // const handleNewVariantChange = (event) => {
  //   const { name, value } = event.target;

  //   // Allow only numbers with up to 2 decimal places for price fields
  //   if (name === "base_price" || name === "offer_price") {
  //     if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
  //       setNewVariant({
  //         ...newVariant,
  //         [name]: value
  //       });
  //     }
  //   } else {
  //     setNewVariant({ ...newVariant, [name]: value });
  //   }
  // };


  // Add the new variant to the data.variants array
  // const handleAddVariant = () => {
  //   const { quantity_name, base_price, offer_price } = newVariant;

  //   // Check for required fields
  //   if (!quantity_name || !base_price) {
  //     setVariantErrors("Please fill in all required fields before adding.");
  //     return;
  //   }

  //   // Check if base_price is a valid number
  //   if (isNaN(parseFloat(base_price))) {
  //     setVariantErrors("Base price must be a valid number.");
  //     return;
  //   }

  //   // Check if offer_price is a valid number (if provided)
  //   if (offer_price && isNaN(parseFloat(offer_price))) {
  //     setVariantErrors("Offer price must be a valid number.");
  //     return;
  //   }

  //   // Validate offer price against base price
  //   if (
  //     offer_price &&
  //     parseFloat(offer_price) > parseFloat(base_price)
  //   ) {
  //     setVariantErrors("Offer price should be less than base price.");
  //     return;
  //   }

  //   // Clear any previous errors
  //   setVariantErrors("");

  //   // Update the data state with the new variant
  //   setData((prevData) => ({
  //     ...prevData,
  //     variants: [...prevData.variants, newVariant],
  //   }));

  //   // Clear the input fields after adding
  //   setNewVariant({ quantity_name: "", base_price: "", offer_price: "" });
  // };


  // Delete a variant from data.variants
  // const handleDeleteVariant = (index) => {
  //   setData((prevData) => ({
  //     ...prevData,
  //     variants: prevData.variants.filter((_, i) => i !== index),
  //   }));
  // };



  const validateForm = (data) => {
    const errors = {};

    // Validate each field and add errors if necessary
    if (!data.name) {
      errors.name = "Product name is required.";
    }


    if (!data.description) {
      errors.description = "Description is required.";
    }


    if (!data.base_price || data.base_price < 0.01) {
      errors.base_price = "Should be a minimum of 0.01";
    }
    if (!data.offer_price) {
      errors.offer_price = "set offer price";
    }
    else if (!data.offer_price || parseFloat(data.offer_price) > parseFloat(data.base_price)) {
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
    // if (!data.ingredients || data.ingredients.length <= 0) {
    //   errors.ingredients = "Please add ingredients";
    // }
    if (data?.is_seasonal && !data?.season) {
      errors.season = "Please select season.";
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
      console.log("validation success")
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

    } else {
      setMessage('All fields are required. Please complete the form.');
      setIsErrorModalOpen(true);
    }
  }


  const put = (DATA) => {

    const validationErrors = validateForm(DATA);

    setFormErrors(validationErrors);
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
    else {
      setMessage('All fields are required. Please complete the form.');
      setIsErrorModalOpen(true);
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
    console.log("save product fn entered")
    var temp = { ...data };
    // temp.is_published = false;
    // if (restaurantId) {
    //   temp.restaurant = restaurantId
    // }
    console.log(temp);


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
    // if (restaurantId) {
    //   temp.restaurant = restaurantId
    // }
    putWithImageValidation(temp);

  };

  const handlePublishProduct = () => {
    // Create the API call for publishing the product
    var temp = { ...data };
    temp.is_published = true;
    // if (restaurantId) {
    //   temp.restaurant = restaurantId
    // }

    putWithImageValidation(temp);
  };


  const handleDiscad = () => {
    navigate('/admin/menu-item/list')
  }





  return (

    <div className="page-body menu-item-add-page">
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
                  {window.innerWidth > 768 ? <div className="col-lg-6">
                    <div className="d-flex justify-content-end mb-3 submit-btn-container">
                      <button className=" btn btn-small-dark" type="button" onClick={handleDiscad}>Cancel </button>
                      <button className=" btn save-button" type="button" onClick={handlesaveProduct}>{mode == "add" ? "Save Food" : "Update Food"}</button>
                    </div>
                  </div> : null}
                </div>

                <div className="row">
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
                        <textarea type="text" className="form-control" rows={3} value={data.description} id="description" placeholder="Write product description" onChange={(e) => onFieldChange(e, "description")}></textarea>
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
                                    <input type="text" min={0.01} step={0.01} className="form-control form-control-sm" id="base_price" name="base_price" placeholder="Enter Sales Price" value={data.base_price} onChange={(e) => onFieldChange(e, "base_price")}></input>
                                    {/* <span className="f-xxs w-100 ms-3 mb-0">Per Bag</span> */}
                                  </div>{formFrrors.base_price && <div className="text-danger">{formFrrors.base_price}</div>}
                                </div>
                                <div className="col-6">
                                  <label htmlFor="offerPrice" className="form-label">Offer Price</label>
                                  <input type="text" min={0.01} step={0.01} className="form-control form-control-sm" id="offerPrice" name="offerPrice" placeholder="Enter Offer Price" value={data.offer_price} onChange={(e) => onFieldChange(e, "offer_price")}></input>
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
                      <div className="mb-3">
                        <div className="">
                          <div className="halal-box">
                            <div>
                              <input
                                className="custom-checkbox"
                                type="checkbox"
                                name="text"
                                id={`is_seasonal`}
                                checked={data.is_seasonal}
                                onChange={(e) => onFieldChange(e, "is_seasonal")}
                              />
                            </div>
                            <div>
                              <span className="m-2" style={{ fontSize: "13px" }}>
                                Is this is seasonal menu?
                              </span>
                            </div>
                          </div>
                        </div>
                        {data.is_seasonal &&
                          <div className="mt-2">
                            <select className="form-select form-select-sm" aria-label=".form-select-sm example" value={data.season} onChange={(e) => onFieldChange(e, "season")}>
                              <option value={''} selected>Select Season</option>
                              {SEASONAL_MENU_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            {formFrrors.season && <div className="text-danger">{formFrrors.season}</div>}

                          </div>
                        }
                      </div>
                    </div>

                    {showImageUploader && <ImageUploader mode={mode} setterFunction={setImages} state={images} setLoading={setIsLoading} formFrrors={formFrrors} setFormErrors={setFormErrors} handlePublishProduct={handlePublishProduct} handleSaveDraft={handleSaveDraft}></ImageUploader>}

                  </div>

                  <div className="col-lg-5">
                    {/* <label className="form-check-label title-label">Organize</label> */}
                    <div className="card w-100">
                      <div className="row w-100">
                        {/* {localStorage.getItem('userRole') !== 'restaurant' &&
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
                        } */}
                        {/* meal timing */}
                        <div className="col-12 mb-2">
                          <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Meal Type
                            </label>
                            <div className="d-flex flex-wrap">
                              {mealTimings.map((meal) => (
                                <div key={meal.value} className="p-1" style={{ width: "50%" }}>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id={meal.value}
                                      value={meal.value}
                                      checked={data.meal_time?.split(",").includes(meal.value) || false}
                                      onChange={() => handleMealTimeChange(meal.value)}
                                    />
                                    <label className="form-check-label" htmlFor={meal.value}>
                                      {meal.label}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {formFrrors.meal_time && <div className="text-danger">{formFrrors.meal_time}</div>}
                          </div>
                        </div>
                        {/* ALCOHOL */}
                        {isSellingAlcohol &&
                          <div className="d-flex mb-2">
                            <div className="halal-box">
                              <div>
                                <input
                                  className="custom-checkbox"
                                  type="checkbox"
                                  name="text"
                                  id={`is_alcohol`}
                                  checked={data.is_alcohol}
                                  onChange={(e) => onFieldChange(e, "is_alcohol")}
                                />
                              </div>
                              <div>
                                <span className="m-2" style={{ fontSize: "13px" }}>Alcohol</span>
                              </div>
                              {data.is_alcohol &&
                                <div>
                                  <input className="form-control form-control-sm alcohol-input" placeholder="Alcohol content %"
                                    name="alcohol_content"
                                    value={data.alcohol_content} onChange={(e) => onFieldChange(e, "alcohol_content")}
                                  />
                                  <div>
                                    %
                                  </div>
                                </div>
                              }
                            </div>
                          </div>
                        }

                        <div className="col-12">
                          <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Category
                            </label>
                            <select className="form-select form-select-sm" aria-label=".form-select-sm example" value={data.category} onChange={(e) => onFieldChange(e, "category")}>
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

                            <select className="form-select form-select-sm" aria-label=".form-select-sm example" value={data.cuisine} onChange={(e) => onFieldChange(e, "cuisine")}>
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
                            <input className="form-control form-control-sm" type="text" min={0.01} step={0.01} value={data.quantity} onChange={(e) => onFieldChange(e, "quantity")} ></input>
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
                            <select className="form-select form-select-sm" aria-label=".form-select-sm example" value={data.unit} onChange={(e) => onFieldChange(e, "unit")}>
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
                            <input className="form-control form-control-sm" type="text" min={0} max={3} step={1} value={data.spiciness_rank} onChange={(e) => onFieldChange(e, "spiciness_rank")} ></input>
                            {formFrrors.spiciness_rank && <div className="text-danger">{formFrrors.spiciness_rank}</div>}
                          </div>
                        </div>


                      </div>
                    </div>

                  </div>

                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="card w-100 tags">
                      <div className="row w-100">
                        {/* Variants */}
                        {/* <div className="col-12 mt-2  ">
                          <div className="sub-section first mb-3">
                            <div className="">
                              <label>Product Variants (Optional)</label>
                            </div>
                            <div className="variant-container">
                              {data.variants?.length > 0 && (
                                <div className="added-variants">
                                  {data.variants?.map((item, index) => (
                                    <div key={index} className="variant-row">
                                      <span>{item.quantity_name}</span>
                                      <span>Base Price: £{item.base_price}</span>
                                      <span>Offer Price: £{item.offer_price || item.base_price}</span>
                                      <button onClick={() => handleDeleteVariant(index)}>Delete</button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div className="input-container">
                                <input
                                  type="text"
                                  name="quantity_name"
                                  id="quantity_name"
                                  className="quantity_name"
                                  value={newVariant.quantity_name}
                                  onChange={handleNewVariantChange}
                                  placeholder="Enter quantity name (Eg:Half, Full)..."
                                  required
                                />
                                <input
                                  type="text"
                                  name="base_price"
                                  id="variant-base_price"
                                  value={newVariant.base_price}
                                  onChange={handleNewVariantChange}
                                  placeholder="Base Price..."
                                  required
                                />
                                <input
                                  type="text"
                                  name="offer_price"
                                  id="variant-offer_price"
                                  value={newVariant.offer_price}
                                  onChange={handleNewVariantChange}
                                  placeholder="Offer Price..."
                                />
                              </div>
                              {variantErrors &&
                                <p className="text-danger">{variantErrors}</p>
                              }
                              <div className="add-btn" onClick={handleAddVariant} >
                                Add Variant
                              </div>
                            </div>

                          </div>
                        </div> */}

                        {/* Ingredients */}
                        {/* <div className="col-12">
                          <div className="sub-section mb-3">
                            <div className="">
                              <label>Ingredients</label>
                            </div>
                            <div className="tag-select ingredient w-100">
                              <div className="tags-container ">
                                {data.ingredients && data.ingredients.map((item, index) => (
                                  <div key={index} className="tag ingredient">
                                    <div className="me-2">
                                      <div className="tag-label">{item.name}</div>
                                      {item.allergy &&
                                        <div className="allergy-name">
                                          [Allergen: {item.allergy_details}]
                                        </div>
                                      }
                                    </div>
                                    <span className="tag-remove" onClick={() => removeIngredient(index)}>
                                      <img src="/images/admin-panel/product/icon/close-circle.svg" />
                                    </span>
                                  </div>
                                ))}

                                <input
                                  type="text"
                                  className="tag-input w-100 mt-3"
                                  value={inputIngredientValue}
                                  onChange={handleIngredientInputChange}
                                  placeholder="Enter Ingredient..."
                                />
                                {formFrrors.ingredients && <div className="text-danger mb-2 mt-0">{formFrrors.ingredients}</div>}
                                <div className="halal-box">
                                  <div>
                                    <input
                                      className="custom-checkbox"
                                      type="checkbox"
                                      name="text"
                                      id={`allergic`}
                                      checked={isAllergic}
                                      onChange={(e) => {
                                        setIsAllergic(e.target.checked);

                                      }}
                                    />
                                  </div>

                                  <div>
                                    <span className="m-2" style={{ fontSize: "13px" }}>
                                      Does this ingredient contain allergens that might cause a reaction? If yes, please select the allergen.
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {isAllergic &&
                                <div className="mb-3">
                                  <label htmlFor="exampleFormControlInput1" className="form-label">Allergens
                                  </label>
                                  <select className="form-select form-select-sm" aria-label=".form-select-sm example"
                                    value={selectedAllergen?.id}
                                    onChange={(e) => {
                                      const selectedOption = allergens.results.find(item => item.id === parseInt(e.target.value));
                                      handleAllergenChange(selectedOption.id, selectedOption.name);
                                    }}
                                  >
                                    <option value={0} selected disabled>Select Allergen</option>
                                    {allergens && allergens.results.map((item, index) => {
                                      return (
                                        <option value={item.id} key={index}>{item.name}</option>
                                      )
                                    })}
                                  </select>
                                  {formFrrors.allergy && <div className="text-danger">{formFrrors.allergy}</div>}
                                </div>
                              }
                              <div className="d-flex justify-content-start mt-2">
                                <div className="add-btn " onClick={addIngredient} >
                                  Add <span className="ms-1">+</span>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div> */}

                        {/* Toppings */}
                        {/* <div className="col-12 mt-2">
                          <div className="sub-section mb-3">
                            <div className="">
                              <label>Toppings</label>
                            </div>
                            <div className="tag-select toppings">
                              <div className="row d-flex w-100 align-items-center mt-2">
                                <div className="col-md-7">
                                  <input
                                    type="text"
                                    className="tag-input"
                                    value={inputToppingDescription}
                                    onChange={handleToppingDescriptionChange}
                                    placeholder="Enter topping name..."
                                  />
                                  {toppingErrors.toppingDescription && <div className="position-absolute mt-0 text-danger">{toppingErrors.toppingDescription}</div>}
                                </div>
                                <div className="col-md-3 col-sm-6">
                                  <input
                                    type="text"
                                    min={0.01} step={0.01}
                                    className="tag-input"
                                    value={inputToppingPrice}
                                    onChange={handleToppingPriceChange}
                                    placeholder="Price..."
                                  />
                                  {toppingErrors.toppingPrice && <div className="position-absolute mt-0 text-danger">{toppingErrors.toppingPrice}</div>}
                                </div>
                                <div className="col-md-2 col-sm-6 d-flex justify-content-center">
                                  <div className="add-btn " onClick={addTopping} >
                                    Add <span className="ms-1">+</span>
                                  </div>
                                </div>
                              </div>
                              <div className="tags-container m-2 mt-3">
                                {data.toppings && data.toppings.map((item, index) => (
                                  <div key={index} className="tag topping">
                                    <span className="tag-label">
                                      {item.description}&nbsp;
                                      {item.price && `(Price: £${item.price} )`}
                                    </span>
                                    <span className="tag-remove" onClick={() => removeTopping(index)}>
                                      <img src="/images/admin-panel/product/icon/close-circle.svg" />
                                     
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div> */}

                        {/* Nutritions */}
                        <div className="col-12 mt-2">
                          <div className="sub-section mb-3">
                            <div className="">
                              <label>Nutritions</label>
                            </div>
                            <div className="tag-select toppings">
                              <div className="row d-flex w-100 align-items-center mt-2">
                                <div className="col-md-6">
                                  <input
                                    type="text"
                                    className="tag-input"
                                    value={inputNutritionName}
                                    onChange={handleNutritionNameChange}
                                    placeholder="Enter nutrition name..."
                                  />
                                  {nutritionErrors.nutritionName && <div className="position-absolute mt-0 text-danger">{nutritionErrors.nutritionName}</div>}
                                </div>
                                <div className="col-md-4 col-sm-6">
                                  <input
                                    type="text"
                                    className="tag-input"
                                    value={inputNutritionValue}
                                    onChange={handleNutritionValueChange}
                                    placeholder="Value with units(15g, 20kcal)..."
                                  />
                                  {nutritionErrors.nutritionValue && <div className="position-absolute mt-0 text-danger">{nutritionErrors.nutritionValue}</div>}
                                </div>
                                <div className="col-md-2 col-sm-6 d-flex justify-content-center">
                                  <div className="add-btn " onClick={addNutrition} >
                                    Add <span className="ms-1">+</span>
                                  </div>
                                </div>
                              </div>
                              <div className="tags-container m-2 mt-3">
                                {data.nutritions && data.nutritions.map((item, index) => (
                                  <div key={index} className="tag nutrition">
                                    <div className="tag-label">
                                      <div className="name">
                                        {item.attribute_name}
                                      </div>
                                      <div className="value"> {item.value} </div>
                                    </div>
                                    <span className="tag-remove" onClick={() => removeNutrition(index)}>
                                      <img src="/images/admin-panel/product/icon/close-circle.svg" />
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Customization Notes */}
                        {/* <div className="col-12 mt-2 ">
                          <div className="sub-section mb-3">
                            <div className="">
                              <label>Customization Notes</label>
                            </div>
                            <div className="tag-select w-100">
                              <div className="tags-container custom-notes">
                                {data.custom_notes && data.custom_notes.map((item, index) => (
                                  <div key={index} className="tag ingredient">
                                    <span className="tag-label">{item.description}</span>
                                    <span className="tag-remove" onClick={() => removeCustomNotes(index)}>
                                      <img src="/images/admin-panel/product/icon/close-circle.svg" />
                                    </span>
                                  </div>
                                ))}
                                <div className="d-flex mt-2">
                                  <input
                                    type="text"
                                    className="tag-input w-100"
                                    value={inputNotesValue}
                                    onChange={handleNotesInputChange}
                                    onKeyDown={handleNotesInputKeyDown}
                                    placeholder="Enter any special instructions for this food item."
                                  />

                                  <div className="add-btn " onClick={handleNotesAddButton} >
                                    Add <span className="ms-1">+</span>
                                  </div>
                                </div>
                                {CustomNoteErrors && <div className=" mt-0 text-danger">{CustomNoteErrors}</div>}

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
                        </div> */}

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