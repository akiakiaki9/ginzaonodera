'use client';

import { useState, useRef } from 'react';
import { FaTimes, FaPhone, FaEnvelope, FaUser, FaShoppingBag, FaMoneyBill, FaCreditCard, FaCloudUploadAlt, FaCheckCircle, FaTrash } from 'react-icons/fa';
import { SiClickup } from 'react-icons/si';
import { useCart } from '../context/CartContext';
import './ordermodal.css';

const OrderModal = ({ isOpen, onClose, cartItems, total }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' или 'click'
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const fileInputRef = useRef(null);
    const { clearCart } = useCart();

    const phoneNumber = '+998 (94) 778-08-80';

    // Данные для Click (пример)
    const clickDetails = {
        cardNumber: '6262 5700 0040 8270',
        holderName: 'Халимов Ф М',
        // bank: 'Kapitalbank',
        // expiry: '12/25'
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);

            // Создаем превью для изображений
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setFilePreview(null);
            }
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setFilePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

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
        formData.append('paymentMethod', paymentMethod === 'cash' ? 'Наличные' : 'Click');
        formData.append('order', orderItems);
        formData.append('total', total);
        formData.append('_subject', `Новый заказ от ${name} (${paymentMethod === 'cash' ? 'Наличные' : 'Click'})`);

        // Добавляем файл, если он выбран
        if (selectedFile) {
            formData.append('paymentScreenshot', selectedFile);
        }

        try {
            // Здесь нужно использовать сервис который поддерживает загрузку файлов
            // Например, Formspree с поддержкой файлов или другой сервис
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
                    setSelectedFile(null);
                    setFilePreview(null);
                    setPaymentMethod('cash');
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
                        Выберите способ оплаты и оформите заказ
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
                            {/* <div className="click-card-row">
                                <span className="click-label">Банк:</span>
                                <span className="click-value">{clickDetails.bank}</span>
                            </div>
                            <div className="click-card-row">
                                <span className="click-label">Срок:</span>
                                <span className="click-value">{clickDetails.expiry}</span>
                            </div> */}
                        </div>

                        <p className="click-note">
                            После оплаты, пожалуйста, прикрепите скриншот перевода
                        </p>

                        {/* Загрузка файла */}
                        <div className="file-upload-section">
                            <div
                                className={`file-upload-area ${selectedFile ? 'has-file' : ''}`}
                                onClick={() => !selectedFile && fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*,.pdf"
                                    className="file-input"
                                />

                                {!selectedFile ? (
                                    <>
                                        <FaCloudUploadAlt className="upload-icon" />
                                        <div className="upload-text">
                                            <span className="upload-main">Нажмите для загрузки</span>
                                            <span className="upload-hint">PNG, JPG, PDF до 10MB</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="file-preview">
                                        {filePreview ? (
                                            <img src={filePreview} alt="Preview" className="preview-image" />
                                        ) : (
                                            <div className="file-icon">{selectedFile.name.split('.').pop()}</div>
                                        )}
                                        <div className="file-info">
                                            <span className="file-name">{selectedFile.name}</span>
                                            <span className="file-size">
                                                {(selectedFile.size / 1024).toFixed(1)} KB
                                            </span>
                                        </div>
                                        <button
                                            className="remove-file"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveFile();
                                            }}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Форма заказа */}
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
                        className={`submit-btn ${paymentMethod === 'click' && !selectedFile ? 'disabled' : ''}`}
                        disabled={isSubmitting || (paymentMethod === 'click' && !selectedFile)}
                    >
                        {isSubmitting ? (
                            'Отправка...'
                        ) : (
                            paymentMethod === 'cash' ? 'Подтвердить заказ' : 'Отправить заказ с чеком'
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