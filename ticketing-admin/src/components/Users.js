import React, { useEffect, useState } from "react";

function Users({ token }) {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [error, setError] = useState(null);

  const [nameFilter, setNameFilter] = useState("");
  const [minTicketCount, setMinTicketCount] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/tickets", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tickets");
        return res.json();
      })
      .then((tickets) => {
        const userMap = {};

        tickets.forEach((t) => {
          const name = t.ownerName;
          if (!userMap[name]) {
            userMap[name] = { name, count: 0 };
          }
          userMap[name].count += 1;
        });

        const userList = Object.values(userMap).sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setUsers(userList);
        setFiltered(userList);
      })
      .catch((e) => setError(e.message));
  }, [token]);

  useEffect(() => {
    let filteredUsers = [...users];

    if (nameFilter.trim()) {
      filteredUsers = filteredUsers.filter((u) =>
        u.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (minTicketCount !== "") {
      const min = parseInt(minTicketCount);
      if (!isNaN(min)) {
        filteredUsers = filteredUsers.filter((u) => u.count >= min);
      }
    }

    setFiltered(filteredUsers);
  }, [nameFilter, minTicketCount, users]);

  return (
    <div>
      <h2>Users</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th style={cell}>#</th>
            <th style={cell}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                👤 <strong>Username</strong>
                <input
                  type="text"
                  placeholder="Search..."
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  style={filterInputStyle}
                />
              </div>
            </th>
            <th style={cell}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                🖊 <strong>Ticket Count</strong>
                <input
                  type="number"
                  placeholder="Min"
                  value={minTicketCount}
                  onChange={(e) => setMinTicketCount(e.target.value)}
                  style={filterInputStyle}
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((user, i) => (
            <tr key={i}>
              <td style={cell}>{i + 1}</td>
              <td style={cell}>{user.name}</td>
              <td style={cell}>{user.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const cell = {
  padding: "10px",
  border: "1px solid #ccc",
  textAlign: "center",
  fontSize: "15px",
  verticalAlign: "top",
};

const filterInputStyle = {
  width: "90%",
  padding: "4px 6px",
  fontSize: "13px",
  marginTop: "6px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

export default Users;
