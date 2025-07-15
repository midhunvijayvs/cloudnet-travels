import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./MenuItemReview.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"


import Pagination from "../../../Pagination";
import { PlusSquare } from "react-feather";
import RatingStar from "../../../user-panel/common-components/RatingStar/RatingStar";
import { timeAgo } from "../../../GeneralFunctions";
import EmptyTableMessage from "../../../Empty";


const MenuItemReview = () => {

  const navigate = useNavigate()

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({ search_key: null });

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState({})

  const [page, setPage] = useState(1);
  const [pageSize, selectPageSize] = useState(12);

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])


  useEffect(() => {
    loadTableData();
  }, [page, pageSize, filters]);

  const loadTableData = () => {
    setIsMessageModalOpen(false);
    let apiUrl = `/order/order-item-reviews/?page=${page}&page_size=${pageSize}&menu_item=${localStorage.getItem('itemSelectedId')}`;

    // Loop through the filters object and append selected filters to the apiUrl
    for (let filter in filters) {
      if (filters[filter] !== null) {
        apiUrl += `&${filter}=${filters[filter]}`;
      }
    }
    setIsLoading(true)
    API.get(apiUrl)
      .then(response => {
        setData(response.data);
        setIsLoading(false)
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
        setIsLoading(false)

      });
  }
  const getConcatenatedReview = (item) => {
    return [item.overall_review, item.accuracy_of_items_review]
      .filter(Boolean)
      .join('\n') || null;
  };


  return (
    <div className="menuitem-review-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="title-header option-title">
                        <h5>Menu Item Reviews</h5>
                      </div>
                      <div className=" review-sect">
                        {data && data.results && data.results.length > 0
                          && data.results.some(item => item.overall_rating || item.taste_rating || item.freshness_rating) ? (
                          <div className="review-box-list">
                            {data.results.map((item, index) => (
                              (item.overall_rating || item.taste_rating || item.freshness_rating) && (
                                <div key={index} className="review-card ">
                                  <div className="review-box">
                                    <div className="review-head">
                                      <div className="review-image">
                                        {item.profile_image ?
                                          <img className="img-fluid img" src={item.profile_image} alt="p1"></img>
                                          :
                                          <img className="img-fluid img" src="/images/no-profile-image.png" alt="p1"></img>
                                        }

                                      </div>
                                      <div
                                        className="d-flex align-items-center justify-content-between w-100">
                                        <div>
                                          <h6 className="reviewer-name">{item.username}</h6>
                                          <h6 className="review-date">{item.updated_at && timeAgo(item.updated_at)}</h6>
                                        </div>
                                        <div>
                                          <div className="rating-sec">
                                            <span>Overall</span>
                                            <div className={`${item.overall_rating ? `` : 'empty'}`}>
                                              <RatingStar rating={item.overall_rating} />
                                            </div>
                                          </div>
                                          <div className="rating-sec">
                                            <span>Taste</span>
                                            <div className={`${item.taste_rating ? `` : 'empty'}`}>
                                              <RatingStar rating={item.taste_rating} />
                                            </div>
                                          </div>
                                          <div className="rating-sec">
                                            <span>Freshness</span>
                                            <div className={`${item.freshness_rating ? `` : 'empty'}`}>
                                              <RatingStar rating={item.freshness_rating} />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {item.overall_review &&
                                      <div className="review-content">
                                        {/* <h6>Wonderful Experience...!!</h6> */}
                                          {getConcatenatedReview(item) ?
                                            getConcatenatedReview(item) :
                                            `No reviews`
                                          }
                                      </div>
                                    }

                                  </div>
                                </div>
                              )
                            ))}

                          </div>

                        ) :
                          (
                            <EmptyTableMessage message={'No Reviews Available.'} />
                          )}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default MenuItemReview