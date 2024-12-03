import React, { useContext, useState } from 'react';
import Rating from 'react-rating-stars-component';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const BookRating = ({ bookId }) => {
  const [rating, setRating] = useState(0);
  const { user } = useContext(AuthContext);

  const handleRatingChange = async (newRating) => {
    setRating(newRating);
    try {
      await axios.post(`/api/book/scoreBooks/${bookId}`, { score: newRating, user_id: user._id });
      console.log("ACTUALIZAMOS")
    } catch (error) {
      console.error("Error updating rating", error);
    }
  };

  return (
    <div>
      <h3>Califica este libro:</h3>
      <Rating
        count={5}
        value={rating}
        onChange={handleRatingChange}
        size={24}
        activeColor="#ffd700"
      />
    </div>
  );
};

export default BookRating;