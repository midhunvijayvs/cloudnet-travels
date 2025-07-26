import React, { useContext, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import './UnlockCoupons.scss'

import API from '../../../API'

const UnlockCoupons = ({ }) => {
  const [availableCoupons, setAvailableCoupons] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const loadCoupons = () => {
    let apiUrl = `payments/coupon/unlock/`;

    API.get(apiUrl)
      .then(response => {
        setAvailableCoupons(response.data?.unlockable_coupons || [])
      })
      .catch(error => {
        // setMessage(error.response?.data?.message || error.message);
        // setIsErrorModalOpen(true);
      });
  }
  useEffect(() => {
    loadCoupons()
  }, [])

  const getCouponDescription = (data) => {
    const {
      coupon_for,
      loyalty_value,
      single_order_value,
      discount_type,
      discount_value,
      combination,
      combination_details,
      users,
      items
    } = data;

    let discountDescription = '';
    if (discount_type === 'flat') {
      discountDescription = `Get a flat cashback of ₹${discount_value}`;
    } else if (discount_type === 'percentage') {
      discountDescription = `Get up to ${discount_value}% cashback`;
    } else {
      discountDescription = 'Discount details not available.';
    }

    // Add details based on coupon_for
    let additionalDescription = '';
    switch (coupon_for) {
      case 'selected_item':
        const itemNames = items.map(item => item.name).join(', ');
        additionalDescription = ` on selected items: ${itemNames}`;
        break;
      case 'selected_combination':
        const comboName = combination_details.map(item => item.name).join(' + ')
        additionalDescription = ` on the combo: ${comboName}`;
        break;
      default:
        additionalDescription = '';
        break;
    }
    return `${discountDescription}${additionalDescription}`;


  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(index); // Set the copied index to the state
      setTimeout(() => setIsCopied(null), 2000); // Reset after 2 seconds
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div className='unlock-coupons'>
      {availableCoupons?.length > 0 &&
        <div className="custom-swiper">
          <div class="loader-line"></div>
          <h2 className='mb-2'>Unlock Offers</h2>
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={10}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 1 },
              1024: { slidesPerView: 1 },
            }}
            // navigation

            // pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
          >
            {availableCoupons?.map((item, idx) => (
              <SwiperSlide key={idx}>
                <div className="offer-card"
                //  onClick={() => handleCardClick(item.restaurant_details?.id)}
                >
                  {/* Overlay */}
                  <div className="overlay">
                    <i className="ri-lock-fill lock-icon"></i>
                    {/* <div className='unlock-msg'>{item.message}</div> */}
                  </div>
                  <div className="coupon-name">
                    <div className="coupon-img">
                      <img className="img-fluid img"
                        // src={item?.coupon?.restaurant
                        //   ? `${item?.coupon?.restaurant_logo}`
                        //   : '/images/icons/svg/offer.svg'
                        // }
                        src='/images/icons/svg/offer.svg'
                        alt="c1">
                      </img>
                    </div>
                    <div
                      className="coupon-name-content">
                      <h5 className="fw-semibold dark-text">
                        {/* {
                          item?.coupon?.coupon_for === 'selected_item'
                            ? item?.coupon?.items.map(item => item?.name).join(', ')
                            : item?.coupon?.coupon_for === 'selected_combination'
                              ? item?.coupon?.combination_details.map(item => item?.name).join(' + ')
                              : item?.coupon?.restaurant
                                ? item?.coupon?.restaurant_name
                                : item?.coupon?.coupon_code
                        } */}
                        {item?.coupon?.coupon_code}
                      </h5>
                      {/* <h6 className="content-color">Use Gpay</h6> */}
                    </div>
                  </div>
                  <div className="coupon-content">
                    <div className='description'>
                      <h6 className="fw-medium dark-text">
                        {getCouponDescription(item?.coupon)}
                      </h6>
                    </div>
                    <p>
                      Valid on order with items worth ₹{item?.coupon?.single_order_value} or more.
                    </p>
                  </div>
                  <div className="coupon-apply">
                    <h6 className="coupon-code success-color">
                      #{item?.coupon?.coupon_code}
                    </h6>
                    {/* <button className={`btn theme-outline copy-btn mt-0 rounded-2`}
                      onClick={() => copyToClipboard(item?.coupon?.coupon_code, idx)}
                    >
                      {isCopied === idx ? 'Copied!' : 'Copy Code'}
                    </button> */}
                  </div>
                </div>
                <div className='unlock-msg'>{item.message}</div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      }
    </div>
  )
}

export default UnlockCoupons
