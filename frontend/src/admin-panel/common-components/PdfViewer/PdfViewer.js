import React, { useRef, useState } from 'react';
import { pdfjs } from 'react-pdf';
import { Document, Page } from 'react-pdf';
import './PdfViewer.scss';
import { useNavigate, useLocation } from 'react-router-dom';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function PdfViewer({ file }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [isPaginationHovered, setIsPaginationHovered] = useState(false);

  // Handle successful document load
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // Handle document load error
  function onDocumentLoadError(error) {
    console.error('Failed to load the document:', error);
  }

  // Handle pagination
  const handlePagination = (increment) => {
    const nextPage = pageNumber + increment;
    if (nextPage >= 1 && nextPage <= numPages) {
      setPageNumber(nextPage);
    }
  };
  // Zoom
  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.2, 2)); // Max zoom level of 3
  };
  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5)); // Min zoom level of 0.5
  };

  return (
    <div className="pdf-container">
      <div className="pdf-wrapper" >
        {/* PDF Document Viewer */}
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError}>
          <Page pageNumber={pageNumber} scale={scale} />
        </Document>
      </div>

      <div className='pdf-options'>
        {/* Zoom Controls */}
        <div className="zoom-controls">
          <button onClick={handleZoomOut} disabled={scale <= 0.5}>
            <img src='/images/pdf/zoom-out.svg' />
          </button>
          <span>{Math.round(scale * 100)}%</span>
          <button onClick={handleZoomIn} disabled={scale >= 2}>
            <img src='/images/pdf/zoom-in.svg' />
          </button>
        </div>
        {/* Conditional Pagination Controls */}
        {numPages > 1 && (
          <div className="pagination"
            onMouseEnter={() => setIsPaginationHovered(true)}
            // onMouseLeave={() => setIsPaginationHovered(false)}
          >
            <button onClick={() => handlePagination(-1)} disabled={pageNumber === 1}>
              <img src='/images/pdf/prev.svg' />
            </button>

            {/* Page Number Display */}
            <div className="page-number">
              {pageNumber} / {numPages}
            </div>

            <button onClick={() => handlePagination(1)} disabled={pageNumber === numPages}>
              <img src='/images/pdf/next.svg' />
            </button>
          </div>
        )}

        {/* thumbnails */}
        <div className={`pdf-thumbnails ${isPaginationHovered && 'show'}`}
        onMouseLeave={() => setIsPaginationHovered(false)}>
          {Array.from(new Array(numPages), (_, index) => (
            <div
              key={index}
              className={`thumbnail ${pageNumber === index + 1 ? 'active' : ''}`}
              onClick={() => setPageNumber(index + 1)}
            >
              <Document file={file}>
                <Page pageNumber={index + 1} width={60} />
              </Document>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default PdfViewer;
