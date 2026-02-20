'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FiSearch,
    FiShoppingCart,
    FiMenu,
    FiX,
    FiPhone
} from 'react-icons/fi';
import DATA from '@/app/utils/data';
import './navbar.css';
import { useCart } from '@/app/context/CartContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const {getCartCount} = useCart();

    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Блокируем скролл при открытом меню
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim() === '') {
            setSearchResults([]);
            setShowSearch(false);
            return;
        }

        const results = DATA
            .filter(item =>
                item.name.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 5);

        setSearchResults(results);
        setShowSearch(true);
    };

    const navLinks = [
        { href: '/', label: 'Главная' },
        { href: '/menu', label: 'Меню' },
        { href: '/about', label: 'О нас' },
        { href: '/contacts', label: 'Контакты' },
    ];

    const phoneNumber = '+998 (94) 778-08-80';

    return (
        <>
            <header className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
                <div className="navbar-container">
                    <Link href="/" className="navbar-brand">
                        <img src="/images/logo.png" alt="" />
                        <p>GINZA ONODERA</p>
                    </Link>

                    {/* Десктоп навигация */}
                    <nav className="navbar-nav">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`navbar-link ${pathname === link.href ? 'active' : ''}`}
                            >
                                {link.label}
                                <span className="navbar-link-underline"></span>
                            </Link>
                        ))}
                    </nav>

                    <div className="navbar-actions">
                        {/* Поиск */}
                        <div className="navbar-search">
                            <FiSearch className="navbar-search-icon" />
                            <input
                                type="text"
                                placeholder="Поиск блюд..."
                                value={searchQuery}
                                onChange={handleSearch}
                                onFocus={() => searchResults.length > 0 && setShowSearch(true)}
                                className="navbar-search-input"
                            />

                            {showSearch && searchResults.length > 0 && (
                                <div className="navbar-search-results">
                                    {searchResults.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={`/product/${item.id}`}
                                            className="navbar-search-item"
                                            onClick={() => {
                                                setShowSearch(false);
                                                setSearchQuery('');
                                            }}
                                        >
                                            <span className="search-item-name">{item.name}</span>
                                            <span className="search-item-price">
                                                {item.price.toLocaleString()} сум
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Телефон */}
                        <a href={`tel:${phoneNumber}`} className="navbar-phone">
                            <FiPhone className="navbar-phone-icon" />
                            <span className="navbar-phone-text">{phoneNumber}</span>
                        </a>

                        {/* Корзина */}
                        <Link href="/cart" className="navbar-cart">
                            <FiShoppingCart className='navbar-cart-icon' />
                            <span className="navbar-cart-badge">{getCartCount()}</span>
                        </Link>

                        {/* Бургер кнопка */}
                        <button
                            className="navbar-burger"
                            onClick={() => setIsMobileMenuOpen(true)}
                            aria-label="Открыть меню"
                        >
                            <FiMenu />
                        </button>
                    </div>
                </div>
            </header>

            {/* Затемнение фона при открытом меню */}
            <div
                className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            ></div>

            {/* Мобильное меню */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-header">
                    <span className="mobile-menu-title">Меню</span>
                    <button
                        className="mobile-menu-close"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <FiX />
                    </button>
                </div>

                <nav className="mobile-nav">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`mobile-link ${pathname === link.href ? 'active' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}

                    <a
                        href={`tel:${phoneNumber}`}
                        className="mobile-link mobile-phone-link"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <FiPhone /> {phoneNumber}
                    </a>
                </nav>
            </div>
        </>
    );
};

export default Navbar;