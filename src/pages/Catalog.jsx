import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Catalog.css';
import banner1 from '../assets/banners/banner1.png';
import banner2 from '../assets/banners/banner2.png';
import axios from 'axios';

export default function Catalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [books, setBooks] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const location = useLocation();

  const banners = [
    { img: banner1, text: 'Скидка 30% при покупке 2-ух книг из детской коллекции' },
    { img: banner2, text: 'Книга за 10 копеек для новых покупателей' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryFromUrl = queryParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
      setActiveCategory(categoryFromUrl);
    }
  }, [location]);

  useEffect(() => {
    axios.get('https://libro-by-backend.onrender.com/api/books')
      .then(response => setBooks(response.data))
      .catch(error => console.error('Ошибка при получении книг:', error));
  }, []);

  const filteredBooks = books.filter(book => {
    return (
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterAuthor ? book.author.toLowerCase().includes(filterAuthor.toLowerCase()) : true) &&
      (filterPrice ? book.price <= parseFloat(filterPrice) : true) &&
      (!selectedCategory || selectedCategory === 'Все книги' ||
        book.categories?.some(cat => cat.toLowerCase().includes(selectedCategory.toLowerCase()))
      )
    );
  });

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setActiveCategory(category);
  };

  const categories = [
    'Все книги',
    'Новинки',
    'Бестселлеры',
    'Детская литература',
    'Комиксы и манга',
    'Фантастика',
    'Детективы',
    'Любовные романы',
    'Психология',
    'Красота и здоровье',
    'Успех, мотивация',
    'Учебные программы',
    'Книги белорусских издательств',
    'Медицина',
    'Доступные для аренды',
  ];

  return (
    <div className="catalog-page fade-in">
      <aside className="catalog-sidebar">
        <h1 className="catalog-title">КАТАЛОГ</h1>
        <nav className="catalog-nav">
          {categories.map(category => (
            <a
              href="#"
              key={category}
              className={activeCategory === category ? 'active-link' : ''}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </a>
          ))}
        </nav>
      </aside>

      <main className="catalog-content">
        <div className="catalog-search-section">
          <input
            type="text"
            placeholder="Поиск"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => setFilterOpen(!filterOpen)}>Фильтры</button>
        </div>

        {filterOpen && (
          <div className="catalog-filters">
            <input
              type="text"
              placeholder="Фильтр по автору"
              value={filterAuthor}
              onChange={(e) => setFilterAuthor(e.target.value)}
            />
            <input
              type="number"
              placeholder="Максимальная цена"
              value={filterPrice}
              onChange={(e) => setFilterPrice(e.target.value)}
            />
          </div>
        )}

    <div className="catalog-banners">
  {window.innerWidth <= 768 ? (
    // Мобильная версия: слайдер
    banners.map((banner, index) => (
      <div
        className={`banner fade-banner ${index === currentBannerIndex ? 'show' : ''}`}
        key={index}
      >
        <img src={banner.img} alt={`Баннер ${index + 1}`} />
        <p>{banner.text}</p>
      </div>
    ))
  ) : (
    // ПК-версия: оба баннера сразу
    banners.map((banner, index) => (
      <div className="banner" key={index}>
        <img src={banner.img} alt={`Баннер ${index + 1}`} />
        <p>{banner.text}</p>
      </div>
    ))
  )}
</div>


       <div className="catalog-mobile-categories">
        {categories.map((category) => (
          <button
            key={category}
            className={activeCategory === category ? 'active-link' : ''}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
        <div className="catalog-books">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book, index) => (
              <div className="book-card" key={index}>
                <img src={`https://libro-by-backend.onrender.com${book.image}`} alt={book.title} />
                <p className="book-price">{book.price} руб.</p>
                <p className="book-title">{book.title}</p>
                <Link
                  to={`/book/${book.id}?from=${encodeURIComponent(activeCategory)}`}
                  className="details-button"
                >
                  Подробнее
                </Link>
              </div>
            ))
          ) : (
            <p>Нет книг по выбранным фильтрам.</p>
          )}
        </div>
      </main>
    </div>
  );
}
