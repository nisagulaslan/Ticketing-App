import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

function Dashboard({ token }) {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("DASHBOARD TOKEN:", token); // Token kontrolü

    if (!token) {
      setError("Token is missing.");
      return;
    }

    fetch("http://localhost:8080/api/tickets", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) throw new Error(text || "Unknown server error");

        try {
          return JSON.parse(text);
        } catch (e) {
          throw new Error("Failed to parse JSON response");
        }
      })
      .then((data) => {
        setTickets(data || []);
        setError(null);
      })
      .catch((err) => {
        console.error("Dashboard ticket fetch error:", err);
        setError("Failed to fetch ticket data");
      });
  }, [token]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!tickets.length) return <p>Loading dashboard...</p>;

  const total = tickets.length;
  const valid = tickets.filter(t => t.state === "VALID").length;
  const cancelled = tickets.filter(t => t.state === "CANCELLED").length;
  const users = [...new Set(tickets.map(t => t.ownerName))].length;

  const eventCounts = {};
  tickets.forEach(t => {
    eventCounts[t.eventName] = (eventCounts[t.eventName] || 0) + 1;
  });

  const topEvent = Object.entries(eventCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  const eventDistribution = Object.entries(eventCounts).map(([name, count]) => ({
    name,
    count,
  }));

  const statusDistribution = [
    { name: "Valid", value: valid },
    { name: "Cancelled", value: cancelled },
  ];

  return (
    <div>
      <h2>Dashboard</h2>

      <div style={{ display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
        <Card title="Total Tickets" value={total} />
        <Card title="Valid Tickets" value={valid} />
        <Card title="Cancelled Tickets" value={cancelled} />
        <Card title="Unique Users" value={users} />
        <Card title="Top Event" value={topEvent} />
      </div>

      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "300px", height: "300px" }}>
          <h4>Tickets per Event</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={eventDistribution}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#007BFF" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ flex: 1, minWidth: "300px", height: "300px" }}>
          <h4>Status Distribution</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                <Cell fill="#28a745" />
                <Cell fill="#dc3545" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        flex: "1 1 200px",
        background: "#f9f9f9",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <h4 style={{ margin: 0, marginBottom: 8 }}>{title}</h4>
      <p style={{ fontSize: "22px", fontWeight: "bold", margin: 0 }}>{value}</p>
    </div>
  );
}

export default Dashboard;
