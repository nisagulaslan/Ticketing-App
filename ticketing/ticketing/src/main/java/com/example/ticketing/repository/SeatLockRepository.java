package com.example.ticketing.repository;

import com.example.ticketing.entity.SeatLock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface SeatLockRepository extends JpaRepository<SeatLock, Integer> {
    @Query("SELECT sl.seat.idSeat FROM SeatLock sl WHERE sl.event.idEvent = :eventId AND sl.validUntil > CURRENT_TIMESTAMP")
    List<Integer> findLockedSeatIdsByEvent(@Param("eventId") Integer eventId);
}

