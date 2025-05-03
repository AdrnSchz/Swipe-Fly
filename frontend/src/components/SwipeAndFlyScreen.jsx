import React, { useState } from 'react';
import './SwipeAndFlyScreen.css'; // Crea este archivo CSS
import stuttgart from './../assets/images/stuttgart.jpeg';
import colonia from './../assets/images/colonia.jpg';

const initialDestinations = [
    {
        id: 1,
        name: 'STUTTGART',
        image: stuttgart, // Asigna directamente la variable importada
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
        image: colonia, // Asigna directamente la variable importada
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
    const currentDestination = initialDestinations[currentDestinationIndex];

    const handleLike = () => {
        // Aquí podrías guardar el destino como "me gusta"
        if (currentDestinationIndex < initialDestinations.length - 1) {
            setCurrentDestinationIndex(currentDestinationIndex + 1);
        } else {
            alert('¡Has visto todos los destinos!');
        }
        setShowDetails(false);
    };

    const handleDislike = () => {
        // Aquí podrías guardar el destino como "no me gusta"
        if (currentDestinationIndex < initialDestinations.length - 1) {
            setCurrentDestinationIndex(currentDestinationIndex + 1);
        } else {
            alert('¡Has visto todos los destinos!');
        }
        setShowDetails(false);
    };

    const handleNeutral = () => {
        // Aquí podrías implementar alguna acción para el botón neutral
        alert('Opción neutral seleccionada');
        if (currentDestinationIndex < initialDestinations.length - 1) {
            setCurrentDestinationIndex(currentDestinationIndex + 1);
        } else {
            alert('¡Has visto todos los destinos!');
        }
        setShowDetails(false);
    };

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    if (!currentDestination) {
        return <div>Cargando destinos...</div>; // O un mensaje de "no hay destinos"
    }

    return (
        <div className="swipe-and-fly-container">
            <div className="destination-card">
                <img src={currentDestination.image} alt={currentDestination.name} className="destination-image" />
                <div className="destination-info">
                    <h2>{currentDestination.name}</h2>
                    <p>Vuelos desde: 50€</p> {/* Esto podría ser dinámico */}
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
                <button className="dislike-button" onClick={handleDislike}>NO ME GUSTA</button>
                <button className="neutral-button" onClick={handleNeutral}>=</button>
                <button className="like-button" onClick={handleLike}>ME GUSTA</button>
            </div>
        </div>
    );
}

export default SwipeAndFlyScreen;