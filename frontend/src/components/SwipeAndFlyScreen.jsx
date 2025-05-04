import React, { useState, useRef, useEffect } from 'react';
import './SwipeAndFlyScreen.css';
import stuttgart from './../assets/images/stuttgart.jpeg';
import colonia from './../assets/images/colonia.jpg';
import berlin from './../assets/images/berlin.jpg';
import bremen from './../assets/images/bremen.jpg';
import dresde from './../assets/images/dresde.jpg';
import francfort from './../assets/images/francfort.jpg';
import hamburgo from './../assets/images/hamburgo.jpg';
import leipzig from './../assets/images/leipzigjpg.jpg';
import munich from './../assets/images/munich.jpg';
import nuremberg from './../assets/images/nuremberg.jpg';

const initialDestinations = [
    {
        id: 1,
        name: 'STUTTGART',
        image: stuttgart,
        flightPrice: 80, // Precio de vuelo coherente
        details: {
            tags: ['Cars', 'Culture', 'Wine'],
            hotels: 'From 65 EUR/night',
            apartments: 'From 40 EUR/night',
            about: 'Known for Mercedes-Benz and Porsche, Stuttgart offers a rich automotive and cultural history.',
        },
    },
    {
        id: 2,
        name: 'COLOGNE',
        image: colonia,
        flightPrice: 70, // Precio de vuelo coherente
        details: {
            tags: ['Cathedral', 'Carnival', 'Rhine River'],
            hotels: 'From 55 EUR/night',
            apartments: 'From 35 EUR/night',
            about: 'Famous for its impressive Gothic cathedral and its lively carnival.',
        },
    },
    {
        id: 3,
        name: 'BERLIN',
        image: berlin,
        flightPrice: 60, // Precio de vuelo coherente
        details: {
            tags: ['History', 'Art', 'Nightlife'],
            hotels: 'From 50 EUR/night',
            apartments: 'From 30 EUR/night',
            about: 'The German capital, rich in history, culture, and a vibrant nightlife.',
        },
    },
    {
        id: 4,
        name: 'MUNICH',
        image: munich,
        flightPrice: 90, // Precio de vuelo coherente
        details: {
            tags: ['Oktoberfest', 'Beer Gardens', 'Alps'],
            hotels: 'From 70 EUR/night',
            apartments: 'From 45 EUR/night',
            about: 'Known for its beer festival, beer gardens, and proximity to the Alps.',
        },
    },
    {
        id: 5,
        name: 'HAMBURG',
        image: hamburgo,
        flightPrice: 75, // Precio de vuelo coherente
        details: {
            tags: ['Port', 'Music', 'Maritime Life'],
            hotels: 'From 60 EUR/night',
            apartments: 'From 40 EUR/night',
            about: 'A major port city with a rich maritime history and a vibrant music scene.',
        },
    },
    {
        id: 6,
        name: 'FRANKFURT',
        image: francfort,
        flightPrice: 85, // Precio de vuelo coherente
        details: {
            tags: ['Finance', 'Museums', 'Shopping'],
            hotels: 'From 75 EUR/night',
            apartments: 'From 50 EUR/night',
            about: 'Germany\'s financial center, with impressive skyscrapers and a rich cultural offering.',
        },
    },
    {
        id: 7,
        name: 'NUREMBERG',
        image: nuremberg,
        flightPrice: 65, // Precio de vuelo coherente
        details: {
            tags: ['Medieval History', 'Christmas Market', 'World War II'],
            hotels: 'From 50 EUR/night',
            apartments: 'From 30 EUR/night',
            about: 'A city with a rich medieval history and an important role during World War II.',
        },
    },
    {
        id: 8,
        name: 'LEIPZIG',
        image: leipzig,
        flightPrice: 55, // Precio de vuelo coherente
        details: {
            tags: ['Music', 'Universities', 'Alternative Culture'],
            hotels: 'From 45 EUR/night',
            apartments: 'From 25 EUR/night',
            about: 'A university city with a strong musical tradition and a growing alternative cultural scene.',
        },
    },
    {
        id: 9,
        name: 'DRESDEN',
        image: dresde,
        flightPrice: 70, // Precio de vuelo coherente
        details: {
            tags: ['Baroque Architecture', 'Art', 'Elbe River'],
            hotels: 'From 55 EUR/night',
            apartments: 'From 35 EUR/night',
            about: 'Known for its stunning Baroque architecture and valuable art treasures.',
        },
    },
    {
        id: 10,
        name: 'BREMEN',
        image: bremen,
        flightPrice: 60, // Precio de vuelo coherente
        details: {
            tags: ['Fairy Tales', 'Port', 'Old Town'],
            hotels: 'From 50 EUR/night',
            apartments: 'From 30 EUR/night',
            about: 'Famous for the tale of the Bremen Town Musicians and its charming old town.',
        },
    },
];

