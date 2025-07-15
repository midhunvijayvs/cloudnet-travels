import React, {useState, useEffect} from 'react'
import $ from 'jquery';
import './AddressInput.scss'

const AddressInput = ({formData,setFormData, id }) => {

    const addressTypeList = [
        {
            id: 1,
            name: 'current address',
        },
        {
            id: 2,
            name: 'permanent address',
        }
    ]
     const [addressListOpened, toggleAddressList] = useState(false);
     const selectAddressType = (value) => {
         setFormData((formData) => ({
           ...formData,
           address_type: value
         }));
       }
     useEffect(() => {
         const $OptionDropList = $(`#${id}_address_type .option-list`);
         if (addressListOpened) {
             const height = $OptionDropList[0].scrollHeight;
             $OptionDropList.animate({ height: height + "px" }, 400);
             $OptionDropList.css("opacity", "1");
         } else {
             $OptionDropList.animate({ height: "0px" }, 400);
             $OptionDropList.css("opacity", "0");
         }
     }, [addressListOpened]);

  return (
    <div className=''>
        <div className='address-container'>
            {/* <div className='close-btn' >
                <button  onClick={okClicked}>
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.49951 7.5L22.4995 22.5" stroke="#263238" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M22.5005 7.5L7.50049 22.5" stroke="#263238" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                </button>
            </div> */}
            <div className='address-form'>
                <div className='address-type-select'>
                    <label>Enter Address</label>
                    <div className="custom-select form-control form-select" id={`${id}_address_type`} name="_address_type"
                    onClick={() => toggleAddressList(!addressListOpened)}>
                    <div className="selected-value">{formData.address_type ? formData.address_type : "Select"}
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <mask id="mask0_3764_11686" style={{maskType:"luminance"}} maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
                        <path d="M24.5 24V0L0.5 0V24H24.5Z" fill="white"/>
                        </mask>
                        <g mask="url(#mask0_3764_11686)">
                        <path d="M23.5 6.5L12.5 17.5L1.5 6.5" stroke="#757F82" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </g>
                        </svg>
                    </div>
                    <div className='option-list'>
                        {addressTypeList.map(option => (
                            <div 
                                key={option} 
                                className='option' 
                                onClick={() => selectAddressType(option.name)}
                            >
                            {option.name}
                        </div>
                        ))}
                    </div>
                    </div>
                </div>
                <div className='sec2'>
                    <div className='lhs'>
                        <div className='text-input'>
                            <input type='text' className='form-control' placeholder='Room Number' />
                        </div>
                        <div className='text-input'>
                            <input type='text' className='form-control' placeholder='Premises' />
                        </div>
                        <div className='text-input'>
                            <input type='text' className='form-control' placeholder='Post Town' />
                        </div>
                        <div className='text-input'>
                            <input type='text' className='form-control' placeholder='County' />
                        </div>
                    </div>
                    <div className='rhs'>
                        <div className='text-input'>
                            <input type='text' className='form-control' placeholder='Address Line 1' />
                        </div>
                        <div className='text-input'>
                            <input type='text' className='form-control' placeholder='Street Name' />
                        </div>
                        <div className='text-input'>
                            <input type='text' className='form-control' placeholder='Post Code' />
                        </div>
                        <div className='text-input'>
                            <input type='text' className='form-control' placeholder='Country' />
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
        
    </div>
  )
}

export default AddressInput