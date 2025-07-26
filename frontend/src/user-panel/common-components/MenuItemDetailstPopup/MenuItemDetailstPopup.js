
import React, { useState, useContext } from 'react';
import "../../../CustomPopup.scss";
import "./MenuItemDetailstPopup.scss"
import API from '../../../API'
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import { useNavigate } from 'react-router-dom';

import ErrorModal from "../../../ErrorModal";


import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const MenuItemDetailstPopup = ({
    menuItem,
    setterFunction,
    handleQtyChange,
    setIsDeleteConfirmModalOpen,
    setSelectedItem,
    handleAddToCartButton,
    isWarningModalOpen,
    setIsWarningModalOpen,
    isToppingsModalOpen,
    CartItemAddPopup,
    setIsToppingsModalOpen,
    selectedItem,
    formData,
    setFormData,
    AddToCart,
    isDeleteConfirmModalOpen,
    ConfirmPopup,
    handleRemoveCartItem,
    isDetailsPopupShown,
    isMessageModalOpen,
    PositiveModal,
    setIsMessageModalOpen,
}) => {

    let navigate = useNavigate();


    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);









    return (
        <div className='custom-modal menu-item-details-modal'>
            <div className='card'>

                <div className='first-screen'>
                    <div className='shop-menu-card'>

                        <div className="vertical-product-box-img">
                            {/* <img className="product-img-top w-100 bg-img" src="/images/product/vp-1.png" alt="vp1"></img> */}

                            <Swiper
                                modules={[Navigation, Pagination, Autoplay]}
                                spaceBetween={3}
                                slidesPerView={1}
                                breakpoints={{
                                    640: { slidesPerView: 1 },
                                    768: { slidesPerView: 1 },
                                    1024: { slidesPerView: 1 },
                                }}
                                navigation
                                // pagination={{ clickable: true }}
                                autoplay={{ delay: 1000, disableOnInteraction: false }}
                            >
                                {menuItem.images?.map((item, idx) => (
                                    <SwiperSlide key={idx}>

                                        <img className="product-img-top w-100 bg-img"
                                            src={item?.image_url} alt="vp1">
                                        </img>
                                    </SwiperSlide>
                                ))}
                            </Swiper>


                            {menuItem?.season &&
                                <div className="seller-badge season-special-badge">
                                    <img className="img-fluid badge" src="/images/svg/medal-fill.svg" alt="medal" />
                                    <h6 className='seasonal-text'>{menuItem?.season.replace(/_/g, ' ')} Special</h6>
                                </div>
                            }
                        </div>

                        <div className="vertical-product-body">
                            <div className="d-flex align-items-center justify-content-between">
                                <h4 className="vertical-product-title">
                                    {menuItem?.name}
                                </h4>
                                {menuItem?.average_overall_rating_count > 0 &&
                                    <h6 className="rating-star">
                                        <span className="star"><i className="ri-star-s-fill"></i></span>{menuItem?.average_overall_rating && (menuItem?.average_overall_rating).toFixed(1)}
                                    </h6>
                                }
                            </div>
                            <div className='product-price-box'>
                               
                                <p className='quantity'>{menuItem?.quantity} {menuItem?.unit_details?.name}</p>
                                <div className='d-flex align-items-center'>
                                    <p className='category me-5'>{menuItem?.category_details?.name}</p>
                                    {menuItem.cuisine_details.name&&<p className='cuisine'>{menuItem.cuisine_details.name}</p>}
                                </div>

                                <div className='d-flex align-items-center justify-content-between'>
                                    {menuItem.base_price !== menuItem.offer_price ?
                                        <h2 className="theme-color fw-semibold">
                                            ₹{menuItem.offer_price} <span>/ <del>₹{menuItem.base_price}</del></span>
                                        </h2>
                                        :
                                        <h2 className="theme-color fw-semibold">
                                            ₹{menuItem.base_price}
                                        </h2>
                                    }
                                    <div>
                                        {menuItem.is_veg ?
                                            <img className="veg-icon" src="/images/svg/veg.svg" alt="veg"></img> :
                                            <img className="veg-icon" src="/images/svg/nonveg.svg" alt="non-veg"></img>
                                        }
                                    </div>

                                </div>
                                {menuItem.is_available ?
                                    (
                                        <>
                                            {menuItem.cart_item ? (
                                                <div className='d-flex align-items-center justify-content-start gap-3 py-2'>
                                                    <div className="plus-minus">
                                                        <i className="ri-subtract-line sub"
                                                            onClick={(e) => handleQtyChange('minus', null, menuItem?.cart_item?.id, menuItem?.cart_item?.count)}>
                                                        </i>
                                                        <input type="number" value={menuItem?.cart_item?.count ?? 0} min="1" max="10" disabled></input>
                                                        <i className="ri-add-line add"
                                                            onClick={(e) => handleQtyChange('plus', null, menuItem?.cart_item?.id, menuItem?.cart_item?.count)}>
                                                        </i>
                                                    </div>
                                                    <i className="ri-delete-bin-line delete"
                                                        onClick={() => { setIsDeleteConfirmModalOpen(true); setSelectedItem(menuItem?.cart_item) }}>
                                                    </i>
                                                    <span className='in-cart-msg'>Already in your cart!</span>
                                                </div>
                                            ) : (
                                                <button className="btn theme-outline add-btn mt-1" disabled={!menuItem.is_available}
                                                    onClick={() => { handleAddToCartButton(menuItem); setSelectedItem(menuItem) }} >
                                                    ADD TO CART
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <button className="closed-tag" disabled={!menuItem.is_available}>
                                            Not Available
                                        </button>
                                    )}
                            </div>
                            <div>

                                <h4 className='description-title'>Description</h4>
                                <h5 className="description-text">
                                    {menuItem.description}
                                </h5>

                            </div>
                            <div>

                                <h4 className='description-title'>Nutritions</h4>
                                {menuItem.nutrition_details.length > 0 ? menuItem.nutrition_details.map((nutriItem, index) => {
                                    return (
                                        <div className='nutrition-row' key={index}>
                                            <h5 className="description-text">{nutriItem.attribute_name}</h5>
                                            :
                                            <h5 className="description-text">{nutriItem.value}</h5>
                                        </div>
                                    )
                                }
                                )
                                    :
                                    <h5 className="description-text">No nutritional info available.</h5>

                                }
                            </div>
                        </div>

                        {/* Warning Modal */}
                        {isWarningModalOpen &&
                            <div className='custom-modal '>
                                <div className='card'>
                                    <div className='first-screen'>
                                        <img src='/images/icons/svg/warning.svg'></img>
                                        <h1>Allergy Warning</h1>
                                        <p>{message}</p>
                                        <div className='footer justify-content-center'>
                                            {/* <button type='button' className='cancel-button' onClick={() => { setIsWarningModalOpen(false) }}>Cancel</button> */}
                                            <button type='button' className='ok-button' onClick={() => { setIsWarningModalOpen(false) }}>Proceed</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        {/* {isToppingsModalOpen && <ToppingAddPopup setterFunction={setIsToppingsModalOpen} selectedItem={selectedItem?.id} formData={formData} setFormData={setFormData} okClickedFunction={AddToCart} />} */}
                        {isToppingsModalOpen && <CartItemAddPopup setterFunction={setIsToppingsModalOpen} selectedItem={selectedItem} formData={formData} setFormData={setFormData} okClickedFunction={AddToCart} />}

                        {isDeleteConfirmModalOpen &&
                            <ConfirmPopup setterFunction={setIsDeleteConfirmModalOpen} okClickedFunction={() => handleRemoveCartItem(selectedItem)}
                                title={'Remove'}
                                message={'Are you sure you want to remove this item from your cart?'} />
                        }


                    </div>
                    <div className='footer'>
                        <button type='button' className='cancel-button' onClick={() => { setterFunction(false) }}>Close</button>
                        <button type='button' className='ok-button' onClick={() => { handleAddToCartButton(menuItem); setSelectedItem(menuItem) }}>   Add To Cart</button>

                    </div>
                </div>

            </div>
            <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
            {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}
            {isLoading && <FixedOverlayLoadingSpinner />}

        </div>
    );
};

export default MenuItemDetailstPopup;

