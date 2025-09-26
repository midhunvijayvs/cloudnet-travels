import React, { useEffect, useState } from 'react';
import './TicketBooking.scss';
import { useSearchParams } from 'react-router-dom';
import API from "../../../API.js"
import { useNavigate, useLocation } from 'react-router-dom'
// import { generateBookingId, generateTransactionId } from '../../../GeneralFunctions.js'
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"

const TicketBooking = ({ ticketSearchFormData }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const ticketData = location.state;



    const [formData, setFormData] = useState({
        adult: ticketSearchFormData.adult,
        child: ticketSearchFormData.child,
        infant: ticketSearchFormData.infant,
        adult_info: [],
        child_info: [],
        infant_info: [],
    });

    const [popupTitle, setPopupTitle] = useState(null)
    const [popupMessage, setPopupMessage] = useState(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [isLowBalanceErrorModalOpen, setIsLowBalanceErrorModalOpen] = useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);


    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        handlePaxChange("adult", ticketSearchFormData.adult)
        handlePaxChange("child", ticketSearchFormData.child)
        handlePaxChange("infant", ticketSearchFormData.infant)

     
    }, [])


    const handlePaxChange = (type, count) => {
        const updatedInfo = Array.from({ length: count }, (_, i) => {
            const defaultObj = { title: type === 'adult' ? 'Mr.' : 'Mstr.', first_name: '', last_name: '' };
            if (type === 'infant') {
                defaultObj.dob = '';
                defaultObj.travel_with = 1;
            }
            return defaultObj;
        });

        setFormData((prev) => ({
            ...prev,
            [type]: count,
            [`${type}_info`]: updatedInfo,
        }));
    };

    const handleChange = (type, index, field, value) => {
        const updated = [...formData[`${type}_info`]];
        updated[index][field] = value;
        setFormData((prev) => ({
            ...prev,
            [`${type}_info`]: updated,
        }));
    };

    const validate = () => {
        const newErrors = {};
        ['adult', 'child', 'infant'].forEach((type) => {
            formData[`${type}_info`]?.forEach((person, i) => {
                if (!person.first_name?.trim()) {
                    newErrors[`${type}_first_name_${i}`] = 'First name required';
                }
                if (!person.last_name?.trim()) {
                    newErrors[`${type}_last_name_${i}`] = 'Last name required';
                }
                if (type === 'infant' && !person.dob) {
                    newErrors[`infant_dob_${i}`] = 'DOB required';
                }
            });
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async () => {
        if (!validate()) return;
        setIsLoading(true);
        const payload = {
            ticket_id: ticketData.ticket_id,
            price: ticketData.price,
            total_pax: formData.adult + formData.child + formData.infant,
            ...formData,
        };

        API.post(`/api/airiq/book/`, payload)
            .then((response) => {
                navigate("/checkout-success", { state: { responseData: response.data } })
             
            })
            
            .catch((error) => {
                //  alert('Booking failed. Please try again.');
                if (error.response.data.error == "Insufficient wallet balance") {
                    setPopupTitle("Low Balance!!")
                    setPopupMessage("Insufficient wallet balance!! \n Please Recharge your wallet!")
                    setIsLowBalanceErrorModalOpen(true)
                }
                else {
                    setPopupTitle("Error!!")
                    setPopupMessage(error.response.data.error)
                    setIsErrorModalOpen(true)
                }
                navigate("/checkout-failed", { state: {} })
            })
            .finally(() => {
                setIsLoading(false);
            }
            )
    }


    const InfoRow = ({ label, value }) => (
        <div className='info-row'>
            <h3 className='label'>{label}</h3>
            <h3 className='value'>:&nbsp;{value}</h3>
        </div>
    );

    return (

        <div className='ticket-booking-page'>
            <div className='sec-2'>

                <div className='lhs'>
                    <div className='info-box'>
                        <h2>Ticket Details</h2>
                        {ticketData && (
                            <div className='info-box'>
                                {/* <InfoRow label="Ticket ID" value={ticketData.ticket_id} /> */}
                                <InfoRow label="Price" value={`₹ ${ticketData.price}`} />
                                <InfoRow label="Infant Price" value={`₹ ${ticketData.infant_price}`} />
                                <InfoRow label="Origin" value={ticketData.origin} />
                                <InfoRow label="Destination" value={ticketData.destination} />
                                <InfoRow label="Airline" value={ticketData.airline} />
                                <InfoRow label="Departure Date" value={ticketData.departure_date} />
                                <InfoRow label="Departure Time" value={ticketData.departure_time} />
                                <InfoRow label="Arrival Time" value={ticketData.arival_time} />
                                <InfoRow label="Arrival Date" value={ticketData.arival_date} />
                                <InfoRow label="Flight Number" value={ticketData.flight_number} />
                                <InfoRow label="Flight Route" value={ticketData.flight_route} />
                                <InfoRow label="PAX" value={ticketData.pax} />
                                <InfoRow label="Inventory Type" value={ticketData.inventory_type} />
                                <InfoRow label="Cabin Baggage" value={ticketData.cabin_baggage} />
                                <InfoRow label="Hand Luggage" value={ticketData.hand_luggage} />
                                <InfoRow label="International" value={ticketData.isinternational ? "Yes" : "No"} />
                               
                            </div>
                        )}
                    </div>

                </div>
                <div className='rhs'>
                    <div className="form-container">
                        <h2>Book Your Ticket</h2>

                        <div className="pax-select">
                            <label>
                                Adults:
                                <input
                                    type="number"
                                    min="1"
                                    max="9"
                                    value={formData.adult}
                                    onChange={(e) => handlePaxChange('adult', +e.target.value)}
                                    disabled
                                />
                            </label>
                            <label>
                                Children:
                                <input
                                    type="number"
                                    min="0"
                                    max="9"
                                    value={formData.child}
                                    onChange={(e) => handlePaxChange('child', +e.target.value)}
                                    disabled
                                />
                            </label>
                            <label>
                                Infants:
                                <input
                                    type="number"
                                    min="0"
                                    max="formData.adult"
                                    value={formData.infant}
                                    onChange={(e) => handlePaxChange('infant', +e.target.value)}
                                    disabled
                                />
                            </label>
                        </div>

                        {['adult', 'child', 'infant'].map((type) =>
                            formData[`${type}_info`].map((info, i) => (
                                <div className="pax-form" key={`${type}-${i}`}>
                                    <h4>{type.charAt(0).toUpperCase() + type.slice(1)} {i + 1}</h4>
                                    <select value={info.title} onChange={(e) => handleChange(type, i, 'title', e.target.value)}>
                                        <option>Mr.</option>
                                        <option>Ms.</option>
                                        <option>Mstr.</option>
                                        <option>Miss</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        value={info.first_name}
                                        onChange={(e) => handleChange(type, i, 'first_name', e.target.value)}
                                    />
                                    {errors[`${type}_first_name_${i}`] && <span className="error">{errors[`${type}_first_name_${i}`]}</span>}
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        value={info.last_name}
                                        onChange={(e) => handleChange(type, i, 'last_name', e.target.value)}
                                    />
                                    {errors[`${type}_last_name_${i}`] && <span className="error">{errors[`${type}_last_name_${i}`]}</span>}
                                    {type === 'infant' && (
                                        <>
                                            <input
                                                type="date"
                                                value={info.dob}
                                                onChange={(e) => handleChange('infant', i, 'dob', e.target.value)}
                                            />
                                            {errors[`infant_dob_${i}`] && <span className="error">{errors[`infant_dob_${i}`]}</span>}
                                            <select
                                                value={info.travel_with}
                                                onChange={(e) => handleChange('infant', i, 'travel_with', e.target.value)}
                                            >
                                                {formData.adult_info.map((_, index) => (
                                                    <option key={index} value={index + 1}>
                                                        Travel with Adult {index + 1}
                                                    </option>
                                                ))}
                                            </select>
                                        </>
                                    )}
                                </div>
                            ))
                        )}

                        <button className="book-button" onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? 'Booking...' : 'Book Ticket'}
                        </button>
                    </div>
                </div>

            </div>

            {isMessageModalOpen &&

                <PositiveModal
                    title={popupTitle}
                    message={popupMessage}
                    state={isMessageModalOpen}
                    setterFunction={setIsMessageModalOpen}
                    okClickedFunction={() => {
                       
                    }}
                />

            }
            <ErrorModal state={isLowBalanceErrorModalOpen} title={popupTitle} message={popupMessage} setterFunction={setIsLowBalanceErrorModalOpen} okClickedFunction={() => navigate('/wallet')} />
            <ErrorModal state={isErrorModalOpen} message={popupMessage} setterFunction={setIsErrorModalOpen} okClickedFunction={()=>{}} />
            {isLoading && <FixedOverlayLoadingSpinner />}
        </div>);
};

export default TicketBooking;
