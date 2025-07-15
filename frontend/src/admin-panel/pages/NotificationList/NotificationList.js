import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./NotificationList.scss"
import API from '../../../API';
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"


import Pagination from "../../../Pagination";
import { timeAgo } from "../../../GeneralFunctions";

const NotificationList = ({ loadHeaderNotificationData }) => {

  const navigate = useNavigate()

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    search_key: null,
  });

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});


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
    setData(null);
    setIsMessageModalOpen(false);

    let apiUrl = `/communication/notifications/?page=${page}&page_size=${pageSize}`;

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

  const handleViewMessage = (item) => {
    // update is_viewed ==> True
    if (item.is_viewed === false) {
      API.put(`/communication/notification/${item.id}/`, { is_viewed: true })
        .then(response => {
          setIsLoading(false);
          loadTableData();
          loadHeaderNotificationData()
        })
        .catch(error => {
          setIsLoading(false);
          setMessage(error.response?.data?.message || error.message)
          setIsErrorModalOpen(true);
        });
    }
  };
  const readAll = () => {
    API.post(`/communication/read-all-notifications/`)
      .then(response => {
        setIsLoading(false);
        loadTableData();
        loadHeaderNotificationData()
      })
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true);
      });
  }

  return (
    <div className="admin-list-page notification-list-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table">
                <div className="card-body">
                  <div className="title-header option-title">
                    <h5>
                      Notifications
                    </h5>
                    {data?.results?.unviewed_count > 0 &&
                      <div className="dismiss mb-0"
                        onClick={readAll} >
                        Dismiss all
                      </div>
                    }
                  </div>
                  <div className="notification-container">
                    {data?.results?.notifications?.map((item, index) => (
                      <div key={index}
                        className={`message ${item.is_viewed ? '' : 'unread'}`}
                        onClick={() => {
                          handleViewMessage(item);
                          if (item.link) {
                            const internalLink = new URL(item.link, window.location.origin).pathname;
                            navigate(internalLink);
                          }
                        }}
                        style={{ cursor: item.link ? 'pointer' : 'default' }}
                      >
                        {/* {!item.is_viewed &&
                          <i className="fa fa-circle font-info"></i>
                        } */}
                        <div className='message-text'>
                          {item.content}
                        </div>
                        <div className="time">
                          {item.created_at && timeAgo(item.created_at)}
                        </div>
                      </div>
                    ))}
                  </div>
                  {data &&
                    <Pagination
                      totalItems={data.count}
                      pageSize={pageSize}
                      currentPage={page}
                      setCurrentPage={setPage}
                      selectPageSize={selectPageSize}
                    >

                    </Pagination>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={loadTableData} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={loadTableData} />}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default NotificationList