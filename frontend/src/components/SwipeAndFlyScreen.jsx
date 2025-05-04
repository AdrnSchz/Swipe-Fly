// SwipeAndFlyScreen.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './SwipeAndFlyScreen.css';
import stuttgart from './../assets/images/stuttgart.jpeg';
import colonia   from './../assets/images/colonia.jpg';
import berlin    from './../assets/images/berlin.jpg';
import bremen    from './../assets/images/bremen.jpg';
import dresde    from './../assets/images/dresde.jpg';
import francfort from './../assets/images/francfort.jpg';
import hamburgo  from './../assets/images/hamburgo.jpg';
import leipzig   from './../assets/images/leipzigjpg.jpg';
import munich    from './../assets/images/munich.jpg';
import nuremberg from './../assets/images/nuremberg.jpg';

const initialDestinations = [
  { id:1,  image: stuttgart },
  { id:2,  image: colonia   },
  { id:3,  image: berlin    },
  { id:4,  image: munich    },
  { id:5,  image: hamburgo  },
  { id:6,  image: francfort },
  { id:7,  image: nuremberg },
  { id:8,  image: leipzig   },
  { id:9,  image: dresde    },
  { id:10, image: bremen    },
];

function SwipeAndFlyScreen({ groupId }) {
  const [cityNames,   setCityNames]   = useState(initialDestinations.map(()=>'Loading…'));
  const [tagsList,    setTagsList]    = useState(initialDestinations.map(()=>[]));
  const [airportList, setAirportList] = useState([]);       // aeropuertos con IATA
  const [flightInfo,  setFlightInfo]  = useState(null);     // primer vuelo para la tarjeta actual

  const [currentIdx,  setCurrentIdx]  = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [offsetX,     setOffsetX]     = useState(0);
  const [isSwiping,   setIsSwiping]   = useState(false);
  const [noMore,      setNoMore]      = useState(false);
  const cardRef = useRef(null);

  // 1) Llamada a POST /api/airport/suggestions/group/:id
  //    que nos devuelve { suggestions: [{city,tags}], matchedAirports: [{iata,...}] }
  useEffect(() => {
    axios.post(`http://localhost:4000/api/airport/suggestions/group/${groupId}`)
      .then(res => {
        const { suggestions = [], matchedAirports = [] } = res.data;

        // extraemos nombres y tags de la IA
        const names = suggestions.map(s => s.city);
        const tags  = suggestions.map(s => s.tags || []);
        // rellenamos hasta 10
        while (names.length < initialDestinations.length) {
          names.push('—');
          tags.push([]);
        }
        setCityNames(names);
        setTagsList(tags);
        setAirportList(matchedAirports);
      })
      .catch(console.error);
  }, [groupId]);

  // 2) Cuando abrimos detalles, llamamos a GET /api/flights para obtener
  //    los vuelos desde el primer aeropuerto al aeropuerto actual
  useEffect(() => {
    if (!showDetails) return;
    if (!airportList.length) return;

    const originIata = "LHR";
    const destAirport = airportList[currentIdx];
    if (!destAirport) return;
    const destIata = destAirport.iata;

    // Ejemplo: parámetros de fecha fijos, ajusta según tu UI
    const params = { from: originIata, to: destIata, year:2025, month:5, day:15 };

    axios.get('http://localhost:4000/api/flights', { params })
      .then(res => {
        // suponemos que la respuesta es un array y tomamos el primero
        const first = Array.isArray(res.data) ? res.data[0] : null;
        setFlightInfo(first);
      })
      .catch(console.error);
  }, [showDetails, airportList, currentIdx]);

  // 3) Swipe handlers (igual a tu implementación anterior)
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const onDown = e => {
      const x = e.clientX ?? e.touches[0].clientX;
      setTouchStartX(x);
      setIsSwiping(true);
      card.style.transition = 'none';
    };
    const onMove = e => {
      if (!isSwiping) return;
      const x = e.clientX ?? e.touches[0].clientX;
      const dx = x - touchStartX;
      setOffsetX(dx);
      card.style.transform = `translateX(${dx}px) rotate(${dx * 0.03}deg)`;
    };
    const onUp = () => {
      if (!isSwiping) return;
      setIsSwiping(false);
      card.style.transition = 'transform 0.3s ease-out';
      if (Math.abs(offsetX) > 80) {
        if (currentIdx < initialDestinations.length - 1) {
          setCurrentIdx(i => i + 1);
          setOffsetX(0);
        } else {
          setNoMore(true);
        }
      } else {
        card.style.transform = 'translateX(0) rotate(0deg)';
        setOffsetX(0);
      }
      setShowDetails(false);
    };

    card.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    card.addEventListener('touchstart', onDown);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);

    return () => {
      card.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      card.removeEventListener('touchstart', onDown);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [isSwiping, touchStartX, offsetX, currentIdx]);

  if (noMore) {
    return <div className="no-destinations">No destinations available</div>;
  }

  const dest   = initialDestinations[currentIdx];
  const city   = cityNames[currentIdx];
  const tags   = tagsList[currentIdx];
  const flight = flightInfo;

  return (
    <div className="swipe-and-fly-container">
      <div
        ref={cardRef}
        className="destination-card"
        style={{ transform: `translateX(${offsetX}px) rotate(${offsetX * 0.03}deg)` }}
      >
        <img src={dest.image} alt={city} className="destination-image" />
        <div className="destination-info">
          <h2>{city}</h2>
        </div>
        <button className="details-button" onClick={() => setShowDetails(d => !d)}>
          ℹ️
        </button>
        {showDetails && (
          <div className="destination-details">
            <h3>Relevant Tags</h3>
            <div className="tags">
              {tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
            <h3>First Flight</h3>
            {flight ? (
              <>
                <p>Duration: {flight.duration}</p>
              </>
            ) : (
              <p>Loading flight…</p>
            )}
          </div>
        )}
      </div>
      <div className="swipe-buttons">
        <button className="dislike-button" onClick={() => {/* swipe left */}}>DISLIKE</button>
        <button className="neutral-button" onClick={() => {/* swipe neutral */}}>=</button>
        <button className="like-button" onClick={() => {/* swipe right */}}>LIKE</button>
      </div>
    </div>
  );
}

export default SwipeAndFlyScreen;
