import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import API from '../../../API';
import '../../common-components/MultipleImageUploader.css'
import './Wallet.scss'
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import PhoneInputField from '../../../authentication/pages/CustomPhone/CustomPhoneInput';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { UserContext } from '../../../authentication/pages/UserContext';
import ChangePasswordPopup from '../../common-components/ChangePasswordPopup/ChangePasswordPopup';
import SupportPagesLayout from '../../common-components/SupportPagesLayout/SupportPagesLayout.js'
import Empty from '../../../Empty.js'
import { ArrowUpRight, ArrowDownRight } from "react-feather";


const ProfilePage = ({ userData, loadUserData }) => {

const navigate = useNavigate()


  const [popupTitle, setPopupTitle] = useState(null)
  const [popupMessage, setPopupMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn, login, logout } = useContext(UserContext);
  const [data, setData] = useState({
    "amount": 0,
    "payment_method": "phonepe",
    "gateway_transaction_reference_number": "TXN12345678",
    "description": "Added via phonepe"
  })
  const [tableData, setTableData] = useState([])


  useEffect(() => {
    loadUserData();
    loadTableData()
  }, []);


  const loadTableData = () => {
    setIsLoading(true)
    API.get('/api/agency/wallet-transactions/list/')
      .then((response) => {
        setTableData(response.data)
        setIsLoading(false)
      })
      .catch(error => {
        setIsLoading(false)
        setPopupTitle("Error")
        setPopupMessage("error loading transactions history")
        setIsErrorModalOpen(true)
      })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let cleanedValue = value
    // only digits allowed
    if (name == 'amount') {
      cleanedValue = value.replace(/\D/g, "");
    }
    setData((prevData) => ({
      ...prevData,
      [name]: cleanedValue,
    }));
  };

  const validateData = () => {
    console.log("data", data)   // Wallet balance: must be a positive number
    if (!data.amount || isNaN(data.amount)) {
      return "Amount must be a valid number.";
    }
    if (Number(data.amount) <= 0) {
      return "Amount must be greater than 0.";
    }

    // Payment method: must be one of the allowed options
    const allowedMethods = ["phonepe", "manual"];
    if (!allowedMethods.includes(data.payment_method)) {
      return "Invalid payment method selected.";
    }

    // Gateway reference number: required, must not be empty
    if (!data.gateway_transaction_reference_number.trim()) {
      return "Transaction reference number is required.";
    }
    if (data.gateway_transaction_reference_number.length < 6) {
      return "Transaction reference number is too short.";
    }

    // Description: required (can set min/max length if needed)
    if (!data.description.trim()) {
      return "Description cannot be empty.";
    }

    return null; // ✅ No validation errors
  };

  const handleSubmit = () => {
    const error = validateData();
    if (error) {
      setPopupMessage(error);
      setIsErrorModalOpen(true);
      return; // ❌ Stop submission
    }


    setIsLoading(true)
    API.post('/api/agency/initiate-add-money-to-wallet/', data)
      .then(response => {
        setIsLoading(false)
        setPopupTitle("Redirecting..");
        setPopupMessage("Record created. Redirecting to payment gateway.");

        setIsMessageModalOpen(true)
console.log("response.data.transaction_id from wallet: ", response.data.transaction_id)
       

 setTimeout(() => {
  navigate("/wallet-checkout-payment", {
          state:
          {
            amount: response.data.amount,
            merchant_order_id: `CLDNTTOPUPODR${localStorage.getItem('userID')}${response.data.transaction_id}`,
            merchant_transaction_id: `CLDNTTOPUPTXN${localStorage.getItem('userID')}${response.data.transaction_id}`,
          pure_transaction_id:response.data.transaction_id
        }
        }
        )
          }, 5000);
      })
      .catch(error => {

        setPopupMessage(error.response?.data?.message || error.message);
        console.log("error:", error)

        setIsErrorModalOpen(true);
        setIsLoading(false)
      });

  }

  return (
    <SupportPagesLayout currentActiveIndex={0} title="My Wallet" breadcrumb={[{ name: "Home", link: "/" }, { name: "My Wallet", link: "#" }]}>
      {userData &&
        <div className='wallet-page'>

          <div className='balance-header'>
            <h5 className='title'>Your Cloudnet Wallet Balance:</h5>
            <h5 className='amount'>₹ {userData.agency.wallet_balance}</h5>

          </div>


          {/* Add Money Section */}
          <div className="add-money">
            <h5 className="section-title">Add money to the Wallet</h5>

            {/* Input field (whole numbers only) */}
            <div class="amount-input-wrapper">
              <span class="currency">₹</span>
              <input
                type="text" // use text to fully control validation
                className="amount-input"
                placeholder="Enter amount"
                name="amount"
                value={data.amount}
                onChange={handleInputChange}
              />
            </div>
            {/* Suggestion Box */}
            <div className="suggestion-box">
              {[10000, 15000, 20000, 50000, 100000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  className="suggestion"
                  onClick={() =>
                    setData((prevData) => ({
                      ...prevData,
                      amount: amt, // keep consistent with input
                    }))
                  }
                >
                  {amt.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Add Money Button */}
            <button className="add-btn" type='button' onClick={handleSubmit}>Add Money</button>
          </div>

          <div className='transaction-history'>
            <h5 className="section-title">Transaction history</h5>
            <div className='table-wrapper'>
              {tableData && tableData.results && tableData.results.length > 0 ?
                <table className="table table-bordered mb-4">
                  <thead>
                    <tr>
                      <th>Tx. ID</th>
                      <th>Amount:</th>
                     <th>Credit/Debit</th>
                      <th> Opening Balance:</th>
                      <th>Closing Balance</th>
                      <th>Payment Method</th>
                      <th>Reference No.</th>
                      <th>Initiated</th>
                      <th>Completed</th>
                      <th>Status</th>
                 </tr>
                  </thead>
                  <tbody>
                    {tableData.results.map((item) => (

                      <tr key={item.id}>

                        <td>
                          {item.id}
                        </td>


                        <td>
                          {item.transaction_amount}
                        </td>

                   <td>
  <span
    className={`debit-or-credit ${item.credit_or_debit === "debit" ? "up" : "down"}`}
  >
    {item.credit_or_debit === "debit" ? (
      <>
        In <ArrowUpRight size={16} className="ms-1" />
      </>
    ) : (
      <>
        Out <ArrowDownRight size={16} className="ms-1" />
      </>
    )}
  </span>
</td>
          
          <td>
                          {item.opening_balance}
                        </td>

                        <td>
                          {item.closing_balance}
                        </td>


                        <td>
                          {item.payment_method}
                        </td>

                        <td>
                          {item.gateway_transaction_reference_number}
                        </td>


                        <td>
                          {new Date(item.initiated_at).toLocaleString()}
                        </td>

                        <td>
                          {new Date(item.payment_completed_at).toLocaleString()}
                        </td>

                        <td>
                          <span className={item.status == 'success' ? 'green' : 'red'}>{item.status}</span>
                        </td>
 
                      </tr>
                    ))}
                  </tbody>
                </table>
                :
                <Empty />
              }
            </div>
          </div>


        </div>
      }
      {isMessageModalOpen &&

        <PositiveModal
          title={popupTitle}
          message={popupMessage}
          state={isMessageModalOpen}
          setterFunction={setIsMessageModalOpen}
          okClickedFunction={() => {
            loadUserData();
            loadTableData()
          }}
        />

      }
      <ErrorModal state={isErrorModalOpen}  message={popupMessage} setterFunction={setIsErrorModalOpen} okClickedFunction={loadUserData} />
      {isLoading && <FixedOverlayLoadingSpinner />}
    </SupportPagesLayout>
  )

}

export default ProfilePage