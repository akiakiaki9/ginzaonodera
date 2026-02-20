'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './header.css';

const Header = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isContentLoaded, setIsContentLoaded] = useState(false);

    useEffect(() => {
        // Проверяем размер экрана
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Для видео/изображения
        setIsContentLoaded(true);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    return (
        <section className="hero">
            {/* Адаптивный фон */}
            <div className="hero-media-container">
                {isMobile ? (
                    // Для телефонов - видео
                    <video
                        className={`hero-media ${isContentLoaded ? 'loaded' : ''}`}
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster="/images/hero-poster.jpg"
                    >
                        <source src="/videos/ginza.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    // Для ПК и ноутбуков - изображение
                    <img
                        src="/images/header.JPG"
                        alt="Ginza Onodera"
                        className={`hero-media ${isContentLoaded ? 'loaded' : ''}`}
                    />
                )}
                {/* Затемнение для читаемости текста */}
                <div className="hero-overlay"></div>
            </div>

            {/* Контент по центру */}
            <div className="hero-content">
                <h1 className="hero-title">
                    GINZA ONODERA
                </h1>
                <p className="hero-subtitle">
                    Ресторан японской кухни в Бухаре
                </p>
                <div className="hero-buttons">
                    <Link href="/menu" className="hero-btn primary">
                        Посмотреть меню
                    </Link>
                    <Link href="/contacts" className="hero-btn secondary">
                        Связаться с нами
                    </Link>
                </div>
            </div>

            {/* Индикатор скролла */}
            <div className="hero-scroll">
                <span>Листайте вниз</span>
                <div className="hero-scroll-icon"></div>
            </div>
        </section>
    );
};

export default Header;