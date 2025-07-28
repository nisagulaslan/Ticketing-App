import React, { useState, useEffect } from "react";
import Login from "./Login";
import styles from "./App.module.css";
import SeatMap from "./SeatMap";

const dummyPosters = [
  "https://images.unsplash.com/photo-1504805572947-34fad45aed93?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
];

function App() {
  const [token, setToken] = useState(null);
  const [events, setEvents] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [ownerName, setOwnerName] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [view, setView] = useState("events");
  const [tickets, setTickets] = useState([]);

  // Yeni: İptal onay modal kontrolü için state
  const [cancelConfirmTicketId, setCancelConfirmTicketId] = useState(null);

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    fetch("http://localhost:8080/api/events/upcoming", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to load events")))
      .then((data) => {
        setEvents(data);
        setError(null);
      })
      .catch((e) => setError(e.toString()))
      .finally(() => setLoading(false));
  }, [token]);

  const loadSeats = (eventId) => {
    setLoading(true);
    fetch(`http://localhost:8080/api/events/${eventId}/seats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to load seats")))
      .then((data) => {
        setSeats(data);
        setError(null);
      })
      .catch((e) => setError(e.toString()))
      .finally(() => setLoading(false));
  };

  const handleSelectSeat = (seat) => {
    if (seat.tickets.length > 0) return;
    setSelectedSeat(seat);
    setSuccessMessage(null);
  };

  const handleGetTicket = () => {
    if (!ownerName.trim()) {
      alert("Please enter your full name.");
      return;
    }
    if (!selectedSeat) {
      alert("Please select a seat first.");
      return;
    }

    const params = new URLSearchParams({
      IdEvent: activeEvent.idEvent,
      IdSeat: selectedSeat.idSeat,
      OwnerName: ownerName.trim(),
    });

    fetch(`http://localhost:8080/api/tickets?${params.toString()}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create ticket");
        return res.json();
      })
      .then((data) => {
        setSuccessMessage(`Ticket #${data.idTicket} created successfully!`);
        setSelectedSeat(null);
        setOwnerName("");
        loadSeats(activeEvent.idEvent);
        setError(null);
      })
      .catch((e) => setError(e.toString()));
  };

  // Yeni: İptal butonuna basıldığında modal açılır
  const cancelTicket = (ticketId) => {
    setCancelConfirmTicketId(ticketId);
  };

  // Yeni: Onay modalındaki "Yes" butonu ile iptal işlemi
  const confirmCancelTicket = () => {
    if (!cancelConfirmTicketId) return;

    fetch(`http://localhost:8080/api/tickets/${cancelConfirmTicketId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to cancel ticket");
        setSuccessMessage("Ticket cancelled successfully.");
        fetchTickets();
      })
      .catch((e) => alert("Error cancelling ticket: " + e.message))
      .finally(() => setCancelConfirmTicketId(null));
  };

  // Yeni: Onay modalındaki "No" butonu ile iptal
  const cancelCancelTicket = () => {
    setCancelConfirmTicketId(null);
  };

  const fetchTickets = () => {
    setLoading(true);
    setError(null);
    fetch("http://localhost:8080/api/tickets/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load tickets");
        return res.json();
      })
      .then((data) => {
        setTickets(data);
        setView("tickets");
        setError(null);
      })
      .catch(() => {
        setTickets([]);
        setView("tickets");
        setError("No tickets available or failed to load tickets.");
      })
      .finally(() => setLoading(false));
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setActiveEvent(null);
    setEvents([]);
    setSeats([]);
    setSelectedSeat(null);
    setOwnerName("");
    setSuccessMessage(null);
    setError(null);
    setView("events");
    setTickets([]);
  };

  if (!token) {
    return (
      <Login
        onLogin={(newToken) => {
          localStorage.setItem("token", newToken);
          setToken(newToken);
        }}
      />
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🎟 Ticketing Platform</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          marginBottom: 20,
        }}
      >
        <button className={styles.btn} onClick={fetchTickets}>
          My Tickets
        </button>
        <button className={styles.btn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {successMessage && <div className={styles.messageSuccess}>{successMessage}</div>}

      {view === "events" && (
        <>
          {error && <div className={styles.messageError}>{error}</div>}

          {!activeEvent && (
            <>
              <h2 style={{ color: "#fff", marginBottom: 20 }}>Available Events</h2>
              <div className={styles.eventGrid}>
                {events.map((event, index) => (
                  <div key={event.idEvent} className={styles.eventCard}>
                    <img
                      src={dummyPosters[index % dummyPosters.length]}
                      alt={`${event.name} poster`}
                      style={{
                        width: "100%",
                        borderRadius: "12px",
                        objectFit: "cover",
                        height: "140px",
                        marginBottom: "12px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                      }}
                    />
                    <h3>{event.name}</h3>
                    <p>
                      {new Date(event.eventStart).toLocaleString("en-GB", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                    <button
                      className={styles.btn}
                      onClick={() => {
                        setActiveEvent(event);
                        loadSeats(event.idEvent);
                      }}
                    >
                      Select Seats
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeEvent && (
            <div className={styles.section}>
              <button
                className={styles.btnSecondary}
                onClick={() => {
                  setActiveEvent(null);
                  setSeats([]);
                  setSelectedSeat(null);
                }}
              >
                ← Back to Events
              </button>

              <div
                style={{
                  position: "relative",
                  marginBottom: "20px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                }}
              >
                <img
                  src={
                    dummyPosters[
                      events.findIndex((e) => e.idEvent === activeEvent.idEvent) %
                        dummyPosters.length
                    ]
                  }
                  alt="Event Poster"
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    filter: "brightness(0.6)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "16px",
                    backgroundColor: "rgba(0,0,0,0.7)",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  {new Date(activeEvent.eventStart).toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>
              </div>

              <h2 style={{ color: "white" }}>
                Select Seat for:{" "}
                <span style={{ color: "#42a5f5" }}>{activeEvent.name}</span>
              </h2>

              <div className={styles.seatMapContainer}>
                <SeatMap
                  seats={seats}
                  selectedSeatId={selectedSeat?.idSeat}
                  onSelect={handleSelectSeat}
                />
              </div>

              {selectedSeat && (
                <div className={styles.selectedSeatPanel}>
                  <div className={styles.seatInfo}>
                    <div className={styles.seatBox}>
                      {selectedSeat.row}
                      {selectedSeat.seatNumber}
                    </div>
                    <div className={styles.ownerInput}>
                      <input
                        type="text"
                        placeholder="Your Full Name"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                      />
                      <button onClick={handleGetTicket}>Get Ticket</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {view === "tickets" && (
        <div>
          <button
            className={styles.btnSecondary}
            onClick={() => {
              setView("events");
              setTickets([]);
              setError(null);
            }}
          >
            ← Back to Events
          </button>

          <h2 style={{ color: "white", marginTop: 20 }}>My Tickets</h2>

          {(error || tickets.length === 0) && (
            <p style={{ color: "white" }}>
              No tickets available or failed to load tickets.
            </p>
          )}

          {!error && tickets.length > 0 && (
            <ul
              style={{
                color: "white",
                listStyle: "none",
                padding: 0,
                marginTop: 10,
              }}
            >
              {tickets.map((ticket) => (
                <li
                  key={ticket.id}
                  style={{
                    background: ticket.state === "CANCELLED" ? "#555" : "#222",
                    opacity: ticket.state === "CANCELLED" ? 0.6 : 1,
                    padding: "16px",
                    marginBottom: "12px",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    🎟 Ticket #{ticket.id} – Seat: {ticket.seatRow}
                    {ticket.seatNumber} – Event: {ticket.eventName}{" "}
                    {ticket.state === "CANCELLED" && (
                      <span style={{ color: "#ff8a80", marginLeft: 10 }}>
                        (CANCELLED)
                      </span>
                    )}
                  </span>
                  {ticket.state !== "CANCELLED" && (
                    <button
                      style={{
                        background: "#c62828",
                        color: "white",
                        padding: "8px 14px",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                      onClick={() => cancelTicket(ticket.id)}
                    >
                      Cancel
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* İptal onay modalı */}
      {cancelConfirmTicketId !== null && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <p>Are you sure you want to cancel this ticket?</p>
            <button className={styles.btnConfirm} onClick={confirmCancelTicket}>
              Yes
            </button>
            <button className={styles.btnCancel} onClick={cancelCancelTicket}>
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