function SwipeAndFlyScreen() {
    const [currentDestinationIndex, setCurrentDestinationIndex] = useState(0);
    const [showDetails, setShowDetails] = useState(false);
    const [touchStartX, setTouchStartX] = useState(null);
    const [touchY, setTouchY] = useState(null);
    const [offsetX, setOffsetX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const cardRef = useRef(null);
    const [noMoreDestinations, setNoMoreDestinations] = useState(false);
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
            setNoMoreDestinations(true);
            setOffsetX(0);
        }
        setShowDetails(false);
    };

    const handleDislikeSwipe = () => {
        if (currentDestinationIndex < initialDestinations.length - 1) {
            setCurrentDestinationIndex(currentDestinationIndex + 1);
            setOffsetX(0);
        } else {
            setNoMoreDestinations(true);
            setOffsetX(0);
        }
        setShowDetails(false);
    };

    const handleNeutral = () => {
        if (currentDestinationIndex < initialDestinations.length - 1) {
            setCurrentDestinationIndex(currentDestinationIndex + 1);
            setOffsetX(0);
        } else {
            setNoMoreDestinations(true);
            setOffsetX(0);
        }
        setShowDetails(false);
    };

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    if (!currentDestination && !noMoreDestinations) {
        return <div>Loading cities...</div>;
    }

    return (
        <div className="swipe-and-fly-container">
            {noMoreDestinations ? (
                <div className="no-destinations">No destinations available</div>
            ) : (
                <>
                    <div
                        ref={cardRef}
                        className="destination-card"
                        style={{ transform: `translateX(${offsetX}px) rotate(${offsetX * 0.03}deg)` }}
                    >
                        <img src={currentDestination.image} alt={currentDestination.name} className="destination-image" />
                        <div className="destination-info">
                            <h2>{currentDestination.name}</h2>
                            <p>{`Flights from: ${currentDestination.flightPrice} EUR`}</p>
                        </div>
                        <button className="details-button" onClick={toggleDetails}>
                            <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
                                <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-1 5h2v-6h-2v6zm1-10c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                            </svg>
                        </button>
                        {showDetails && (
                            <div className="destination-details">
                                <h3>Relevant Tags</h3>
                                <div className="tags">
                                    {currentDestination.details.tags.map((tag) => (
                                        <span key={tag} className="tag">{tag}</span>
                                    ))}
                                </div>
                                <h3>Hotels and apartments</h3>
                                <p>{currentDestination.details.hotels}</p>
                                <p>{currentDestination.details.apartments}</p>
                                <h3>About the city</h3>
                                <p>{currentDestination.details.about}</p>
                            </div>
                        )}
                    </div>
                    <div className="swipe-buttons">
                        <button className="dislike-button" onClick={handleDislikeSwipe}>
                            DISLIKE
                        </button>
                        <button className="neutral-button" onClick={handleNeutral}>
                            =
                        </button>
                        <button className="like-button" onClick={handleLikeSwipe}>
                            LIKE
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default SwipeAndFlyScreen;