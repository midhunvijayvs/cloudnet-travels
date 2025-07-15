import React,{useState, useEffect} from 'react';
import '../FilterPopup.scss'
import $ from 'jquery';
import CustomDatePicker from '../CustomDatePicker/CustomDatePicker';

import API from '../../../API';
import ErrorModal from '../../../ErrorModal';


const InvoiceFilter = ({ message,title, state,filters, setFilters, setterFunction, okClickedFunction,setSelectedOptions,selectedOptions  }) => {

    const okClicked=()=>{
      okClickedFunction();
      setterFunction(false);
      setFilters(filters);
    }
    const clearFilters = () => {
      setFilters({
        invoice_status: null,
        invoice_type: null, 
        from_date: null, 
        to_date: null,
        search_key: null,
        sort_order:null,
        period:'By Month'
      });
      setSelectedOptions({})
  };
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [periodOptionListOpened, togglePeriodOptionList] = useState(false)
   
    
    const selectPeriod = (value) => {
        setFilters({
          ...filters,
          "period": value
        });
      }
    const [dateFormat, setDateFormat] = useState("MM/dd/yyyy");
    const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);
    useEffect(() => {
      if (filters.period === 'By Month') {
        setDateFormat("MM/yyyy");
        setShowMonthYearPicker(true);
        setShowYearPicker(false);
      } else if (filters.period === 'By Year') {
        setDateFormat("yyyy");
        setShowYearPicker(true);
        setShowMonthYearPicker(false);
      } else {
        setDateFormat("MM/dd/yyyy");
        setShowMonthYearPicker(true);
        setShowYearPicker(false);
      }
    }, [filters.period,showMonthYearPicker,showYearPicker]);
  
    
    
      
    useEffect(() => {
      const $OptionDropList = $("#period .option-list");
      if (periodOptionListOpened) {
        const height = $OptionDropList[0].scrollHeight;
        $OptionDropList.animate({ height: height + "px" }, 400);
        $OptionDropList.css("opacity", "1");
      } else {
        $OptionDropList.animate({ height: "0px" }, 400);
        $OptionDropList.css("opacity", "0");
      }
    }, [periodOptionListOpened])

    const handleStatusChange = (value) => {
        setFilters({ ...filters, status:value });
    };
    const handleInvoiceTypeChange = (value) => {
      setFilters({ ...filters, invoice_type:value });
  };

    const getLastDayOfMonth = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const lastDay = new Date(year, month, 0);
      return lastDay.getDate();
    };
    const handleStartDateChange = (date) => {
        if (filters.to_date && new Date(date) > new Date(filters.to_date)) {
          setErrorMessage("From date cannot be greater than To date");
            setIsErrorModalOpen(true)
            return;
        }
        const formattedDate = date.toISOString().slice(0, 10);
        setFilters({ ...filters, from_date: formattedDate });
    };
    

    const handleEndDateChange = (date) => {
      let endDate;
      if (filters.period === 'By Month'){
        const lastDayOfMonth = getLastDayOfMonth(date);
        endDate = new Date(date.getFullYear(), date.getMonth(), lastDayOfMonth);
      } else if (filters.period === 'By Year') {
        endDate = new Date(date.getFullYear(), 11, 31); 
      }

      if (filters.from_date && new Date(endDate) < new Date(filters.from_date)) {
        setErrorMessage("To date cannot be less than From date");
        setIsErrorModalOpen(true)
        return;
      }
      
      const formattedDate = endDate.toISOString().slice(0, 10);
      setFilters({ ...filters, to_date: formattedDate });
    };
  

  return (
    <div className='custom-modal filter-modal jobs'>
        <div className='card'>
            <div className='close-btn' >
                <button  onClick={okClicked}>
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.49951 7.5L22.4995 22.5" stroke="#263238" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M22.5005 7.5L7.50049 22.5" stroke="#263238" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                </button>
                

            </div>
            <div className='card-content'>
                <div className='heading'>
                  <h1>Filter options</h1>
                  <div className='clr-btn' onClick={clearFilters}>
                    Clear All
                  </div>
                </div>
                <div className='option'>
                    <span className='option-title'>Status</span>
                    <div className='options-list'>
                      <label className="custom-select-box">
                          <input 
                              type="radio" 
                              name="status" 
                              value="send" 
                              checked={filters.status=="send"} 
                              onChange={() => handleStatusChange("send")} 
                          />
                          <span className="checkmark"></span>
                          <h4>Send</h4>
                      </label>
                      <label className="custom-select-box">
                          <input 
                              type="radio" 
                              name="status" 
                              value="paid" 
                              checked={filters.status=="paid"} 
                              onChange={() => handleStatusChange("paid")} 
                          />
                          <span className="checkmark"></span>
                          <h4>Paid</h4>
                      </label>
                      <label className="custom-select-box">
                          <input 
                              type="radio" 
                              name="status" 
                              value="overdue" 
                              checked={filters.status=="overdue"} 
                              onChange={() => handleStatusChange("overdue")} 
                          />
                          <span className="checkmark"></span>
                          <h4>Overdue</h4>
                      </label>
                      <label className="custom-select-box">
                          <input 
                              type="radio" 
                              name="status" 
                              value="pending" 
                              checked={filters.status=="pending"} 
                              onChange={() => handleStatusChange("pending")} 
                          />
                          <span className="checkmark"></span>
                          <h4>Pending</h4>
                      </label>
                  </div>
                </div>
                <div className='option'>
                    <span className='option-title'> Type</span>
                    <div className='options-list'>
                      <label className="custom-select-box">
                          <input 
                              type="radio" 
                              name="invoice_type" 
                              value="all" 
                              checked={filters.invoice_type=="all"} 
                              onChange={() => handleInvoiceTypeChange("all")} 
                          />
                          <span className="checkmark"></span>
                          <h4>All</h4>
                      </label>
                      <label className="custom-select-box">
                          <input 
                              type="radio" 
                              name="invoice_type" 
                              value="service" 
                              checked={filters.invoice_type=="service"} 
                              onChange={() => handleInvoiceTypeChange("service")} 
                          />
                          <span className="checkmark"></span>
                          <h4>Service</h4>
                      </label>
                      <label className="custom-select-box">
                          <input 
                              type="radio" 
                              name="invoice_type" 
                              value="contract" 
                              checked={filters.invoice_type=="contract"} 
                              onChange={() => handleInvoiceTypeChange("contract")} 
                          />
                          <span className="checkmark"></span>
                          <h4>Contract</h4>
                      </label>
                      <label className="custom-select-box">
                          <input 
                              type="radio" 
                              name="invoice_type" 
                              value="product" 
                              checked={filters.invoice_type=="product"} 
                              onChange={() => handleInvoiceTypeChange("product")} 
                          />
                          <span className="checkmark"></span>
                          <h4>Product</h4>
                      </label>
                      <label className="custom-select-box">
                          <input 
                              type="radio" 
                              name="invoice_type" 
                              value="custom" 
                              checked={filters.invoice_type=="custom"} 
                              onChange={() => handleInvoiceTypeChange("custom")} 
                          />
                          <span className="checkmark"></span>
                          <h4>Others</h4>
                      </label>
                  </div>
                </div>

                
                <div className='option period'>
                    <span className='option-title period' >Period</span>
                    <div className="form-select custom-select" id="period" name="period"
                        onClick={() => togglePeriodOptionList(!periodOptionListOpened)} >
                        <div className="selected-value">{filters.period ? filters.period : "By Month"}
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
                          <div className='option' onClick={() => selectPeriod("By Month")}>By Month</div>
                          <div className='option' onClick={() => selectPeriod("By Year")}>By Year</div>
                        </div>

                    </div>
                    <CustomDatePicker
                      selected={filters.from_date}
                      dateFormat={dateFormat} placeholder={'From'} 
                      showMonthYearPicker={showMonthYearPicker}
                      showYearPicker={showYearPicker}
                      onChange={(date)=>handleStartDateChange(date)} />

                    <CustomDatePicker
                      selected={filters.to_date}
                      dateFormat={dateFormat} placeholder={'To'} 
                      showMonthYearPicker={showMonthYearPicker}
                      showYearPicker={showYearPicker}
                      onChange={(date)=>handleEndDateChange(date)} />
                </div>
                
                
            </div>
                
        </div>
            
      <ErrorModal state={isErrorModalOpen} message={errorMessage} setterFunction={setIsErrorModalOpen}  />
    </div>
  );
};

export default InvoiceFilter;