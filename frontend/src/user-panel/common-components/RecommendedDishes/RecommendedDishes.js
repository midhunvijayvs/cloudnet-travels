import React, { useContext, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import './RecommendedDishes.scss'
import ErrorModal from "../../../ErrorModal.js";
import PositiveModal from "../../../PositiveModal.js";
import API from '../../../API.js';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../authentication/pages/UserContext.js';


const RecommendedDishes = ({ location }) => {
  let navigate = useNavigate();

  const [data, setData] = useState(null);
  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn } = useContext(UserContext);

  const loadData = () => {
    // Ensure latitude and longitude are available
    if (!location?.current_latitude || !location?.current_longitude) {
      return;
    }
    if (isLoggedIn) {
      setIsLoading(true);
      let apiUrl = `/restaurants/recommended-dishes/?latitude=${location?.current_latitude}&longitude=${location?.current_longitude}`;
      API.get(apiUrl)
        .then(response => {
          setData(response.data);
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
          setMessage(error.response?.data?.message || error.message);
          setIsErrorModalOpen(true);
        });
    }
  }
  useEffect(() => {
    loadData()
  }, [location])

  const handleCardClick = (restaurantId) => {
    localStorage.setItem('selectedItemID', restaurantId); // Store item as a string
    navigate('/restaurant-menu')
  }

  return (
    <div className='recommended-dish'>
      {data?.length > 0 &&
        <div className="custom-swiper">
          <div class="loader-line"></div>
          <h2 onClick={loadData}>Recommended Dishes</h2>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={10}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            navigation
            // pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
          >
            {data?.map((item, idx) => (
              <SwiperSlide key={idx}>
                <div className="dish-card" onClick={() => handleCardClick(item.restaurant_details?.id)}>
                  <img className='product-img' src={item.images?.[0]?.image_url ?? ""} alt={item.name} />
                  <div className="dish-info">
                    <div className="d-flex align-items-center gap-2">
                      {item.is_veg ?
                        <img className="img-fluid" src="/images/svg/veg.svg" alt="veg"></img> :
                        <img className="img-fluid" src="/images/svg/nonveg.svg" alt="non-veg"></img>
                      }
                      <h6 className="product-name">{item.name}</h6>
                      {/* <h6 className="customized">Customized</h6> */}
                      {item.base_price !== item.offer_price ?
                        <p className='product-price'>
                          <div className='base-price'>
                            ₹{item.offer_price}
                          </div>
                          / <span className='offer-price'>₹{item.base_price}</span>
                        </p>
                        :
                        <p className='product-price'>
                          <div className='base-price'>
                            ₹{item.base_price}
                          </div>
                        </p>
                      }
                    </div>
                    <div className='restaurant-details'>
                      <img src={item?.restaurant_details?.logo ?? '/images/no-restaurant-img.jpg'} alt={''} />
                      <h6 className="rest-name">
                        {item.restaurant_details?.name}
                      </h6>

                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      }
    </div>
  )
}

export default RecommendedDishes
