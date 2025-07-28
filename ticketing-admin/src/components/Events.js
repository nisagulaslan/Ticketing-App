import React, { useEffect, useState } from 'react';


function Events({ token }) {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [layoutId, setLayoutId] = useState('');
  const [error, setError] = useState(null);

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  // Modal için state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const fetchEvents = () => {
    fetch('http://localhost:8080/api/events/upcoming', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject('Failed')))
      .then((data) => {
        setEvents(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Error:', err);
        setError('Could not fetch events.');
      });
  };

  useEffect(() => {
    fetchEvents();
  }, [token]);

  const confirmDelete = (event) => {
    setEventToDelete(event);
    setShowConfirmModal(true);
  };

  const handleDelete = () => {
    if (!eventToDelete) return;
    fetch(`http://localhost:8080/api/events/${eventToDelete.idEvent}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Delete failed');
        fetchEvents();
        setMessage(`"${eventToDelete.name}" deleted successfully.`);
        setMessageType('success');
      })
      .catch(() => {
        setMessage('Failed to delete event.');
        setMessageType('error');
      })
      .finally(() => {
        setEventToDelete(null);
        setShowConfirmModal(false);
        setTimeout(() => setMessage(null), 3000);
      });
  };

  const handleAdd = () => {
    if (!name.trim() || !eventStart.trim() || !layoutId.trim()) {
      alert('Please fill all fields.');
      return;
    }

    fetch('http://localhost:8080/api/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        eventStart,
        physicalSeatLayoutId: parseInt(layoutId),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Creation failed');
        setName('');
        setEventStart('');
        setLayoutId('');
        fetchEvents();
        setMessage('Event added successfully!');
        setMessageType('success');
      })
      .catch(() => {
        setMessage('Failed to add event.');
        setMessageType('error');
      })
      .finally(() => {
        setTimeout(() => setMessage(null), 3000);
      });
  };

  return (
    <div>
      {/* Bildirim mesajı */}
      {message && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            padding: '12px 20px',
            borderRadius: 8,
            color: 'white',
            backgroundColor: messageType === 'success' ? '#4caf50' : '#f44336',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            zIndex: 1000,
            minWidth: 250,
            textAlign: 'center',
            cursor: 'pointer',
          }}
          onClick={() => setMessage(null)}
        >
          {message}
        </div>
      )}

      {/* Silme onay modali */}
      {showConfirmModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background: 'white',
              padding: 30,
              borderRadius: 12,
              textAlign: 'center',
              minWidth: 300,
            }}
          >
            <p>Are you sure you want to delete event:</p>
            <h3 style={{ marginTop: 10 }}>{eventToDelete?.name}</h3>
            <div style={{ marginTop: 20 }}>
              <button
                onClick={handleDelete}
                style={{
                  padding: '8px 16px',
                  marginRight: 10,
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                }}
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#888',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <h1>Upcoming Events</h1>

      {/* Yeni etkinlik formu */}
      <div style={{ marginBottom: 30, background: '#f9f9f9', padding: 20, borderRadius: 10 }}>
        <h3>Add New Event</h3>
        <input
          type="text"
          placeholder="Event Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 8, marginRight: 10 }}
        />
        <input
          type="datetime-local"
          value={eventStart}
          onChange={(e) => setEventStart(e.target.value)}
          style={{ padding: 8, marginRight: 10 }}
        />
        <select
          value={layoutId}
          onChange={(e) => setLayoutId(e.target.value)}
          style={{ padding: 8, marginRight: 10 }}
        >
          <option value="">Select Layout</option>
          <option value="1">Main Hall Layout</option>
          <option value="2">Balcony Layout</option>
        </select>
        <button onClick={handleAdd} style={{ padding: '8px 14px' }}>
          Add Event
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <table className="event-table">
          <thead>
            <tr>
              {/* ID gizlendi */}
              <th>Name</th>
              <th>Start Time</th>
              <th>State</th>
              {events.some((e) => e.physicalSeatLayoutName) && <th>Layout</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.idEvent}>
                <td>{event.name}</td>
                <td>{new Date(event.eventStart).toLocaleString()}</td>
                <td>{event.state}</td>
                {event.physicalSeatLayoutName && <td>{event.physicalSeatLayoutName}</td>}
                <td>
                  <button
                    onClick={() => confirmDelete(event)}
                    style={{
                      background: '#c62828',
                      color: 'white',
                      padding: '6px 12px',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Events;
