import React, {useState, useEffect} from 'react'
import './AddDataPopup.scss'
import API from '../../../API';
import ErrorModal from '../../../ErrorModal';
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"

const AddDataPopup = ({setterFunction, okClickedFunction,title, addSectionAPI}) => {
    const okClicked=()=>{
      okClickedFunction();
      setterFunction(false)
    }

    

    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const [newItemName, setNewItemName] = useState('');
    const [sectionItems, setsectionItems] = useState([]);
    const numColumns = Math.ceil(sectionItems.length / 10);

    useEffect(() => {
      loadData();
    }, []);

    // Get Item List
    const loadData = () => {
      setIsLoading(true)
      API.get(`${addSectionAPI}/?page_size=1000`)
        .then((response) => {
          setsectionItems(response.data.results)
        })
        .catch((error) => {
          // setMessage(error.response?.data?.message || error.message);
          // setIsErrorModalOpen(true);
          // console.log(error);
        });
      setIsLoading(false)
    }

    const [selectedItems, setSelectedItems] = useState([]);

    const handleCheckboxChange = (event) => {
      const { value, checked } = event.target;
      if (checked) {
        setSelectedItems([...selectedItems, value]);
      } else {
        setSelectedItems(selectedItems.filter(item => item !== value));
      }
  };

    const addItem = () =>{
      if (newItemName.trim()) {
        API.post(`${addSectionAPI}/`,{name:newItemName})
          .then((response) => {
            loadData();
            setNewItemName(''); 
          })
          .catch((error) => {
            setMessage(error.response?.data?.message || error.message);
            setIsErrorModalOpen(true);
            // console.log(error);
          });
      }
    }
  const deleteItems = (itemIds) => {
    // setIsLoading(true);
    console.log('to-delete:',itemIds);
    Promise.all(itemIds.map(itemId => (
        API.delete(`${addSectionAPI}/${itemId}/`)
            .then(() => console.log(`Item ${itemId} deleted successfully.`))
            .catch(error => {
                console.error(`Error deleting item ${itemId}:`, error.message);
                throw error;
            })
        )
    ))
    .then(() => {
        setMessage("Items deleted successfully.");
        // console.log('Items deleted successfully');
        setIsLoading(false);
        loadData();
        setSelectedItems([]);
    }).catch(error => {
        setMessage(error.response?.data?.message || error.message);
        // console.log(error);
        setIsLoading(false);
        setIsErrorModalOpen(true);
    });
  }

  return (
    <div className='custom-modal filter-modal add-modal'>
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
          {/* <span className='heading'>Add {title}</span> */}
          <div className='option'>
            <span className='option-title' >Enter {title}</span>
            <input type='text'className='form-control'
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}  />
          </div>
          <div className='submit-section mt-2'>
            <button className='btn-outlined' onClick={addItem}>
                Add
            </button>
          </div>
          <div className='manage-sec'>
            <div className='title'>
              <span  className='heading'>Manage {title}</span>
              <div className='btns'>
                <button className='delete' onClick={()=>deleteItems(selectedItems)}>
                  <svg width="25" height="25" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 31H8C7.20435 31 6.44129 30.6839 5.87868 30.1213C5.31607 29.5587 5 28.7956 5 28V9C5 8.73478 5.10536 8.48043 5.29289 8.29289C5.48043 8.10536 5.73478 8 6 8C6.26522 8 6.51957 8.10536 6.70711 8.29289C6.89464 8.48043 7 8.73478 7 9V28C7 28.2652 7.10536 28.5196 7.29289 28.7071C7.48043 28.8946 7.73478 29 8 29H24C24.2652 29 24.5196 28.8946 24.7071 28.7071C24.8946 28.5196 25 28.2652 25 28V9C25 8.73478 25.1054 8.48043 25.2929 8.29289C25.4804 8.10536 25.7348 8 26 8C26.2652 8 26.5196 8.10536 26.7071 8.29289C26.8946 8.48043 27 8.73478 27 9V28C27 28.7956 26.6839 29.5587 26.1213 30.1213C25.5587 30.6839 24.7956 31 24 31Z" fill="#212429"/>
                    <path d="M28 7H4C3.73478 7 3.48043 6.89464 3.29289 6.70711C3.10536 6.51957 3 6.26522 3 6C3 5.73478 3.10536 5.48043 3.29289 5.29289C3.48043 5.10536 3.73478 5 4 5H28C28.2652 5 28.5196 5.10536 28.7071 5.29289C28.8946 5.48043 29 5.73478 29 6C29 6.26522 28.8946 6.51957 28.7071 6.70711C28.5196 6.89464 28.2652 7 28 7Z" fill="#212429"/>
                    <path d="M20 7C19.7348 7 19.4804 6.89464 19.2929 6.70711C19.1054 6.51957 19 6.26522 19 6V3H13V6C13 6.26522 12.8946 6.51957 12.7071 6.70711C12.5196 6.89464 12.2652 7 12 7C11.7348 7 11.4804 6.89464 11.2929 6.70711C11.1054 6.51957 11 6.26522 11 6V2C11 1.73478 11.1054 1.48043 11.2929 1.29289C11.4804 1.10536 11.7348 1 12 1H20C20.2652 1 20.5196 1.10536 20.7071 1.29289C20.8946 1.48043 21 1.73478 21 2V6C21 6.26522 20.8946 6.51957 20.7071 6.70711C20.5196 6.89464 20.2652 7 20 7Z" fill="#212429"/>
                    <path d="M16 26C15.7348 26 15.4804 25.8946 15.2929 25.7071C15.1054 25.5196 15 25.2652 15 25V11C15 10.7348 15.1054 10.4804 15.2929 10.2929C15.4804 10.1054 15.7348 10 16 10C16.2652 10 16.5196 10.1054 16.7071 10.2929C16.8946 10.4804 17 10.7348 17 11V25C17 25.2652 16.8946 25.5196 16.7071 25.7071C16.5196 25.8946 16.2652 26 16 26Z" fill="#212429"/>
                    <path d="M21 24C20.7348 24 20.4804 23.8946 20.2929 23.7071C20.1054 23.5196 20 23.2652 20 23V13C20 12.7348 20.1054 12.4804 20.2929 12.2929C20.4804 12.1054 20.7348 12 21 12C21.2652 12 21.5196 12.1054 21.7071 12.2929C21.8946 12.4804 22 12.7348 22 13V23C22 23.2652 21.8946 23.5196 21.7071 23.7071C21.5196 23.8946 21.2652 24 21 24Z" fill="#212429"/>
                    <path d="M11 24C10.7348 24 10.4804 23.8946 10.2929 23.7071C10.1054 23.5196 10 23.2652 10 23V13C10 12.7348 10.1054 12.4804 10.2929 12.2929C10.4804 12.1054 10.7348 12 11 12C11.2652 12 11.5196 12.1054 11.7071 12.2929C11.8946 12.4804 12 12.7348 12 13V23C12 23.2652 11.8946 23.5196 11.7071 23.7071C11.5196 23.8946 11.2652 24 11 24Z" fill="#212429"/>
                  </svg>
                  
                </button>
                <button className='refresh' onClick={loadData}>
                  <svg width="25" height="25" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.41198 21.3389C6.23792 21.3391 6.06726 21.2907 5.91912 21.1993C5.77098 21.1079 5.65122 20.9771 5.57323 20.8214C4.46614 18.6188 4.08226 16.1229 4.47626 13.6893C4.87025 11.2558 6.02205 9.00854 7.76761 7.2677C12.3414 2.69332 19.7839 2.69332 24.3576 7.2677C24.5284 7.44451 24.6229 7.68132 24.6207 7.92713C24.6186 8.17294 24.52 8.40808 24.3462 8.5819C24.1724 8.75572 23.9372 8.85432 23.6914 8.85645C23.4456 8.85859 23.2088 8.76409 23.032 8.59332C19.1876 4.7502 12.9376 4.7502 9.09324 8.59332C7.62669 10.056 6.65904 11.944 6.32811 13.9887C5.99717 16.0333 6.31982 18.1302 7.25011 19.9808C7.32185 20.1237 7.35585 20.2826 7.34887 20.4424C7.3419 20.6021 7.29417 20.7574 7.21024 20.8935C7.12631 21.0296 7.00896 21.142 6.86935 21.22C6.72974 21.2979 6.57251 21.3389 6.41261 21.3389H6.41198Z" fill="#000"/>
                    <path d="M16.0627 27.2883C14.5223 27.2911 12.9965 26.9895 11.573 26.4009C10.1495 25.8123 8.85627 24.9482 7.76769 23.8583C7.6806 23.7713 7.61152 23.6679 7.56437 23.5542C7.51723 23.4404 7.49295 23.3185 7.49292 23.1954C7.49289 23.0723 7.51711 22.9503 7.5642 22.8366C7.6113 22.7228 7.68033 22.6194 7.76737 22.5324C7.85442 22.4453 7.95776 22.3762 8.0715 22.329C8.18524 22.2819 8.30715 22.2576 8.43028 22.2576C8.5534 22.2576 8.67533 22.2818 8.78909 22.3289C8.90285 22.376 9.00623 22.445 9.09331 22.532C12.9377 26.3752 19.1877 26.3752 23.0321 22.532C24.4986 21.0694 25.4663 19.1813 25.7972 17.1367C26.1281 15.092 25.8055 12.9951 24.8752 11.1445C24.7637 10.9223 24.7451 10.6648 24.8235 10.4288C24.9018 10.1928 25.0707 9.99758 25.293 9.88611C25.5153 9.77463 25.7727 9.75603 26.0088 9.83438C26.2448 9.91274 26.44 10.0816 26.5514 10.3039C27.4486 12.0923 27.8733 14.0804 27.785 16.0793C27.6968 18.0781 27.0985 20.0211 26.0473 21.7234C24.996 23.4258 23.5266 24.8308 21.7789 25.8048C20.0313 26.7789 18.0635 27.2896 16.0627 27.2883Z" fill="#000"/>
                    <path d="M19.7006 9.26558C19.4608 9.26437 19.2305 9.17128 19.0572 9.00545C18.8839 8.83962 18.7807 8.61367 18.769 8.3741C18.7572 8.13452 18.8377 7.89955 18.9939 7.71753C19.1501 7.53551 19.3702 7.42029 19.6087 7.39558L22.5731 7.09995L21.9787 4.12058C21.9334 3.87805 21.9855 3.62742 22.1237 3.42304C22.2619 3.21866 22.4751 3.07701 22.7171 3.02881C22.9591 2.98061 23.2103 3.02975 23.4163 3.16556C23.6223 3.30138 23.7665 3.51293 23.8175 3.75433L24.6137 7.74995C24.6393 7.87823 24.6378 8.01043 24.6092 8.13808C24.5807 8.26572 24.5257 8.38597 24.4479 8.49111C24.3701 8.59624 24.2711 8.68392 24.1574 8.74852C24.0436 8.81312 23.9176 8.85321 23.7875 8.8662L19.795 9.26433C19.7631 9.26433 19.7319 9.26558 19.7006 9.26558Z" fill="#000"/>
                    <path d="M9.22578 28.1248C9.00904 28.1247 8.79905 28.0494 8.63154 27.9119C8.46404 27.7744 8.34936 27.583 8.30703 27.3705L7.51078 23.378C7.48519 23.2496 7.48675 23.1174 7.51535 22.9897C7.54395 22.862 7.59896 22.7417 7.67685 22.6366C7.75473 22.5315 7.85376 22.4438 7.96757 22.3792C8.08138 22.3147 8.20744 22.2746 8.33765 22.2617L12.3302 21.8636C12.5775 21.8387 12.8247 21.9132 13.0172 22.0705C13.2097 22.2279 13.3318 22.4553 13.3567 22.7027C13.3816 22.95 13.3071 23.1972 13.1498 23.3897C12.9924 23.5822 12.765 23.7044 12.5177 23.7292L9.55328 24.0248L10.147 27.0042C10.1741 27.1403 10.1707 27.2808 10.1369 27.4154C10.1032 27.55 10.0399 27.6755 9.95178 27.7827C9.86364 27.8899 9.75279 27.9762 9.62724 28.0354C9.50169 28.0946 9.36457 28.1251 9.22578 28.1248Z" fill="#000"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className='page-select'>
              <div className="custom-page-select">
                <div className="select-container">
                  <div className="checkbox-container">
                      {[...Array(numColumns)].map((_, columnIndex) => (
                          <div key={columnIndex} className="column">
                              {sectionItems.slice(columnIndex * 10, (columnIndex + 1) * 10).map(item => (
                                  <label key={item.id} className="custom-select-box" htmlFor={item.id}>
                                      <input type="checkbox" id={item.id} name={item.id} value={item.id}
                                        onChange={handleCheckboxChange} 
                                        />
                                      <span className="checkmark"></span>
                                      {item.name}
                                  </label>
                              ))}
                          </div>
                      ))}

            
                  </div>
                </div>
              </div>

          </div>
            


          </div>
        </div>
      </div>
    
    {isLoading && <FixedOverlayLoadingSpinner />}
    <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
    </div>
  )
}

export default AddDataPopup;