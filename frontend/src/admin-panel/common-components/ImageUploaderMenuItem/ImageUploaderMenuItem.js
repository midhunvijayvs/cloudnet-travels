import React, { useState, useEffect } from 'react';
import './ImageUploaderMenuItem.scss';
import axios from 'axios';
import API from '../../../API';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const MultipleImageUploader = ({ mode, source, state, setterFunction, setLoading, formFrrors, setFormErrors, handlePublishProduct, handleSaveDraft }) => {

  let navigate = useNavigate();
  const [isConfirmDiscardOpen, setIsConfirmDiscardOpen] = useState(false);


  const authToken = localStorage.getItem('accessToken')

  const [errorMessage, setErrorMessage] = useState('');

  const loadData = () => {
    let apiUrl = `/restaurants/menu-item-images/?menu_item=${window.localStorage.getItem("itemSelectedId")}`;
    if (source === 'grocery') {
      apiUrl = `/grocery/grocery-item-images/?grocery_item=${window.localStorage.getItem("itemSelectedId")}`
    }
    window.localStorage.getItem('itemSelectedId') !== null &&
      setLoading(true);
    API.get(apiUrl)
      .then(response => {
        // Handle the response
        setterFunction(response.data.results)
        setLoading(false);
      })
      .catch(error => {
        // Handle the error
        console.error('Error loading images:', error);
        setLoading(false);
      });
  }


  useEffect(() => {
    loadData();
  }, [])


  const handleFileSelect = (event) => {
    let temp = { ...formFrrors }
    console.log(temp, "temp")
    delete temp.image
    setFormErrors(temp)

    if (state.length < 3) {
      const file = event.target.files[0];
      console.log("fie", file)
      let error = '';


      // Check file type restriction, file size restriction, and image resolution restriction
      const allowedTypes = ['image/jpeg', 'image/png'];
      const maxSizeInBytes = 3 * 1024 * 1024; // 3MB
      const maxResolution = { width: 800, height: 800 };
      const img = new Image();
      img.src = URL.createObjectURL(file);
      // const aspectRatio = img.width / img.height;
      // const validAspectRatio = aspectRatio >= 0.9 && aspectRatio <= 1.1;


      if (!allowedTypes.includes(file.type)) {
        error = 'Only JPEG and PNG images are allowed.';
        setErrorMessage(error);
      }

      else if (file.size > maxSizeInBytes) {
        error = 'File size exceeds the maximum limit of 3MB.';
        setErrorMessage(error);
      }
      // else if (!validAspectRatio) {
      //     error = 'File aspect ratio(width/height) should be between 0.9 to 1.1';
      //     setErrorMessage(error);
      // }
      else if (img.width > maxResolution.width || img.height > maxResolution.height) {
        error = 'image height and width should not exceed 800px';
        setErrorMessage(error);
      }

      else {
        const formData = new FormData();
        formData.append("image_url", file);
        if (source === 'grocery') {
          formData.append("grocery_item", window.localStorage.getItem('itemSelectedId'));
        } else {
          formData.append("menu_item", window.localStorage.getItem('itemSelectedId'));
        }
        // make a POST request to the File Upload API with the FormData object and Rapid API headers
        setLoading(true);
        
        let apiUrl = "/restaurants/menu-item-images/";
        if (source === 'grocery') {
          apiUrl = "/grocery/grocery-item-images/"
        }
        console.log(source, apiUrl);

        API.post(apiUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            'X-CSRFToken': Cookies.get('csrftoken'),  // Include the CSRF token in the headers
            'Authorization': 'Bearer ' + authToken,
          },
        })
          .then((response) => {
            // handle the response
            setLoading(false)
            loadData()
          })
          .catch((error) => {
            // handle errors
            setLoading(false)

            // console.log(error);
          });

      }

    }
    else {
      setErrorMessage('Maximum number of images that can be uploaded for a product is 3');
    }

  };

  const handleRemove = (id) => {
    if (state?.length == 1) {
      setErrorMessage('Minimum 1 image is required. Please upload a new image to replace.');
      return
    }
    setLoading(true);

    let apiUrl = `/restaurants/menu-item-images/${id}/`;
    if (source === 'grocery') {
      apiUrl = `/grocery/grocery-item-images/${id}/`
    }

    API.delete(apiUrl)
      .then(response => {
        // Handle the response
        console.log('Prduct deleted successfully:', response.data);
        loadData()
        setErrorMessage("")

      })
      .catch(error => {
        // Handle the error
        console.error('Error deleting image:', error);
        setLoading(false);
        loadData()
      });

  };



  const handleDiscad = () => {
    let redirectUrl = '/admin/menu-item/list';
    if (source === 'grocery') {
      redirectUrl = '/admin/grocery-item/list'
    }

    if (mode === 'add') {
      let apiUrl = `/restaurants/menu-items/${window.localStorage.getItem("itemSelectedId")}`;
      if (source === 'grocery') {
        apiUrl = `/grocery/grocery-items/${window.localStorage.getItem("itemSelectedId")}`
      }

      API.delete(apiUrl)
        .then(response => {
          navigate(redirectUrl);
        })
        .catch(error => {
        });
    } else {
      navigate(redirectUrl);
    }

  }


  return (
    <div className='menu-item'>
      <div className='image-uploader'>
        <div className='content card'>


          <div className='row justify-content-start align-items-center  w-100'>
            <div className='col-md-4'>
              <div className="file-input-wrapper">
                <div className="file-input-preview">
                  <img src="/images/admin-panel/svg/image-upload-icon.svg"></img>
                </div>
                <input type="file" multiple onChange={handleFileSelect} accept="image/*" />
                <span>Upload your Image</span>
              </div>

            </div>


            {state.length > 0 ? state.map((image, index) => (
              <div key={index} style={{ alignItems: 'center' }} className='col-md-4'>
                <div className="file-preview-wrapper">
                  <img src={`${image.image_url}`} alt="Preview" style={{ maxWidth: '180px', maxHeight: '180px' }} />
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
          {!errorMessage &&
            <p className='text-muted'>Maximum file size: 3MB, File format jpg or png (png is preferred).<br />
              {/* Maximum resolution 800px x 800 px.  */}
              Aspect ratio: Square(1:1) preferred.<br />
              Background colour should be transparent.<br />
              {/* Also please reduce the padding to the minimum, atleast at any 2 opposite sides of the 4 sides.<br /> */}
              Minimum 1 image is required and it can be upto 3 images.
            </p>

          }
          {errorMessage && <p className='text-danger'>{errorMessage}</p>}
          {/* {state.length > 0 && <button type='button' className='btn btn-small-dark remove-img-btn' onClick={handleRemoveAll}>Remove All</button>} */}
          <div className='row'>
            <div className='col-12'>
              <div className="d-flex justify-content-end mb-3 submit-btn-container">
                <button className=" btn btn-small-dark" type="button" onClick={() => setIsConfirmDiscardOpen(true)}>Cancel </button>
                <button className=" btn btn-small-dark" type="button" onClick={handlePublishProduct}>Publish</button>
                <button className=" btn btn-small-dark" type="button" onClick={handleSaveDraft}>Save Draft</button>
              </div>
            </div>
          </div>

          {formFrrors.image && <div className="text-danger">{formFrrors.image}</div>}
        </div>
      </div>
      {isConfirmDiscardOpen &&
        <div className='custom-modal confirm'>
          <div className='card'>
            <div className='first-screen'>
              <img src='/images/icons/svg/warning.svg'></img>
              <h1>Cancel</h1>
              <p>Are you sure you want to cancel?<br /> All updates will be lost.</p>
              <div className='footer mt-2'>
                <button type='button' className='btn-outlined'
                  onClick={() => setIsConfirmDiscardOpen(false)}
                >Close</button>
                <button type='button' className='btn-primary'
                  onClick={handleDiscad}
                >Proceed</button>
              </div>
            </div>
          </div>
        </div>
      }

    </div>


  );
};

export default MultipleImageUploader;
