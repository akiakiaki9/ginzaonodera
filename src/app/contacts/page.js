'use client';

import Link from 'next/link';
import {
    FaPhone,
    FaClock,
    FaEnvelope,
    FaMapMarkerAlt,
    FaChevronRight,
    FaHome
} from 'react-icons/fa';
import './contacts.css';

const ContactPage = () => {
    const contactInfo = [
        {
            icon: FaPhone,
            title: 'Телефон',
            items: [
                { value: '+998 (94) 778-08-80', href: 'tel:+998947780880' },
                { value: '+998 (91) 715-08-80', href: 'tel:+998917150880' }
            ]
        },
        {
            icon: FaEnvelope,
            title: 'Email',
            items: [
                { value: 'saidovamarjona49@gmail.com', href: 'mailto:saidovamarjona49@gmail.com' }
            ]
        },
        {
            icon: FaClock,
            title: 'Время работы',
            items: [
                { value: 'Пн-Чт: 10:00 - 23:00' },
                { value: 'Пт-Вс: 10:00 - 23:00' }
            ]
        },
        {
            icon: FaMapMarkerAlt,
            title: 'Адрес',
            items: [
                { value: 'г. Бухара, ул. И.Муминова 24' },
                { value: 'Напротив «Buxoro savdo majmuasi»"' }
            ]
        }
    ];

    return (
        <div className="contact-page">
            {/* Hero секция с хлебными крошками */}
            <div className="contact-hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-title">Контакты</h1>
                    <div className="breadcrumbs">
                        <Link href="/" className="breadcrumb-link">
                            <FaHome className="breadcrumb-icon" />
                            Главная
                        </Link>
                        <FaChevronRight className="breadcrumb-separator" />
                        <span className="breadcrumb-current">Контакты</span>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Два блока рядом */}
                <div className="contact-grid">
                    {/* Левый блок - информация */}
                    <div className="contact-info-block">
                        <h2 className="block-title">
                            Свяжитесь с нами
                        </h2>
                        <p className="block-subtitle">
                            Мы всегда рады ответить на ваши вопросы и принять заказы
                        </p>

                        <div className="info-grid">
                            {contactInfo.map((section, idx) => (
                                <div key={idx} className="info-section">
                                    <div className="section-header">
                                        <section.icon className="section-icon" />
                                        <h3 className="section-title">{section.title}</h3>
                                    </div>
                                    <div className="section-content">
                                        {section.items.map((item, i) => (
                                            item.href ? (
                                                <a
                                                    key={i}
                                                    href={item.href}
                                                    className="info-item-link"
                                                >
                                                    {item.value}
                                                </a>
                                            ) : (
                                                <p key={i} className="info-item">
                                                    {item.value}
                                                </p>
                                            )
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Дополнительная информация */}
                        <div className="info-note">
                            <p>
                                По вопросам бронирования столиков и проведения мероприятий,
                                пожалуйста, свяжитесь с нами по телефону или email.
                            </p>
                        </div>
                    </div>

                    {/* Правый блок - Google Maps */}
                    <div className="contact-map-block">
                        <h2 className="block-title">
                            Мы на карте
                        </h2>
                        <p className="block-subtitle">
                            Легко найти в центре города
                        </p>

                        <div className="map-container">
                            <iframe
                                src="https://yandex.uz/map-widget/v1/?ll=64.432632%2C39.766099&z=16&pt=64.432632%2C39.766099,pm2rdm"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Карта"
                                className="map-iframe"
                            ></iframe>
                        </div>

                        {/* Кнопка открыть в картах */}
                        <a
                            href="https://yandex.uz/maps/-/CPaCmRii"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="map-button"
                        >
                            Открыть в Yandex Maps
                            <FaChevronRight className="button-icon" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;