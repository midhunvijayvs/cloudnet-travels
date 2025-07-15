import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./CustomersList.css"

// import CountryFilter from "../common-components/customers-filters/CountryFilter"
// import ZipFilter from "../common-components/customers-filters/ZipFilter"
// import PremiumFilter from "../common-components/customers-filters/PremiumFilter"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"


import Pagination from "../../../Pagination";


const CustomersList = () => {

    let navigate = useNavigate();
    const [data, setData] = useState(null);
    const [filters, setFilters] = useState({
        postcode: null,
        country: null,
        is_premium: null, 
        search_key: null


    });
    const [page, setPage] = useState(1);
    const[pageSize,selectPageSize]=useState(10);




    const [postcodeSelected, selectPostCode] = useState(null);
    const [countrySelected, selectCountry] = useState(null);
    const [isPremiumSelected, setPremium] = useState(false);
    const [searchKey, setSearchKey] = useState(null);

    const [message, setMessage] = useState(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isActionModalOpen, setActionModalOpen] = useState(false);
    const [idSelected, setIdSelected] = useState(0);

    const [isFilterDropOpen, setFilterDropOpen] = useState([false, false, false]);


    const [tabSelected, setTabSelected] = useState(0);


    const [countIndicator, setCountIndicator]=useState([null,null,null,null,null])

    useEffect(() => {
        $(function() {
      $(window).scrollTop(0);
      });
      }, []) 

      

    useEffect(() => {
        setFilterDropOpen([false,false,false])
        console.log("postcodeSelected", postcodeSelected    )
        setFilters(prevFilters => ({
            ...prevFilters, // Copy the existing state object
            postcode: postcodeSelected,
            country: countrySelected,
            is_premium: isPremiumSelected,
            search_key:searchKey
            // Update only the category field
        }));
    }, [postcodeSelected, countrySelected, isPremiumSelected, searchKey])




    useEffect(() => {
        loadTableData();
    }, [page,pageSize, filters,tabSelected]);





    const loadTableData = () => {
        setData(null);
        setIsMessageModalOpen(false);

        let apiUrl = `/users/?page=${page}&page_size=${pageSize}`;
        if (tabSelected === 1) {
            apiUrl = `/users/newcustomers/?page=${page}&page_size=${pageSize}`;
        }
        else if (tabSelected === 2) {
            apiUrl = `/users/abanded/?page=${page}&page_size=${pageSize}`;
        }
        else if (tabSelected === 3) {
            apiUrl = `/users/?page=${page}&page_size=${pageSize}`;    //need to change when defenition of premium customers finalised
        }
        else if (tabSelected === 4) {
            apiUrl = `/users/localcustomers/?page=${page}&page_size=${pageSize}`;
        }
        // Loop through the filters object and append selected filters to the apiUrl
        for (let filter in filters) {
            if (filters[filter] !== null) {
                apiUrl += `&${filter}=${filters[filter]}`;
            }
        }

        API.get(apiUrl)
            .then(response => {
                setData(response.data);
                let temp=[...countIndicator]
        temp[tabSelected]=response.data?.count;
        setCountIndicator(temp)
            })
            .catch(error => {
                setMessage(error.response?.data?.message || error.message);
                setIsErrorModalOpen(true);
            });
    }






    useEffect(() => {
        $(".tab-btn").removeClass("active");
        $(".tab-btn").eq(tabSelected).addClass("active");

        // $(".table-box").css("display", "none");
        // $(".table-box").eq(tabSelected).css("display", "block");

        $(".add-btn").css("display", "none");
        $(".add-btn").eq(tabSelected).css("display", "block");

        setPage(1);
        if (tabSelected === 0) {
            selectPostCode(null);
            selectCountry(null);
            setPremium(false)
        }
        else if (tabSelected === 1) {
            selectPostCode(null);
            selectCountry(null);
            setPremium(false)
        }
        else if (tabSelected === 2) {
            selectPostCode(null);
            selectCountry(null);
            setPremium(false)
        }
        else if (tabSelected === 3) {
            selectPostCode(null);
            selectCountry(null);
            setPremium(false)
        }

        else if (tabSelected === 4) {
            selectPostCode(null);
            selectCountry(null);
            setPremium(false)
        }

        

    }, [tabSelected])


    function toggleTab(index) {
        setTabSelected(index);
    }



    const toggleFilterDropDown = (index) => {

        var temp = [...isFilterDropOpen];
        temp.forEach((item, i) => {
            temp[i] = false
        })

        temp[index] = true
        setFilterDropOpen(temp)
    }




    const Search = (key) => {       
        if(key==="Enter"){      
           const searchKEY=document.getElementById("search-input").value
              
         setSearchKey(searchKEY);
        }   
    }


    const viewDetails=(id)=>{
        window.localStorage.setItem("itemSelectedId",id)
    navigate("/admin/customers/details")
    }
    
    const editItem = () => {
        localStorage.setItem("itemSelectedId", idSelected);
        navigate("/e-commerse-list/customers/edit")
    }
    
    const deleteItem = () => {
        setIsLoading(true)
        API.delete(`/users/${idSelected}`)
            .then(response => {
                setMessage("Item deleted successfully.");
                setIsMessageModalOpen(true)
                setIsLoading(false)
            })
            .catch(error => {
                setMessage(error.response?.data?.message || error.message);
                setIsErrorModalOpen(true);
                setIsLoading(false)
            });
    }



    return (
      <div className='px-0 px-md-4 py-3 full-screen-table-container'>
        <div className='text-between'>
        <h3 className=' mb-2 mb-md-0'>Customers</h3>
           
        </div>

        <div className='d-flex align-items-center my-3'>
            <div className='relative w-100'>
                <input className='nav-search-inp w-100 fw-600' placeholder='Start typing search for customer' id='search-input'  onKeyUp={(e) => Search(e.key)}></input>
                <div className='search-i-position'><i className="fa-solid fa-magnifying-glass"></i></div>
            </div>
        </div>

        <div className='w-100 table-box'>
          <table className="rwd-table mb-2">
            <tbody id='table'>
              <tr>
                  <th>CUSTOMER</th>
                  <th>PHONE</th>
                  <th>EMAIL</th>
                  <th>POSTAL CODE</th>
                  <th>TOTAL SPENT</th>
                  <th className='text-center'>MORE</th>
              </tr>
              
              
              {data&&data.results&&data.results.map((item, index) => {

return (
    <tr key={index}>

                  <td data-th="Customer">
                 {item.first_name} {item.last_name}
                  </td>
                  <td data-th="Phone">
                 {item.phonenumber}
                  </td>
                  <td data-th="Email">
                  {item.email}
                  </td>
                  <td data-th="Postal Code">
                 {item.postcode}
                  </td>
                  <td data-th="Total Spent">
                  {item.total_spent}
                  </td>
                  <td data-th="More">
                  <div className='action-btn-box'>
                    <button onClick={()=>viewDetails(item.id)}><i className="fa-solid fa-eye clr-33363F me-2"></i></button>
                    {/* <button onClick={() => { editItem(item.id) }}><img src='/images/admin-panel/table-edit-icon.svg' /></button> */}
                    {/* <button onClick={() => { setIdSelected(item.id); setIsDeleteConfModalOpen(true) }}><img src='/images/admin-panel/table-delete-icon.svg' /></button> */}
                  </div>
                  </td>

              </tr>

)})}
              
            </tbody>
          </table> 
        </div>
      </div>
    )
  }


export default CustomersList