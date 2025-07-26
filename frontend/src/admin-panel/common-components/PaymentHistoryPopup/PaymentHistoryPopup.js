
import React, { useEffect, useState } from 'react';
import "./PaymentHistoryPopup.scss";
import API from '../../../API'
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import { useNavigate, Link } from 'react-router-dom';
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";

const PaymentHistoryPopup = ({ setterFunction, selectedItem }) => {

  const navigate = useNavigate()

  const [data, setData] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedItem])


  const loadData = () => {
    setIsLoading(true);
    API.get(`/payments/restaurant-settlements/?restaurant=${selectedItem.restaurant}`)
      .then((response) => {
        setData(response.data)
        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false);
      })
  }
  return (
    <div className='custom-modal payment-history'>
      <div className='card'>
        <div className='title'>Payment History</div>
        <div className='content'>
          <div className='payment-details'>
            <table className='mb-1'>
              <tr>
                <th>Paid On</th>
                <th>Orders From</th>
                <th>Orders To</th>
                <th>No.of Orders</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Transaction ID</th>
              </tr>
              {data?.results?.length > 0 && data.results.map((item, index) => {
                return (
                  <tr>
                    <td>
                      <span>
                        {/* <i className="ri-time-line"></i> */}
                        {item.payment_time ? item.payment_time.substring(0, 10) : 'N/A'}
                      </span>
                    </td>
                    <td>{item.payment_for_orders_from ? item.payment_for_orders_from.substring(0, 10) : 'N/A'}</td>
                    <td>{item.payment_for_orders_to ? item.payment_for_orders_to.substring(0, 10) : 'N/A'}</td>
                    <td>{item.number_of_orders}</td>
                    <td>₹{item.paid_amount && item.paid_amount.toFixed(2)}</td>
                    <td >
                      <span className={`status ${item.payment_status}`}>{item.payment_status && item.payment_status.replace(/_/g, ' ')}</span>
                    </td>
                    <td>{item.wise_transaction_id ? `#${item.wise_transaction_id}`: 'N/A'	}</td>
                  </tr>
                )
              })}
            </table>
          </div>

        </div>

        <div className='footer single-button-footer'>
          <button type='button' className='cancel-button' onClick={() => { setterFunction(false) }}>Close</button>

        </div>
      </div>
      <ErrorModal message={message} state={isErrorModalOpen} setterFunction={setIsErrorModalOpen} okClickedFunction={() => { setIsErrorModalOpen(false) }} />
      {isLoading && <FixedOverlayLoadingSpinner />}
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => { setterFunction(false); }} />}

    </div>
  );
};

export default PaymentHistoryPopup;

