package com.example.ticketing.service;

import com.example.ticketing.dto.EventDto;
import com.example.ticketing.entity.Event;
import com.example.ticketing.entity.EventState;
import com.example.ticketing.entity.PhysicalSeatLayout;
import com.example.ticketing.entity.Seat;
import com.example.ticketing.repository.EventRepository;
import com.example.ticketing.repository.PhysicalSeatLayoutRepository;
import com.example.ticketing.repository.SeatLockRepository;
import com.example.ticketing.repository.SeatRepository;
import com.example.ticketing.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {
    private final EventRepository eventRepository;
    private final SeatRepository seatRepository;
    private final SeatLockRepository seatLockRepository;
    private final TicketRepository ticketRepository;
    private final PhysicalSeatLayoutRepository seatLayoutRepository;

    public EventService(EventRepository eventRepository,
                        SeatRepository seatRepository,
                        SeatLockRepository seatLockRepository,
                        TicketRepository ticketRepository,
                        PhysicalSeatLayoutRepository seatLayoutRepository) {
        this.eventRepository = eventRepository;
        this.seatRepository = seatRepository;
        this.seatLockRepository = seatLockRepository;
        this.ticketRepository = ticketRepository;
        this.seatLayoutRepository = seatLayoutRepository;
    }

    public List<Event> getUpcomingEvents() {
        return eventRepository.findUpcomingEvents();
    }

    public List<Seat> getSeatsForEvent(Integer eventId) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));

        List<Seat> seats = seatRepository.findSeatsByPhysicalSeatLayout(
            event.getPhysicalSeatLayout().getIdPhysicalSeatLayout()
        );

        seats.forEach(seat -> {
            if (seat.getTickets() != null) {
                seat.setTickets(
                    seat.getTickets().stream()
                        .filter(ticket ->
                            ticket.getState().name().equals("VALID") &&
                            ticket.getEvent().getIdEvent().equals(eventId)
                        )
                        .toList()
                );
            }
        });

        return seats;
    }


    public List<Seat> getFreeSeatsForEvent(Integer eventId) {
        List<Seat> allSeats = getSeatsForEvent(eventId);

        List<Integer> lockedSeats = seatLockRepository.findLockedSeatIdsByEvent(eventId);
        List<Integer> soldSeats = ticketRepository.findSoldSeatIdsByEvent(eventId);

        return allSeats.stream()
            .filter(s -> !lockedSeats.contains(s.getIdSeat()) && !soldSeats.contains(s.getIdSeat()))
            .toList();
    }

    
    public Event createEvent(EventDto eventDto) {
        Event event = new Event();
        event.setName(eventDto.getName());
        event.setEventStart(LocalDateTime.parse(eventDto.getEventStart()));
        event.setState(EventState.AVAILABLE);

        PhysicalSeatLayout layout = seatLayoutRepository.findById(eventDto.getPhysicalSeatLayoutId())
            .orElseThrow(() -> new RuntimeException("Layout not found"));
        event.setPhysicalSeatLayout(layout);

        return eventRepository.save(event);
    }

    public void deleteEvent(Integer eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new RuntimeException("Event not found");
        }
        eventRepository.deleteById(eventId);
    }
}
