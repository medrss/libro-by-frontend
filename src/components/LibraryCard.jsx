import React, { useEffect, useState } from 'react';
import './LibraryCard.css';

export default function LibraryCard({ token }) {
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/my-rentals', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setRentals(data);
      } catch (err) {
        console.error('Ошибка при загрузке аренд:', err);
      }
    };

    fetchRentals();
  }, [token]);

  return (
    <div className="library-card">
      <h3>Читательский билет</h3>
      {rentals.length === 0 ? (
        <p>Нет активных или завершённых аренд.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Книга</th>
              <th>Взята</th>
              <th>Вернуть до</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map(r => (
              <tr key={r.id}>
                <td>{r.book_title}</td>
                <td>{new Date(r.rental_date).toLocaleDateString()}</td>
                <td>{new Date(r.return_date).toLocaleDateString()}</td>
                <td>{r.status === 'active' ? 'Активна' : 'Завершена'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
