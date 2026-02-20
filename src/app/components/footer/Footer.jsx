'use client';

import Link from 'next/link';
import {
    FaPhone,
    FaMapMarkerAlt,
    FaClock,
    FaInstagram,
    FaTelegram,
    FaFacebookF
} from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import './footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const menuLinks = [
        { href: '/', label: 'Главная' },
        { href: '/menu', label: 'Меню' },
        { href: '/about', label: 'О нас' },
        { href: '/contacts', label: 'Контакты' },
    ];

    const contactInfo = [
        { icon: FaPhone, text: '+998 (94) 778-08-80', href: 'tel:+998947780880' },
        { icon: FiMail, text: 'saidovamarjona49@gmail.com', href: 'mailto:saidovamarjona49@gmail.com' },
        { icon: FaMapMarkerAlt, text: 'г. Бухара, ул. И.Муминова 24', href: 'https://maps.google.com' },
        { icon: FaClock, text: 'Ежедневно: 10:00 - 23:00' },
    ];

    const socialLinks = [
        { icon: FaInstagram, href: 'https://www.instagram.com/ginza_onodera?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', label: 'Instagram' },
        { icon: FaTelegram, href: 'https://t.me/ginza_onodera1', label: 'Telegram' },
    ];

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Колонка 1: О ресторане */}
                    <div className="footer-col">
                        <h3 className="footer-title">GINZA ONODERA</h3>
                        <p className="footer-description">
                            Ресторан японской кухни в самом сердце Бухары.
                            Аутентичные блюда, свежие продукты и неповторимая атмосфера Японии.
                        </p>
                        <div className="footer-social">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link"
                                    aria-label={social.label}
                                >
                                    <social.icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Колонка 2: Меню */}
                    <div className="footer-col">
                        <h4 className="footer-subtitle">Навигация</h4>
                        <ul className="footer-links">
                            {menuLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="footer-link">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Колонка 3: Контакты */}
                    <div className="footer-col">
                        <h4 className="footer-subtitle">Контакты</h4>
                        <ul className="footer-contact">
                            {contactInfo.map((item, index) => (
                                <li key={index}>
                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            className="contact-item"
                                            target={item.href.startsWith('http') ? '_blank' : '_self'}
                                            rel="noopener noreferrer"
                                        >
                                            <item.icon className="contact-icon" />
                                            <span>{item.text}</span>
                                        </a>
                                    ) : (
                                        <div className="contact-item">
                                            <item.icon className="contact-icon" />
                                            <span>{item.text}</span>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Нижняя часть футера */}
                <div className="footer-bottom">
                    <div className="copyright">
                        © {currentYear} GINZA ONODERA. Все права защищены.
                    </div>
                    <div className="developer">
                        Разработано в{' '}
                        <a
                            href="https://akbarsoft.uz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="developer-link"
                        >
                            Akbar Soft
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;