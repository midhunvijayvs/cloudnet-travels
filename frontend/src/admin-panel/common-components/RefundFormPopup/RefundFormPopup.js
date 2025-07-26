
import React, { useState, useEffect } from 'react';
import API from '../../../API';
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import './RefundFormPopup.scss'

const RefundFormPopup = ({ resourceName, setterFunction, orderId, loadmainData }) => {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formFrrors, setFormErrors] = useState({});
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [orderData, setOrderData] = useState({})
  const [formData, setFormData] = useState({
    order_id: orderId,
  })

  const loadData = () => {
    let apiUrl = `/order/orders/${orderId}`;
    setIsLoading(true)
    API.get(apiUrl)
      .then(response => {
        setOrderData(response.data)
        setFormData({ order_id: response.data.id })
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false)
      });
  }
  useEffect(() => {
    loadData();
  }, [orderId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  const validateForm = (data) => {
    const errors = {};
    // Check if money is provided
    if (!data.money) {
      errors.money = "Required.";
    } else {
      // Check if money is a valid number
      if (isNaN(data.money)) {
        errors.money = "Must be a valid number.";
      } else {
        // Check if money is greater than 0
        if (data.money <= 0) {
          errors.money = "Must be greater than 0.";
        }

        // Check if money does not exceed total_amount
        if (data.money > orderData.total_amount) {
          errors.money = `Cannot exceed the total amount of ${orderData.total_amount}.`;
        }
      }
    }
    return errors
  }

  const handleSubmit = () => {
    const validationErrors = validateForm(formData);
    setFormErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    } else {
      setIsConfirmModalOpen(true)
    }
  }
  const proceedRefund = () => {
    setIsLoading(true)
    API.post(`payments/refund/`, formData)
      .then(response => {
        setIsLoading(false)
        setMessage(response?.data?.message)
        setIsMessageModalOpen(true)
        loadmainData()
      })
      .catch(error => {
        setIsLoading(false)
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true)
      });
  }



  return (
    <div className='custom-modal refund-popup'>
      <div className='card refund'>
        <div className='first-screen '>
          <h1>Process Refund</h1>
          <div className='row form-container'>
            <div className='col-6 mb-2'>
              <div className="form-group">
                <label for="money" className="form-label m-0">
                  Amount to Refund</label>
                <input type="text" className="form-control" name='money'
                  value={formData.money}
                  onChange={handleInputChange}
                  placeholder="Enter Refund Amount" />
                {formFrrors.money && <div className="invalid-feedback">{formFrrors.money}</div>}
              </div>
            </div>
            <div className='col-6 mb-2'>
              <div className="form-group">
                <label for="money" className="form-label m-0">
                  Already Refunded Amount </label>
                <input type="text" className="form-control" name='money'
                  value={orderData?.refunded_amount}
                  disabled={true}
                  placeholder="Refunded Amount" />
              </div>
            </div>

            <div className='col-4'>
              <div className="form-group">
                <label for="old_password" className="form-label">
                  Order ID</label>
                <input type="text" className="form-control" name='order'
                  value={orderData.id} disabled={true}
                  placeholder="Order ID" />
              </div>
            </div>
            <div className='col-4'>
              <div className="form-group">
                <label for="old_password" className="form-label">
                  Sub Total</label>
                <input type="text" className="form-control" name='order'
                  value={orderData.sub_total}
                  disabled={true}
                  placeholder="Sub Total" />
              </div>
            </div>
            <div className='col-4'>
              <div className="form-group">
                <label for="old_password" className="form-label">
                  Total Amount</label>
                <input type="text" className="form-control" name='order'
                  value={orderData.total_amount}
                  disabled={true}
                  placeholder="Total" />
              </div>
            </div>

            {orderData?.payment_delegations?.some((item) => item.order_item?.final === true) && (
              <div className='col-12 payment-deligation-table'>
                <div className='table-title'>Order Item Payment Deligations</div>
                <table>
                  <thead>
                    <tr>
                      <th>Order Item ID</th>
                      <th>Order Item</th>
                      <th>Payment Method</th>
                      <th>Reference ID</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData?.payment_delegations
                      .filter((item) => item.order_item?.final === true)
                      .map((item, index) => (
                        <tr key={index}>
                          <td>#{item.order_item?.id}</td>
                          <td>{item.order_item?.menu_item_name}</td>
                          <td>{item.payment_method}</td>
                          <td>{item.reference_id || "N/A"}</td>
                          <td>₹{item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}


          </div>


          <div className='footer'>
            <button type='button' className='btn-outlined' onClick={() => { setterFunction(false) }}>Discard</button>

            <button type='button' className='btn-primary ' onClick={handleSubmit}>Proceed</button>
          </div>
        </div>

      </div>

      {/* Confirm Modal */}
      {isConfirmModalOpen &&
        <div className='custom-modal '>
          <div className='card confirm'>
            <div className='first-screen'>
              <img src='/images/icons/svg/warning.svg'></img>
              <h1>Confirm Refund</h1>
              <p>
                A refund of <span className='money'>₹{formData.money}</span > will be sent to the customer. Please confirm to proceed.
              </p>
              <div className='footer'>
                <button type='button' className='btn-outlined' onClick={() => { setIsConfirmModalOpen(false) }}>Cancel</button>
                <button type='button' className='btn-primary' onClick={proceedRefund}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      }
      <ErrorModal message={message} state={isErrorModalOpen} setterFunction={setIsErrorModalOpen} okClickedFunction={() => { setterFunction(false) }} />
      {isLoading && <FixedOverlayLoadingSpinner />}
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => { setterFunction(false); }} />}

    </div>
  );
};

export default RefundFormPopup;

