import React, { useState } from 'react';
import SeatModal from './SeatModal';

function EventCard({ event }) {
  const [showSeats, setShowSeats] = useState(false);

  return (
    <div style={{border: '1px solid #ccc', borderRadius: 8, marginBottom: 15, padding: 15}}>
      <h2>{event.name}</h2>
      <p>Starts: {new Date(event.eventStart).toLocaleString()}</p>
      <button onClick={() => setShowSeats(true)}>View Seats</button>

      {showSeats && <SeatModal eventId={event.idEvent} onClose={() => setShowSeats(false)} />}
    </div>
  );
}

export default EventCard;
