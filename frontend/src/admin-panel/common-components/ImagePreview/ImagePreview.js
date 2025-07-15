import React from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const ImagePreview = ({ images, keyName = "url", thumbnailStyle = {} }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="mb-3">
      <PhotoProvider>
        <div className="d-flex flex-wrap gap-2">
          {images.map((image, index) => {
            const imageUrl = image[keyName]; // Dynamically get URL based on keyName
            return (
              <PhotoView key={index} src={imageUrl}>
                <img
                  src={imageUrl}
                  alt={`Uploaded ${index + 1}`}
                  className="img-thumbnail"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    cursor: "pointer",
                    ...thumbnailStyle, // Apply custom styles dynamically
                  }}
                />
              </PhotoView>
            );
          })}
        </div>
      </PhotoProvider>
    </div>
  );
};

export default ImagePreview;
