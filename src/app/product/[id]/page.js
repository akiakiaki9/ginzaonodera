'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiShoppingCart, FiCheck, FiChevronRight } from 'react-icons/fi';
import { useCart } from '@/app/context/CartContext';
import DATA from '@/app/utils/data';
import './product.css';

export default function ProductPage() {
    const params = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdded, setIsAdded] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    const { addToCart } = useCart();

    useEffect(() => {
        if (params?.id) {
            const found = DATA.find(item => item.id === parseInt(params.id));
            setProduct(found);

            // Находим похожие товары (той же категории, исключая текущий)
            if (found) {
                const related = DATA
                    .filter(item => item.category === found.category && item.id !== found.id)
                    .slice(0, 4); // Показываем 4 похожих товара
                setRelatedProducts(related);
            }

            setIsLoading(false);
        }
    }, [params?.id]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity);

            // Показываем анимацию добавления
            setIsAdded(true);
            setShowNotification(true);

            // Убираем анимацию через 2 секунды
            setTimeout(() => {
                setIsAdded(false);
            }, 2000);

            // Убираем уведомление через 3 секунды
            setTimeout(() => {
                setShowNotification(false);
            }, 3000);
        }
    };

    if (isLoading) {
        return <div className="loading">Загрузка...</div>;
    }

    if (!product) {
        return (
            <div className="loading">
                <h2>Товар не найден</h2>
                <Link href="/menu" className="product-back-link">
                    <FiArrowLeft /> Вернуться в меню
                </Link>
            </div>
        );
    }

    return (
        <div className="product-container">
            <Link href="/menu" className="product-back-link">
                <FiArrowLeft /> Назад в меню
            </Link>

            <div className="product-grid">
                <div className="product-image-container">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                    />
                </div>

                <div className="product-info">
                    <h1 className="product-title">{product.name}</h1>

                    <div className="product-price">
                        {product.price.toLocaleString()} сум
                    </div>

                    <p className="product-description">
                        Традиционное японское блюдо, приготовленное по особому рецепту
                        шеф-повара ресторана Ginza Onodera. Используются только свежие
                        ингредиенты высшего качества.
                    </p>

                    <div className="product-quantity">
                        <div className="quantity-controls">
                            <button
                                className="quantity-btn"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={isAdded}
                            >
                                −
                            </button>
                            <span className="quantity-value">{quantity}</span>
                            <button
                                className="quantity-btn"
                                onClick={() => setQuantity(quantity + 1)}
                                disabled={isAdded}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <button
                        className={`add-to-cart-btn ${isAdded ? 'added' : ''}`}
                        onClick={handleAddToCart}
                        disabled={isAdded}
                    >
                        {isAdded ? (
                            <>
                                <FiCheck className="btn-icon" />
                                Добавлено
                            </>
                        ) : (
                            <>
                                <FiShoppingCart className="btn-icon" />
                                Добавить в корзину • {(product.price * quantity).toLocaleString()} сум
                            </>
                        )}
                    </button>

                    {/* Всплывающее уведомление */}
                    {showNotification && (
                        <div className="cart-notification">
                            <div className="notification-content">
                                <FiCheck className="notification-icon" />
                                <div className="notification-text">
                                    <strong>{product.name}</strong>
                                    <span>добавлено в корзину</span>
                                </div>
                            </div>
                            <Link href="/cart" className="notification-link">
                                Перейти в корзину →
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Блок похожих товаров */}
            {relatedProducts.length > 0 && (
                <div className="related-products">
                    <div className="related-header">
                        <h2 className="related-title">Похожие товары</h2>
                        <Link href={`/menu?category=${product.category}`} className="related-view-all">
                            Смотреть все
                            <FiChevronRight className="related-icon" />
                        </Link>
                    </div>

                    <div className="related-grid">
                        {relatedProducts.map((item, index) => (
                            <Link
                                href={`/product/${item.id}`}
                                key={item.id}
                                className="related-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="related-image-wrapper">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="related-image"
                                    />
                                    {item.isTop && (
                                        <span className="related-badge">Хит</span>
                                    )}
                                    <div className="related-overlay">
                                        <span className="related-view">Подробнее</span>
                                    </div>
                                </div>
                                <div className="related-info">
                                    <h3 className="related-name">{item.name}</h3>
                                    <div className="related-footer">
                                        <span className="related-price">
                                            {item.price.toLocaleString()} сум
                                        </span>
                                        <button
                                            className="related-cart-btn"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                addToCart(item, 1);
                                            }}
                                        >
                                            <FiShoppingCart />
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};