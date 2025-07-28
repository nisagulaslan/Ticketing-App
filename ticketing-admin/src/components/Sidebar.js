import React from "react";
import { useLocation, Link } from "react-router-dom";

function Sidebar({ onLogout }) {
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <aside className="sidebar">
      <h2 className="logo">🎟 TicketAdmin</h2>
      <nav>
        <ul>
          <li>
            <Link to="/" className={isActive("/")}>Dashboard</Link>
          </li>
          <li>
            <Link to="/events" className={isActive("/events")}>Events</Link>
          </li>
          <li>
            <Link to="/users" className={isActive("/users")}>Users</Link>
          </li>
          <li>
            <Link to="/tickets" className={isActive("/tickets")}>Tickets</Link>
          </li>
          <li>
            <button onClick={onLogout}>Logout</button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
