'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    FaShoppingCart,
    FaTrash,
    FaPlus,
    FaMinus,
    FaArrowLeft,
    FaPhone,
    FaEnvelope,
    FaHome,
    FaChevronRight
} from 'react-icons/fa';
import { FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import OrderModal from './OrderModal';
import './cart.css';
import { FaArrowRight } from "react-icons/fa";

const CartPage = () => {
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        getCartCount,
        clearCart
    } = useCart();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCheckout = () => {
        setIsModalOpen(true);
    };

    // Функция для безопасного форматирования цены
    const formatPrice = (price) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return isNaN(numPrice) ? '0' : numPrice.toLocaleString();
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                {/* Hero секция */}
                <div className="cart-hero">
                    <div className="hero-overlay"></div>
                    <div className="hero-content">
                        <h1 className="hero-title">Корзина</h1>
                        <div className="breadcrumbs">
                            <Link href="/" className="breadcrumb-link">
                                <FaHome className="breadcrumb-icon" />
                                Главная
                            </Link>
                            <FaChevronRight className="breadcrumb-separator" />
                            <span className="breadcrumb-current">Корзина</span>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="empty-cart">
                        <div className="empty-cart-icon">
                            <FiShoppingBag />
                        </div>
                        <h2 className="empty-cart-title">Корзина пуста</h2>
                        <p className="empty-cart-text">
                            Добавьте блюда из меню, чтобы оформить заказ
                        </p>
                        <Link href="/menu" className="empty-cart-btn">
                            Перейти в меню
                            <FaArrowRight className="btn-icon" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            {/* Hero секция */}
            <div className="cart-hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-title">Корзина</h1>
                    <div className="breadcrumbs">
                        <Link href="/" className="breadcrumb-link">
                            <FaHome className="breadcrumb-icon" />
                            Главная
                        </Link>
                        <FaChevronRight className="breadcrumb-separator" />
                        <span className="breadcrumb-current">Корзина</span>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="cart-content">
                    {/* Список товаров */}
                    <div className="cart-items-section">
                        <h2 className="section-title">
                            Ваш заказ ({getCartCount()} {getCartCount() === 1 ? 'позиция' : 'позиций'})
                        </h2>

                        <div className="cart-items">
                            {cartItems.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <div className="cart-item-image">
                                        <img src={item.image} alt={item.name} />
                                    </div>

                                    <div className="cart-item-info">
                                        <h3 className="cart-item-name">{item.name}</h3>
                                        <div className="cart-item-price">
                                            {formatPrice(item.price)} сум
                                        </div>
                                    </div>

                                    <div className="cart-item-quantity">
                                        <button
                                            className="quantity-btn"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                            <FaMinus />
                                        </button>
                                        <span className="quantity-value">{item.quantity}</span>
                                        <button
                                            className="quantity-btn"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>

                                    <div className="cart-item-total">
                                        {formatPrice(item.price * item.quantity)} сум
                                    </div>

                                    <button
                                        className="cart-item-remove"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-actions">
                            <button
                                className="clear-cart-btn"
                                onClick={clearCart}
                            >
                                <FaTrash /> Очистить корзину
                            </button>

                            <Link href="/menu" className="continue-shopping">
                                <FaArrowLeft /> Продолжить покупки
                            </Link>
                        </div>
                    </div>

                    {/* Итого и оформление */}
                    <div className="cart-summary-section">
                        <div className="summary-card">
                            <h3 className="summary-title">Итого</h3>

                            <div className="summary-items">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="summary-item">
                                        <span className="summary-item-name">
                                            {item.name} x{item.quantity}
                                        </span>
                                        <span className="summary-item-price">
                                            {formatPrice(item.price * item.quantity)} сум
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-total">
                                <span>Общая сумма:</span>
                                <span className="total-price">
                                    {formatPrice(getCartTotal())} сум
                                </span>
                            </div>

                            <button
                                className="checkout-btn"
                                onClick={handleCheckout}
                            >
                                <FaShoppingCart /> Оформить заказ
                            </button>

                            <p className="checkout-info">
                                Нажимая "Оформить заказ", вы соглашаетесь с условиями обработки данных
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Модальное окно заказа */}
            <OrderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                cartItems={cartItems}
                total={getCartTotal()}
            />
        </div>
    );
};

export default CartPage;