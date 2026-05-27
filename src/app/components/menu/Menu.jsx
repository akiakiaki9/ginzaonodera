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
import { FaWineBottle, FaAngleLeft, FaAngleRight, FaArrowRight, FaShoppingCart } from "react-icons/fa";
import { FaBowlFood, FaBowlRice } from "react-icons/fa6";

const Menu = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categoryItems, setCategoryItems] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [addedItems, setAddedItems] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const { addToCart } = useCart();
    const itemsPerPage = 30;

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
        setCurrentPage(1); // Сбрасываем страницу при смене категории

        setTimeout(() => {
            let filtered = [];

            if (selectedCategory === 'all') {
                filtered = [...DATA];
            } else {
                filtered = DATA.filter(item => item.category === selectedCategory);
            }

            setCategoryItems(filtered);
            setIsAnimating(false);
        }, 300);
    }, [selectedCategory]);

    // Пагинация
    const totalPages = Math.ceil(categoryItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = categoryItems.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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

                {/* Индикаторы страниц категорий */}
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

                {/* Превью товаров категории с пагинацией */}
                <div className={`category-items ${isAnimating ? 'fade-out' : 'fade-in'}`}>
                    {currentItems.length > 0 ? (
                        <>
                            <div className="items-grid">
                                {currentItems.map((item) => (
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
                                                {item.category === 'sets' && (
                                                    <div className="sets-item-badge">
                                                        🍱 Сет
                                                    </div>
                                                )}
                                                {item.isTop && item.category !== 'promo' && item.category !== 'sets' && (
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

                            {/* Пагинация */}
                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        className="pagination-btn"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <FaAngleLeft />
                                    </button>

                                    <div className="pagination-pages">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }

                                            if (pageNum <= totalPages && pageNum > 0) {
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        className={`pagination-page ${currentPage === pageNum ? 'active' : ''}`}
                                                        onClick={() => handlePageChange(pageNum)}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>

                                    <button
                                        className="pagination-btn"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <FaAngleRight />
                                    </button>
                                </div>
                            )}

                            <div className="items-count-info">
                                Показано {startIndex + 1}–{Math.min(endIndex, categoryItems.length)} из {categoryItems.length} товаров
                            </div>
                        </>
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