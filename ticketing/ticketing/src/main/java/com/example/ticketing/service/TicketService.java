package com.example.ticketing.service;

import java.util.List;
import java.util.UUID;
import java.time.OffsetDateTime;

import com.example.ticketing.entity.Event;
import com.example.ticketing.entity.Seat;
import com.example.ticketing.entity.Ticket;
import com.example.ticketing.entity.TicketState;
import com.example.ticketing.entity.SeatLock;

import com.example.ticketing.repository.SeatLockRepository;
import com.example.ticketing.repository.TicketRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.StoredProcedureQuery;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TicketService {
    private final SeatLockRepository seatLockRepository;
    private final TicketRepository ticketRepository;
    private final EntityManager entityManager;

    public TicketService(SeatLockRepository seatLockRepository, TicketRepository ticketRepository, EntityManager entityManager) {
        this.seatLockRepository = seatLockRepository;
        this.ticketRepository = ticketRepository;
        this.entityManager = entityManager;
    }

    @Transactional
    public Ticket createTicket(Integer eventId, Integer seatId, String ownerName) throws Exception {
        // 1. Clean old locks
        StoredProcedureQuery query = entityManager.createStoredProcedureQuery("DeleteOldSeatLocks");
        query.execute();

        // 2. Lock seat
        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime validUntil = now.plusMinutes(5);

        SeatLock seatLock = new SeatLock();
        seatLock.setEvent(new Event());
        seatLock.getEvent().setIdEvent(eventId);

        seatLock.setSeat(new Seat());
        seatLock.getSeat().setIdSeat(seatId);

        seatLock.setCreationTime(now);
        seatLock.setValidUntil(validUntil);
        seatLock.setLockCode(UUID.randomUUID().toString());

        try {
            seatLockRepository.save(seatLock);
        } catch (Exception e) {
            throw new Exception("Seat is already locked or being processed.");
        }

        // 3. Check ticket exists
        boolean ticketExists = ticketRepository.existsByEventIdEventAndSeatIdSeatAndState(eventId, seatId, TicketState.VALID);
        if (ticketExists) {
            seatLockRepository.delete(seatLock);
            throw new Exception("Ticket already exists for this seat and event.");
        }

        // 4. Create ticket
        Ticket ticket = new Ticket();
        ticket.setEvent(seatLock.getEvent());
        ticket.setSeat(seatLock.getSeat());
        ticket.setOwnerName(ownerName);
        ticket.setCreatedAt(now);
        ticket.setState(TicketState.VALID);

        ticketRepository.save(ticket);

        // 5. Remove lock
        seatLockRepository.delete(seatLock);

        return ticket;
    }

    @Transactional
    public void cancelTicket(Integer ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                          .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setState(TicketState.CANCELLED);
        ticketRepository.save(ticket);
    }
    public List<Ticket> getTicketsForEvent(Integer eventId) {
        return ticketRepository.findByEventIdEvent(eventId);
    }
    public List<Ticket> getTicketsByOwnerName(String ownerName) {
    return ticketRepository.findAllByOwnerName(ownerName);
    }
    public List<Ticket> getAllTickets() {
    return ticketRepository.findAll();
    }
}

