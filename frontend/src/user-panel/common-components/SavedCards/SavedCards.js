import { useEffect, useState } from "react";
import API from '../../../API'
import './SavedCards.scss'
import PositiveModal from "../../../PositiveModal"
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import ErrorModal from "../../../ErrorModal";

const SavedCards = ({ handleSavedPayment }) => {
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmType, setConfirmType] = useState('delete');


  useEffect(() => {
    API.get("payments/saved-cards/")
      .then((response) => {
        setSavedCards(response.data);
      })
      .catch((error) => {
        console.error("Failed to load saved cards:", error);
      });
  }, []);

  const handleDeleteCard = () => {
    setIsLoading(true)
    API.delete(`/payments/delete-payment-method/${selectedCard}/`)
      .then(response => {
        setSavedCards(prevCards => prevCards.filter(card => card.payment_method_id !== selectedCard));
        setIsLoading(false);
        setIsConfirmModalOpen(false)
      })
      .catch(error => {
        setIsLoading(false)
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true)
      });
  }

  const handleConfirmAction = () => {
    if (confirmType === 'payment') {
      handleSavedPayment(selectedCard)
    } else if (confirmType === 'delete') {
      handleDeleteCard();
    }
    setIsConfirmModalOpen(false);
  };


  return (
    <div>
      <div className="cards-container">
        {savedCards.length > 0 && (
          <div className="title">
            <div className="loader-line"></div>
            <h3>Saved Payment Methods</h3>
          </div>
        )}
        <div className="row g-4">
          {savedCards.length > 0 && (
            savedCards.map((card) => (
              <div className="col-xl-6 col-lg-6 col-sm-6 col-12" key={card.id}>
                <div
                  className={`debit-card  ${card.brand?.replace(/\s/g, "")} ${selectedCard === card.payment_method_id ? "selected-card" : ""}`}
                  onClick={() => setSelectedCard(card.payment_method_id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-details">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="card-name fw-semibold">{card.brand}</h5>
                      <img className="img-fluid network" src="/images/svg/network.svg" alt="network" />
                    </div>
                    <img className="img-fluid chip" src="/images/svg/Chip.svg" alt="chip" />
                    <div className="ac-details">
                      <h3>**** **** **** {card.last4}</h3>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex gap-2">
                        <h6>Exp.</h6>
                        <h5>{String(card.exp_month).padStart(2, "0")}/{card.exp_year}</h5>
                      </div>
                      <div className="d-flex gap-2">
                        <h6>CVV</h6>
                        <h5>***</h5>
                      </div>
                    </div>
                  </div>
                  <div className="card-hover">
                    <div className="d-flex align-items-center gap-3">
                      <a className="text-white" onClick={() => { setConfirmType('payment'); setIsConfirmModalOpen(true) }}>
                        <i className="ri-bank-card-fill me-2"></i>
                        Pay Now
                      </a>
                    </div>
                    <a className="delete" onClick={() => { setConfirmType('delete'); setIsConfirmModalOpen(true) }}>
                      <i className="ri-delete-bin-fill"></i>
                      Delete
                    </a>
                  </div>
                </div>
              </div>
            )))
          }
        </div>
      </div>
      {isConfirmModalOpen &&
        <div className='custom-modal confirm-modal'>
          <div className='card'>
            <div className='first-screen'>
              <img
                src={`/images/${confirmType === 'payment'
                  ? 'payment-popup-icon.svg'
                  : 'delete-popup-icon.svg'}`}
                alt="Confirmation Icon"
              />
              <h1>
                {confirmType === 'payment' ? 'Payment' : 'Delete'}
              </h1>
              {confirmType === 'payment' ? (
                <p>Are you sure you want to proceed the payment?</p>
              ) : (
                <p>Are you sure you want to delete the card?</p>
              )}

              <div className='footer'>
                <button type='button' className='cancel-button' onClick={() => { setIsConfirmModalOpen(false) }}>
                  Cancel
                </button>
                <button type='button' className='ok-button' onClick={handleConfirmAction}>
                  {confirmType === 'payment' ? 'PAY' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      }
      {isLoading && <FixedOverlayLoadingSpinner />}

      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />

    </div>
  )
}

export default SavedCards
