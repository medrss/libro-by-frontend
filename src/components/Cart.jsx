import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from "../contexts/UserContext";
import './Cart.css';

export default function Cart() {
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // 📌 Загрузка корзины
  useEffect(() => {
    if (!user) return;

    fetch('https://libro-by-backend.onrender.com/api/cart', {
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => {
        setCartItems(data);
        calculateTotal(data);
      })
      .catch(error => console.error("Ошибка загрузки корзины:", error));
  }, [user]);

  // 📌 Подсчёт итоговой суммы
  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  };

  // 📌 Обновление количества
  const updateQuantity = async (book_id, quantity) => {
    if (quantity < 1) return;

    try {
      const res = await fetch('https://libro-by-backend.onrender.com/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ book_id, quantity })
      });

      const data = await res.json();
      if (res.ok) {
        const updated = cartItems.map(item =>
          item.book_id === book_id ? { ...item, quantity } : item
        );
        setCartItems(updated);
        calculateTotal(updated);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Ошибка обновления:", error);
    }
  };

  // 📌 Удаление книги из корзины
  const removeFromCart = async (book_id) => {
    try {
      const res = await fetch('https://libro-by-backend.onrender.com/api/cart/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ book_id })
      });

      const data = await res.json();
      if (res.ok) {
        const updated = cartItems.filter(item => item.book_id !== book_id);
        setCartItems(updated);
        calculateTotal(updated);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Ошибка удаления из корзины:", error);
    }
  };

  if (!user) {
    return <div className="cart-page"><p>Пожалуйста, войдите в аккаунт, чтобы просмотреть корзину.</p></div>;
  }

  if (cartItems.length === 0) {
    return <div className="cart-page"><p>Ваша корзина пуста.</p></div>;
  }

  return (
    <div className="cart-page fade-in">
      <h1 className='h1-cart'>Ваша корзина</h1>
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.book_id} className="cart-item">
            <img src={`https://libro-by-backend.onrender.com${item.image}`} alt={item.title} className="cart-item-image" />
            <div className="cart-item-info">
              <h3>{item.title}</h3>
              <p>Цена: {Number(item.price).toFixed(2)} руб.</p>
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.book_id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.book_id, item.quantity + 1)}>+</button>
              </div>
              <p>Итого: {(Number(item.price) * item.quantity).toFixed(2)} руб.</p>
              <button className="remove-button" onClick={() => removeFromCart(item.book_id)}>Удалить</button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
      <h2>Общая сумма: {Number(totalPrice).toFixed(2)} руб.</h2>
        <button className="checkout-button">Оформить заказ</button>
      </div>
    </div>
  );
}
