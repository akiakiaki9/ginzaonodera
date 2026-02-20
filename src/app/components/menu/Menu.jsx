'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {  
    FaWineBottle, 
    FaBowlFood,
    FaBowlRice,
    FaAngleLeft,
    FaAngleRight,
    FaArrowRight
} from 'react-icons/fa6';
import { GiSushis } from 'react-icons/gi';
import DATA from '@/app/utils/data';
import './menu.css';
import { FaUtensils, FaFish, FaLeaf, FaCoffee } from "react-icons/fa";

const Menu = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categoryItems, setCategoryItems] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(6);
    const carouselRef = useRef(null);
    const itemsGridRef = useRef(null);

    // Категории ТОЛЬКО из data.js
    const categories = [
        { id: 'all', name: 'Всё меню', icon: FaUtensils },
        { id: 'noodles', name: 'Лапша', icon: FaBowlFood },
        { id: 'rolls', name: 'Горчие Роллы', icon: GiSushis },
        { id: 'cold_rolls', name: 'Холодные роллы', icon: GiSushis },
        { id: 'soups', name: 'Супы', icon: FaBowlFood },
        { id: 'hot_dishes', name: 'Горячие блюда', icon: FaFish },
        { id: 'salads', name: 'Салаты', icon: FaLeaf },
        { id: 'snacks', name: 'Закуски', icon: FaUtensils },
        { id: 'sushis', name: 'Суши', icon: GiSushis },
        { id: 'fried_rice', name: 'Жареный рис', icon: FaBowlRice },
        { id: 'coffee', name: 'Кофе', icon: FaCoffee },
        { id: 'drinks', name: 'Напитки', icon: FaWineBottle },
    ];

    useEffect(() => {
        // Определяем сколько категорий показывать в зависимости от экрана
        const updateVisibleCount = () => {
            if (window.innerWidth <= 480) {
                setVisibleCount(3);
            } else if (window.innerWidth <= 768) {
                setVisibleCount(4);
            } else if (window.innerWidth <= 1024) {
                setVisibleCount(5);
            } else {
                setVisibleCount(6);
            }
        };

        updateVisibleCount();
        window.addEventListener('resize', updateVisibleCount);
        return () => window.removeEventListener('resize', updateVisibleCount);
    }, []);

    useEffect(() => {
        setIsAnimating(true);

        setTimeout(() => {
            if (selectedCategory === 'all') {
                const shuffled = [...DATA].sort(() => 0.5 - Math.random());
                setCategoryItems(shuffled.slice(0, 6));
            } else {
                const filtered = DATA.filter(item => item.category === selectedCategory);
                setCategoryItems(filtered.slice(0, 6));
            }
            setIsAnimating(false);
        }, 300);
    }, [selectedCategory]);

    const nextSlide = () => {
        if (currentIndex < categories.length - visibleCount) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const selectCategory = (categoryId) => {
        setSelectedCategory(categoryId);
        // Сброс позиции карусели не делаем, чтобы не дергалась
    };

    return (
        <section className="menu-section">
            <div className="container">
                <div className="menu-header">
                    <h1 className="menu-title">
                        Наше меню
                    </h1>
                    <p className="menu-subtitle">
                        Листайте категории и открывайте вкус Японии
                    </p>
                </div>

                {/* Категории КАРУСЕЛЬ */}
                <div className="carousel-container">
                    <button 
                        className={`carousel-btn prev ${currentIndex === 0 ? 'disabled' : ''}`}
                        onClick={prevSlide}
                        disabled={currentIndex === 0}
                    >
                        <FaAngleLeft />
                    </button>

                    <div className="carousel-viewport">
                        <div 
                            className="carousel-track" 
                            style={{ 
                                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                                transition: 'transform 0.5s ease'
                            }}
                        >
                            {categories.map((category) => {
                                const Icon = category.icon;
                                const isSelected = selectedCategory === category.id;

                                return (
                                    <button
                                        key={category.id}
                                        className={`carousel-item ${isSelected ? 'active' : ''}`}
                                        onClick={() => selectCategory(category.id)}
                                        style={{ flex: `0 0 ${100 / visibleCount}%` }}
                                    >
                                        <Icon className="category-icon" />
                                        <span className="category-name">{category.name}</span>
                                        {isSelected && <span className="category-active-dot"></span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button 
                        className={`carousel-btn next ${currentIndex >= categories.length - visibleCount ? 'disabled' : ''}`}
                        onClick={nextSlide}
                        disabled={currentIndex >= categories.length - visibleCount}
                    >
                        <FaAngleRight />
                    </button>
                </div>

                {/* Индикаторы карусели */}
                <div className="carousel-indicators">
                    {Array.from({ length: Math.ceil(categories.length / visibleCount) }).map((_, idx) => (
                        <button
                            key={idx}
                            className={`indicator ${Math.floor(currentIndex / visibleCount) === idx ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(idx * visibleCount)}
                        />
                    ))}
                </div>

                {/* Превью товаров категории */}
                <div className={`category-items ${isAnimating ? 'fade-out' : 'fade-in'}`} ref={itemsGridRef}>
                    {categoryItems.length > 0 ? (
                        <div className="items-grid">
                            {categoryItems.map((item) => (
                                <Link
                                    href={`/product/${item.id}`}
                                    key={item.id}
                                    className="item-card"
                                >
                                    <div className="item-image">
                                        <img 
                                            src={item.image} 
                                            alt={item.name}
                                            className="item-img"
                                        />
                                        {item.isTop && (
                                            <span className="item-badge">Хит</span>
                                        )}
                                    </div>
                                    <div className="item-info">
                                        <h3 className="item-name">{item.name}</h3>
                                        <div className="item-price">{item.price.toLocaleString()} сум</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="no-items">
                            <p>В этой категории пока нет товаров</p>
                        </div>
                    )}
                </div>

                {/* Кнопка перехода в полное меню */}
                <div className="menu-footer">
                    <Link href="/menu" className="view-all-btn">
                        Смотреть всё меню
                        <FaArrowRight className="btn-icon" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Menu;