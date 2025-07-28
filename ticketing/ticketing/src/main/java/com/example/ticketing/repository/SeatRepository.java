package com.example.ticketing.repository;

import com.example.ticketing.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Integer> {
    // All seats for event's physical seat layout
    @Query("SELECT s FROM Seat s WHERE s.physicalSeatLayout.idPhysicalSeatLayout = :layoutId")
    List<Seat> findSeatsByPhysicalSeatLayout(@Param("layoutId") Integer layoutId);
}

