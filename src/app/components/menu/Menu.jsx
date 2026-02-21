'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
    FaCheck,
    FaFire
} from 'react-icons/fa6';
import { GiSushis } from 'react-icons/gi';
import { FaUtensils, FaFish, FaLeaf, FaCoffee } from "react-icons/fa";
import { useCart } from '@/app/context/CartContext';
import DATA from '@/app/utils/data';
import './menu.css';
import { FaWineBottle } from "react-icons/fa";
import { FaBowlFood } from "react-icons/fa6";
import { FaBowlRice } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";

const Menu = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categoryItems, setCategoryItems] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [addedItems, setAddedItems] = useState({});
    const { addToCart } = useCart();

    // Для drag-to-scroll
    const scrollContainerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    // Категории
    const categories = [
        { id: 'all', name: 'Всё меню', icon: FaUtensils },
        { id: 'promo', name: 'Акционные блюда', icon: FaFire, isPromo: true },
        { id: 'sets', name: 'Сеты', icon: FaUtensils },
        { id: 'noodles', name: 'Лапша', icon: FaBowlFood },
        { id: 'rolls', name: 'Горячие Роллы', icon: GiSushis },
        { id: 'cold_rolls', name: 'Холодные роллы', icon: GiSushis },
        { id: 'soups', name: 'Супы', icon: FaBowlFood },
        { id: 'hot_dishes', name: 'Горячие блюда', icon: FaFish },
        { id: 'salads', name: 'Салаты', icon: FaLeaf },
        { id: 'snacks', name: 'Закуски', icon: FaUtensils },
        { id: 'sushis', name: 'Суши', icon: GiSushis },
        { id: 'fried_rice', name: 'Жареный рис', icon: FaBowlRice },
        { id: 'coffee', name: 'Кофе', icon: FaCoffee },
        { id: 'drinks', name: 'Напитки', icon: FaWineBottle },
        { id: 'tea', name: 'Чай', icon: FaCoffee },
    ];

    // Подсчет количества товаров в каждой категории
    const getCategoryCount = (categoryId) => {
        if (categoryId === 'all') return DATA.length;
        return DATA.filter(item => item.category === categoryId).length;
    };

    useEffect(() => {
        setIsAnimating(true);

        setTimeout(() => {
            let filtered = [];
            
            if (selectedCategory === 'all') {
                // Для "Все меню" показываем случайные 6 товаров
                filtered = [...DATA].sort(() => 0.5 - Math.random()).slice(0, 6);
            } else {
                // Фильтруем по категории из данных
                filtered = DATA.filter(item => item.category === selectedCategory);
                
                // Если это промо-категория, показываем все промо-товары (не больше 6)
                if (selectedCategory === 'promo') {
                    filtered = DATA.filter(item => item.category === 'promo');
                }
                
                // Берем первые 6 товаров
                filtered = filtered.slice(0, 6);
            }
            
            setCategoryItems(filtered);
            setIsAnimating(false);
        }, 300);
    }, [selectedCategory]);

    const handleAddToCart = (item, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        addToCart(item, 1);
        
        setAddedItems(prev => ({ ...prev, [item.id]: true }));
        setTimeout(() => {
            setAddedItems(prev => ({ ...prev, [item.id]: false }));
        }, 1500);
    };

    // Проверка видимости стрелок
    const checkScroll = () => {
        const container = scrollContainerRef.current;
        if (container) {
            setShowLeftArrow(container.scrollLeft > 10);
            setShowRightArrow(
                container.scrollLeft < container.scrollWidth - container.clientWidth - 10
            );
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            checkScroll();
            container.addEventListener('scroll', checkScroll);
            window.addEventListener('resize', checkScroll);

            return () => {
                container.removeEventListener('scroll', checkScroll);
                window.removeEventListener('resize', checkScroll);
            };
        }
    }, []);

    // Прокрутка по стрелкам
    const scroll = (direction) => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = 300;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Drag-to-scroll функции
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
        scrollContainerRef.current.style.cursor = 'grabbing';
        scrollContainerRef.current.style.userSelect = 'none';
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (scrollContainerRef.current) {
            scrollContainerRef.current.style.cursor = 'grab';
            scrollContainerRef.current.style.removeProperty('user-select');
        }
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            handleMouseUp();
        }
    };

    // Touch события для мобилок
    const handleTouchStart = (e) => {
        setIsDragging(true);
        setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const selectCategory = (categoryId) => {
        if (!isDragging) {
            setSelectedCategory(categoryId);
        }
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

                {/* Категории с горизонтальным скроллом */}
                <div className="categories-wrapper">
                    {showLeftArrow && (
                        <button
                            className="scroll-arrow left"
                            onClick={() => scroll('left')}
                            aria-label="Прокрутить влево"
                        >
                            <FaAngleLeft />
                        </button>
                    )}

                    <div
                        className={`categories-scroll ${isDragging ? 'dragging' : ''}`}
                        ref={scrollContainerRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {categories.map((category) => {
                            const Icon = category.icon;
                            const isSelected = selectedCategory === category.id;
                            const itemCount = getCategoryCount(category.id);

                            return (
                                <button
                                    key={category.id}
                                    className={`category-btn ${isSelected ? 'active' : ''} ${category.isPromo ? 'promo-category' : ''}`}
                                    onClick={() => selectCategory(category.id)}
                                >
                                    {category.isPromo && (
                                        <>
                                            <span className="promo-badge-top">АКЦИЯ 🔥</span>
                                            <span className="promo-category-icon">🔥</span>
                                        </>
                                    )}
                                    <Icon className="category-icon" />
                                    <span className="category-name">{category.name}</span>
                                    <span className="category-count">{itemCount}</span>
                                    {isSelected && <span className="category-active-dot"></span>}
                                </button>
                            );
                        })}
                    </div>

                    {showRightArrow && (
                        <button
                            className="scroll-arrow right"
                            onClick={() => scroll('right')}
                            aria-label="Прокрутить вправо"
                        >
                            <FaAngleRight />
                        </button>
                    )}
                </div>

                {/* Индикаторы страниц */}
                <div className="page-indicators">
                    {Array.from({ length: Math.ceil(categories.length / 4) }).map((_, idx) => (
                        <button
                            key={idx}
                            className={`page-dot ${Math.floor(scrollContainerRef.current?.scrollLeft / 300) === idx ? 'active' : ''}`}
                            onClick={() => {
                                if (scrollContainerRef.current) {
                                    scrollContainerRef.current.scrollTo({
                                        left: idx * 300,
                                        behavior: 'smooth'
                                    });
                                }
                            }}
                        />
                    ))}
                </div>

                {/* Превью товаров категории */}
                <div className={`category-items ${isAnimating ? 'fade-out' : 'fade-in'}`}>
                    {categoryItems.length > 0 ? (
                        <div className="items-grid">
                            {categoryItems.map((item) => (
                                <div key={item.id} className="item-card-wrapper">
                                    <Link
                                        href={`/product/${item.id}`}
                                        className="item-card"
                                    >
                                        <div className="item-image">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="item-img"
                                            />
                                            {item.category === 'promo' && (
                                                <div className="promo-item-badge">
                                                    🔥 Акция
                                                </div>
                                            )}
                                            {item.isTop && item.category !== 'promo' && (
                                                <span className="item-badge">Хит</span>
                                            )}
                                        </div>
                                        <div className="item-info">
                                            <h3 className="item-name">{item.name}</h3>
                                            <div className="item-price-row">
                                                <span className="item-price">{item.price.toLocaleString()} сум</span>
                                                <button 
                                                    className={`item-cart-btn ${addedItems[item.id] ? 'added' : ''}`}
                                                    onClick={(e) => handleAddToCart(item, e)}
                                                    aria-label="Добавить в корзину"
                                                >
                                                    {addedItems[item.id] ? <FaCheck /> : <FaShoppingCart />}
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
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