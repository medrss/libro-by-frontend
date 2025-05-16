import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './BookDetails.css';
import Reviews from './Reviews';
import { UserContext } from "../contexts/UserContext";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromCategory = new URLSearchParams(location.search).get('from');

  const { user } = useContext(UserContext);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 360;

  // 📌 Запрос аренды книги
  const [showRentalForm, setShowRentalForm] = useState(false);
  const [requestedReturnDate, setRequestedReturnDate] = useState('');

  const addToCart = async () => {
    if (!user) {
      alert("Вы должны войти в аккаунт!");
      return;
    }
  
    try {
      // 📌 Получаем текущую корзину
      const cartRes = await fetch('https://libro-by-backend.onrender.com/api/cart', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const cartData = await cartRes.json();
  
      // 📌 Проверяем, есть ли товар уже в корзине
      const existingItem = cartData.find(item => item.book_id === book.id);
  
      // 📌 Если товар уже в корзине, увеличиваем количество
      if (existingItem) {
        const res = await fetch('https://libro-by-backend.onrender.com/api/cart/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({ book_id: book.id, quantity: existingItem.quantity + 1 })
        });
  
        if (res.ok) {
          alert("Количество товара увеличено!");
        } else {
          alert("Ошибка обновления корзины");
        }
      } else {
        // 📌 Если товара нет в корзине, добавляем его
        const res = await fetch('https://libro-by-backend.onrender.com/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({ book_id: book.id, quantity: 1 })
        });
  
        const data = await res.json();
        alert(data.message || "Ошибка при добавлении в корзину");
      }
    } catch (error) {
      console.error("Ошибка добавления в корзину:", error);
    }
  };
  
  const requestRental = async () => {
    if (!user) {
      alert("Вы должны войти в аккаунт!");
      return;
    }
    if (!requestedReturnDate) {
      alert("Выберите дату возврата!");
      return;
    }

    try {
      const res = await fetch('https://libro-by-backend.onrender.com/api/rental-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          user_id: user.id,
          book_id: book.id,
          requested_return_date: requestedReturnDate
        })
      });

      if (res.ok) {
        alert("Запрос на аренду отправлен!");
        setShowRentalForm(false);
        setRequestedReturnDate('');
      } else {
        alert("Ошибка при отправке запроса");
      }
    } catch (error) {
      console.error("Ошибка запроса:", error);
    }
  };

  // 📌 Загрузка книги
  useEffect(() => {
    fetch(`https://libro-by-backend.onrender.com/api/books/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Книга не найдена");
        return res.json();
      })
      .then(data => {
        setBook(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // 📌 Возвращение назад
  const handleBack = () => {
    if (fromCategory) {
      navigate(`/catalog?category=${encodeURIComponent(fromCategory)}`);
    } else {
      navigate(-1);
    }
  };

  if (loading) return <div className="book-details"><p>Загрузка...</p></div>;
  if (error) return <div className="book-details"><p>{error}</p></div>;

  return (
    <div className="book-details fade-in">
      <button className="back-button" onClick={handleBack}>Назад</button>

      <div className="book-details-content">
        <img
          src={`https://libro-by-backend.onrender.com${book.image}`}
          alt={book.title}
          className="book-details-image"
        />

        <div className="book-details-info">
          <h1>{book.title}</h1>
          <div className="book-meta">
            <span><strong>Автор:</strong> {book.author}</span>
            <span><strong>Год издания:</strong> {book.year}</span>
          </div>
          <p className="book-price-details">{book.price} руб.</p>

          <div className="book-status">
            <div className="status-item">
              <span>В наличии</span>
              <span className={book.available ? "checkmark" : "crossmark"}>
                {book.available ? "✔" : "✖"}
              </span>
            </div>

            <div className="status-item">
              <span>Доступно в аренду</span>
              <span className={book.rentable ? "checkmark" : "crossmark"}>
                {book.rentable ? "✔" : "✖"}
              </span>
            </div>
          </div>

          <div className="book-actions">
          {/* 📌 Кнопка "Положить в корзину" только если книга доступна для покупки */}
          {book.available > 0 && (
            <button className="action-button" onClick={addToCart}>Положить в корзину</button>
          )}

          {/* 📌 Кнопка "Взять в аренду" только если книга доступна в аренду */}
          {book.rentable > 0 && (
            <button className="action-button" onClick={() => setShowRentalForm(true)}>Взять в аренду</button>
          )}
        </div>

          {showRentalForm && (
            <div className="rental-request-form">
              <label>Выберите дату возврата:</label>
              <input
                type="date"
                value={requestedReturnDate}
                onChange={(e) => setRequestedReturnDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]} // Минимальная дата - сегодня
              />
              <button onClick={requestRental}>Отправить запрос</button>
              <button onClick={() => setShowRentalForm(false)}>Отмена</button>
            </div>
          )}
          <div className={`book-description ${isExpanded ? 'expanded' : 'collapsed'}`}>
            {isExpanded ? (
              <>
                {book.description.split('\n').map((line, idx) =>
                  line.trim() === '' ? <div key={idx} style={{ height: '8px' }} /> : <p key={idx}>{line}</p>
                )}
                <p>
                  <span className="show-more" onClick={() => setIsExpanded(false)}>Скрыть</span>
                </p>
              </>
            ) : (
              <p>
                {book.description.length > maxLength ? (
                  <>
                    {book.description.slice(0, maxLength - 5)}
                    {book.description.slice(maxLength - 5, maxLength).split("").map((char, index) => (
                      <span key={index} className={`fade-text fade-${index + 1}`}>{char}</span>
                    ))}
                    <span className="show-more" onClick={() => setIsExpanded(true)}>Посмотреть полностью</span>
                  </>
                ) : book.description}
              </p>
            )}
          </div>
        </div>

        <div className="reviews-wrapper">
          <Reviews bookId={book.id} />
        </div>
      </div>
    </div>
  );
}
