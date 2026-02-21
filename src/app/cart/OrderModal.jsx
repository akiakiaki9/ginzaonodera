'use client';

import { useState } from 'react';
import { FaTimes, FaPhone, FaEnvelope, FaUser, FaShoppingBag, FaMoneyBill, FaCheckCircle } from 'react-icons/fa';
import { SiClickup } from 'react-icons/si';
import { useCart } from '../context/CartContext';
import './ordermodal.css';

const OrderModal = ({ isOpen, onClose, cartItems, total }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' или 'click'
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const { clearCart } = useCart();

    const phoneNumber = '+998 (94) 778-08-80';

    // Реквизиты для Click
    const clickDetails = {
        cardNumber: '6262 5700 0040 8270',
        holderName: 'Халимов Ф М',
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Формируем текст заказа для отправки
        const orderItemsList = cartItems.map(item =>
            `${item.name} x${item.quantity} - ${(item.price * item.quantity).toLocaleString()} сум`
        ).join('\n');

        // Формируем данные для отправки
        const formData = new FormData();
        formData.append('access_key', '22c186b3-8dd8-4f97-97b7-e7dc76a524ab');
        
        // Основная информация
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('payment_method', paymentMethod === 'cash' ? 'Наличные' : 'Click');
        formData.append('total_amount', `${total.toLocaleString()} сум`);
        
        // Детали заказа
        formData.append('order_details', orderItemsList);
        formData.append('items_count', cartItems.length.toString());
        
        // Тема письма
        formData.append('subject', `Новый заказ от ${name} - ${paymentMethod === 'cash' ? 'Наличные' : 'Click'}`);
        
        // От кого
        formData.append('from_name', 'Сайт Суши-магазин');
        
        // Дополнительная информация
        if (paymentMethod === 'click') {
            formData.append('click_card', clickDetails.cardNumber);
            formData.append('click_holder', clickDetails.holderName);
            formData.append('payment_note', 'Клиент оплатит через Click');
        }

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setSubmitStatus('success');
                clearCart();
                setTimeout(() => {
                    onClose();
                    setSubmitStatus(null);
                    setName('');
                    setPhone('');
                    setPaymentMethod('cash');
                }, 3000);
            } else {
                setSubmitStatus('error');
                console.error('Ошибка отправки:', data);
            }
        } catch (error) {
            console.error('Ошибка:', error);
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
                        Выберите способ оплаты и заполните форму
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

                {/* Выбор способа оплаты */}
                <div className="payment-methods">
                    <h3 className="payment-title">Способ оплаты:</h3>
                    <div className="payment-options">
                        <button
                            className={`payment-option ${paymentMethod === 'cash' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('cash')}
                        >
                            <FaMoneyBill className="payment-icon" />
                            <span className="payment-label">Наличные</span>
                            {paymentMethod === 'cash' && <FaCheckCircle className="payment-check" />}
                        </button>

                        <button
                            className={`payment-option ${paymentMethod === 'click' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('click')}
                        >
                            <SiClickup className="payment-icon" />
                            <span className="payment-label">Click</span>
                            {paymentMethod === 'click' && <FaCheckCircle className="payment-check" />}
                        </button>
                    </div>
                </div>

                {/* Детали Click */}
                {paymentMethod === 'click' && (
                    <div className="click-details">
                        <div className="click-header">
                            <SiClickup className="click-logo" />
                            <h4 className="click-title">Реквизиты для оплаты Click</h4>
                        </div>

                        <div className="click-card">
                            <div className="click-card-row">
                                <span className="click-label">Номер карты:</span>
                                <span className="click-value click-card-number">{clickDetails.cardNumber}</span>
                            </div>
                            <div className="click-card-row">
                                <span className="click-label">Владелец:</span>
                                <span className="click-value">{clickDetails.holderName}</span>
                            </div>
                        </div>

                        <p className="click-note">
                            <strong>Важно:</strong> После оплаты через Click, просто отправьте заявку. 
                            Менеджер свяжется с вами для подтверждения оплаты.
                        </p>
                    </div>
                )}

                {/* Форма заказа */}
                <form onSubmit={handleFormSubmit} className="order-form">
                    <div className="form-group">
                        <FaUser className="form-icon" />
                        <input
                            type="text"
                            placeholder="Ваше имя *"
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
                            placeholder="Номер телефона *"
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
                        {isSubmitting ? (
                            'Отправка...'
                        ) : (
                            paymentMethod === 'cash' ? 'Подтвердить заказ' : 'Отправить заказ'
                        )}
                    </button>

                    {submitStatus === 'success' && (
                        <div className="success-message">
                            <FaCheckCircle className="success-icon" />
                            Заказ успешно отправлен! Мы свяжемся с вами в ближайшее время.
                        </div>
                    )}

                    {submitStatus === 'error' && (
                        <div className="error-message">
                            Произошла ошибка. Пожалуйста, попробуйте позже или позвоните нам.
                        </div>
                    )}
                </form>

                {/* Альтернативный способ - позвонить */}
                <div className="phone-alternative">
                    <div className="phone-alternative-content">
                        <FaPhone className="phone-alternative-icon" />
                        <div className="phone-alternative-text">
                            <span className="phone-alternative-label">Или позвоните нам:</span>
                            <a href={`tel:${phoneNumber}`} className="phone-alternative-number">
                                {phoneNumber}
                            </a>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <p className="footer-note">
                        Нажимая кнопку подтверждения, вы соглашаетесь на обработку персональных данных
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderModal;