import React, { useEffect, useState } from 'react';

function SeatModal({ eventId, onClose }) {
  const [seats, setSeats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = "YOUR_TOKEN_HERE";

    fetch(`http://localhost:8080/api/events/${eventId}/seats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch seats');
      return res.json();
    })
    .then(data => setSeats(data))
    .catch(err => setError(err.message));
  }, [eventId]);

  return (
    <div style={{
      position: 'fixed', top:0, left:0, right:0, bottom:0, 
      backgroundColor: 'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center'
    }}>
      <div style={{ backgroundColor: 'white', padding: 20, borderRadius: 8, width: '80%', maxHeight: '80%', overflowY: 'auto' }}>
        <h3>Seats for Event {eventId}</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={onClose} style={{ float: 'right' }}>Close</button>
        <ul>
          {seats.map(seat => (
            <li key={seat.idSeat}>{seat.name} - {seat.state}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SeatModal;
