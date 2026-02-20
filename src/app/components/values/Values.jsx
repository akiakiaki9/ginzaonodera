'use client';

import { useEffect, useRef } from 'react';
import {
    GiFishCooked,
    GiMeditation,
    GiSushis,
    GiChopsticks,
    GiRiceCooker
} from 'react-icons/gi';
import {
    FaLeaf,
    FaHeart,
    FaClock,
    FaStar,
    FaUtensils,
    FaCrown
} from 'react-icons/fa';
import './values.css';
import { GiJapaneseBridge } from "react-icons/gi";

const Values = () => {
    const valuesRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.2, rootMargin: '50px' }
        );

        const cards = document.querySelectorAll('.value-card');
        cards.forEach((card) => observer.observe(card));

        return () => {
            cards.forEach((card) => observer.unobserve(card));
        };
    }, []);

    const values = [
        {
            icon: GiJapaneseBridge,
            title: 'Аутентичная кухня',
            description: 'Традиционные рецепты от шеф-поваров из Токио',
            gradient: ['#B71C1C', '#F4511E']
        },
        {
            icon: FaCrown,
            title: 'Премиум качество',
            description: 'Только отборные ингредиенты высшего сорта',
            gradient: ['#B71C1C', '#F4511E']
        },
        {
            icon: FaHeart,
            title: 'Готовим с душой',
            description: 'Каждое блюдо — маленькое произведение искусства',
            gradient: ['#B71C1C', '#F4511E']
        },
        {
            icon: GiMeditation,
            title: 'Атмосфера Японии',
            description: 'Погружение в культуру страны восходящего солнца',
            gradient: ['#B71C1C', '#F4511E']
        },
        {
            icon: GiSushis,
            title: 'Авторские роллы',
            description: 'Уникальные рецепты, созданные нашим шеф-поваром',
            gradient: ['#B71C1C', '#F4511E']
        },
        {
            icon: FaStar,
            title: 'Гарантия вкуса',
            description: '100% удовольствие или вернем деньги',
            gradient: ['#B71C1C', '#F4511E']
        }
    ];

    return (
        <section className="values-section" ref={valuesRef}>
            {/* Японский фон */}
            <div className="japanese-pattern"></div>
            <div className="sakura-petals">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="petal" style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${5 + Math.random() * 5}s`
                    }}></div>
                ))}
            </div>

            <div className="container">
                <div className="values-header">
                    <span className="values-subtitle-en">OUR VALUES</span>
                    <h2 className="values-title">
                        Философия <span className="title-highlight">GINZA</span>
                    </h2>
                    <p className="values-subtitle">
                        Шесть причин влюбиться в нашу кухню
                    </p>
                </div>

                <div className="values-grid">
                    {values.map((value, index) => {
                        const Icon = value.icon;
                        return (
                            <div
                                key={index}
                                className="value-card"
                                style={{
                                    '--gradient-start': value.gradient[0],
                                    '--gradient-end': value.gradient[1]
                                }}
                            >
                                <div className="value-card-inner">
                                    <div className="value-front">
                                        <div className="value-icon-wrapper">
                                            <Icon className="value-icon" />
                                        </div>
                                        <h3 className="value-title">{value.title}</h3>
                                        <div className="value-number">0{index + 1}</div>
                                    </div>
                                    <div className="value-back">
                                        <p className="value-description">{value.description}</p>
                                        <div className="value-back-decoration"></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Декоративная волна */}
                <div className="values-wave">
                    <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
                        <path d="M0,50 C300,100 600,0 1440,50 L1440,100 L0,100 Z" fill="rgba(183,28,28,0.05)" />
                    </svg>
                </div>
            </div>
        </section>
    );
};

export default Values;