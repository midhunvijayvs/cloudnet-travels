import React, { useState, useEffect, useRef } from 'react';
import './MultipleImageUploaderGrocery.scss';
import axios from 'axios';
import API from '../../../API';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../ErrorModal';

const MultipleImageUploaderGrocery = ({ state, setterFunction, setLoading, formFrrors,imgGalleryToggle, setFormErrors, restaurantId }) => {

  let navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const authToken = localStorage.getItem('accessToken')

  const [errorMessage, setErrorMessage] = useState("");

  // Clear errorMessage when the Image tab opens
  useEffect(() => {
    // console.log('clearing');
    setErrorMessage(""); // Clear the error message
  }, [imgGalleryToggle]);

  const loadData = () => {
    // console.log(window.localStorage.getItem('itemSelectedId'));
    if (window.localStorage.getItem('itemSelectedId') !== null) {
      setLoading(true);
      API.get(`/grocery/grocery-images/?grocerystore_id=${window.localStorage.getItem("itemSelectedId")}`)
        .then(response => {
          // Handle the response
          setterFunction(response.data.results)
          setLoading(false);
        })
        .catch(error => {
          // Handle the error
          setMessage(error.response?.data?.message || error.message)
          // setIsErrorModalOpen(true)
          setLoading(false);
        });
    }
  }


  useEffect(() => {
    loadData();
    setErrorMessage("")
  }, [restaurantId])


  const handleFileSelect = (event) => {
    let temp = { ...formFrrors };
    delete temp.image;
    setFormErrors(temp);
  
    const file = event.target.files[0];
  
    if (!file) {
      // If no file is selected, return early to avoid further processing.
      return;
    }
  
    if (state.length < 10) {
      console.log("file", file);
      let error = "";
  
      // Check file type restriction, file size restriction, and image resolution restriction
      const allowedTypes = ["image/jpeg", "image/png"];
      const maxSizeInBytes = 3 * 1024 * 1024; // 3MB
      const maxResolution = { width: 800, height: 800 };
      const img = new Image();
      img.src = URL.createObjectURL(file);
  
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const validAspectRatio = aspectRatio >= 0.9 && aspectRatio <= 1.1;
  
        if (!allowedTypes.includes(file.type)) {
          error = "Only JPEG and PNG images are allowed.";
          setErrorMessage(error);
        } else if (file.size > maxSizeInBytes) {
          error = "File size exceeds the maximum limit of 3MB.";
          setErrorMessage(error);
        } else if (img.width > maxResolution.width || img.height > maxResolution.height) {
          error = "Image height and width should not exceed 800px.";
          setErrorMessage(error);
        } else {
          setErrorMessage("");
          const formData = new FormData();
          formData.append("image_url", file);
          formData.append(
            "grocerystore",
            window.localStorage.getItem("itemSelectedId")
          );
  
          // Make a POST request to the File Upload API with the FormData object and Rapid API headers
          setLoading(true);
          API.post("/grocery/grocery-images/", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              "X-CSRFToken": Cookies.get("csrftoken"), // Include the CSRF token in the headers
              Authorization: "Bearer " + authToken,
            },
          })
            .then((response) => {
              // Handle the response
              setLoading(false);
              loadData();
            })
            .catch((error) => {
              // Handle errors
              setLoading(false);
              console.log(error);
            });
        }
      };
    } else {
      setErrorMessage(
        "Maximum number of images that can be uploaded for a restaurant is 10"
      );
    }
  };
  

  const handleRemove = (id) => {
    if (state?.length == 1) {
      setErrorMessage('Minimum 1 image is required. Please upload a new image to replace.');
      return
    }
    setLoading(true);
    API.delete(`/grocery/grocery-images/${id}/`)
      .then(response => {
        // Handle the response
        console.log('Prduct deleted successfully:', response.data);
        loadData()
        setErrorMessage("")

      })
      .catch(error => {
        // Handle the error
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true)
        setLoading(false);
        loadData()
      });

  };

  const handleRemoveAll = () => {


  };




  return (
    <div className='image-uploader'>
      <div className='content card'>


        <div className='row image-container justify-content-start align-items-center  w-100'>
          <div className='col-md-4'>
            <div className="file-input-wrapper">
              <div className="file-input-preview">
                <img src="/images/admin-panel/svg/image-upload-icon.svg"></img>
              </div>
              <input type="file" onChange={handleFileSelect} accept="image/*" />
              <span>Upload your Image</span>
            </div>

          </div>


          {state.length > 0 ? state.map((image, index) => (
            <div key={index} style={{ alignItems: 'center' }} className='col-md-4'>
              <div className="file-preview-wrapper">
                <img src={image.image_url} alt="Preview" style={{ maxWidth: '100%', maxHeight: '140px' }} />
                <button type='button' className='btn btn-small-dark remove-img-btn remove-single-img-btn' onClick={() => handleRemove(image.id)}>
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M21.9878 6.41309H3.98779V9.41309C5.09236 9.41309 5.98779 10.3085 5.98779 11.4131V15.4131C5.98779 18.2415 5.98779 19.6557 6.86647 20.5344C7.74515 21.4131 9.15937 21.4131 11.9878 21.4131H13.9878C16.8162 21.4131 18.2304 21.4131 19.1091 20.5344C19.9878 19.6557 19.9878 18.2415 19.9878 15.4131V11.4131C19.9878 10.3085 20.8832 9.41309 21.9878 9.41309V6.41309ZM11.4878 11.4131C11.4878 10.8608 11.0401 10.4131 10.4878 10.4131C9.93551 10.4131 9.48779 10.8608 9.48779 11.4131V16.4131C9.48779 16.9654 9.93551 17.4131 10.4878 17.4131C11.0401 17.4131 11.4878 16.9654 11.4878 16.4131V11.4131ZM16.4878 11.4131C16.4878 10.8608 16.0401 10.4131 15.4878 10.4131C14.9355 10.4131 14.4878 10.8608 14.4878 11.4131V16.4131C14.4878 16.9654 14.9355 17.4131 15.4878 17.4131C16.0401 17.4131 16.4878 16.9654 16.4878 16.4131V11.4131Z" fill="#fff" fill-opacity="0.85" />
                    <path d="M11.0559 3.78368C11.1699 3.67736 11.421 3.58341 11.7703 3.51641C12.1196 3.4494 12.5475 3.41309 12.9878 3.41309C13.4281 3.41309 13.856 3.4494 14.2053 3.51641C14.5546 3.58341 14.8057 3.67736 14.9196 3.78368" stroke="#fff" strokeOpacity="0.85" strokeWidth="2" stroke-linecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          )) : null}

        </div>
        {/* {!errorMessage && */}
        <p className='text-muted'>Maximum file size: 3MB, File format jpg or png (png is preferred).<br />
          Maximum resolution 800px x 800 px.
          Aspect ratio: Square(1:1) preferred.
          <br />
          {/* Background colour should be transparent.<br /> */}
          {/* Also please reduce the padding to the minimum, atleast at any 2 opposite sides of the 4 sides.<br /> */}
          Minimum 1 image is required and it can be upto 10 images.
        </p>

        {/* } */}
        {errorMessage && <p className='text-danger'>{errorMessage}</p>}
        {/* {state.length > 0 && <button type='button' className='btn btn-small-dark remove-img-btn' onClick={handleRemoveAll}>Remove All</button>} */}
        <div className='row'>
          <div className='col-12'>
            <div className="d-flex justify-content-end mb-3 submit-btn-container">
              {/* <button className=" btn btn-small-dark" type="button" onClick={handleDiscad}>Cancel </button>
                        <button className=" btn btn-small-dark" type="button" onClick={handleSave}>Save</button> */}
              {/* <button className=" btn btn-small-dark" type="button" onClick={handleSaveDraft}>Save Draft</button> */}
            </div>
          </div>
        </div>

        {formFrrors.image && <div className="text-danger">{formFrrors.image}</div>}
      </div>
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />

    </div>

  );
};

export default MultipleImageUploaderGrocery;
