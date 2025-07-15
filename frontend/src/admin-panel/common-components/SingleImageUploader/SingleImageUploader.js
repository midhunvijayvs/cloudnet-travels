import React, { useState } from 'react';
import API from '../../../API';

const SingleImageUploader = ({ selectedItem, source }) => {
  const [previewImage, setPreviewImage] = useState(selectedItem.image_url);
  const [isImgLoading, setIsImgLoading] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [message, setMessage] = useState('');
  let apiUrl = `/restaurants/menu-categories/${selectedItem.id}/`;
  if (source === 'grocery_store') {
    apiUrl = `/grocery/grocery-categories/${selectedItem.id}/`;
  }

  const handleImageSelect = (event) => {
    const file = event.target.files[0];

    // Check image dimensions
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const validAspectRatio = aspectRatio >= 0.9 && aspectRatio <= 1.1;

      if (img.width <= 250 && img.height <= 250 && validAspectRatio) {
        if (file.size <= 300 * 1024) { // Max size in bytes (300 KB)
          setImageError(null)
          setIsImgLoading(true);
          setPreviewImage(URL.createObjectURL(file));

          const formData = new FormData();
          formData.append('image_url', file);
          API.put(apiUrl, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          })
            .then((response) => {
              setMessage("Image updated successfully.")
              setIsImgLoading(false);
            })
            .catch((error) => {
              setIsImgLoading(false);
              setMessage(error.response?.data?.message || error.message);
              //   setIsErrorModalOpen(true);
            })

        }
        else {
          setImageError('Image file size is too large.');
        }
      } else {
        setImageError('Image dimensions are not within the specified limits.');
      }
    };
  };


  return (
    <div className="single-img-uploader d-flex flex-column justify-content-center align-items-center" style={{ position: "static", zIndex: 1, backgroundColor: "transparent", height: "fit-content" }}>

      <div className="image-preview-box">

        {previewImage ?
          <img src={previewImage} alt="" style={isImgLoading ? { opacity: '40%' } : { opacity: '100%' }} className="preview-image" />
          :
          <img src="/images/profile/avatar-no-profile-image.png"></img>
        }
        {/* {previewImage &&
                        <button className="btn btn-small-danger d-flex justify-content-center  w-100 delete-btn" onClick={handleImageDelete}> <svg className="me-2" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M21.9878 6.41309H3.98779V9.41309C5.09236 9.41309 5.98779 10.3085 5.98779 11.4131V15.4131C5.98779 18.2415 5.98779 19.6557 6.86647 20.5344C7.74515 21.4131 9.15937 21.4131 11.9878 21.4131H13.9878C16.8162 21.4131 18.2304 21.4131 19.1091 20.5344C19.9878 19.6557 19.9878 18.2415 19.9878 15.4131V11.4131C19.9878 10.3085 20.8832 9.41309 21.9878 9.41309V6.41309ZM11.4878 11.4131C11.4878 10.8608 11.0401 10.4131 10.4878 10.4131C9.93551 10.4131 9.48779 10.8608 9.48779 11.4131V16.4131C9.48779 16.9654 9.93551 17.4131 10.4878 17.4131C11.0401 17.4131 11.4878 16.9654 11.4878 16.4131V11.4131ZM16.4878 11.4131C16.4878 10.8608 16.0401 10.4131 15.4878 10.4131C14.9355 10.4131 14.4878 10.8608 14.4878 11.4131V16.4131C14.4878 16.9654 14.9355 17.4131 15.4878 17.4131C16.0401 17.4131 16.4878 16.9654 16.4878 16.4131V11.4131Z" fill="#fff" fill-opacity="0.85" />
                          <path d="M11.0559 3.78368C11.1699 3.67736 11.421 3.58341 11.7703 3.51641C12.1196 3.4494 12.5475 3.41309 12.9878 3.41309C13.4281 3.41309 13.856 3.4494 14.2053 3.51641C14.5546 3.58341 14.8057 3.67736 14.9196 3.78368" stroke="#fff" strokeOpacity="0.85" strokeWidth="2" stroke-linecap="round" />
                        </svg>Remove Image</button>} */}
        {isImgLoading &&
          <div
            style={{

              position: "absolute",
              zIndex: "201",
              top: "200px"
            }}
          >
            <div className="spinner-border" role="status">
              <span className="sr-only "></span>
            </div>
          </div>}

      </div>

      <div className=" mb-2 d-flex justify-content-center">
        <input className="btn btn-secondary image-input-button w-100" type="file" accept="image/*"
          onChange={handleImageSelect} />

      </div>


      {imageError && <p className="img-error-msg">{imageError}</p>}
      <p className="image-instruction text-center">
        File size should be less than 300kB<br></br>
        File resolution Max height: 250px and Max width:250px, in a square aspect ratio.
      </p>

    </div>
  );
};

export default SingleImageUploader;
