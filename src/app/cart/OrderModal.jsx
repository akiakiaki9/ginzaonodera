'use client';

import { useState } from 'react';
import { FaTimes, FaPhone, FaEnvelope, FaUser, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './ordermodal.css';

const OrderModal = ({ isOpen, onClose, cartItems, total }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const { clearCart } = useCart();

    const phoneNumber = '+998 (94) 778-08-80';

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Формируем текст заказа
        const orderItems = cartItems.map(item =>
            `${item.name} x${item.quantity} - ${(item.price * item.quantity).toLocaleString()} сум`
        ).join('\n');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('order', orderItems);
        formData.append('total', total);
        formData.append('_subject', `Новый заказ от ${name}`);

        try {
            const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                setSubmitStatus('success');
                clearCart();
                setTimeout(() => {
                    onClose();
                    setSubmitStatus(null);
                    setName('');
                    setPhone('');
                }, 3000);
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <FaTimes />
                </button>

                <div className="modal-header">
                    <FaShoppingBag className="modal-icon" />
                    <h2 className="modal-title">Оформление заказа</h2>
                    <p className="modal-subtitle">
                        Выберите удобный способ оформления
                    </p>
                </div>

                {/* Список заказываемых товаров */}
                <div className="order-summary">
                    <h3 className="summary-label">Ваш заказ:</h3>
                    <div className="order-items">
                        {cartItems.map((item) => (
                            <div key={item.id} className="order-item">
                                <span className="order-item-name">
                                    {item.name} x{item.quantity}
                                </span>
                                <span className="order-item-price">
                                    {(item.price * item.quantity).toLocaleString()} сум
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="order-total">
                        <span>Итого:</span>
                        <span className="total-amount">{total.toLocaleString()} сум</span>
                    </div>
                </div>

                {/* Два способа заказа */}
                <div className="order-options">
                    {/* Способ 1: Formspree */}
                    <div className="order-option">
                        <div className="option-header">
                            <FaEnvelope className="option-icon" />
                            <h3 className="option-title">Отправить онлайн</h3>
                        </div>

                        <form onSubmit={handleFormSubmit} className="order-form">
                            <div className="form-group">
                                <FaUser className="form-icon" />
                                <input
                                    type="text"
                                    placeholder="Ваше имя"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <FaPhone className="form-icon" />
                                <input
                                    type="tel"
                                    placeholder="Номер телефона"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    className="form-input"
                                />
                            </div>

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Отправка...' : 'Отправить заказ'}
                            </button>

                            {submitStatus === 'success' && (
                                <div className="success-message">
                                    Заказ успешно отправлен! Мы свяжемся с вами в ближайшее время.
                                </div>
                            )}

                            {submitStatus === 'error' && (
                                <div className="error-message">
                                    Произошла ошибка. Пожалуйста, попробуйте позже или позвоните нам.
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Способ 2: Позвонить */}
                    <div className="order-option phone-option">
                        <div className="option-header">
                            <FaPhone className="option-icon" />
                            <h3 className="option-title">Позвоните нам</h3>
                        </div>

                        <div className="phone-content">
                            <p className="phone-text">
                                Сделайте заказ по телефону, и наш администратор поможет вам с выбором и оформлением.
                            </p>

                            <a href={`tel:${phoneNumber}`} className="phone-link">
                                <FaPhone className="phone-icon" />
                                {phoneNumber}
                            </a>

                            <p className="phone-note">
                                При звонке сообщите состав вашего заказа из списка выше
                            </p>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <p className="footer-note">
                        Нажимая "Отправить заказ", вы соглашаетесь на обработку персональных данных
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderModal;