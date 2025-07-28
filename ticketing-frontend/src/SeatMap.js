import React from "react";
import styles from "./SeatMap.module.css";

function SeatShape({ x, y, seatNumber, isSelected, isOccupied, onClick }) {
  return (
    <g
      transform={`translate(${x}, ${y})`}
      style={{ cursor: isOccupied ? "not-allowed" : "pointer" }}
      tabIndex={isOccupied ? -1 : 0}
      role="button"
      aria-label={`Seat ${seatNumber} ${isOccupied ? "Occupied" : "Available"}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !isOccupied) {
          e.target.click();
        }
      }}
    >
      {/* Koltuk sırt kısmı */}
      <rect x="5" y="0" width="20" height="10" rx="4" ry="4" fill="#357ABD" />
      {/* Koltuk ana gövdesi */}
      <rect
        width="30"
        height="40"
        rx="6"
        ry="6"
        fill="#4a90e2"
        stroke={isSelected ? "#fbc02d" : "#2a5ab7"}
        strokeWidth={isSelected ? 3 : 1}
        filter={isSelected ? "drop-shadow(0 0 6px #fbc02d)" : undefined}
      />
      {/* Koltuk numarası */}
      <text
        x="15"
        y="28"
        fontSize="14"
        fontWeight="600"
        fill="white"
        textAnchor="middle"
        pointerEvents="none"
      >
        {seatNumber}
      </text>

      {/* Doluysa üstte X işareti */}
      {isOccupied && (
        <>
          <line x1="7" y1="7" x2="23" y2="33" stroke="white" strokeWidth="3" />
          <line x1="23" y1="7" x2="7" y2="33" stroke="white" strokeWidth="3" />
        </>
      )}
    </g>
  );
}

function SeatMap({ seats, selectedSeatId, onSelect }) {
  // Satırları grupla
  const grouped = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  const rowKeys = Object.keys(grouped).sort();

  return (
    <svg
      viewBox="0 0 800 400"
      className={styles.seatMapSvg}
      role="img"
      aria-label="Seat map"
      tabIndex={-1}
    >
      <defs>
        <linearGradient id="stageGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2f3e4e" />
          <stop offset="100%" stopColor="#50607a" />
        </linearGradient>
      </defs>

      {/* Ana arka plan dikdörtgen - sahne ve koltukları kapsayan */}
      <rect
        className={styles.seatMapBackground}
        x="10"
        y="10"
        width="780"
        height="380"
        rx="20"
        ry="20"
      />

      {/* Sahne */}
      <rect
        className={styles.stageRect}
        x="150"
        y="20"
        width="500"
        height="50"
        rx="14"
        ry="14"
        fill="url(#stageGradient)"
        stroke="#1b2a43"
        strokeWidth="2"
        filter="drop-shadow(0 4px 6px rgba(0,0,0,0.6))"
      />
      <text
        className={styles.stageText}
        x="400"
        y="45"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#e0e7ff"
        fontWeight="700"
        fontSize="22"
        style={{ userSelect: "none" }}
      >
        STAGE
      </text>

      {/* Koltuklar */}
      {rowKeys.map((row, rowIndex) => {
        const seatsInRow = grouped[row].sort((a, b) => a.seatNumber - b.seatNumber);
        return seatsInRow.map((seat, seatIndex) => {
          const isOccupied = seat.tickets.length > 0;
          const isSelected = selectedSeatId === seat.idSeat;

          const cx = 130 + seatIndex * 45;
          const cy = 100 + rowIndex * 60;

          return (
            <SeatShape
              key={seat.idSeat}
              x={cx}
              y={cy}
              seatNumber={`${seat.row}${seat.seatNumber}`}
              isOccupied={isOccupied}
              isSelected={isSelected}
              onClick={() => !isOccupied && onSelect(seat)}
            />
          );
        });
      })}
    </svg>
  );
}

export default SeatMap;
