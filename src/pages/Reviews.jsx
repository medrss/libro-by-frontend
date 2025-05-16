import React, { useEffect, useState, useContext } from 'react';
import './Reviews.css';
import axios from 'axios';
import { UserContext } from "../contexts/UserContext";

export default function Reviews({ bookId }) {
  const { user } = useContext(UserContext);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, pros: '', cons: '', comment: '', image: null });

  // Состояния для модального окна
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/reviews/book/${bookId}`)
      .then(res => setReviews(res.data.reviews || []))
      .catch(error => console.error("Ошибка загрузки отзывов:", error));
  }, [bookId]);

  const handleStarClick = (rating) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!user?.token) {
      alert("Вы должны войти в систему, чтобы оставить отзыв.");
      return;
    }
  
    const formData = new FormData();
    Object.entries(newReview).forEach(([key, value]) => formData.append(key, value));
    formData.append('book_id', bookId);
  
    try {
      const res = await axios.post('http://localhost:3000/api/reviews', formData, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
  
      setReviews(prev => [...prev, res.data]);
      
      // ✅ Сбрасываем поле загрузки изображения
      setNewReview({ rating: 5, pros: '', cons: '', comment: '', image: null });
  
      // ✅ Очищаем форму
      e.target.reset();
  
    } catch (error) {
      console.error('Ошибка добавления отзыва:', error);
      alert(error.response?.data?.message || "Ошибка при добавлении отзыва.");
    }
  };
  

  const validRatings = reviews.map(r => r.rating).filter(rating => typeof rating === "number" && rating > 0);

  const averageRating = validRatings.length > 0
    ? (validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length).toFixed(1)
    : "—";  

  const reviewImages = reviews.filter(r => r.image).map(r => r.image);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const nextImage = () => setCurrentIndex((currentIndex + 1) % reviewImages.length);

  const prevImage = () => setCurrentIndex((currentIndex - 1 + reviewImages.length) % reviewImages.length);

  return (
    <div className="reviews-wrapper">
      {user?.token && <hr className="section-divider" />}
      {user?.token && (
        <form className="review-form" onSubmit={handleSubmit}>
          <h2>Оставить отзыв</h2>
          <div className="stars-select">
            {[1, 2, 3, 4, 5].map(v => (
              <span key={v} className={v <= newReview.rating ? 'star active' : 'star'}
                onClick={() => handleStarClick(v)}>★</span>
            ))}
          </div>
          <input type="text" placeholder="Достоинства" value={newReview.pros}
            onChange={e => setNewReview({ ...newReview, pros: e.target.value })} />
          <input type="text" placeholder="Недостатки" value={newReview.cons}
            onChange={e => setNewReview({ ...newReview, cons: e.target.value })} />
          <textarea placeholder="Ваш отзыв..." value={newReview.comment}
            onChange={e => setNewReview({ ...newReview, comment: e.target.value })} />
          <input type="file" accept="image/*"
            onChange={e => setNewReview({ ...newReview, image: e.target.files[0] })} />
          <button type="submit">Добавить отзыв</button>
        </form>
      )}

      {!user?.token && <hr className="section-divider" />}

      <h2 className="reviews-title" style={{ marginBottom: "1rem" }}>
        Отзывы ({reviews.length}) <span className="avg-rating">★ {averageRating}</span>
      </h2>

      {reviewImages.length > 0 && (
        <div className="review-gallery">
          {reviewImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt="отзыв"
              className="gallery-img"
              onClick={() => openLightbox(idx)}
            />
          ))}
        </div>
      )}

      {reviews.map(r => {
        const shortName = r.full_name?.split(" ").slice(0, 2).join(" ") || "Неизвестный пользователь";
        return (
          <div key={r.id} className="review">
            <div className="review-header">
              <img src={r.user_avatar || '/images/avatarka.png'} alt="avatar" className="avatar" />
              <span className="username">{shortName}</span>
              <span className="stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
            </div>
            <div className="review-content">
              {r.pros && <p><strong>Достоинства:</strong> {r.pros}</p>}
              {r.cons && <p><strong>Недостатки:</strong> {r.cons}</p>}
              {r.comment && <p><strong>Отзыв:</strong> {r.comment}</p>}
              {r.image && (
                <img
                  src={r.image}
                  alt="изображение из отзыва"
                  className="review-img"
                  onClick={() => openLightbox(reviewImages.indexOf(r.image))}
                />
              )}
            </div>
          </div>
        );
      })}

      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <img
            src={reviewImages[currentIndex]}
            alt="просмотр"
            className="lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
          <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>‹</button>
          <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>›</button>
          <button className="lightbox-close" onClick={closeLightbox}>×</button>
        </div>
      )}
    </div>
  );
}
