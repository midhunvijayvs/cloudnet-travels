import React,{useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import API from '../../../API';
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import $ from 'jquery';
import './InvoiceSendPopup.scss'
import '../AdminListPage.scss'
import InvoicePreview from '../InvoicePreview/InvoicePreview';

const InvoiceSendPopup = ({ title, state, setterFunction, okClickedFunction,formData ,setFormData }) => {

    const okClicked=()=>{
        okClickedFunction();
        setterFunction(false)
    }

    let navigate = useNavigate();
    const loadPage = () => {
      navigate(window.location.pathname);
    };
    

    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const [FromListOpened, toggleFromList] = useState(false);
    const [ToListOpened, toggleToList] = useState(false);
    const selectAddress = (key,value) => {
        setFormData((formData) => ({
          ...formData,
          [key]: value
        }));
      }
    useEffect(() => {
        let $OptionDropList = $("#address_from .option-list");
        if (FromListOpened) {
            const height = $OptionDropList[0].scrollHeight;
            $OptionDropList.animate({ height: height + "px" }, 400);
            $OptionDropList.css("opacity", "1");
        } else {
            $OptionDropList.animate({ height: "0px" }, 400);
            $OptionDropList.css("opacity", "0");
        }

        $OptionDropList = $("#address_to .option-list");
        if (ToListOpened) {
            const height = $OptionDropList[0].scrollHeight;
            $OptionDropList.animate({ height: height + "px" }, 400);
            $OptionDropList.css("opacity", "1");
        } else {
            $OptionDropList.animate({ height: "0px" }, 400);
            $OptionDropList.css("opacity", "0");
        }
    }, [FromListOpened,ToListOpened]);


    // Address 
    const AddressList = [
        {
            id: 1,
            title: 'ZOG Global Ltd Suite V3',
            address: "ZOG Global Ltd Suite V3, 4 Woodland Road,  Darlington, DL3 7PJ"
        },
        {
            id: 2,
            title: 'Mango. Inc',
            address: "Mango. Inc Apto. 761 13975 Santos Travessa,  Câmara de Lobos, UT 4431"
        }
    ]
  


  return (
    <>
    <div className='custom-modal invoice-send-preview'>
        <div className='card'>
            <div className='close-btn' >
                <button  onClick={okClicked}>
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.999 15.0005L44.999 45.0005" stroke="#263238" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M45.001 15.0005L15.001 45.0005" stroke="#263238" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
            <div className='lhs'>
                <h1>Send Invoice</h1>
                <div className=' text-input'>
                    <label>Invoice Number</label>
                    <input type='text' value={'INVOICEZGUKS15201'} id='invoice_id' className='form-control' disabled={true} />
                </div>
                <div className='address-from-select'>
                    <label>From</label>
                    <div className="custom-select form-control form-select" id="address_from" name="address_from"
                        onClick={() => toggleFromList(!FromListOpened)}>
                        <div className="selected-value">{formData.address_from ? formData.address_from : "Select"}
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
                            {AddressList.map(option => (
                                <div 
                                    key={option.id} 
                                    className='option' 
                                    onClick={() => selectAddress('address_from',option.title)}
                                >
                                {option.title}
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='address-to-select'>
                    <label>Send To</label>
                    <div className="custom-select form-control form-select" id="address_to" name="address_to"
                        onClick={() => toggleToList(!ToListOpened)}>
                        <div className="selected-value">{formData.address_to ? formData.address_to : "Select"}
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
                            {AddressList.map(option => (
                                <div 
                                    key={option.id} 
                                    className='option' 
                                    onClick={() => selectAddress('address_to',option.title)}
                                >
                                {option.title}
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className=' text-input'>
                    <label>Subject</label>
                    <input type='text' id='subject' className='form-control'  />
                </div>
                <div className=' text-area'>
                    <label>Message</label>
                    <textarea type='text' id='message' className='form-control'  />
                    <div className='file'>
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.632401 8.4434C0.937801 8.12791 1.43314 8.12791 1.73878 8.4434L11.8559 18.8857C12.6899 19.7466 13.7853 20.2318 14.9415 20.2521C16.0943 20.2772 17.1557 19.8334 17.9494 19.014C19.5951 17.3152 19.5394 14.4929 17.8255 12.7235C17.8232 12.7211 17.8218 12.7184 17.8194 12.7158L8.21262 2.7998C7.15871 1.71382 5.44505 1.71431 4.39066 2.80198C3.33604 3.89086 3.33604 5.66246 4.39066 6.75134C4.39183 6.75255 4.39254 6.754 4.39371 6.75521L14.1691 16.846C14.1696 16.8464 14.1696 16.8467 14.1701 16.8472C14.6087 17.298 15.3223 17.2978 15.7601 16.846C15.9727 16.6269 16.0903 16.3351 16.0903 16.0249C16.0903 15.7153 15.9737 15.4249 15.7624 15.2059C15.7612 15.2049 15.7601 15.2042 15.7591 15.2032L6.99289 6.15226C6.68749 5.83677 6.68749 5.32593 6.99313 5.01044C7.29876 4.69494 7.79387 4.69494 8.0995 5.01044L16.861 14.0565C16.8627 14.0582 16.8648 14.0592 16.866 14.0609C17.3747 14.585 17.6545 15.283 17.6545 16.0247C17.6545 16.7664 17.3747 17.4634 16.8655 17.989C16.3414 18.5291 15.6526 18.7994 14.9642 18.7994C14.2757 18.7989 13.5869 18.5293 13.063 17.9885C13.0618 17.9873 13.0611 17.9858 13.0597 17.9846L3.28499 7.89485C3.28475 7.89437 3.28429 7.89413 3.28382 7.89365C3.28312 7.89292 3.28241 7.89195 3.28171 7.89123L3.11519 7.71934C3.07257 7.67558 3.03767 7.62747 3.00699 7.57718C1.62613 5.8474 1.7177 3.27703 3.28405 1.65967C4.85087 0.0432725 7.33998 -0.0505297 9.01477 1.37415C9.06349 1.40582 9.11009 1.44209 9.15248 1.48584L18.9323 11.5814C18.9347 11.5836 18.9359 11.5863 18.9377 11.5884C21.2556 13.9881 21.3086 17.8294 19.0553 20.1559C17.9831 21.2626 16.5533 21.8685 15.0188 21.8685C14.9841 21.8685 14.9492 21.8675 14.9146 21.867C13.3508 21.8397 11.8716 21.1862 10.7495 20.0275C10.7486 20.0268 10.7481 20.0256 10.7474 20.0248L0.632401 9.58499C0.327 9.27022 0.327 8.7589 0.632401 8.4434Z" fill="#0B79B7"/>
                        </svg>

                        Invoice-ZGKS15201
                    </div>
                </div>
                <div className='submit-btns'>
                    <button type='button'  className='admin-blue-btn send'>Send Invoice</button>
                    <div className='btns-2'>
                        <button type='button'  className=''>
                            <img src='/images/admin-panel/invoices/download.svg' ></img>
                            Download
                        </button>
                        <button type='button'  className=''>
                            <img src='/images/admin-panel/invoices/print.svg' ></img>
                            Print
                        </button>
                    </div>
                </div>
            </div>
            <div className='rhs'>
            <div className=''>
                <InvoicePreview />
                <div className="footer-invoice">
                    <div className='hr'></div>
                    <div className='text'>Thank you for the support</div>
                    <div className='hr'></div>
                </div>
            </div>
            </div>

            
            
        
        </div>
            
        
    </div>
    {isLoading && <FixedOverlayLoadingSpinner />} 
    <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={loadPage} />
    {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={()=> navigate('/admin/job/list/')} />}
    </>
  );
};

export default InvoiceSendPopup;