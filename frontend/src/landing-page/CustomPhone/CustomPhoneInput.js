import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './CustomPhoneInput.scss'

const PhoneInputField = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePhoneChange = (value, country) => {
    setFormData({
      ...formData,
      phone_number: value,
      country_code: country.dialCode
    });
  };

  return (
    <div className={`phone-input-container ${errors.phone_number ? "is-invalid" : ""}`}>
      <PhoneInput
        inputProps={{
          name: 'phone_number',
          id: 'phone_number',
          className: 'form-control',
          placeholder: '',
        }}
        country={'in'} 
        value={formData.phone_number}
        onChange={(value, country) => handlePhoneChange(value, country)}
      />
      <div className='down-arrow'>
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_3810_8531" style={{maskType:"luminance"}} maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
            <path d="M24.5 24V0L0.5 0V24H24.5Z" fill="white"/>
          </mask>
          <g mask="url(#mask0_3810_8531)">
            <path d="M23.5 6.5L12.5 17.5L1.5 6.5" stroke="#757F82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default PhoneInputField;
