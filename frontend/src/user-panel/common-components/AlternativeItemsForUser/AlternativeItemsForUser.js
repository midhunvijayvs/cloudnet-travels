import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./AlternativeItemsForUser.scss"
import API from '../../../API';
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import AlternativeToppingAddPopup from "../AlternativeToppingAddPopup/AlternativeToppingAddPopup";


const AlternativeItemsForUser = ({ setterFunction, restaurantId, mainItem, addAlternative }) => {
    const popupRef = useRef(null);
    const navigate = useNavigate()
    const [message, setMessage] = useState(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [menuData, setMenuData] = useState(null);
    const [ItemSearchInput, setItemSearchInput] = useState('');
    const [isToppingsModalOpen, setIsToppingsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            if (!isToppingsModalOpen) {
                setterFunction(false);
            }
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isToppingsModalOpen]);

    // menuitem search
    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setItemSearchInput(value);
    };

    // Handle selecting an item
    const handleSelectItem = (item, variant) => {
        setItemSearchInput("");
        const updatedItem = { ...item, count: mainItem?.count};
        if (variant) {
            updatedItem.variant = variant?.id
            updatedItem.variant_details = variant.quantity_name
            updatedItem.price = variant.offer_price
        }

        handleAddMenuItem(updatedItem)
        // addAlternative(item)
    };

    // Add to Cart Button
    const handleAddMenuItem = (item) => {
        // setIsLoading(true)
        setSelectedItem(item)
        setIsToppingsModalOpen(true);
    }



    const loadMenuData = () => {
        let apiUrl = `/restaurants/menu-items/?page_size=100&is_available=True&is_published=true`;
        if (ItemSearchInput) {
            apiUrl += `&search_key=${ItemSearchInput}`;
        }
        if (restaurantId) {
            apiUrl += `&restaurant=${restaurantId}`;
        } else {
            return
        }
        setIsLoading(true)
        API.get(apiUrl)
            .then(response => {
                setIsLoading(false)
                setMenuData(response.data);
            })
            .catch(error => {
                setIsLoading(false)
                console.error(error);
            });
    }

    useEffect(() => {
        loadMenuData();
    }, [ItemSearchInput])

    return (
        <div className="custom-modal user-alter-order-popup">
            <div className="card user-alter-order-card" ref={popupRef}>
                <div className='close-btn' >
                    <button onClick={() => setterFunction(false)}>
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.49951 7.5L22.4995 22.5" stroke="#263238" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M22.5005 7.5L7.50049 22.5" stroke="#263238" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                </div>
                <div className='first-screen'>
                    <p>Please choose an alternative item from the list below.</p>
                    <div className="search-container w-100">
                        <input
                            type="text"
                            value={ItemSearchInput}
                            className="tag-input w-100"
                            onChange={handleSearchInputChange}
                            placeholder="Search food item..."
                        />
                        {menuData && menuData.results?.length > 0 ? (
                            <div className="search-result-container">
                                <ul className="dropdown">
                                    {menuData.results.map((item, index) => (
                                        <div className="menu-item" key={index}>
                                            <li
                                                className="dropdown-item"
                                                onClick={() => handleSelectItem(item, null)}
                                            >
                                                <div className='item-content'>
                                                    <img src={item?.images?.[0]?.image_url}></img>
                                                    {item.name}
                                                </div>
                                                <div>
                                                    £{item.offer_price}
                                                </div>
                                            </li>
                                            {item.variants_details?.length > 0 &&
                                                item.variants_details.map((variant, idx) => (
                                                    <li className='dropdown-item variant' key={idx}
                                                        onClick={() => handleSelectItem(item, variant)} >
                                                        <div className='item-content'>
                                                            {/* <img src={item?.images?.[0]?.image_url}></img> */}
                                                            {variant.quantity_name}
                                                        </div>
                                                        <div>
                                                            £{variant.offer_price}
                                                        </div>
                                                    </li>
                                                ))}
                                        </div>
                                    ))}
                                </ul>
                            </div>
                        ) :
                            isLoading ? (
                                null
                            ) :
                                (
                                    <div className="no-data">
                                        No Results!
                                    </div>
                                )}


                    </div>

                </div>
            </div>
            {isToppingsModalOpen && <AlternativeToppingAddPopup setterFunction={setIsToppingsModalOpen} selectedItem={selectedItem}
                setSelectedItem={setSelectedItem} addAlternative={addAlternative} />}

            <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
            {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}
            {isLoading && <FixedOverlayLoadingSpinner />}
        </div>
    )
}


export default AlternativeItemsForUser