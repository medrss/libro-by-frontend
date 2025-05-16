import React, { useState, useEffect, useRef } from 'react';
import './AdminBookForm.css';

export default function AdminBookForm({ token }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: '',
    price: '',
    available: true,
    rentable: false,
    stock: '',
    rental_stock: '',
    description: '',
    image: null,
    categories: []
  });

  const [allCategories, setAllCategories] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/categories')
      .then(res => res.json())
      .then(data => setAllCategories(data))
      .catch(err => console.error('Ошибка загрузки категорий:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file') {
      setFormData({ ...formData, image: files[0] });
    } else if (name === 'price' && value < 0) {
      return; // ❌ Запрещаем отрицательную цену
    } else if (type === 'checkbox' && name === 'rentable') {
      const updatedCategories = checked
        ? [...formData.categories, findRentalCategoryId()]
        : formData.categories.filter(id => id !== findRentalCategoryId());
      setFormData({ ...formData, rentable: checked, categories: updatedCategories });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = parseInt(e.target.value);
    const rentalCategoryId = findRentalCategoryId();
  
    if (e.target.checked) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, categoryId],
        rentable: categoryId === rentalCategoryId ? true : prev.rentable // ✅ Если выбрана "Доступные в аренду", ставим аренду
      }));
    } else {
      const updatedCategories = formData.categories.filter(id => id !== categoryId);
  
      setFormData(prev => ({
        ...prev,
        rentable: categoryId === rentalCategoryId ? false : prev.rentable, // ✅ Если снимается "Доступные в аренду", убираем аренду
        categories: updatedCategories
      }));
    }
  };
  

  const findRentalCategoryId = () => {
    const rentalCategory = allCategories.find(cat => cat.name === "Доступные для аренды");
    return rentalCategory ? rentalCategory.id : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookData = new FormData();
    for (let key in formData) {
      if (key === 'categories') {
        bookData.append('categories', JSON.stringify(formData.categories));
      } else if (key === 'available' || key === 'rentable') {
        bookData.append(key, formData[key] ? 1 : 0);
      } else {
        bookData.append(key, formData[key]);
      }
    }

    const res = await fetch('http://localhost:3000/api/books', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: bookData
    });

    if (res.ok) {
      alert('Книга успешно добавлена');
      setFormData({
        title: '', author: '', year: '', price: '', available: true,
        rentable: false, stock: '', rental_stock: '', description: '', image: null, categories: []
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      const data = await res.json();
      alert(data.message || 'Ошибка при добавлении книги');
    }
  };

  return (
    <form className="admin-book-form" onSubmit={handleSubmit}>
      <h3>Добавить новую книгу</h3>
      <input name="title" placeholder="Название" value={formData.title} onChange={handleChange} required />
      <input name="author" placeholder="Автор" value={formData.author} onChange={handleChange} required />
      <input name="year" type="number" min="0" placeholder="Год издания" value={formData.year} onChange={handleChange} required />
      <input name="price" type="number" step="0.01" min="0" placeholder="Цена" value={formData.price} onChange={handleChange} required />
      <input name="stock" type="number" min="0" placeholder="Количество для покупки" value={formData.stock} onChange={handleChange} />
      <input name="rental_stock" type="number" min="0" placeholder="Количество для аренды" value={formData.rental_stock} onChange={handleChange} />
      <textarea name="description" placeholder="Описание" value={formData.description} onChange={handleChange}></textarea>

      <label>
        <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} />
        Доступна для покупки
      </label>
      <label>
        <input type="checkbox" name="rentable" checked={formData.rentable} onChange={handleChange} />
        Доступна для аренды
      </label>

      <label>Выберите категории:</label>
      <div className="category-checkboxes">
        {allCategories.map(cat => (
          <label key={cat.id}>
            <input
              type="checkbox"
              value={cat.id}
              checked={formData.categories.includes(cat.id)}
              onChange={handleCategoryChange}
            />
            {cat.name}
          </label>
        ))}
      </div>

      <input type="file" accept="image/*" name="image" onChange={handleChange} ref={fileInputRef} required />
      <button className="btn">Добавить книгу</button>
    </form>
  );
}
