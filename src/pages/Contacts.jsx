import './Contacts.css';
import contactImage from '/images/contact.jpg';

export default function Contacts() {
  return (
    <main className="contacts-container">
      <div className="contact-info fade-in">
        <h1>Связаться с нами</h1>
        <p>По любым вопросам, предложениям или сотрудничеству — мы всегда на связи.</p>

        <div className="contact-block">
          <h2>Основатель проекта</h2>
          <p><strong>Карелина Мария Дмитриевна</strong></p>
          <p><a href="tel:+375336908805">+375 (33) 690-88-05</a></p>
          <p><a href="mailto:info@libro.by">info@libro.by</a></p>
          <p>Минск, ул. Академика Книги, д. 10</p>
        </div>

        <form className="contact-form">
          <h2>Форма обратной связи</h2>
          <input type="text" placeholder="Ваше имя" required />
          <input type="email" placeholder="Email для ответа" required />
          <textarea placeholder="Ваше сообщение" rows="5" required></textarea>
          <button type="submit">Отправить</button>
        </form>
      </div>

      <div className="contact-image fade-in">
        <img src={contactImage} alt="Контакты Libro.by" />
        <iframe
            className="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2351.742732!2d27.561881!3d53.902496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dbcfb8f1e1b1a1%3A0x1a2b3c4d5e6f7g8h!2z0JrQvtC80L7QvdC-0LzQuNGC0LXRgiDQn9C-0YDRg9Cz0L7QstCwLCAxMCwg0JzQvtGB0LrQstCwLCDQnNC-0YHQutCy0LAsINCa0LjQtdCy0LDRgNC90LAsIDIzMDAwMA!5e0!3m2!1sru!2sby!4v1610000000000!5m2!1sru!2sby"
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Карта — ул. Академика Книги, 10"
            ></iframe>
      </div>
    </main>
  );
}
