package com.example.ticketing.controller;

import java.util.List;
import com.example.ticketing.entity.Ticket;
import com.example.ticketing.service.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import com.example.ticketing.dto.SimpleTicketDto;
import com.example.ticketing.dto.AdminTicketDto;


@RestController
@RequestMapping("/api/tickets")
public class TicketController {
    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public ResponseEntity<?> createTicket(
            @RequestParam(name = "IdEvent") Integer eventId,
            @RequestParam(name = "IdSeat") Integer seatId,
            @RequestParam(name = "OwnerName") String ownerName) {
        try {
            Ticket ticket = ticketService.createTicket(eventId, seatId, ownerName);
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/cancel")
    public ResponseEntity<?> cancelTicket(@RequestParam Integer ticketId) {
        try {
            ticketService.cancelTicket(ticketId);
            return ResponseEntity.ok("Ticket cancelled.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/event/{eventId}")
    public List<Ticket> getTicketsForEvent(@PathVariable Integer eventId) {
        return ticketService.getTicketsForEvent(eventId);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyTickets(Authentication authentication) {
        try {
            String username = authentication.getName();
            List<Ticket> tickets = ticketService.getTicketsByOwnerName(username);

            List<SimpleTicketDto> simpleTickets = tickets.stream()
                .map(t -> new SimpleTicketDto(
                    t.getIdTicket(),
                    t.getOwnerName(),
                    t.getSeat() != null ? t.getSeat().getRow() : null,
                    t.getSeat() != null ? t.getSeat().getSeatNumber() : null,
                    t.getEvent() != null ? t.getEvent().getName() : null,
                    t.getState()  
                ))
                .toList();

            return ResponseEntity.ok(simpleTickets);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to retrieve tickets: " + e.getMessage());
        }
    }


    @DeleteMapping("/{ticketId}")
    public ResponseEntity<?> deleteTicket(@PathVariable Integer ticketId) {
        try {
            ticketService.cancelTicket(ticketId);
            return ResponseEntity.ok("Ticket cancelled.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to cancel ticket: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllTickets() {
        try {
            List<Ticket> tickets = ticketService.getAllTickets();

            List<AdminTicketDto> result = tickets.stream()
                .map(t -> new AdminTicketDto(
                    t.getIdTicket(),
                    t.getEvent() != null ? t.getEvent().getName() : null,
                    t.getSeat() != null ? t.getSeat().getRow() : null,
                    t.getSeat() != null ? t.getSeat().getSeatNumber() : null,
                    t.getOwnerName(),
                    t.getState()
                ))
                .toList();

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to retrieve tickets: " + e.getMessage());
        }
    }
}

