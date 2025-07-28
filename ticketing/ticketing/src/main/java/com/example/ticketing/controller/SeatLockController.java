package com.example.ticketing.controller;

import com.example.ticketing.entity.SeatLock;
import com.example.ticketing.service.SeatLockService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seatlocks")
public class SeatLockController {

    private final SeatLockService seatLockService;

    public SeatLockController(SeatLockService seatLockService) {
        this.seatLockService = seatLockService;
    }

    @PostMapping("/lock")
    public ResponseEntity<?> lockSeat(@RequestParam Integer eventId,
                                      @RequestParam Integer seatId) {
        try {
            SeatLock seatLock = seatLockService.lockSeat(eventId, seatId);
            return ResponseEntity.ok(seatLock);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body(e.getMessage());
        }
    }
}
