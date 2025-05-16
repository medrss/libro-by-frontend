import './Home.css';
import bookImage from '/images/book.png';
import leaf1 from '/images/leaf1.png';
import leaf2 from '/images/leaf2.png';
import leaf3 from '/images/leaf3.png';
import { useNavigate } from 'react-router-dom'; 

export default function Home() {
    const navigate = useNavigate(); // создаём навигатор

  const handleCatalogClick = () => {
    navigate('/catalog'); // переходим на каталог
  };
  return (
    <main className="home-container fade-in">
      <div className="text-section">
        <h1 className="slogan">Теперь читать еще проще</h1>
        <p className="description">Выгодная покупка и аренда книг</p>
        <button className="catalog-btn" onClick={handleCatalogClick}>Смотреть каталог</button>
      </div>
      
      <div className="image-section">
        <div className="book-wrapper">
            <img src={bookImage} alt="Книга" className="book-image" />
            <div className="leaf-container">
            <img src={leaf1} alt="Лист 1" className="leaf leaf1" />
            <img src={leaf2} alt="Лист 2" className="leaf leaf2" />
            <img src={leaf3} alt="Лист 3" className="leaf leaf3" />
            </div>
        </div>
        </div>

    </main>
  );
}
