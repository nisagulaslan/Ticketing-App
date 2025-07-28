import React, { useEffect, useState } from "react";

function Tickets({ token }) {
  const [tickets, setTickets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [eventFilter, setEventFilter] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");

  const [cancelId, setCancelId] = useState(null); // seçilen bilet

  useEffect(() => {
    fetch("http://localhost:8080/api/tickets", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tickets");
        return res.json();
      })
      .then((data) => {
        setTickets(data);
        setFiltered(data);
        setError(null);
      })
      .catch((e) => {
        setError(e.message);
        setTickets([]);
        setFiltered([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    let filtered = [...tickets];

    if (eventFilter.trim()) {
      filtered = filtered.filter((t) =>
        t.eventName.toLowerCase().includes(eventFilter.toLowerCase())
      );
    }

    if (ownerFilter.trim()) {
      filtered = filtered.filter((t) =>
        t.ownerName.toLowerCase().includes(ownerFilter.toLowerCase())
      );
    }

    if (stateFilter) {
      filtered = filtered.filter((t) => t.state === stateFilter);
    }

    setFiltered(filtered);
  }, [eventFilter, ownerFilter, stateFilter, tickets]);

  const confirmCancel = () => {
    fetch(`http://localhost:8080/api/tickets/${cancelId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to cancel ticket");
        return fetch("http://localhost:8080/api/tickets", {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => res.json())
      .then((data) => {
        setTickets(data);
        setCancelId(null);
      })
      .catch((e) => {
        alert(e.message);
        setCancelId(null);
      });
  };

  return (
    <div>
      <h2>All Tickets</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && filtered.length === 0 && <p>No tickets found.</p>}

      {!loading && filtered.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
          <thead>
            <tr style={{ backgroundColor: "#eee" }}>
              <th style={cell}>ID</th>
              <th style={cell}>
                Event<br />
                <input
                  type="text"
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  placeholder="Search..."
                  style={inputStyle}
                />
              </th>
              <th style={cell}>Seat</th>
              <th style={cell}>
                Owner<br />
                <input
                  type="text"
                  value={ownerFilter}
                  onChange={(e) => setOwnerFilter(e.target.value)}
                  placeholder="Search..."
                  style={inputStyle}
                />
              </th>
              <th style={cell}>
                State<br />
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">All</option>
                  <option value="VALID">Valid</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </th>
              <th style={cell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ticket) => (
              <tr key={ticket.id}>
                <td style={cell}>{ticket.id}</td>
                <td style={cell}>{ticket.eventName}</td>
                <td style={cell}>{ticket.seatRow}{ticket.seatNumber}</td>
                <td style={cell}>{ticket.ownerName}</td>
                <td style={cell}>
                  {ticket.state === "CANCELLED"
                    ? "❌ Cancelled"
                    : ticket.state === "VALID"
                    ? "✅ Valid"
                    : ticket.state}
                </td>
                <td style={cell}>
                  {ticket.state === "VALID" && (
                    <button
                      onClick={() => setCancelId(ticket.id)}
                      style={cancelBtnStyle}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Onay modalı */}
      {cancelId !== null && (
        <div style={modalBackdrop}>
          <div style={modalBox}>
            <p>Are you sure you want to cancel ticket #{cancelId}?</p>
            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
              <button onClick={confirmCancel} style={confirmBtn}>Yes, Cancel</button>
              <button onClick={() => setCancelId(null)} style={cancelBtn}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stil tanımları
const cell = {
  padding: "8px",
  border: "1px solid #ccc",
  textAlign: "center",
};

const inputStyle = {
  width: "90%",
  padding: "4px",
  fontSize: "12px",
};

const cancelBtnStyle = {
  backgroundColor: "#c62828",
  color: "white",
  padding: "6px 10px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

// Modal stilleri
const modalBackdrop = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const modalBox = {
  backgroundColor: "white",
  padding: 20,
  borderRadius: 8,
  boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
  minWidth: 300,
  textAlign: "center",
};

const confirmBtn = {
  backgroundColor: "#2e7d32",
  color: "white",
  padding: "6px 12px",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};

const cancelBtn = {
  backgroundColor: "#bdbdbd",
  color: "black",
  padding: "6px 12px",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};

export default Tickets;
