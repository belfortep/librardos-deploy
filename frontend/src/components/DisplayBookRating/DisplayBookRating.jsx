import React from 'react';
import Rating from 'react-rating-stars-component';

const BookRatingDisplay = ({ rating }) => {
  return (
    <div>
      <Rating
        count={5}
        value={rating}
        size={24}
        activeColor="#ffd700"
        edit={false}
      />
    </div>
  );
};

export default BookRatingDisplay;