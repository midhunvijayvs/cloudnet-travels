import React, { useState } from 'react'
import './NotificationPopup.scss'
import { timeAgo } from '../../../GeneralFunctions'
import API from '../../../API';
import ErrorModal from '../../../ErrorModal';
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import PositiveModal from '../../../PositiveModal';
import { useNavigate } from 'react-router-dom';


const NotificationPopup = ({ notificationData, loadNotificationData }) => {
  const navigate = useNavigate();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleViewMessage = (index, item) => {
    setExpandedIndex(expandedIndex === index ? null : index);
    // update is_viewed ==> True
    if (item.is_viewed === false) {
      API.put(`/communication/notification/${item.id}/`, { is_viewed: true })
        .then(response => {
          setIsLoading(false);
          loadNotificationData();
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
        loadNotificationData();
      })
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true);
      });
  }



  return (
    <div className='user-notification-popup'>
      <ul className="notification-dropdown">
        <li className='head'>
          {/* <i className="ri-notification-line"></i> */}
          <h4 className="mb-0">Notifications</h4>
          {notificationData?.results?.unviewed_count > 0 &&
            <div className="dismiss mb-0"
              onClick={readAll} >
              Dismiss all
            </div>
          }
        </li>
        <div className='items-container'>
          {notificationData?.results?.notifications?.length > 0 &&
            notificationData.results.notifications.map((item, index) => (
              <li key={index} onClick={() => handleViewMessage(index, item)}>
                <div className={`content-sec ${item.is_viewed ? 'viewed' : ''} ${expandedIndex === index && 'expanded'}`}>
                  <i className="fa fa-circle font-info"></i>
                  <span className='message-text'>
                    {item.content}
                  </span>
                  <span className="pull-right">
                    {item.created_at && timeAgo(item.created_at)}
                  </span>
                </div>
                {expandedIndex === index && (
                  <div className={`content-sec accordion-content ${item.is_viewed ? 'viewed' : ''}`}>
                    <p>{item.content}</p>
                    {item.link &&
                      <a className='link-btn'
                        onClick={() => {
                          const internalLink = new URL(item.link, window.location.origin).pathname;
                          // navigate(internalLink);
                          navigate('/orders');
                        }} >
                        View</a>
                    }
                  </div>
                )}

              </li>
            ))}
        </div>
        {/* <li className='button'
          onClick={() => {navigate('/notifications') }}
        >
          <a className="see-all-btn" >View all notifications</a>
        </li> */}

      </ul>

      {isLoading && <FixedOverlayLoadingSpinner />}
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen}
        okClickedFunction={() => { setIsMessageModalOpen(false) }} />}
    </div>
  )
}

export default NotificationPopup