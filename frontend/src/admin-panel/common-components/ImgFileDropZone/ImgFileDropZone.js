import React, { useState, useEffect } from 'react';
import './ImgFileDropZone.scss'

const ImgFileDropZone = ({ onFileSelect, inputId, showPreview, disabled, imagePreview }) => {
    const [imageURL, setImageURL] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState('');

    const [imagePreviewURL, setImagePreviewURL] = useState(imagePreview);
    const allowedTypes = ['image/jpeg', 'image/png'];

    useEffect(() => {
        // Update image preview URL when the imagePreview prop changes (for editing)
        if (imagePreview && !imageURL) {
            setImagePreviewURL(imagePreview);
        }
    }, [imagePreview, imageURL]);

    const handleFileSize = (file) => {
        if (file.size > 2 * 1048576) {
            setError('File size exceeds 2MB.');
            return;
        }
        // Check image dimensions
        const img = new Image();
        img.onload = () => {
            if (img.width < 800 || img.height < 400) {
                setError('Image dimensions are too small. Minimum width is 800px and height is 400px.');
                return;
            }

            setError(''); // Clear error message
            const fileURL = URL.createObjectURL(file);
            setImageURL(fileURL); // Store the newly selected file URL
            setImagePreviewURL(fileURL); // Update the preview with the new file
            onFileSelect(file); // Pass the file to the parent component
        };
        img.onerror = () => {
            setError('Invalid image file.');
        };
        img.src = URL.createObjectURL(file);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        const file = Array.from(e.dataTransfer.files).find(file => allowedTypes.includes(file.type));
        file ? handleFileSize(file) : setError('Only JPEG and PNG images are allowed.');
    };

    const handleSelectFile = () => {
        document.getElementById(inputId).click();
    };

    const handleFileChange = (e) => {
        const file = Array.from(e.target.files).find(file => allowedTypes.includes(file.type));
        file ? handleFileSize(file) : setError('Only JPEG and PNG images are allowed.');
    };

    return (
        <div className='file-dropzone-container'>
            <div
                className={`drag-and-drop ${dragging ? 'dragging' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleSelectFile}>
                <input
                    type="file"
                    id={inputId}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    accept="image/*"
                    disabled={disabled}
                />
                {showPreview && imagePreviewURL ?
                    <img src={imagePreviewURL} alt="Uploaded" />
                    : (
                        <>
                            <div>
                                <svg width="66" height="52" viewBox="0 0 66 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_1790_17768)">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M31.8619 51.5H4.53846C2.04903 51.5 0 49.4317 0 46.8864V21.3675H66V46.8769C66 49.4317 63.9695 51.5 61.4615 51.5H34.1381V30.6372L41.5322 38.1692L43.2382 36.4314L32.9977 26L22.7572 36.4314L24.4632 38.1692L31.8573 30.6372V51.5H31.8619ZM0 19.0442V5.11361C0 2.56361 2.03976 0.5 4.557 0.5H29.5857L34.1381 9.77444H61.4337C63.9556 9.77444 66 11.8475 66 14.3975V19.0442H0Z" fill="#648197" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1790_17768">
                                            <rect width="66" height="51" fill="white" transform="translate(0 0.5)" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            <span className="drag-text">Drag & Drop your <br />image here</span>
                            <div className='instructions'>
                                <div>File type must be either JPEG or PNG.</div>
                                <div>File size must be less than 2MB.</div>
                                <div>Minimum image dimensions: 800px width and 400px height.</div>
                            </div>
                        </>
                    )}


            </div>
            {showPreview && imagePreviewURL &&
                <div className='d-flex w-100 justify-content-center'>
                    <button type="button" className='remove-btn' onClick={() => onFileSelect(null)} >Remove Image</button>
                </div>
            }

            {error && <div className="invalid-feedback">{error}</div>}
        </div>

    );
};

export default ImgFileDropZone;
