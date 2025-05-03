import React, { useState, useRef, useEffect } from 'react';
import './SwipeAndFlyScreen.css';
import stuttgart from './../assets/images/stuttgart.jpeg';
import colonia from './../assets/images/colonia.jpg';

const initialDestinations = [
    {
        id: 1,
        name: 'STUTTGART',
        image: stuttgart,
        details: {
            tags: ['Fresco montaña', 'Ruinas ancestrales', 'Coches y carreras'],
            hotels: 'Hoteles desde 70€/noche',
            apartments: 'Apartamentos desde 15€/noche',
            about: 'Stuttgart es una ciudad idónea para los amantes de los coches...',
        },
    },
    {
        id: 2,
        name: 'COLONIA',
        image: colonia,
        details: {
            tags: ['Arquitectura gótica', 'Carnaval', 'Río Rin'],
            hotels: 'Hoteles desde 60€/noche',
            apartments: 'Apartamentos desde 20€/noche',
            about: 'Colonia es famosa por su impresionante catedral...',
        },
    },
    // ... más destinos ...
];

function SwipeAndFlyScreen() {
    const [currentDestinationIndex, setCurrentDestinationIndex] = useState(0);
    const [showDetails, setShowDetails] = useState(false);
    const [touchStartX, setTouchStartX] = useState(null);
    const [touchY, setTouchY] = useState(null);
    const [offsetX, setOffsetX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const cardRef = useRef(null);
    const currentDestination = initialDestinations[currentDestinationIndex];

    useEffect(() => {
        const card = cardRef.current;
        if (card) {
            const handleMouseDown = (e) => {
                setTouchStartX(e.clientX);
                setTouchY(e.clientY);
                setIsSwiping(true);
                card.style.transition = 'none'; // Desactivar la transición para el movimiento en tiempo real
            };

            const handleMouseMove = (e) => {
                if (!isSwiping) return;
                const deltaX = e.clientX - touchStartX;
                setOffsetX(deltaX);
                card.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.03}deg)`;
            };

            const handleMouseUp = (e) => {
                if (!isSwiping) return;
                setIsSwiping(false);
                card.style.transition = 'transform 0.3s ease-out'; // Activar la transición para la animación final

                if (Math.abs(offsetX) > 100) {
                    // Considerar como swipe
                    if (offsetX > 0) {
                        handleLikeSwipe();
                    } else {
                        handleDislikeSwipe();
                    }
                } else {
                    // Volver a la posición original
                    setOffsetX(0);
                    card.style.transform = 'translateX(0) rotate(0deg)';
                }
            };

            const handleTouchStart = (e) => {
                setTouchStartX(e.touches[0].clientX);
                setTouchY(e.touches[0].clientY);
                setIsSwiping(true);
                card.style.transition = 'none';
            };

            const handleTouchMove = (e) => {
                if (!isSwiping || e.touches.length !== 1) return;
                const deltaX = e.touches[0].clientX - touchStartX;
                setOffsetX(deltaX);
                card.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.03}deg)`;
            };

            const handleTouchEnd = (e) => {
                if (!isSwiping) return;
                setIsSwiping(false);
                card.style.transition = 'transform 0.3s ease-out';

                if (Math.abs(offsetX) > 80) {
                    if (offsetX > 0) {
                        handleLikeSwipe();
                    } else {
                        handleDislikeSwipe();
                    }
                } else {
                    setOffsetX(0);
                    card.style.transform = 'translateX(0) rotate(0deg)';
                }
            };

            card.addEventListener('mousedown', handleMouseDown);
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);

            card.addEventListener('touchstart', handleTouchStart);
            window.addEventListener('touchmove', handleTouchMove, { passive: false }); // Evitar el comportamiento de scroll predeterminado
            window.addEventListener('touchend', handleTouchEnd);
            window.addEventListener('touchcancel', handleTouchEnd);

            return () => {
                card.removeEventListener('mousedown', handleMouseDown);
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
                card.removeEventListener('touchstart', handleTouchStart);
                window.removeEventListener('touchmove', handleTouchMove);
                window.removeEventListener('touchend', handleTouchEnd);
                window.removeEventListener('touchcancel', handleTouchEnd);
            };
        }
    }, [isSwiping, touchStartX, touchY, offsetX]);

    const handleLikeSwipe = () => {
        if (currentDestinationIndex < initialDestinations.length - 1) {
            setCurrentDestinationIndex(currentDestinationIndex + 1);
            setOffsetX(0);
        } else {
            setOffsetX(0);
        }
        setShowDetails(false);
    };

    const handleDislikeSwipe = () => {
        if (currentDestinationIndex < initialDestinations.length - 1) {
            setCurrentDestinationIndex(currentDestinationIndex + 1);
            setOffsetX(0);
        } else {
            setOffsetX(0);
        }
        setShowDetails(false);
    };

    const handleNeutral = () => {
        if (currentDestinationIndex < initialDestinations.length - 1) {
            setCurrentDestinationIndex(currentDestinationIndex + 1);
            setOffsetX(0);
        } else {
            setOffsetX(0);
        }
        setShowDetails(false);
    };

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    if (!currentDestination) {
        return <div>Cargando destinos...</div>;
    }

    return (
        <div className="swipe-and-fly-container">
            <div ref={cardRef} className="destination-card" style={{ transform: `translateX(${offsetX}px) rotate(${offsetX * 0.03}deg)` }}>
                <img src={currentDestination.image} alt={currentDestination.name} className="destination-image" />
                <div className="destination-info">
                    <h2>{currentDestination.name}</h2>
                    <p>Vuelos desde: 50€</p>
                </div>
                <button className="details-button" onClick={toggleDetails}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                        <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-1 5h2v-6h-2v6zm1-10c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                    </svg>
                </button>
                {showDetails && (
                    <div className="destination-details">
                        <h3>Tags relevantes</h3>
                        <div className="tags">
                            {currentDestination.details.tags.map((tag) => (
                                <span key={tag} className="tag">{tag}</span>
                            ))}
                        </div>
                        <h3>Hoteles y Apartamentos</h3>
                        <p>{currentDestination.details.hotels}</p>
                        <p>{currentDestination.details.apartments}</p>
                        <h3>Sobre la ciudad</h3>
                        <p>{currentDestination.details.about}</p>
                    </div>
                )}
            </div>
            <div className="swipe-buttons">
                <button className="dislike-button" onClick={handleDislikeSwipe}>NO ME GUSTA</button>
                <button className="neutral-button" onClick={handleNeutral}>=</button>
                <button className="like-button" onClick={handleLikeSwipe}>ME GUSTA</button>
            </div>
        </div>
    );
}

export default SwipeAndFlyScreen;