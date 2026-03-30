'use client';

import { useState } from 'react';
import { FaTimes, FaPhone, FaUser, FaShoppingBag, FaMoneyBill, FaCheckCircle, FaTelegramPlane } from 'react-icons/fa';
import { SiClickup } from 'react-icons/si';
import { useCart } from '../context/CartContext';
import './ordermodal.css';

const OrderModal = ({ isOpen, onClose, cartItems, total }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const { clearCart } = useCart();

    const phoneNumber = '+998 (94) 778-08-80';
    // Для отправки в Telegram по номеру телефона, нужно получить username
    // Номер телефона в Telegram: @username или chat_id
    // В данном случае используем ссылку для перехода в диалог с пользователем
    const telegramUsername = 'ginza_onodera_admin'; // Замените на реальный username получателя

    const clickDetails = {
        cardNumber: '6262 5700 0040 8270',
        holderName: 'Халимов Ф М',
    };

    // Функция для безопасного форматирования цены
    const formatPrice = (price) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return isNaN(numPrice) ? '0' : numPrice.toLocaleString();
    };

    // Формирование текста заказа для Telegram
    const formatOrderMessage = () => {
        const orderItemsList = cartItems.map((item, index) => {
            const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
            const itemTotal = price * item.quantity;
            return `${index + 1}. ${item.name} x${item.quantity} - ${isNaN(itemTotal) ? '0' : itemTotal.toLocaleString()} сум`;
        }).join('\n');

        const currentDate = new Date().toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const totalAmount = typeof total === 'string' ? parseFloat(total) : total;

        // Формируем сообщение без HTML-тегов для обычного текста
        return `🛍 НОВЫЙ ЗАКАЗ!

👤 Клиент: ${name}
📞 Телефон: ${phone}
💳 Способ оплаты: ${paymentMethod === 'cash' ? 'Наличные' : 'Click'}
💰 Общая сумма: ${isNaN(totalAmount) ? '0' : totalAmount.toLocaleString()} сум
🕐 Время заказа: ${currentDate}

📦 Состав заказа:
${orderItemsList}

${paymentMethod === 'click' ? `💳 Click реквизиты:
Карта: ${clickDetails.cardNumber}
Получатель: ${clickDetails.holderName}` : ''}

✅ Статус: Ожидает подтверждения`;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const messageText = formatOrderMessage();
            
            // Способ 1: Открыть чат с конкретным пользователем Telegram по username
            const telegramUrl = `https://t.me/${telegramUsername}?text=${encodeURIComponent(messageText)}`;
            
            // Способ 2: Если нужен прямой переход на номер (не всегда работает)
            // const telegramUrl = `tg://resolve?phone=${phoneNumber.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(messageText)}`;
            
            // Открываем Telegram в новой вкладке с готовым сообщением
            window.open(telegramUrl, '_blank');
            
            setSubmitStatus('success');
            clearCart();
            
            setTimeout(() => {
                onClose();
                setSubmitStatus(null);
                setName('');
                setPhone('');
                setPaymentMethod('cash');
            }, 3000);
            
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
                        {cartItems.map((item) => {
                            const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
                            const itemTotal = price * item.quantity;
                            return (
                                <div key={item.id} className="order-item">
                                    <span className="order-item-name">
                                        {item.name} x{item.quantity}
                                    </span>
                                    <span className="order-item-price">
                                        {isNaN(itemTotal) ? '0' : itemTotal.toLocaleString()} сум
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="order-total">
                        <span>Итого:</span>
                        <span className="total-amount">{formatPrice(total)} сум</span>
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
                            <>
                                <FaTelegramPlane style={{ marginRight: '8px' }} />
                                Отправить в Telegram
                            </>
                        )}
                    </button>

                    {submitStatus === 'success' && (
                        <div className="success-message">
                            <FaCheckCircle className="success-icon" />
                            Заказ отправлен в Telegram! Менеджер свяжется с вами.
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