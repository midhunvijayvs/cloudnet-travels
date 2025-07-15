import React, { useEffect, useState } from 'react'
import API from '../../../API'
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import ErrorModal from "../../../ErrorModal";
import { useParams } from 'react-router-dom';
import PdfViewer from '../PdfViewer/PdfViewer';

const RestaurantPdf = ({resource}) => {
  const { fileId } = useParams(); // Get the fileId from the URL
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadDocument = () => {
    setIsLoading(true);
    let apiUrl = `/restaurants/documents/${fileId}/`
    if (resource === 'grocery_store'){
      apiUrl = `/grocery/documents/${fileId}/`
    }
    API.get(apiUrl)
      .then((response) => {
        const { file, decrypted_file } = response.data;
  
        if (decrypted_file) {
          // If the response includes `decrypted_file`, convert Base64 to a Blob URL
          const binary = atob(decrypted_file);
          const byteArray = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            byteArray[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const blobUrl = URL.createObjectURL(blob);
          setPdfUrl(blobUrl); // Use Blob URL for PdfViewer
        } else {
          // If no `decrypted_file`, fallback to the `file` URL
          setPdfUrl(file);
        }
  
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load document:', error);
        setIsLoading(false);
      });
  };
  
  // Cleanup Blob URL when component unmounts
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);
  useEffect(() => {
    loadDocument()
  }, [fileId])

  return (
    <div className='page-body'>
      {pdfUrl &&
        <PdfViewer file={pdfUrl} />
      }
      {isLoading && <FixedOverlayLoadingSpinner />}

    </div>
  )
}

export default RestaurantPdf
