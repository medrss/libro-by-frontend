import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext'; // Импортируем UserProvider
import Header from './components/Header';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Contacts from './pages/Contacts';
import About from './pages/About';
import ProfileView from './components/ProfileView';
import './index.css';
import BookDetails from './pages/BookDetails';
import Cart from './components/Cart';

function App() {
  return (
    <UserProvider>
        <Router basename="/libro-by-frontend">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} /> 
          
          {/* Профиль доступен только для авторизованных пользователей */}
          <Route 
            path="/profile" 
            element={<ProfileView />} 
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
