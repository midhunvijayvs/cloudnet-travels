import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import $ from 'jquery';
import './RestaurantInfo.scss'
import MultipleImageUploader from '../../common-components/MultipleImageUploader';
import { isValidPhoneNumber } from 'libphonenumber-js';
import PhoneInputField from '../../../authentication/pages/CustomPhone/CustomPhoneInput';
import MapLocationSelector from '../../../user-panel/common-components/MapLocationSelector/MapLocationSelector';
import RestaurantCharges from '../../../user-panel/common-components/RestaurantCharges/RestaurantCharges';
import RestaurantBankAdd from '../../../user-panel/common-components/RestaurantBankAdd/RestaurantBankAdd';
import Addresses from '../../../user-panel/common-components/Addresses/Addresses';
import CustomSearchSelectBox from '../../common-components/CustomSearchSelectBox/CustomSearchSelectBox';
import RichTextEditor from '../../common-components/RichText/RichText';


const RestaurantInfo = ({ mode }) => {

  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [cuisines, setCuisines] = useState([]);
  const [restaurantCuisines, setRestaurantCuisines] = useState([]);
  const [isRestaurantExist, setIsRestaurantExist] = useState(false);
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantUserId, setRestaurantUserId] = useState(null);
  const [workHoursExist, setworkHoursExist] = useState(false);

  const [workingHoursData, setWorkingHoursData] = useState([
    { day: "Sunday", opening_time: null, closing_time: null },
    { day: "Monday", opening_time: null, closing_time: null },
    { day: "Tuesday", opening_time: null, closing_time: null },
    { day: "Wednesday", opening_time: null, closing_time: null },
    { day: "Thursday", opening_time: null, closing_time: null },
    { day: "Friday", opening_time: null, closing_time: null },
    { day: "Saturday", opening_time: null, closing_time: null },
  ])
useEffect(()=>{
  console.log("workingHoursData",workingHoursData)
},[workingHoursData])

  const [images, setImages] = useState([])
  const [documentErrors, setDocumentErrors] = useState({});
  const [errors, setErrors] = useState([]);
  const [alcoholErrors, setAlcoholErrors] = useState("");
  const [imgGalleryToggle, setImgGalleryToggle] = useState(false) // for image_uploader



  const addressTabRef = useRef(null);
  const infoTabRef = useRef(null);
  const cuisineTabRef = useRef(null);
  const serviceTabRef = useRef(null);
  const chargesTabRef = useRef(null);
  const imageTabRef = useRef(null);
  const documentTabRef = useRef(null);
  const bankDetailsTabRef = useRef(null);
  const workHrsTabRef = useRef(null);



  // Location
  const [location, setLocation] = useState({ lat: 51.509865, lng: -0.118092 });
  const handleLocationSelect = (coords) => {
    setLocation(coords);
  };



  // const [setErrors, setErrors] = useState([]);
  const [knownForTemplates, setKnownForTemplates] = useState([
    "Signature Cocktails",
    "Gluten-Free Options",
    "Seasonal Menus",
    "Healthy Salads",
    "Home-Style Cooking",
    "Fusion Cuisine",
    "Spicy Dishes",
    "Live Music Nights",
  ]);

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])
  const [tabCompletion, setTabCompletion] = useState({
    restaurant_info: true,
    cuisines: false,
    images: false,
    services: false,
    working_hours: false,
    charges: false,
    documents: false,
    bank_details: false,
  })

  const initialData = {
    restaurant_info: {
      name: "",
      description: "",
      country_code: "",
      phone_number: "",
      known_for: "",
      pickup_instruction: "",
      is_branded_package_avaiable: false,
      is_eco_friendly_package_available: false,
    },
    cuisines: [],
    images: [],
    services: {
      luxury_dining: false,
      brunch: false,
      is_veg: false,
      take_away: false,
      table_booking: false,
      buffet: false,
      wallet_parking: false,
      outdoor_seating: false,
      cash_accepted: false,
      card_accepted: false,
      digital_payment_accepted: false,
    },
    working_hours: [
      { day: "Sunday", opening_time: null, closing_time: null },
      { day: "Monday", opening_time: null, closing_time: null },
      { day: "Tuesday", opening_time: null, closing_time: null },
      { day: "Wednesday", opening_time: null, closing_time: null },
      { day: "Thursday", opening_time: null, closing_time: null },
      { day: "Friday", opening_time: null, closing_time: null },
      { day: "Saturday", opening_time: null, closing_time: null },
    ],
    charges: {
      tax_rate: null,
      delivery_charge_per_mile: null,
      min_delivery_distance: null,
      max_delivery_radius: null,
      delivery_charge_per_mile: null,
      min_order_amount: null,
      preparation_time_required: null,
    },
    documents: [
      { name: "Business Registration Certificate", documentno: null, file: null, file_url: null },
      { name: "Health & Safety Certificate", documentno: null, file: null, file_url: null },
      { name: "Public Liability Insurance", documentno: null, file: null, file_url: null },
      { name: "Premises licence", documentno: null, file: null, file_url: null },
    ],
    bank_details: {},
    selling_alcohol: false,
    is_registration_completed: false,
  }

  const [data, setData] = useState(initialData);

  const handleInputChange = (key) => (e) => {
    const { name, type, checked, value } = e.target;
    // console.log(value, type);
    // Check if the field name requires numeric validation
    const isNumericField = ['min_delivery_distance', 'max_delivery_radius', 'min_delivery_charge',
      'delivery_charge_per_mile', 'outside_limit_radius',
      'outside_delivery_charge_per_mile', 'tax_rate', 'preparation_time_required',
      'min_order_amount', 'min_order_amount_for_free_delivery'].includes(name);

    // Parse the value based on field type and whether it should be numeric
    let parsedValue = value;
    if (isNumericField) {
      // Allow only numbers and at most one decimal point
      parsedValue = value.replace(/[^0-9.]/g, '');

      // Ensure only one decimal point is allowed
      const decimalCount = (parsedValue.match(/\./g) || []).length;
      if (decimalCount > 1) {
        parsedValue = parsedValue.slice(0, -1); // Remove extra decimal points
      }

      // Restrict integer part to max 3 digits and decimal part to 2 digits
      const [integerPart, decimalPart] = parsedValue.split('.');
      if (integerPart.length > 3) {
        parsedValue = integerPart.slice(0, 3) + (decimalPart !== undefined ? `.${decimalPart}` : '');
      }

      if (decimalPart !== undefined && decimalPart.length > 2) {
        parsedValue = `${integerPart}.${decimalPart.slice(0, 2)}`; // Keep only 2 decimal places
      }
    }

    // Handle sort code validation and formatting
    if (name === 'sort_code') {
      // Remove any non-digit characters except for hyphens
      const digitsOnly = parsedValue.replace(/[^\d]/g, '');
      // Automatically format the sort code as XX-XX-XX
      if (digitsOnly.length <= 6) {
        parsedValue = digitsOnly
          .replace(/(\d{2})(\d{2})(\d{2})/, '$1-$2-$3') // Auto-format
          .replace(/(\d{2})(\d{2})/, '$1-$2'); // Partial input for auto-formatting
      } else {
        // If more than 6 digits, just keep the first 6 and format
        parsedValue = digitsOnly.slice(0, 6)
          .replace(/(\d{2})(\d{2})(\d{2})/, '$1-$2-$3'); // Format the first 6 digits
      }
    }
    // Handle SWIFT code validation
    else if (name === 'swift_code') {
      // Allow only uppercase letters and digits
      parsedValue = parsedValue.toUpperCase().replace(/[^A-Z0-9]/g, '');
      // Limit to a maximum of 11 characters
      if (parsedValue.length > 11) {
        parsedValue = parsedValue.slice(0, 11);
      }
    }
    // Handle IBAN validation
    else if (name === 'iban') {
      // Allow only uppercase letters and digits
      parsedValue = parsedValue.toUpperCase().replace(/[^A-Z0-9]/g, '');

      // Limit to a maximum of 22 characters for UK IBAN
      if (parsedValue.length > 22) {
        parsedValue = parsedValue.slice(0, 22);
      }
    }

    setData((prevState) => ({
      ...prevState,
      [key]: {
        ...prevState[key],
        [name]: type === 'checkbox' ? checked : (type === 'radio' ? parsedValue === 'true' : parsedValue),
      },
    }));
  };

  // environmetal practices
  const handleEnvPracticeChange = (sectionId, content) => {
    setData((prevState) => ({
      ...prevState,
      ['restaurant_info']: {
        ...prevState['restaurant_info'],
        environmental_practices: content,
      },
    }));
  }
  // known for templates
  const handleTemplateClick = (template, tab, field) => {
    console.log(template, tab, field);
    setData((prevData) => ({
      ...prevData,
      [tab]: {
        ...prevData[tab],
        [field]: prevData[tab][field]
          ? `${prevData[tab][field]}\n${template}`
          : template
      }
    }));
  };

  // Success Alert
  const showSuccessAlert = () => {
    $(".success-alert").addClass("active")
    setTimeout(() => {
      $(".success-alert").removeClass("active")
    }, 1000);
  }

  // working hours
