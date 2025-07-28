package com.example.ticketing.repository;

import com.example.ticketing.entity.Ticket;
import com.example.ticketing.entity.TicketState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;


@Repository
public interface TicketRepository extends JpaRepository<Ticket, Integer> {
    @Query("SELECT t.seat.idSeat FROM Ticket t WHERE t.event.idEvent = :eventId AND t.state = 'VALID'")
    List<Integer> findSoldSeatIdsByEvent(@Param("eventId") Integer eventId);

    List<Ticket> findByEventIdEvent(Integer eventId);

    boolean existsByEventIdEventAndSeatIdSeatAndState(Integer eventId, Integer seatId, TicketState state);

    List<Ticket> findAllByOwnerName(String ownerName);

}


