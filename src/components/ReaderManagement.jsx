import React, { useEffect, useState } from 'react';
import './ReaderManagement.css';

export default function ReaderManagement({ token }) {
  const [readers, setReaders] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedReader, setSelectedReader] = useState(null);
  const [bookQuery, setBookQuery] = useState('');
  const [bookSuggestions, setBookSuggestions] = useState([]);
  const [book_id, setBookId] = useState('');
  const [return_date, setReturnDate] = useState('');
  const [payment_method, setPaymentMethod] = useState('online');
  const [activeRentals, setActiveRentals] = useState([]);
  const [rentalRequests, setRentalRequests] = useState([]);

  // 📌 **Загрузка списка читателей**
  useEffect(() => {
    fetch('http://localhost:3000/api/readers', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setReaders)
      .catch(console.error);
  }, [token]);

  // 📌 **Загрузка запросов на аренду**
  useEffect(() => {
    fetch('http://localhost:3000/api/rental-requests', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setRentalRequests)
      .catch(console.error);
  }, [token]);

  // 📌 **Поиск книг**
  useEffect(() => {
    if (bookQuery.length < 2) {
      setBookSuggestions([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetch(`http://localhost:3000/api/books/search/${bookQuery}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(setBookSuggestions)
        .catch(console.error);
    }, 300);

    return () => clearTimeout(timeout);
  }, [bookQuery, token]);

  // 📌 **Принять или отклонить запрос**
  const updateRentalRequest = async (requestId, status) => {
    const res = await fetch(`http://localhost:3000/api/rental-requests/${requestId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    if (res.ok) {
      alert(`Запрос ${status === 'approved' ? 'подтвержден' : 'отклонен'}`);
      setRentalRequests(rentalRequests.filter(r => r.id !== requestId));
    } else {
      alert("Ошибка при обновлении запроса");
    }
  };

  // 📌 **Оформление аренды**
  const handleCreateRental = async () => {
    if (!selectedReader || !book_id || !return_date) return;

    const res = await fetch('http://localhost:3000/api/rentals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        user_id: selectedReader.id,
        book_id,
        return_date,
        payment_method
      })
    });

    if (res.ok) {
      alert('Аренда оформлена');
      fetchActiveRentals(selectedReader.id);
      setBookQuery('');
      setBookId('');
      setReturnDate('');
    } else {
      const data = await res.json();
      alert(data.message || 'Ошибка оформления аренды');
    }
  };

  // 📌 **Загрузка активных аренд пользователя**
  const fetchActiveRentals = async (user_id) => {
    const res = await fetch(`http://localhost:3000/api/rentals/user/${user_id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setActiveRentals(data);
  };

  // 📌 **Закрытие аренды**
  const closeRental = async (rentalId) => {
    const res = await fetch(`http://localhost:3000/api/rentals/${rentalId}/close`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
      alert('Аренда закрыта');
      fetchActiveRentals(selectedReader.id);
    } else {
      const data = await res.json();
      alert(data.message || 'Ошибка при закрытии аренды');
    }
  };

  // 📌 **Фильтр пользователей**
  const filteredReaders = Array.isArray(readers) ? readers.filter(r =>
    r.full_name.toLowerCase().includes(search.toLowerCase())
  ) : [];

  return (
    <div className="reader-management">
      {/* 📌 Раздел запросов на аренду */}
      <h3>Запросы на аренду</h3>
      <ul>
  {rentalRequests.map(request => (
    <li key={request.id} className="rental-request-item">
      <span>{request.user_name} хочет взять <strong>{request.book_title}</strong> до {new Date(request.requested_return_date).toLocaleDateString()}</span>
      <div>
        <button className="request-btn request-approve" onClick={() => updateRentalRequest(request.id, 'approved')}>Принять</button>
        <button className="request-btn request-deny" onClick={() => updateRentalRequest(request.id, 'denied')}>Отклонить</button>
      </div>
    </li>
  ))}
</ul>


      {/* 📌 Раздел пользователей */}
      <h3>Пользователи с читательским билетом</h3>
      <input
        type="text"
        placeholder="Поиск по ФИО"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul>
        {filteredReaders.map(reader => (
          <li key={reader.id} onClick={() => {
            setSelectedReader(reader);
            fetchActiveRentals(reader.id);
          }}>
            {reader.full_name} ({reader.email})
          </li>
        ))}
      </ul>

      {/* 📌 Форма аренды */}
      {selectedReader && (
        <div className="rental-form">
          <h4>Оформить аренду для {selectedReader.full_name}</h4>

          <input
            type="text"
            placeholder="Название книги"
            value={bookQuery}
            onChange={(e) => {
              setBookQuery(e.target.value);
              setBookId('');
            }}
          />
          {bookSuggestions.length > 0 && (
            <ul className="suggestions">
              {bookSuggestions.map(book => (
                <li key={book.id} onClick={() => {
                  setBookQuery(book.title);
                  setBookId(book.id);
                  setBookSuggestions([]);
                }}>
                  {book.title}
                </li>
              ))}
            </ul>
          )}

          <input
            type="date"
            value={return_date}
            onChange={(e) => setReturnDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
          <select value={payment_method} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="online">Онлайн</option>
            <option value="in_store">В магазине</option>
          </select>
          <button className="btn" onClick={handleCreateRental}>Оформить аренду</button>
          <h4>Активные аренды</h4>
          <ul>
            {activeRentals.map(r => (
                <li key={r.id}>
                {r.book_title}, до {new Date(r.return_date).toLocaleDateString()} — {r.status}
                {r.status === 'active' && (
                    <button onClick={() => closeRental(r.id)}>Закрыть</button>
                )}
                </li>
            ))}
            </ul>
        </div>
      )}
    </div>
  );
}
