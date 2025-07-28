package com.example.ticketing.service;

import java.time.OffsetDateTime;
import java.util.UUID;

import com.example.ticketing.entity.Event;
import com.example.ticketing.entity.Seat;
import com.example.ticketing.entity.SeatLock;
import com.example.ticketing.repository.SeatLockRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.StoredProcedureQuery;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SeatLockService {

    private final SeatLockRepository seatLockRepository;
    private final EntityManager entityManager;

    public SeatLockService(SeatLockRepository seatLockRepository, EntityManager entityManager) {
        this.seatLockRepository = seatLockRepository;
        this.entityManager = entityManager;
    }

    @Transactional
    public SeatLock lockSeat(Integer eventId, Integer seatId) throws Exception {
        // 1. Eski kilitleri temizle
        StoredProcedureQuery query = entityManager.createStoredProcedureQuery("DeleteOldSeatLocks");
        query.execute();

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
            return seatLockRepository.save(seatLock);
        } catch (Exception e) {
            throw new Exception("Seat is already locked or being processed.");
        }
    }
}
