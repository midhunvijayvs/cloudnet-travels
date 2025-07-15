import React, { useEffect, useState } from 'react';
import './TicketBooking.scss';
import { useSearchParams } from 'react-router-dom';
import API from "../../../API.js"

const TicketBooking = () => {
    const [searchParams] = useSearchParams();
    const ticketId = searchParams.get('ticket_id');

    const [formData, setFormData] = useState({
        adult: 1,
        child: 0,
        infant: 0,
        adult_info: [{ title: 'Mr.', first_name: '', last_name: '' }],
        child_info: [],
        infant_info: [],
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

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
            ticket_id: ticketId,
            total_pax: formData.adult + formData.child + formData.infant,
            ...formData,
        };
        API.post(`/book/`, payload)
            .then((response) => {
                alert('Booking successful!');

            })
            .catch((error) => {
                alert('Booking failed. Please try again.');
            })
            .finally(() =>{
                setIsLoading(false);
            }
         )
        }
        
return (

    <div className='ticket-booking-page'>
        <div className='sec-2'>


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
    </div>);
};

export default TicketBooking;
