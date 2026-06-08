'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    FaSearch,
    FaTimes,
    FaFilter,
    FaChevronDown,
    FaHome,
    FaChevronRight,
    FaShoppingCart,
    FaCheck
} from 'react-icons/fa';
import {
    GiChickenLeg,
    GiBowlOfRice
} from 'react-icons/gi';
import {
    FiGrid,
    FiList,
    FiCoffee
} from 'react-icons/fi';
import { MdOutlineSoupKitchen } from 'react-icons/md';
import { useCart } from '../context/CartContext';
import DATA from '@/app/utils/data';
import './menu.css';
import { GiNoodles } from "react-icons/gi";
import { GiSushis } from "react-icons/gi";
import { GiFishCooked } from "react-icons/gi";
import { LuSalad } from "react-icons/lu";
import { FaUtensils, FaFire } from "react-icons/fa";

const MenuPage = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('default');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 });
    const [showFilters, setShowFilters] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [addedItems, setAddedItems] = useState({});
    const [showPriceFilter, setShowPriceFilter] = useState(true);

    const { addToCart } = useCart();
    const filterRef = useRef(null);

    // Функция для получения названия категории по ID
    const getCategoryName = (categoryId) => {
        const categories = {
            'promo': 'Акция',
            'sets': 'Сеты',
            'noodles': 'Лапша',
            'rolls': 'Горячие роллы',
            'cold_rolls': 'Холодные роллы',
            'soups': 'Супы',
            'hot_dishes': 'Горячие блюда',
            'salads': 'Салаты',
            'snacks': 'Закуски',
            'sushis': 'Суши',
            'fried_rice': 'Жареный рис',
            'coffee': 'Кофе',
            'tea': 'Чай'
        };
        return categories[categoryId] || 'Блюдо';
    };

    const getCategoryIcon = (categoryId) => {
        const icons = {
            'sets': FaUtensils,
            'noodles': GiNoodles,
            'rolls': GiSushis,
            'cold_rolls': GiSushis,
            'soups': MdOutlineSoupKitchen,
            'hot_dishes': GiFishCooked,
            'salads': LuSalad,
            'snacks': GiChickenLeg,
            'sushis': GiSushis,
            'fried_rice': GiBowlOfRice,
            'coffee': FiCoffee,
            'tea': FiCoffee,
            'promo': FaFire
        };
        return icons[categoryId] || FiGrid;
    };

    useEffect(() => {
        setItems(DATA);
        setFilteredItems(DATA);
    }, []);

    useEffect(() => {
        let result = [...items];

        if (searchQuery) {
            result = result.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        result = result.filter(item =>
            item.price >= priceRange.min && item.price <= priceRange.max
        );

        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                result.sort((a, b) => a.id - b.id);
        }

        setFilteredItems(result);
    }, [searchQuery, sortBy, priceRange, items]);

    const handleAddToCart = (item, e) => {
        e.preventDefault();
        e.stopPropagation();

        addToCart(item, 1);

        setAddedItems(prev => ({ ...prev, [item.id]: true }));
        setTimeout(() => {
            setAddedItems(prev => ({ ...prev, [item.id]: false }));
        }, 1500);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSortBy('default');
        setPriceRange({ min: 0, max: 200000 });
    };

    return (
        <div className="menu-page">
            <div className="menu-hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-title">Наше меню</h1>
                    <p className="hero-subtitle">
                        Откройте для себя разнообразие японской кухни
                    </p>
                    <div className="breadcrumbs">
                        <Link href="/" className="breadcrumb-link">
                            <FaHome className="breadcrumb-icon" />
                            Главная
                        </Link>
                        <FaChevronRight className="breadcrumb-separator" />
                        <span className="breadcrumb-current">Меню</span>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="menu-toolbar">
                    <div className="search-wrapper">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Поиск блюд..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        {searchQuery && (
                            <button
                                className="clear-search"
                                onClick={() => setSearchQuery('')}
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>

                    <div className="toolbar-actions">
                        <button
                            className={`filter-toggle ${showFilters ? 'active' : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FaFilter />
                            <span>Фильтры</span>
                            <FaChevronDown className={`arrow ${showFilters ? 'open' : ''}`} />
                        </button>

                        <div className="view-toggle">
                            <button
                                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <FiGrid />
                            </button>
                            <button
                                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <FiList />
                            </button>
                        </div>

                        <select
                            className="sort-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="default">По умолчанию</option>
                            <option value="price-asc">Цена: по возрастанию</option>
                            <option value="price-desc">Цена: по убыванию</option>
                            <option value="name-asc">Название: А-Я</option>
                            <option value="name-desc">Название: Я-А</option>
                        </select>
                    </div>
                </div>

                {showFilters && (
                    <div className="filters-panel" ref={filterRef}>
                        <div className="filters-grid">
                            <div className="filter-section">
                                <div
                                    className="filter-header"
                                    onClick={() => setShowPriceFilter(!showPriceFilter)}
                                >
                                    <h3>Цена</h3>
                                    <FaChevronDown className={`arrow ${showPriceFilter ? 'open' : ''}`} />
                                </div>
                                {showPriceFilter && (
                                    <div className="filter-content">
                                        <div className="price-range">
                                            <div className="price-inputs">
                                                <div className="price-input">
                                                    <label>От</label>
                                                    <input
                                                        type="number"
                                                        value={priceRange.min}
                                                        onChange={(e) => setPriceRange(prev => ({
                                                            ...prev,
                                                            min: Math.max(0, parseInt(e.target.value) || 0)
                                                        }))}
                                                        min="0"
                                                        max={priceRange.max}
                                                    />
                                                </div>
                                                <div className="price-input">
                                                    <label>До</label>
                                                    <input
                                                        type="number"
                                                        value={priceRange.max}
                                                        onChange={(e) => setPriceRange(prev => ({
                                                            ...prev,
                                                            max: Math.min(200000, parseInt(e.target.value) || 200000)
                                                        }))}
                                                        min={priceRange.min}
                                                        max="200000"
                                                    />
                                                </div>
                                            </div>
                                            <div className="price-presets">
                                                <button onClick={() => setPriceRange({ min: 0, max: 30000 })}>до 30k</button>
                                                <button onClick={() => setPriceRange({ min: 30000, max: 50000 })}>30k-50k</button>
                                                <button onClick={() => setPriceRange({ min: 50000, max: 80000 })}>50k-80k</button>
                                                <button onClick={() => setPriceRange({ min: 80000, max: 200000 })}>от 80k</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="filters-actions">
                            <button className="clear-filters" onClick={clearFilters}>
                                Сбросить все фильтры
                            </button>
                            <div className="results-count">
                                Найдено: {filteredItems.length} {filteredItems.length === 1 ? 'блюдо' :
                                    filteredItems.length < 5 ? 'блюда' : 'блюд'}
                            </div>
                        </div>
                    </div>
                )}

                <div className={`menu-items ${viewMode}`}>
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => {
                            const CategoryIcon = getCategoryIcon(item.category);
                            const categoryName = getCategoryName(item.category);
                            return (
                                <div key={item.id} className="menu-item-card-wrapper">
                                    <div className={`menu-item-card ${viewMode} 
                                        ${item.category === 'promo' ? 'promo-item' : ''} 
                                        ${item.category === 'sets' ? 'sets-item' : ''}`}
                                    >
                                        <Link href={`/product/${item.id}`} className="item-link">
                                            <div className="item-image-wrapper">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="item-image"
                                                />
                                                {item.category === 'promo' && (
                                                    <div className="promo-item-badge">
                                                        <span className="promo-item-icon">🔥</span>
                                                        <span className="promo-item-text">Акция</span>
                                                    </div>
                                                )}
                                                {item.category === 'sets' && (
                                                    <div className="sets-item-badge">
                                                        <span className="sets-item-icon">🍱</span>
                                                        <span className="sets-item-text">Сет</span>
                                                    </div>
                                                )}
                                                {item.isTop && item.category !== 'promo' && item.category !== 'sets' && (
                                                    <span className="item-badge">Хит</span>
                                                )}
                                                <div className="item-category-icon">
                                                    <CategoryIcon />
                                                </div>
                                            </div>
                                        </Link>

                                        <div className="item-content">
                                            <Link href={`/product/${item.id}`} className="item-name-link">
                                                <h3 className="item-name">{item.name}</h3>
                                            </Link>

                                            {/* Отображение названия категории */}
                                            <div className="item-category-name">
                                                {categoryName}
                                            </div>

                                            <div className="item-price-row">
                                                <span className="item-price">
                                                    {item.price.toLocaleString()} сум
                                                </span>
                                                <button
                                                    className={`item-cart-btn ${addedItems[item.id] ? 'added' : ''}`}
                                                    onClick={(e) => handleAddToCart(item, e)}
                                                    aria-label="Добавить в корзину"
                                                >
                                                    {addedItems[item.id] ? <FaCheck className='item-cart-icon' /> : <FaShoppingCart className='item-cart-icon' />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-results">
                            <FaSearch className="no-results-icon" />
                            <h3>Ничего не найдено</h3>
                            <p>Попробуйте изменить параметры поиска</p>
                            <button className="reset-filters-btn" onClick={clearFilters}>
                                Сбросить фильтры
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuPage;