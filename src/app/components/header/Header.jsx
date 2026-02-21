// src/components/header/Header.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import './header.css';

const Header = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isContentLoaded, setIsContentLoaded] = useState(false);
    const videoRefs = useRef([]);

    const videos = [
        '/videos/ginza.mp4',
        '/videos/ginza2.mp4', 
        '/videos/ginza3.mp4'
    ];

    useEffect(() => {
        // Проверяем размер экрана
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Для ПК версии сразу говорим что контент загружен
        if (window.innerWidth > 768) {
            setIsContentLoaded(true);
        }

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    // Управление воспроизведением видео (только для мобилок)
    useEffect(() => {
        if (!isMobile) return;

        const playCurrentVideo = async () => {
            // Останавливаем все видео
            videoRefs.current.forEach((video, index) => {
                if (video) {
                    video.pause();
                    video.currentTime = 0;
                }
            });

            // Запускаем текущее видео
            const currentVideo = videoRefs.current[currentVideoIndex];
            if (currentVideo) {
                try {
                    await currentVideo.play();
                } catch (error) {
                    console.log('Auto-play failed:', error);
                }
            }
        };

        playCurrentVideo();
    }, [currentVideoIndex, isMobile]);

    // Предзагрузка видео (только для мобилок)
    useEffect(() => {
        if (!isMobile) return;

        const preloadVideos = async () => {
            const promises = videoRefs.current.map(video => {
                if (video) {
                    return new Promise((resolve) => {
                        if (video.readyState >= 3) {
                            resolve();
                        } else {
                            video.addEventListener('loadeddata', resolve, { once: true });
                        }
                    });
                }
            });

            await Promise.all(promises);
            setIsContentLoaded(true);
            
            // Запускаем первое видео
            if (videoRefs.current[0]) {
                try {
                    await videoRefs.current[0].play();
                } catch (error) {
                    console.log('Auto-play failed:', error);
                }
            }
        };

        preloadVideos();
    }, [isMobile]);

    const handleVideoEnd = () => {
        setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    };

    return (
        <section className="hero">
            {/* Адаптивный фон */}
            <div className="hero-media-container">
                {isMobile ? (
                    // Для телефонов - карусель из 3 видео
                    <div className="video-carousel">
                        {videos.map((videoSrc, index) => (
                            <video
                                key={index}
                                ref={el => videoRefs.current[index] = el}
                                className={`hero-video ${currentVideoIndex === index ? 'active' : ''}`}
                                muted
                                playsInline
                                poster="/images/hero-poster.jpg"
                                onEnded={handleVideoEnd}
                                preload="auto"
                            >
                                <source src={videoSrc} type="video/mp4" />
                            </video>
                        ))}
                    </div>
                ) : (
                    // Для ПК и ноутбуков - изображение
                    <img
                        src="/images/header.JPG"
                        alt="Ginza Onodera"
                        className={`hero-image ${isContentLoaded ? 'loaded' : ''}`}
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

                {/* Акции с анимацией */}
                <div className="promo-banners">
    <div className="promo-item promo-left">
        <span className="promo-badge">🔥</span>
        <div className="promo-text">
            <span className="promo-highlight">20%</span> скидки
        </div>
        <span className="promo-small">за заказ на сайте</span>
    </div>

    <div className="promo-item promo-right">
        <span className="promo-badge">🎁</span>
        <div className="promo-text">
            <span className="promo-highlight">Ролл в подарок</span>
        </div>
        <span className="promo-small">от сушефа при заказе от 299 000 сум</span>
    </div>
</div>

                <div className="hero-buttons">
                    <Link href="/menu" className="hero-btn primary">
                        Посмотреть меню
                    </Link>
                    <Link href="/contacts" className="hero-btn secondary">
                        Связаться с нами
                    </Link>
                </div>
            </div>

            {/* Индикатор видео (только для мобилок) */}
            {isMobile && (
                <div className="video-indicators">
                    {videos.map((_, index) => (
                        <button
                            key={index}
                            className={`video-indicator ${currentVideoIndex === index ? 'active' : ''}`}
                            onClick={() => setCurrentVideoIndex(index)}
                        />
                    ))}
                </div>
            )}

            {/* Индикатор скролла */}
            <div className="hero-scroll">
                <span>Листайте вниз</span>
                <div className="hero-scroll-icon"></div>
            </div>
        </section>
    );
};

export default Header;