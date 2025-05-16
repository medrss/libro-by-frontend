import './About.css';
import happy1 from '/images/happy1.jpg';
import happy2 from '/images/happy2.jpeg';
import happy3 from '/images/happy3.jpg';
import { useState } from 'react';

export default function About() {
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const openImage = (src) => {
    setFullscreenImage(src);
  };

  const closeImage = () => {
    setFullscreenImage(null);
  };

  return (
    <main className="about-container fade-in">
      <section className="about-intro">
        <h1>О Libro.by</h1>
        <p>
          Libro.by — это современная онлайн-платформа для покупки и аренды книг в ближайших магазинах.
          Мы объединяем удобство цифрового выбора с атмосферой настоящих книжных полок.
        </p>
      </section>

      <section className="about-mission">
        <h2>Наша миссия</h2>
        <p>
          Сделать чтение доступным каждому. Libro.by позволяет легко находить нужные книги,
          заказывать их онлайн и забирать в магазине рядом с домом.
        </p>
      </section>

      <section className="about-gallery">
        {[happy1, happy2, happy3].map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Фото ${index + 1}`}
            onClick={() => openImage(img)}
            className="clickable"
          />
        ))}
      </section>
      {fullscreenImage && (
        <div className="fullscreen-overlay" onClick={closeImage}>
          <img src={fullscreenImage} alt="Просмотр фото" className="fullscreen-image" />
        </div>
      )}
    </main>
  );
}
