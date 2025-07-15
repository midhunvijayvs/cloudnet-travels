
import React from 'react'
import './Pagination.css'

const Pagination = ({ totalItems, currentPage, setCurrentPage, pageSize, selectPageSize }) => {


  const totalNumberOfPages = Math.ceil(totalItems / pageSize);

  const maxVisibleButtons = 5;

  const pageDown = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const pageUp = () => {
    if (currentPage !== totalNumberOfPages) {
      setCurrentPage(currentPage + 1)
    }
  }


  let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
  let endPage = Math.min(totalNumberOfPages, startPage + maxVisibleButtons - 1);

  if (endPage - startPage + 1 < maxVisibleButtons) {
    startPage = Math.max(1, endPage - maxVisibleButtons + 1);
  }

  const pageButtons = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

  return (
    <>
      {totalItems > 0 &&
        <div className="pagination-box">
          <div className='lhs'>
            <p>Items per page: </p>
           
           
            <select class="form-select form-select-sm"
             aria-label="Items per page" value={pageSize} onChange={(e) => selectPageSize(e.target.value)}>

              <option value={12} selected>12</option>

              <option value={24} >24</option>

              <option value={60} >60</option>

            </select>

            <p>{((currentPage-1)*pageSize)+1} to {Math.min(currentPage*pageSize,totalItems)} of {totalItems} Items </p>
          </div>
          <div className='rhs'>
            <button className="left-btn" onClick={pageDown}>
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.06634 4.58906L4.81634 0.839062C4.97496 0.680579 5.20598 0.618636 5.42252 0.676672C5.63917 0.734708 5.80827 0.903793 5.8663 1.12046C5.92434 1.33698 5.8624 1.56799 5.70391 1.72664L2.39141 5.03285L5.70391 8.33907C5.82222 8.45639 5.88876 8.61613 5.88876 8.78285C5.88876 8.94957 5.82222 9.1093 5.70391 9.22664C5.58658 9.34494 5.42685 9.41149 5.26013 9.41149C5.09341 9.41149 4.93368 9.34494 4.81634 9.22664L1.06634 5.47664C0.948039 5.35931 0.881492 5.19957 0.881492 5.03285C0.881492 4.86613 0.948035 4.7064 1.06634 4.58906Z" fill="#E05A67" />
              </svg>
            </button>

            {pageButtons.map((pageNumber) => (
              <button 
                className={`number-btn ${currentPage === pageNumber ? 'active' : ''}`}
                onClick={() => setCurrentPage(pageNumber)}
                key={pageNumber}
              >
                {pageNumber}
              </button>
            ))}

            <button className="right-btn" onClick={pageUp}>
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.46836 4.58906L1.71836 0.839062C1.55974 0.680579 1.32872 0.618636 1.11218 0.676672C0.895524 0.734708 0.726432 0.903793 0.668396 1.12046C0.61036 1.33698 0.672303 1.56799 0.830785 1.72664L4.14329 5.03285L0.830785 8.33907C0.712482 8.45639 0.645935 8.61613 0.645935 8.78285C0.645935 8.94957 0.712482 9.1093 0.830785 9.22664C0.948114 9.34494 1.10785 9.41149 1.27457 9.41149C1.44129 9.41149 1.60102 9.34494 1.71836 9.22664L5.46836 5.47664C5.58666 5.35931 5.65321 5.19957 5.65321 5.03285C5.65321 4.86613 5.58666 4.7064 5.46836 4.58906Z" fill="#E05A67" />
              </svg>
            </button>
          </div>

        </div>
      }
    </>
  )
}

export default Pagination