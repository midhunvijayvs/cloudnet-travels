import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import './ImageCrop.scss';
import getCroppedImg from './CropImage';

const ImageCropper = ({closeModal,ImageURL,formData,setFormData}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.5);
  const [aspect, setAspect] = useState({value:1280/588, text:'1280/588'})

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropChange = (crop) => {
    setCrop(crop);
  };
  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onCropComplete = (croppedArea, croppedAreaPixels ) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }
  const onCrop = async () => {
    const croppedImageURL = await getCroppedImg(ImageURL, croppedAreaPixels) ;
    // Extract image type and name from URL
    // const imageName = ImageURL.substring(ImageURL.lastIndexOf('/') + 1);
    // const imageType = imageName.split('.').pop();
    const imageName = `blog_${new Date().getTime()}.jpg`; 
    const imageType = 'image/jpeg'; 


    // Convert the cropped image URL to a Blob
    const response = await fetch(croppedImageURL);
    const blob = await response.blob();
    // Create a file from the Blob
    console.log(imageName,imageType,ImageURL);
    const file = new File([blob], imageName, { type: imageType });
    setFormData({
        ...formData,
        "image_url": file,
      });
      closeModal()
  }
  
  
  return (
    <div className="custom-modal image-crop">
            <div className='card'>
                <div className='title'>
                    <h3>Drag the frame to crop the image</h3>
                    <div className='close-btn' >
                        <button onClick={closeModal}>
                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.49951 7.5L22.4995 22.5" stroke="#263238" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M22.5005 7.5L7.50049 22.5" stroke="#263238" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className='crop-container'>
                    <div>
                    <Cropper
                        image={ImageURL}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect.value}
                        showGrid={false}
                        zoomSpeed={0.2}
                        onCropChange={onCropChange}
                        onZoomChange={onZoomChange}
                        onCropComplete ={onCropComplete}
                        
                    />
                    </div>
                    
                </div>

                <div className='controls'>
                    <div className='slider-section'>
                        <span className='small'>
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M29 6H3C2.73478 6 2.48043 6.10536 2.29289 6.29289C2.10536 6.48043 2 6.73478 2 7V25C2 25.2652 2.10536 25.5196 2.29289 25.7071C2.48043 25.8946 2.73478 26 3 26H29C29.2652 26 29.5196 25.8946 29.7071 25.7071C29.8946 25.5196 30 25.2652 30 25V7C30 6.73478 29.8946 6.48043 29.7071 6.29289C29.5196 6.10536 29.2652 6 29 6ZM28 24H4V8H28V24Z" fill="#466574"/>
                            <path d="M6.99984 22H24.9998C25.19 22.0003 25.3764 21.9464 25.537 21.8446C25.6976 21.7427 25.8258 21.5972 25.9067 21.425C25.9875 21.2529 26.0175 21.0612 25.9933 20.8726C25.9691 20.684 25.8916 20.5062 25.7698 20.36L20.7698 14.36C20.6813 14.2534 20.5716 14.1664 20.4477 14.1044C20.3237 14.0424 20.1882 14.0069 20.0498 14C19.9099 13.9924 19.7699 14.0143 19.639 14.0643C19.5081 14.1142 19.3891 14.1911 19.2898 14.29L18.1598 15.43L14.8298 10.43C14.737 10.2962 14.6128 10.187 14.4682 10.1121C14.3235 10.0371 14.1628 9.99868 13.9998 10C13.838 10.0042 13.6792 10.0451 13.5354 10.1196C13.3916 10.1941 13.2666 10.3002 13.1698 10.43L6.16984 20.43C6.0712 20.5758 6.01278 20.745 6.00049 20.9206C5.9882 21.0962 6.02247 21.2719 6.09984 21.43C6.18089 21.6002 6.30838 21.744 6.46762 21.8449C6.62686 21.9457 6.81136 21.9995 6.99984 22ZM13.9998 12.77L17.1898 17.55C17.2713 17.6738 17.3792 17.778 17.5058 17.8549C17.6324 17.9319 17.7745 17.9797 17.9219 17.9951C18.0693 18.0104 18.2182 17.9927 18.3579 17.9435C18.4977 17.8942 18.6247 17.8144 18.7298 17.71L19.9498 16.48L22.8598 20H8.91984L13.9998 12.77Z" fill="#466574"/>
                            <path d="M23 12H25C25.2652 12 25.5196 11.8946 25.7071 11.7071C25.8946 11.5196 26 11.2652 26 11C26 10.7348 25.8946 10.4804 25.7071 10.2929C25.5196 10.1054 25.2652 10 25 10H23C22.7348 10 22.4804 10.1054 22.2929 10.2929C22.1054 10.4804 22 10.7348 22 11C22 11.2652 22.1054 11.5196 22.2929 11.7071C22.4804 11.8946 22.7348 12 23 12Z" fill="#466574"/>
                            </svg>
                        </span>
                        <input type='range' min={1} max={3} step={0.01} 
                            value={zoom} onInput={(e)=>onZoomChange(e.target.value)}
                            className='slider'
                            >
                        </input>
                        <span className='big'>
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M29 6H3C2.73478 6 2.48043 6.10536 2.29289 6.29289C2.10536 6.48043 2 6.73478 2 7V25C2 25.2652 2.10536 25.5196 2.29289 25.7071C2.48043 25.8946 2.73478 26 3 26H29C29.2652 26 29.5196 25.8946 29.7071 25.7071C29.8946 25.5196 30 25.2652 30 25V7C30 6.73478 29.8946 6.48043 29.7071 6.29289C29.5196 6.10536 29.2652 6 29 6ZM28 24H4V8H28V24Z" fill="#466574"/>
                            <path d="M6.99984 22H24.9998C25.19 22.0003 25.3764 21.9464 25.537 21.8446C25.6976 21.7427 25.8258 21.5972 25.9067 21.425C25.9875 21.2529 26.0175 21.0612 25.9933 20.8726C25.9691 20.684 25.8916 20.5062 25.7698 20.36L20.7698 14.36C20.6813 14.2534 20.5716 14.1664 20.4477 14.1044C20.3237 14.0424 20.1882 14.0069 20.0498 14C19.9099 13.9924 19.7699 14.0143 19.639 14.0643C19.5081 14.1142 19.3891 14.1911 19.2898 14.29L18.1598 15.43L14.8298 10.43C14.737 10.2962 14.6128 10.187 14.4682 10.1121C14.3235 10.0371 14.1628 9.99868 13.9998 10C13.838 10.0042 13.6792 10.0451 13.5354 10.1196C13.3916 10.1941 13.2666 10.3002 13.1698 10.43L6.16984 20.43C6.0712 20.5758 6.01278 20.745 6.00049 20.9206C5.9882 21.0962 6.02247 21.2719 6.09984 21.43C6.18089 21.6002 6.30838 21.744 6.46762 21.8449C6.62686 21.9457 6.81136 21.9995 6.99984 22ZM13.9998 12.77L17.1898 17.55C17.2713 17.6738 17.3792 17.778 17.5058 17.8549C17.6324 17.9319 17.7745 17.9797 17.9219 17.9951C18.0693 18.0104 18.2182 17.9927 18.3579 17.9435C18.4977 17.8942 18.6247 17.8144 18.7298 17.71L19.9498 16.48L22.8598 20H8.91984L13.9998 12.77Z" fill="#466574"/>
                            <path d="M23 12H25C25.2652 12 25.5196 11.8946 25.7071 11.7071C25.8946 11.5196 26 11.2652 26 11C26 10.7348 25.8946 10.4804 25.7071 10.2929C25.5196 10.1054 25.2652 10 25 10H23C22.7348 10 22.4804 10.1054 22.2929 10.2929C22.1054 10.4804 22 10.7348 22 11C22 11.2652 22.1054 11.5196 22.2929 11.7071C22.4804 11.8946 22.7348 12 23 12Z" fill="#466574"/>
                            </svg>
                        </span>
                       
                    </div>
                    <div className='btns'>
                        <div className='cancel-btn' onClick={closeModal}>Cancel</div>
                        <div className='admin-blue-btn' onClick={onCrop}>Crop Image</div>
                    </div>
                    
                </div>
                
            </div>
        </div>
    
  );
};

export default ImageCropper;
