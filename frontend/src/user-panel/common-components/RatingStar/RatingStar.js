import React from 'react';
import './RatingStar.scss'

const RatingStar = ({ rating }) => {
  const fullStar = 'ri-star-fill';
  const halfStar = 'ri-star-half-fill';
  const emptyStar = 'ri-star-line'; // Assuming you have an empty star icon

  const stars = [];
  const roundedRating = Math.round(rating * 2) / 2; // Round to the nearest 0.5

  for (let i = 1; i <= 5; i++) {
    if (roundedRating >= i) {
      stars.push(fullStar);
    } else if (roundedRating >= i - 0.5) {
      stars.push(halfStar);
    } else {
      stars.push(emptyStar);
    }
  }

  return (
    <div className="common-rating-section">
      <ul className="rating-star">
        {stars.map((star, index) => (
          <li key={index}>
            <i className={`${star} star`}></i>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RatingStar;