const handleWorkingHrChange = (day, type, value) => {
  setWorkingHoursData(prevData =>
    prevData.map(item =>
      item.day === day ? { ...item, [type]: value } : item
    )
  );
};


    useEffect(() => {
    setImages("workingHoursData:",workingHoursData)
  }, [workingHoursData]);

  useEffect(() => {
    setImages(data?.images || [])
  }, [data]);



  const [phoneData, setPhoneData] = useState({ phone_number: "", country_code: "" })
  // add phone info,Working Hours  to data when changes:
  useEffect(() => {
    setData(prevData => ({
      ...prevData,
      restaurant_info: {
        ...prevData.restaurant_info,
        phone_number: phoneData.phone_number,
        country_code: phoneData.country_code
      }
    }));
  }, [phoneData]);




  const loadCuisines = () => {
    setIsLoading(true)
    API.get(`/restaurants/cuisines/?page_size=100`)
      .then(response => {
        setCuisines(response.data);
        setIsLoading(false)
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
        setIsLoading(false)
      });
  }

  const loadDocuments = () => {
    if (restaurantId) {
      setIsLoading(true)
      API.get(`/restaurants/documents/?restaurant_id=${restaurantId}`)
        .then(response => {
          setIsLoading(false);
          const apiDocuments = response.data.results;
          // Update documents based on API response
          const updatedDocuments = data.documents.map(doc => {
            const foundDoc = apiDocuments.find(apiDoc => apiDoc.name === doc.name);
            return foundDoc
              ? { ...doc, id: foundDoc.id, documentno: foundDoc.documentno || null, file: foundDoc.file || null, file_url: foundDoc.file || null }
              : { name: doc.name, documentno: doc.documentno, file: null, file_url: null };; // Keep original if not found
          });
          setData(prevState => ({
            ...prevState,
            documents: updatedDocuments,
          }));
        })
        .catch(error => {
          setMessage(error.response?.data?.message || error.message);
          setIsErrorModalOpen(true);
          setIsLoading(false)
        });
    }
  }


  // const loadData = () => {

  //   setIsLoading(true)
  //   API.get(`/restaurants/${restaurantId}/`)
  //     .then(response => {
  //       const result = response.data || {};
  //       setRestaurantUserId(result.user)
  //       // location
  //       if (result.latitude && result.longitude) {
  //         setLocation({ lat: parseFloat(result.latitude), lng: parseFloat(result.longitude) })
  //       }

  //       // working hours
  //       if (result.working_hours.length == 7) {
  //         setworkHoursExist(true);
  //       }
  //       const defaultWorkingHours = data.working_hours;
  //       const updatedWorkingHours = defaultWorkingHours.map(hour => {
  //         const foundHour = result.working_hours.find(w => w.day === hour.day);
  //         return foundHour ? { ...hour, ...foundHour } : hour;
  //       });
  //       // cuisines
  //       setRestaurantCuisines(result.cuisines.map(cuisine => cuisine.cuisine))
  //       setData(prevState => ({
  //         ...prevState,
  //         restaurant_info: result.restaurant_info || {},
  //         cuisines: result.cuisines || [],
  //         images: result.images || [],
  //         services: result.services || {},
  //         working_hours: updatedWorkingHours,
  //         charges: result.charges || {},
  //         user: result.user || window.localStorage.getItem('userID'),
  //         primary_address: result.primary_address || null,
  //         selling_alcohol: result.selling_alcohol || false,
  //         is_registration_completed: result.is_registration_completed || false,
  //       }));
  //       setPhoneData({ phone_number: result.restaurant_info?.phone_number || "", country_code: result.restaurant_info?.country_code || "" })
  //       setIsLoading(false);
  //       // set tab button state
  //       const allWorkingHoursValid = result?.working_hours?.every(hour => hour.opening_time !== null && hour.closing_time !== null) || false;
  //       // console.log(result.cuisines);
  //       setTabCompletion(prevState => ({
  //         ...prevState,
  //         restaurant_info: result.restaurant_info?.name !== null,
  //         working_hours: allWorkingHoursValid,
  //         cuisines: result.cuisines?.length > 0,
  //         charges: result.charges?.delivery_charge_per_mile !== null,
  //       }));
  //     })
  //     .catch(error => {
  //       setMessage(error.response?.data?.message || error.message);
  //       setIsErrorModalOpen(true);
  //       setIsLoading(false)
  //     });


  // }

  const loadWorkingHoursData = () => {
    setIsLoading(true)
    API.get(`/restaurants/working_hours/bulk/`)

      .then(response => {
        console.log("working hours fetched:", response.data)
        if (response.data.length > 0) {
          setworkHoursExist(true);

          const defaultWorkingHours = [...workingHoursData];
          const updatedWorkingHours = defaultWorkingHours.map(hour => {
            const foundHour = response.data.find(w => w.day === hour.day);
            return foundHour ? { ...hour, ...foundHour } : hour;
          });

          setWorkingHoursData(updatedWorkingHours)
          setIsLoading(false)

        }
      }

      )

      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
        setIsLoading(false)
      });


  }


  const loadRestaurantImages = () => {
    if (restaurantId) {
      setIsLoading(true)
      API.get(`/restaurants/restaurant-images/?restaurant_id=${restaurantId}`)
        .then(response => {
          // Handle the response
          setImages(response.data.results)
          setIsLoading(false);
        })
        .catch(error => {
          // Handle the error
          setMessage(error.response?.data?.message || error.message)
          // setIsErrorModalOpen(true)
          setIsLoading(false);
        });
    }
  }

  // load data
  useEffect(() => {
   
    loadCuisines();
    // loadData();
    loadWorkingHoursData()
    loadDocuments();
    loadRestaurantImages();
  }, [restaurantId, isMessageModalOpen, mode]);


  const validatePhoneNumber = (phoneNumber, countryCode) => {
    try {
      const parsedPhoneNumber = isValidPhoneNumber(`+${phoneNumber}`, countryCode);
      return parsedPhoneNumber ? null : 'Invalid phone number';
    } catch (error) {
      return 'Invalid phone number';
    }
  };

  const validateForm = (data, tabName) => {
    const errors = {};
    if (tabName == 'restaurant_info') {
      if (!data.user) {
        errors.user = "Select User.";
      }
      if (!data.name || !data.name.trim()) {
        errors.restaurant_name = "Restaurant name is required.";
      }
      if (!data.description.trim()) {
        errors.description = "description is required.";
      }
      if (!data.phone_number.trim()) {
        errors.phone_number = "Phone number is required.";
      }
      else if (validatePhoneNumber(data.phone_number, data.country_code)) {
        errors.phone_number = 'Invalid phone number'
      }
    }
    if (tabName === 'charges') {
      // Helper function to validate if a value is a non-empty, valid number
      const validateNumberField = (value, fieldName) => {
        const strValue = String(value).trim();
        if (strValue === '') {
          errors[fieldName] = "Required.";
        } else if (isNaN(Number(strValue))) {
          errors[fieldName] = "Must be a valid number.";
        }
      };
      // Validate each field
      const fieldsToValidate = [
        'min_delivery_distance',
        'max_delivery_radius',
        'min_delivery_charge',
        'delivery_charge_per_mile',
        'tax_rate',
        'preparation_time_required',
        'min_order_amount',
        'min_order_amount_for_free_delivery'
      ];
      // if willing to deliver exceeded distance
      if (data.is_delivering_to_outside_limit) {
        fieldsToValidate.push(
          'outside_limit_radius',
          'outside_delivery_charge_per_mile'
        );
      }
      fieldsToValidate.forEach((field) => {
        const value = data[field];
        if (value === undefined || value === null || value === '' || validateNumberField(value) || value <= 0) {
          errors[field] = `must be a number greater than 0.`;
        }
      });
    }
    if (tabName === 'bank_details') {
      // account number (commonly 8digits)
      if (!data.account_no || !data.account_no.trim()) {
        errors.account_no = "Required.";
      } else if (!/^\d{8,10}$/.test(data.account_no)) {
        errors.account_no = "Account number must be between 8 and 10 digits.";
      }
      // account holder name (Alphabets)
      if (!data.account_holder_name || !data.account_holder_name.trim()) {
        errors.account_holder_name = "Required.";
      } else if (!/^[a-zA-Z\s]+$/.test(data.account_holder_name)) {
        errors.account_holder_name = "Only alphabets are allowed.";
      } else {
        const nameParts = data.account_holder_name.trim().split(/\s+/); // Split by one or more spaces
        if (nameParts.length < 2) {
          errors.account_holder_name = "Please enter both first and last name.";
        } else if (nameParts.some(part => part.length < 2)) {
          errors.account_holder_name = "Both first and last name must be at least 2 letters long.";
        }
      }
      // swift code (8-11 characters)
      if (!data.swift_code || !data.swift_code.trim()) {
        errors.swift_code = "Required.";
      } else if (!/^[A-Z0-9]{8,11}$/.test(data.swift_code)) {
        errors.swift_code = "SWIFT code must be 8 to 11 characters, consisting of letters and numbers.";
      }
      // Sort Code ( XX-XX-XX )
      if (!data.sort_code || !data.sort_code.trim()) {
        errors.sort_code = "Required.";
      } else if (!/^\d{2}-\d{2}-\d{2}$/.test(data.sort_code)) {
        errors.sort_code = 'Invalid sort code format. Please use XX-XX-XX.';
      }
      // IBAN (22 characters)
      if (!data.iban || !data.iban.trim()) {
        errors.iban = "Required.";
      } else if (!/^GB\d{2}[A-Z]{4}\d{14}$/.test(data.iban)) {
        errors.iban = "Invalid UK IBAN format.";
      }
    }


    return errors;
  };

  // submit Restaurant info, services, charges
  // const handleSaveMaindata = (tabName) => {
  //   let updateFormData;
  //   // Add user_id to the restaurant_info
  //   if (tabName == 'restaurant_info') {
  //     updateFormData = {
  //       ...data.restaurant_info,
  //       user: data.user
  //     };
  //   }
  //   else if (tabName == 'services') {
  //     updateFormData = {
  //       ...data.services,
  //     };
  //   }
  //   else if (tabName == 'charges') {
  //     updateFormData = {
  //       ...data.charges,
  //     };
  //   }

  //   const validationErrors = validateForm(updateFormData, tabName);
  //   setErrors(validationErrors);
  //   if (Object.keys(validationErrors).length > 0) {
  //     console.log(validationErrors);
  //     return;
  //   }

  //   // return;
  //   if (isRestaurantExist) {
  //     API.put(`/restaurants/${restaurantId}/`, updateFormData)
  //       .then(response => {
  //         // Handle the response 
  //         setIsLoading(false);
  //         // setMessage("Details updated successfully");
  //         // setIsMessageModalOpen(true)
  //         setTabCompletion(prevState => ({
  //           ...prevState,
  //           restaurant_info: true,
  //         }));

  //         // Switch to the Cuisine tab
  //         showSuccessAlert()
  //         if (tabName === 'restaurant_info') {
  //           if (addressTabRef.current) {
  //             addressTabRef.current.click();
  //           }
  //         } else if (tabName === 'services') {
  //           if (workHrsTabRef.current) {
  //             workHrsTabRef.current.click();
  //           }
  //         }
  //         else if (tabName === 'charges') {
  //           if (bankDetailsTabRef.current) {
  //             bankDetailsTabRef.current.click();
  //           }
  //         }

  //       })
  //       .catch(error => {
  //         // Handle the error
  //         console.error('Error saving restaurant:', error);
  //         setMessage(error.response?.data?.message || error.message)
  //         setIsLoading(false);
  //         setIsErrorModalOpen(true)
  //       });
  //   }
  //   else {
  //     API.post(`/restaurants/`, updateFormData)
  //       .then(response => {
  //         setRestaurantId(response.data.id)
  //         // Handle the response
  //         setIsLoading(false);
  //         showSuccessAlert()
  //         setTabCompletion(prevState => ({
  //           ...prevState,
  //           restaurant_info: true,
  //         }));
  //         loadData()
  //         localStorage.setItem('createdId', response.data.id);
  //         loadRestaurantExist();

  //         // Switch to the Cuisine tab
  //         if (addressTabRef.current) {
  //           addressTabRef.current.click();
  //         }
  //       })
  //       .catch(error => {
  //         // Handle the error
  //         console.error('Error saving restaurant:', error);
  //         setMessage(error.response?.data?.message || error.message)
  //         setIsLoading(false);
  //         setIsErrorModalOpen(true)
  //       });
  //   }

  // }
  // submit Working Hours
  const handleSaveWorkingHours = (tabName) => {
    
   const invalidHour = workingHoursData.find(hour => {
  return (
    
    (!hour.opening_time || !hour.closing_time)
  );
});

    if (invalidHour) {
      setMessage(`Please fill both opening and closing time for ${invalidHour.day}`);
      setIsErrorModalOpen(true);
      return;
    }
    if (workHoursExist) {
      setIsLoading(true)
      API.put(`/restaurants/working_hours/bulk/`, workingHoursData)
        .then(response => {
          // Handle the response
          setIsLoading(false);
          setMessage("Details updated successfully.");
          setIsMessageModalOpen(true)
          loadWorkingHoursData();
          if (chargesTabRef.current) {
            chargesTabRef.current.click();
          }

        })
        .catch(error => {
          // Handle the error
          setMessage(error.response?.data?.message || error.message)
          setIsLoading(false);
          setIsErrorModalOpen(true)
        });
    } else {
      setIsLoading(true)

      API.post(`/restaurants/working_hours/bulk/`, workingHoursData)
        .then(response => {
          // Handle the response
           setIsLoading(false);
          setMessage("Details updated successfully.");
          setIsMessageModalOpen(true)
          loadWorkingHoursData();
        })
        .catch(error => {
          // Handle the error
          setMessage(error.response?.data?.message || error.message)
          setIsLoading(false);
          setIsErrorModalOpen(true)
        });
    }
  }
  // submit Cuisine changes
  // const handleCuisineChange = (event, cuisineId) => {
  //   const isChecked = event.target.checked;
  //   // console.log(tabCompletion);
  //   // console.log(restaurantCuisines);
  //   if (isChecked) {
  //     setIsLoading(true)
  //     // Add the cuisine
  //     API.post('/restaurants/restaurant-cuisines/', { cuisine: cuisineId, restaurant: restaurantId })
  //       .then(response => {
  //         setIsLoading(false);
  //         loadData();
  //       })
  //       .catch(error => {
  //         // Handle the error
  //         setMessage(error.response?.data?.message || error.message)
  //         setIsLoading(false);
  //         setIsErrorModalOpen(true)
  //       });
  //   } else {
  //     setIsLoading(true)
  //     // Remove the cuisine
  //     const cuisineToDelete = data.cuisines.find(cuisine => cuisine.cuisine === cuisineId);
  //     API.delete(`/restaurants/restaurant-cuisines/${cuisineToDelete.id}/`)
  //       .then(response => {
  //         setIsLoading(false);
  //         loadData();
  //       }).catch(error => {

  //         setMessage(error.response?.data?.message || error.message)
  //         setIsLoading(false);
  //         setIsErrorModalOpen(true)
  //       });
  //   }
  // };

  // documents
  const handleDocumentInputChange = (index, field, value) => {
    const updatedDocuments = data.documents.map((doc, idx) => {
      if (idx === index) {
        return { ...doc, [field]: value };
      }
      return doc;
    });
    setData(prevState => ({
      ...prevState,
      documents: updatedDocuments,
    }));
  };

  const handleDocumentFileChange = (index, file) => {
    // Check if the filename exceeds 100 characters
    if (file.name.length > 100) {
      setDocumentErrors((prevErrors) => ({
        ...prevErrors,
        [index]: { ...prevErrors[index], file: 'Filename must be at most 100 characters.' },
      }));
      return; // Exit if the filename is too long
    }
    // Check if the file type is PDF
    if (file.type !== "application/pdf") {
      setDocumentErrors((prevErrors) => ({
        ...prevErrors,
        [index]: { ...prevErrors[index], file: 'Only PDF files are allowed.' },
      }));
      return; // Exit if the file is not a PDF
    }

    // Clear any previous file-related errors
    setDocumentErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (updatedErrors[index]) {
        delete updatedErrors[index].file;
      }
      return updatedErrors;
    });

    const updatedDocuments = data.documents.map((doc, idx) => {
      if (idx === index) {
        return { ...doc, file: file };
      }
      return doc;
    });

    setData(prevState => ({
      ...prevState,
      documents: updatedDocuments,
    }));
  };

  const validateDocumentErrors = (doc) => {
    const docErrors = {};
    let alcoholError = ""

    if (!doc.documentno || doc.documentno.trim() === '') {
      docErrors.document_no = 'Required.';
    }

    if (!doc.file || !(doc.file instanceof File)) {
      docErrors.file = 'Required.';
    }

    if (doc?.name === 'Premises licence') {
      console.log(data);

      if (doc.documentno && doc.file && data?.selling_alcohol !== true) {
        alcoholError = 'Must be enabled if providing Premises licence.';
      } else {
        alcoholError = ""
      }
    }

    return { docErrors, alcoholError };
  };


  const handleSaveDocument = (index) => {
    const documentData = data.documents[index];
    const errors = validateDocumentErrors(documentData);
    setAlcoholErrors(errors?.alcoholError)

    if (Object.keys(errors?.docErrors).length > 0) {
      // Update errors in state
      setDocumentErrors((prevErrors) => ({
        ...prevErrors,
        [index]: errors?.docErrors,
      }));
      return; // Stop execution if there are errors
    } else {
      setDocumentErrors({})
    }
    if (errors?.alcoholError) {
      return;
    }

    const formData = new FormData();
    formData.append('restaurant', restaurantId);
    formData.append('name', documentData.name);
    formData.append('documentno', documentData.documentno || '');
    formData.append('file', documentData.file);


    // const formData = new FormData();
    // formData.append('restaurant', restaurantId);
    // formData.append('name', documentData.name);
    // if (documentData.file && documentData.documentno) {
    //   formData.append('documentno', documentData.documentno || '');
    //   formData.append('file', documentData.file);
    // } else {
    //   setMessage('Please add all details')
    //   setIsErrorModalOpen(true)
    //   return
    // }

    setIsLoading(true);
    API.post('/restaurants/documents/', formData, {
      headers: { "Content-Type": "multipart/form-data", }
    })
      .then(response => {
        setIsLoading(false);
        // loadDocuments();
        // Update the specific document in state with API response
        const updatedDoc = response.data;
        // console.log(updatedDoc);

        setData((prevState) => {
          const updatedDocuments = prevState.documents.map((doc, idx) => {
            if (idx === index) {
              return {
                ...doc,
                id: updatedDoc.id,
                file: updatedDoc.file,
                file_url: updatedDoc.file,
              };
            }
            return doc;
          });
          return { ...prevState, documents: updatedDocuments };
        });
      })
      .catch(error => {
        // Handle the error
        setMessage(error.response?.data?.message || error.message)
        setIsLoading(false);
        setIsErrorModalOpen(true)
      });
  }
  // Delete uploaded document
  const handleDeleteDocument = (id) => {
    setIsLoading(true);
    API.delete(`/restaurants/documents/${id}/`)
      .then(response => {

        setIsLoading(false);
        loadDocuments();
      })
      .catch(error => {
        // Handle the error
        setMessage(error.response?.data?.message || error.message)
        setIsLoading(false);
        setIsErrorModalOpen(true)
      });
  }

  const handleSaveAddress = () => {
    if (location.lat === 51.509865 && location.lng === -0.118092) {
      setMessage('Please choose your restaurant location!')
      setIsErrorModalOpen(true);
      return;
    }
    if (!data.primary_address) {
      setMessage('Please add your restaurant address!')
      setIsErrorModalOpen(true);
      return;
    }
    else {
      const formData = { latitude: location.lat, longitude: location.lng }
      API.put(`/restaurants/${restaurantId}/`, formData)
        .then(response => {
          setIsLoading(false);
          // Switch to the Cuisine tab
          showSuccessAlert();
          if (cuisineTabRef.current) {
            cuisineTabRef.current.click();
          }
        })
        .catch(error => {
          setMessage(error.response?.data?.message || error.message)
          setIsLoading(false);
          setIsErrorModalOpen(true)
        });
    }


  }
  const handleSaveCuisine = () => {
    showSuccessAlert();
    if (imageTabRef.current) {
      imageTabRef.current.click();
    }
  }
  const handleSaveImages = () => {
    if (images?.length <= 0) {
      setMessage('Minimum one image is required!')
      setIsErrorModalOpen(true)
      return
    }
    showSuccessAlert();
    if (serviceTabRef.current) {
      serviceTabRef.current.click();
    }
  }

  // save bankdetails
  const handleSaveBankDetails = () => {
    const formData = data.bank_details;
    const validationErrors = validateForm(formData, 'bank_details');
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    if (!formData.id && restaurantUserId) {
      formData.user = restaurantUserId
    }
    setIsLoading(true);
    const method = formData.id ? 'put' : 'post';
    const url = formData.id
      ? `/payments/receiver-bank-details/${formData.id}/`
      : '/payments/receiver-bank-details/';

    API[method](url, formData)
      .then(response => {
        setIsLoading(false);
        showSuccessAlert();
        if (documentTabRef.current) {
          documentTabRef.current.click();
        }
      })
      .catch(error => {
        // Handle the error
        setMessage(error.response?.data?.message || error.message)
        setIsLoading(false);
        setIsErrorModalOpen(true)
      });
  }


  const handlCompleteRegButton = () => {
    // validation for alcohol selling
    if (
      data.is_registration_completed &&
      data?.selling_alcohol &&
      data?.documents.some(doc =>
        doc.name === "Premises licence" &&
        (!doc.documentno || doc.documentno === null) &&
        (!doc.file || doc.file === null)
      )
    ) {
      setAlcoholErrors('Premises licence document is required to sell alcohol.');
      return
    } else { setAlcoholErrors("") }

    API.put(`/restaurants/${restaurantId}/`, { is_registration_completed: true, selling_alcohol: data?.selling_alcohol })
      .then(response => {
        setIsLoading(false);
        if (localStorage.getItem('userRole') === 'admin') {
          setMessage('Registration successfully completed!');
        } else {
          if (data.is_registration_completed) {
            setMessage('Details updated! You will be notified with further information.');
          } else {
            setMessage('Registration completed! You will be informed once your account is verified.');
          }
        }
        setIsMessageModalOpen(true)
      })
      .catch(error => {
        // Handle the error
        setMessage(error.response?.data?.message || error.message)
        setIsLoading(false);
        setIsErrorModalOpen(true)
      });

  }

  const handlePDFView = (file) => {
    const fileId = file.id; // Get the file ID
    // navigate(`/admin/restaurant/pdf/${fileId}`)
    let newTabUrl = `${window.location.origin}/admin/restaurant/pdf/${fileId}`; // Full URL with fileId
    // if (resourseName === 'grocery_store'){
    //   newTabUrl = `${window.location.origin}/admin/grocery-store/pdf/${fileId}`; // Full URL with fileId
    // }
    window.open(newTabUrl, '_blank'); // Open the URL in a new tab without triggering an app reload
  };



  return (
    <>
      <div className="admin-restaurant-add-page page-body">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h5>
                {mode === 'edit' ? 'Edit Restaurant' : mode === 'add' ? 'Add Restaurant' : 'Restaurant Settings'}
              </h5>
            </div>
            <div className="card-body">
              <div className="row sec-2">
                <div className="col-xxl-3 col-xl-4">

                  <ul className="nav setting-main-box sticky theme-scrollbar" id="v-pills-tab" role="tablist"
                    aria-orientation="vertical">

                    {/* <li>
                      <button className="nav-link" id="Info-tab" data-bs-toggle="pill"
                        data-bs-target="#Info" role="tab"
                        aria-controls="Info" aria-selected="false" ref={infoTabRef}>
                        <i className="ri-information-2-line"></i>Restaurant Info</button>
                    </li>
                    <li>
                      <button className="nav-link" id="Address-tab" data-bs-toggle="pill"
                        data-bs-target="#Address" role="tab" aria-controls="Address"
                        aria-selected="false" disabled={!tabCompletion.restaurant_info} ref={addressTabRef}>
                        <i className="ri-map-pin-2-fill"></i>Address</button>
                    </li>
                    <li>
                      <button className="nav-link" id="Cuisine-tab" data-bs-toggle="pill"
                        data-bs-target="#Cuisine" role="tab" aria-controls="Cuisine"
                        aria-selected="false" disabled={!tabCompletion.restaurant_info} ref={cuisineTabRef}>
                        <i className="ri-restaurant-line"></i>Cuisine</button>
                    </li>

                    <li>
                      <button className="nav-link" id="Image-tab" data-bs-toggle="pill"
                        data-bs-target="#Image" role="tab" aria-controls="Image" onClick={() => setImgGalleryToggle(!imgGalleryToggle)}
                        aria-selected="false" disabled={!tabCompletion.restaurant_info} ref={imageTabRef}>
                        <i className="ri-image-circle-fill"></i> Image Gallery </button>
                    </li>
                    <li>
                      <button className="nav-link" id="Service-tab" data-bs-toggle="pill"
                        data-bs-target="#Service" role="tab" aria-controls="Service"
                        aria-selected="false" disabled={!tabCompletion.restaurant_info} ref={serviceTabRef}>
                        <i className="ri-customer-service-line"></i>Service</button>
                    </li> */}

                    <li>
                      <button className="nav-link active" id="Working-tab" data-bs-toggle="pill"
                        data-bs-target="#Working" role="tab" aria-controls="Working"
                        aria-selected="false" disabled={!tabCompletion.restaurant_info} ref={workHrsTabRef}>
                        <i className="ri-hourglass-2-fill"></i>Hours of Working</button>
                    </li>

                    {/* <li>
                      <button className="nav-link" id="delivery-tab" data-bs-toggle="pill"
                        data-bs-target="#delivery" role="tab" aria-controls="delivery"
                        aria-selected="false" disabled={!tabCompletion.restaurant_info} ref={chargesTabRef}>
                        <i className="ri-truck-line"></i>Charges</button>
                    </li>

                    {localStorage.getItem('userRole') !== 'restaurant' &&
                      <>
                        <li>
                          <button className="nav-link " id="bankDetails-tab"
                            data-bs-toggle="pill" data-bs-target="#bankDetails" role="tab"
                            aria-controls="bankDetails" aria-selected="true" disabled={!tabCompletion.restaurant_info} ref={bankDetailsTabRef}>
                            <i className="ri-bank-line"></i>Bank Details </button>
                        </li>
                      </>
                    }
                    <li >
                      <button className="nav-link " id="Legal-tab"
                        data-bs-toggle="pill" data-bs-target="#Legal" role="tab"
                        aria-controls="Legal" aria-selected="true" disabled={!tabCompletion.restaurant_info} ref={documentTabRef}>
                        <i className="ri-file-line"></i>Documents </button>
                    </li> */}


                  </ul>
                </div>
                <div className="col-xxl-9 col-xl-8 col-12">
                  <div className="restaurant-tab">

                    <div className="tab-content" id="v-pills-tabContent">

                      {/* <div className="tab-pane fade " id="Info" role="tabpanel"
                        aria-labelledby="Info-tab">
                        <div className="input-items">
                          <div className="row gy-3">
                            {localStorage.getItem('userRole') !== 'restaurant' &&
                              <div className="col-12">
                                <div className="input-box">
                                  <h6>User Account</h6>
                                  <CustomSearchSelectBox formData={data} setFormData={setData} resourceName={'user'}
                                    changeKey={'user'} apiGetUrl={`/user/verified-users/`} />
                                  {errors.user && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.user}</div>}
                                </div>
                              </div>
                            }
                            <div className="col-md-6">
                              <div className="input-box">
                                <h6>Restaurant Name</h6>
                                <input type="text" name="name" placeholder="Enter Restaurant Name"
                                  value={data.restaurant_info.name}
                                  onChange={handleInputChange('restaurant_info')} />
                                {errors.restaurant_name && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.restaurant_name}</div>}
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="input-box">
                                <h6>Phone</h6>
                                <PhoneInputField formData={phoneData} setFormData={setPhoneData} />
                                {errors.phone_number && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.phone_number}</div>}
                              </div>
                            </div>
                            <div className="col-md-6 d-none">
                              <div className="input-box">
                                <h6>Star Rating</h6>
                                <select
                                  className='form-select' style={{ padding: "15px" }}
                                  name="star_status"
                                  value={data.restaurant_info.star_status}
                                  onChange={handleInputChange('restaurant_info')}
                                >
                                  <option value={null} selected disabled>Select Rating</option>
                                  <option value={1}>1 Star</option>
                                  <option value={2}>2 Star</option>
                                  <option value={3}>3 Star</option>
                                  <option value={4}>4 Star</option>
                                  <option value={5}>5 Star</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="input-box">
                                <h6>Description</h6>
                                <textarea name="description" rows="3" placeholder="Enter Description"
                                  value={data.restaurant_info.description}
                                  onChange={handleInputChange('restaurant_info')} ></textarea>
                                {errors.description && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.description}</div>}
                              </div>
                            </div>
                           
                           
                            <div className="col-12">
                              <div className="input-box">
                                <div className='d-flex'>
                                  <h6>Known For</h6>
                                </div>
                                <textarea name="known_for" rows="3" placeholder="Known For"
                                  value={data.restaurant_info.known_for}
                                  onChange={handleInputChange('restaurant_info')} ></textarea>
                              </div>
                            </div>
                            <div className="mt-1 template">
                              {knownForTemplates.map((template, index) => (
                                <button
                                  type="button"
                                  key={index}
                                  className="theme-outline btn-sm me-2 mt-1 "
                                  onClick={() => handleTemplateClick(template, 'restaurant_info', 'known_for')}
                                >
                                  {template}
                                </button>
                              ))}
                            </div>
                            <div className="col-12">
                              <div className="input-box mt-2">
                                <h6>Pickup Instructions <span style={{ fontSize: "12px" }}>(mention instructions if applicable)</span></h6>
                                <textarea name="pickup_instruction" rows="3" placeholder="E.g., 'Pickup is from the reception area. Please call upon arrival.'"
                                  value={data.restaurant_info.pickup_instruction}
                                  onChange={handleInputChange('restaurant_info')} ></textarea>
                              </div>
                            </div>
                            <div className='row mt-3 checkox-container'>
                              <div className='col-md-6 input-box'>
                                <h6>Is Eco-Friendly Packaging Available?</h6>
                                <div className='radio-btn-group'>
                                  <label>
                                    <input type='radio' name='is_eco_friendly_package_available'
                                      checked={data.restaurant_info.is_eco_friendly_package_available === true}
                                      value={true}
                                      onChange={handleInputChange('restaurant_info')}
                                      className='custom-radio' />
                                    Yes
                                  </label>
                                  <label>
                                    <input type='radio' name='is_eco_friendly_package_available'
                                      checked={data.restaurant_info.is_eco_friendly_package_available === false}
                                      value={false}
                                      onChange={handleInputChange('restaurant_info')}
                                      className='custom-radio' />
                                    No
                                  </label>
                                </div>
                              </div>
                              <div className='col-md-6 input-box'>
                                <h6>Is Branded Packaging Available?</h6>
                                <div className='radio-btn-group'>
                                  <label>
                                    <input type='radio' name='is_branded_package_avaiable'
                                      checked={data.restaurant_info.is_branded_package_avaiable === true}
                                      value={true}
                                      onChange={handleInputChange('restaurant_info')}
                                      className='custom-radio' />
                                    Yes
                                  </label>
                                  <label>
                                    <input type='radio' name='is_branded_package_avaiable'
                                      checked={data.restaurant_info.is_branded_package_avaiable === false}
                                      value={false}
                                      onChange={handleInputChange('restaurant_info')}
                                      className='custom-radio' />
                                    No
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="col-12">
                              <div className="input-box">
                                <div className='d-flex'>
                                  <h6>Restaurant Story</h6>
                                </div>
                                <textarea name="restaurant_story" rows="4" placeholder="Share restaurant's origin, mission, values, and what makes it unique. This is the chance to tell us what inspired you to start this restaurant and what you hope to achieve."
                                  value={data.restaurant_info.restaurant_story}
                                  onChange={handleInputChange('restaurant_info')} ></textarea>
                              </div>
                            </div>

                            <div className="col-12">
                              <div className="input-box">
                                <div className='d-flex'>
                                  <h6>Environmental Practices </h6>
                                </div>
                                <RichTextEditor
                                  sectionId={1}
                                  placeholder="Share your restaurant's sustainability efforts, eco-friendly initiatives, and commitment to the environment. Highlight practices such as waste reduction, sourcing locally, or using recyclable materials."
                                  onContentChange={handleEnvPracticeChange}
                                  initialContent={isRestaurantExist ? data.restaurant_info.environmental_practices
                                    : JSON.stringify({ blocks: [], entityMap: {} })}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 d-flex justify-content-center mt-2">
                          <button onClick={() => handleSaveMaindata('restaurant_info')} className="btn restaurant-button mt-1">Save and Proceed</button>
                        </div>
                      </div>

                      <div className="tab-pane fade show" id="Address" role="tabpanel"
                        aria-labelledby="Address-tab">
                        <div className="input-box row">
                          <div className='col-lg-6'>
                            {restaurantUserId &&
                              <Addresses resourceName={'restaurant'} userId={restaurantUserId} loadMainData={loadData} />
                            }
                          </div>
                          <div className='col-lg-6'>
                            <div className='location-selection'>
                              {location &&
                                <>
                                  <MapLocationSelector center={location} onSelect={handleLocationSelect} />
                                  {location.lat !== 51.509865 || location.lng !== -0.118092 && (
                                    <div className='d-flex mt-3 selected-location'>
                                      <span className='me-3'>Latitude: {location.lat}</span>
                                      <span>Longitude: {location.lng}</span>
                                    </div>
                                  )}
                                </>
                              }
                            </div>
                          </div>
                        </div>
                        <div className="col-12 d-flex justify-content-center">
                          <button onClick={() => handleSaveAddress()} className="btn restaurant-button mt-1">Save and Proceed</button>
                        </div>
                      </div>

                      <div className="tab-pane fade" id="Image" role="tabpanel"
                        aria-labelledby="Image-tab">

                        <MultipleImageUploader imgGalleryToggle={imgGalleryToggle} state={images} setterFunction={setImages} setLoading={setIsLoading} setFormErrors={setErrors} formFrrors={errors} restaurantId={restaurantId} />
                        
                        <div className="col-12  d-flex justify-content-center mt-2">
                          <button onClick={() => handleSaveImages()} className="btn restaurant-button mt-1">Save and Proceed</button>
                        </div>
                      </div>
 
                      <div className="tab-pane fade" id="Service" role="tabpanel"
                        aria-labelledby="Service-tab">
                        <div className="service-box">
                          <div className="row gy-4">
                            <div className="col-md-6">
                              <div className="service-item">
                                <input className="custom-checkbox" id="is_veg" type="checkbox" name="is_veg"
                                  checked={data.services.is_veg}
                                  onChange={handleInputChange('services')} />
                                <label for="is_veg">Vegetarian</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="service-item">
                                <input className="custom-checkbox" id="gluten_free" type="checkbox" name="gluten_free"
                                  checked={data.services.gluten_free}
                                  onChange={handleInputChange('services')} />
                                <label for="gluten_free">Gluten-Free</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="service-item">
                                <input className="custom-checkbox" id="luxury_dining" type="checkbox" name="luxury_dining"
                                  checked={data.services.luxury_dining}
                                  onChange={handleInputChange('services')} />
                                <label for="luxury_dining">Luxury Dining</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="service-item">
                                <input className="custom-checkbox" id="table_booking" type="checkbox" name="table_booking"
                                  checked={data.services.table_booking}
                                  onChange={handleInputChange('services')} />
                                <label for="table_booking">Table Booking</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="service-item">
                                <input className="custom-checkbox" id="outdoor_seating" type="checkbox" name="outdoor_seating"
                                  checked={data.services.outdoor_seating}
                                  onChange={handleInputChange('services')} />

                                <label for="outdoor_seating">Outdoor Seating</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="service-item">
                                <input className="custom-checkbox" id="breakfast" type="checkbox" name="breakfast"
                                  checked={data.services.breakfast}
                                  onChange={handleInputChange('services')} />
                                <label for="breakfast">Breakfast</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="service-item">
                                <input className="custom-checkbox" id="brunch" type="checkbox" name="brunch"
                                  checked={data.services.brunch}
                                  onChange={handleInputChange('services')} />
                                <label for="brunch">Brunch</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="service-item">
                                <input className="custom-checkbox" id="take_away" type="checkbox" name="take_away"
                                  checked={data.services.take_away}
                                  onChange={handleInputChange('services')} />
                                <label for="take_away">Take Away Option</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="service-item">
                                <input className="custom-checkbox" id="buffet" type="checkbox" name="buffet"
                                  checked={data.services.buffet}
                                  onChange={handleInputChange('services')} />
                                <label for="buffet">Buffet</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="service-item">
                                <input className="custom-checkbox" id="cash_accepted" type="checkbox" name="cash_accepted"
                                  checked={data.services.cash_accepted}
                                  onChange={handleInputChange('services')} />
                                <label for="cash_accepted">Cash Accepted</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="service-item">
                                <input className="custom-checkbox" id="card_accepted" type="checkbox" name="card_accepted"
                                  checked={data.services.card_accepted}
                                  onChange={handleInputChange('services')} />
                                <label for="card_accepted">Card Accepted</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="service-item">
                                <input className="custom-checkbox" id="digital_payment_accepted" type="checkbox" name="digital_payment_accepted"
                                  checked={data.services.digital_payment_accepted}
                                  onChange={handleInputChange('services')} />
                                <label for="digital_payment_accepted">Digital Payment Accepted</label>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="service-item">
                                <input className="custom-checkbox" id="wallet_parking" type="checkbox" name="wallet_parking"
                                  checked={data.services.wallet_parking}
                                  onChange={handleInputChange('services')} />
                                <label for="wallet_parking">Wallet Parking</label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12  d-flex justify-content-center mt-2">
                          <button onClick={() => handleSaveMaindata('services')} className="btn restaurant-button mt-1">Save and Proceed</button>
                        </div>
                      </div>

                      <div className="tab-pane fade" id="Cuisine" role="tabpanel"
                        aria-labelledby="Cuisine-tab">
                        <div className="service-box">
                          <div className="row gy-4">
                            {cuisines && cuisines.results && cuisines.results.map((item) => (
                              <div className="col-md-6">
                                <div className="service-item">
                                  <input className="custom-checkbox"
                                    id={`category-${item.id}`}
                                    type="checkbox"
                                    name={item.name}
                                    checked={restaurantCuisines.includes(item.id)}
                                    onChange={event => handleCuisineChange(event, item.id)} />
                                  <label htmlFor={`category-${item.id}`}>{item.name}</label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="col-12  d-flex justify-content-center mt-2">
                          <button onClick={() => handleSaveCuisine()} className="btn restaurant-button mt-1">Save and Proceed</button>
                        </div>
                      </div> */}

                      <div className="tab-pane fade show active" id="Working" role="tabpanel"
                        aria-labelledby="Working-tab">
                        <div className="input-items">
                          <div className="row gy-3">
                            <div className="col-12">
                              <div className="input-box ">
                                <h6>Hours of Working</h6>
                                {/* <span className="choose-img-box" data-bs-toggle="modal" data-bs-target="#add-hours" title="Quick View" tabIndex="0">
                                  <i className="ri-add-circle-line"></i>
                                  Add Working Hours </span> */}
                                <table className="table table-bordered">
                                  <thead>
                                    {/* <tr>
                                    <th scope="col">Document Name</th>
                                    <th scope="col">Document Number</th>
                                    <th scope="col">File</th>
                                  </tr> */}
                                  </thead>
                                  <tbody>
                                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => {
                                      const hours = workingHoursData.find((hour) => hour.day === day) || {};
                                      const isOffDay = hours.is_closed || false; // Adjust based on your data model

                                      return (
                                        <tr key={day}>
                                          <td>
                                            <input type="text" name="doc_name" placeholder={day} disabled />
                                          </td>
                                          <td>
                                            <input
                                              type="time"
                                              name="opening_time"
                                              value={hours.opening_time?.substring(0, 5) || ""}
                                              onChange={(e) =>
                                                handleWorkingHrChange(day, "opening_time", e.target.value)
                                              }
                                              disabled={isOffDay}
                                            />
                                          </td>
                                          <td>
                                            <input
                                              type="time"
                                              name="closing_time"
                                              value={hours.closing_time?.substring(0, 5) || ""}
                                              onChange={(e) =>
                                                handleWorkingHrChange(day, "closing_time", e.target.value)
                                              }
                                              disabled={isOffDay}
                                            />
                                          </td>
                                          <td>
                                            <div className="checkbox-container work-hrs">
                                              <input
                                                className="custom-checkbox"
                                                type="checkbox"
                                                id={`offday-${day.toLowerCase()}`}
                                                name={day}
                                                checked={isOffDay}
                                                onChange={(e) =>
                                                  handleWorkingHrChange(day, "is_closed", e.target.checked)
                                                }
                                              />
                                              Off Day
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>

                                </table>
                              </div>
                              <div className="col-12  d-flex justify-content-center mt-2">
                                <button onClick={() => handleSaveWorkingHours('working_hours')} className="btn restaurant-button mt-1">Save</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* <div className="tab-pane fade" id="Restaurant" role="tabpanel"
                        aria-labelledby="Restaurant-tab">
                        <div className="service-box">
                          <div className="row gy-4">
                            <div className="col-12">
                              <div className="service-item">
                                <input className="custom-checkbox" id="category9" type="radio" name="text" />
                                <label for="category9">Active</label>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="service-item">
                                <input className="custom-checkbox" id="category10" type="radio" name="text" />
                                <label for="category10">Inactive</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="tab-pane fade" id="Feature" role="tabpanel"
                        aria-labelledby="Feature-tab">
                        <div className="input-items">
                          <div className="row gy-3">
                            <div className="col-md-6">
                              <div className="input-box">
                                <h6>Opening Time</h6>
                                <input type="time" name="text" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="input-box">
                                <h6>Closing Time</h6>
                                <input type="time" name="text" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="input-box">
                                <h6>Cost</h6>
                                <input type="number" name="number" />
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="input-box">
                                <h6>Image</h6>
                                <span className="choose-img-box" data-bs-toggle="modal" data-bs-target="#select-img" title="Quick View" tabIndex="0">
                                  <i className="ri-add-circle-line"></i>
                                  Choose image </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="tab-pane fade" id="delivery" role="tabpanel"
                        aria-labelledby="delivery-tab">

                        <RestaurantCharges data={data} handleInputChange={handleInputChange} errors={errors} saveFunction={() => handleSaveMaindata('charges')} />
                       
                      </div>

                      <div className="tab-pane fade" id="Legal" role="tabpanel"
                        aria-labelledby="Legal-tab">
                        <div className="input-items">
                          <div className="row gy-3">
                            <div className="col-12">
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th scope="col">Document Name</th>
                                    <th scope="col">Document Number</th>
                                    <th scope="col">File</th>
                                    <th scope="col"></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {data.documents && data.documents.map((doc, index) => (
                                    (
                                      <tr key={index}>
                                        <td>
                                          <div className='doc-value'
                                          >
                                            {doc.name}
                                          </div>
                                        </td>
                                        <td className='docnum-col'>
                                          {doc.file_url ? (
                                            <div className='doc-value'>
                                              {doc.documentno}
                                            </div>
                                          ) : (
                                            <>
                                              <input
                                                type="text"
                                                name="documentno"
                                                placeholder=""
                                                value={doc.documentno}
                                                disabled={doc.file_url ? true : false}
                                                onChange={(e) => handleDocumentInputChange(index, 'documentno', e.target.value)}
                                              />
                                              {documentErrors[index]?.document_no && <div className="text-danger">{documentErrors[index].document_no}</div>}
                                            </>
                                          )}
                                        </td>
                                        <td className='file-col'>
                                          {doc.file_url ? (
                                            <input
                                              type="text"
                                              name="file"
                                              value={
                                                doc.file
                                                  ? doc.file.split('/').pop().replace(/\.enc$/, '')
                                                  : ''
                                              }
                                              disabled={true}
                                            />
                                          ) : (
                                            <>
                                              <input
                                                type="file"
                                                name="file"
                                                accept=".pdf"
                                                value={doc.filename}
                                                onChange={(e) => handleDocumentFileChange(index, e.target.files[0])}
                                              />
                                              {documentErrors[index]?.file && <div className="text-danger">{documentErrors[index].file}</div>}
                                            </>
                                          )}
                                        </td>
                                        <td>
                                          <div className='d-flex justify-content-center w-100'>
                                            {doc.id ? (
                                              (data.is_registration_completed && localStorage.getItem('userRole') === 'restaurant') ? (
                                                <button className='btn restaurant-button'
                                                  onClick={() => handlePDFView(doc)} >
                                                  <i className="ri-eye-line"></i>
                                                </button>
                                              ) : (
                                                <button className='btn restaurant-button delete-btn' onClick={() => handleDeleteDocument(doc.id)}>
                                                  <i className="ri-delete-bin-line"></i>
                                                </button>
                                              )
                                            ) : (
                                              <button className='btn restaurant-button' onClick={() => handleSaveDocument(index)}>Save</button>
                                            )}

                                          </div>
                                        </td>
                                      </tr>
                                    )
                                  ))}
                                  <tr>
                                    <td colSpan={4}>
                                      <div className='checkbox-container'>
                                        <input class="custom-checkbox" checked={data?.selling_alcohol} id="category-8" type="checkbox" name="selling_alcohol"
                                          onChange={(e) => setData((prev) => ({ ...prev, selling_alcohol: e.target.checked }))}
                                        />
                                        Is providing alcohol?
                                      </div>
                                      {alcoholErrors && <div className="text-danger">{alcoholErrors}</div>}

                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              {(data.is_registration_completed && localStorage.getItem('userRole') === 'restaurant') &&
                                <p className='doc-info'>You can't update the documents as your verification has been completed by the admin. If you need to replace any document, please contact the admin.</p>
                              }
                            </div>

                          </div>
                        </div>
                        <div className="col-12 d-flex justify-content-center mt-2">
                          <button className="btn restaurant-button mt-1" onClick={handlCompleteRegButton}>Complete Registration</button>
                        </div>
                      </div>

                      <div className="tab-pane fade" id="bankDetails" role="tabpanel"
                        aria-labelledby="bankDetails-tab">

                        <RestaurantBankAdd isVerified={false} restaurantId={restaurantId} userId={restaurantUserId} setData={setData} data={data} handleInputChange={handleInputChange} errors={errors} saveFunction={handleSaveBankDetails} />
                        
                      </div> */}

                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='success-alert'>
              <div className='text'>Details saved successfully!</div>
            </div>
          </div>
        </div>

      </div>



      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}

      {isLoading && <FixedOverlayLoadingSpinner />}
    </>

  )
}

export default RestaurantInfo