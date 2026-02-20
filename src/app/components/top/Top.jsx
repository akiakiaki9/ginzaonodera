'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiShoppingCart, FiStar, FiCheck } from 'react-icons/fi';
import { useCart } from '@/app/context/CartContext';
import DATA from '@/app/utils/data';
import './top.css';

const Top = () => {
    const [bestItems, setBestItems] = useState([]);
    const [addedItems, setAddedItems] = useState({});
    const { addToCart } = useCart();

    useEffect(() => {
        // Фильтруем только топовые позиции
        const topItems = DATA.filter(item => item.isTop);
        setBestItems(topItems);
    }, []);

    const handleAddToCart = (item) => {
        addToCart(item, 1);

        // Показываем анимацию добавления
        setAddedItems(prev => ({ ...prev, [item.id]: true }));

        // Убираем анимацию через 2 секунды
        setTimeout(() => {
            setAddedItems(prev => ({ ...prev, [item.id]: false }));
        }, 2000);
    };

    return (
        <section className="best-offers">
            <div className="container">
                <div className="best-offers-header">
                    <h2 className="best-offers-title">
                        Лучшие предложения
                        <FiStar className="best-offers-title-icon" />
                    </h2>
                    <p className="best-offers-subtitle">
                        Самые популярные блюда от шеф-повара
                    </p>
                </div>

                <div className="best-offers-grid">
                    {bestItems.map((item) => (
                        <div key={item.id} className="best-offer-card">
                            <div className="best-offer-badge">Топ</div>
                            <Link href={`/product/${item.id}`} className="best-offer-image-link">
                                <div className="best-offer-image">
                                    <img src={item.image} alt={item.name} />
                                </div>
                            </Link>
                            <div className="best-offer-content">
                                <Link href={`/product/${item.id}`} className="best-offer-name-link">
                                    <h3 className="best-offer-name">{item.name}</h3>
                                </Link>
                                <div className="best-offer-price">
                                    {item.price.toLocaleString()} сум
                                </div>
                                <div className="best-offer-actions">
                                    <Link
                                        href={`/product/${item.id}`}
                                        className="best-offer-btn details"
                                    >
                                        Подробнее
                                    </Link>
                                    <button
                                        className={`best-offer-btn cart ${addedItems[item.id] ? 'added' : ''}`}
                                        onClick={() => handleAddToCart(item)}
                                        aria-label="Добавить в корзину"
                                    >
                                        {addedItems[item.id] ? <FiCheck /> : <FiShoppingCart />}
                                    </button>
                                </div>
                            </div>

                            {/* Всплывающее уведомление */}
                            {addedItems[item.id] && (
                                <div className="added-notification">
                                    Добавлено в корзину
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="best-offers-footer">
                    <Link href="/menu" className="best-offers-all-btn">
                        Смотреть всё меню
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Top;