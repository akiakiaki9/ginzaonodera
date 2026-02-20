'use client';

import Link from 'next/link';
import {
    FaChevronRight,
    FaHome,
    FaStar,
    FaLeaf,
    FaHeart
} from 'react-icons/fa';
import { GiSushis, GiFishCooked } from 'react-icons/gi';
import './about.css';
import { GiJapaneseBridge } from "react-icons/gi";

const AboutPage = () => {
    return (
        <div className="about-page">
            {/* Hero секция с хлебными крошками */}
            <div className="about-hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-title">О нас</h1>
                    <div className="breadcrumbs">
                        <Link href="/" className="breadcrumb-link">
                            <FaHome className="breadcrumb-icon" />
                            Главная
                        </Link>
                        <FaChevronRight className="breadcrumb-separator" />
                        <span className="breadcrumb-current">О нас</span>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Основной контент */}
                <div className="about-content">
                    {/* Левая колонка с текстом */}
                    <div className="about-text">
                        <div className="about-header">
                            <span className="about-subtitle-en">GINZA ONODERA</span>
                            <h2 className="about-title">
                                Искусство высокой <span className="title-highlight">японской гастрономии</span>
                            </h2>
                        </div>

                        <div className="about-description">
                            <p className="about-quote">
                                ✨ Ginza Onodera — это больше, чем ресторан. Это пространство,
                                где философия японской кухни встречается с безупречным вкусом
                                и вниманием к деталям.
                            </p>

                            <div className="about-feature">
                                <GiSushis className="feature-icon" />
                                <p>
                                    🍣 Здесь каждое блюдо — маленький шедевр, созданный мастерами,
                                    которые знают цену традиции и красоте простоты.
                                </p>
                            </div>

                            <div className="about-feature">
                                <GiJapaneseBridge className="feature-icon" />
                                <p>
                                    🥢 Атмосфера, пропитанная гармонией, позволяет насладиться моментом
                                    и почувствовать настоящее омотэнаси — японское искусство гостеприимства.
                                </p>
                            </div>

                            <div className="about-highlight">
                                <FaStar className="highlight-icon" />
                                <FaStar className="highlight-icon" />
                                <FaStar className="highlight-icon" />
                            </div>
                        </div>

                        {/* Преимущества */}
                        <div className="about-advantages">
                            <div className="advantage-item">
                                <div className="advantage-icon-wrapper">
                                    <FaLeaf className="advantage-icon" />
                                </div>
                                <div className="advantage-text">
                                    <h4>Только свежие продукты</h4>
                                    <p>Ежедневная поставка отборных ингредиентов</p>
                                </div>
                            </div>

                            <div className="advantage-item">
                                <div className="advantage-icon-wrapper">
                                    <FaHeart className="advantage-icon" />
                                </div>
                                <div className="advantage-text">
                                    <h4>Готовим с любовью</h4>
                                    <p>Каждое блюдо создается с душой</p>
                                </div>
                            </div>

                            <div className="advantage-item">
                                <div className="advantage-icon-wrapper">
                                    <GiFishCooked className="advantage-icon" />
                                </div>
                                <div className="advantage-text">
                                    <h4>Мастера своего дела</h4>
                                    <p>Шеф-повара с многолетним опытом</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Правая колонка с фото и цитатой */}
                    <div className="about-gallery">
                        <div className="gallery-main">
                            <video
                                src="/videos/ginza2.mp4"
                                alt="Ginza Onodera интерьер"
                                className="gallery-image"
                                autoPlay
                                loop
                                muted
                            />
                            <div className="image-overlay"></div>
                            <div className="image-caption">
                                <span className="caption-japanese">銀座 オノデラ</span>
                                <span className="caption-text">GINZA ONODERA</span>
                            </div>
                        </div>

                        <div className="gallery-grid">
                            <div className="gallery-item">
                                <img
                                    src="/images/about-1.jpg"
                                    alt="Суши от шефа"
                                    className="gallery-thumb"
                                />
                            </div>
                            <div className="gallery-item">
                                <img
                                    src="/images/about-2.jpg"
                                    alt="Атмосфера ресторана"
                                    className="gallery-thumb"
                                />
                            </div>
                            <div className="gallery-item">
                                <img
                                    src="/images/about-3.jpg"
                                    alt="Японский интерьер"
                                    className="gallery-thumb"
                                />
                            </div>
                            <div className="gallery-item">
                                <img
                                    src="/images/about-4.jpg"
                                    alt="Блюдо от шефа"
                                    className="gallery-thumb"
                                />
                            </div>
                        </div>

                        {/* Цитата */}
                        <div className="about-quote-block">
                            <div className="quote-icon">"</div>
                            <p className="quote-text">
                                Мы не просто готовим еду. Мы создаем впечатления,
                                которые остаются с вами надолго.
                            </p>
                            <p className="quote-author">— Шеф-повар Ginza Onodera</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;