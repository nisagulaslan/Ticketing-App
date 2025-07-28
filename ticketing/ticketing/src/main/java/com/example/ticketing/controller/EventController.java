package com.example.ticketing.controller;

import com.example.ticketing.dto.EventDto;
import com.example.ticketing.entity.Event;
import com.example.ticketing.entity.Seat;
import com.example.ticketing.service.EventService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {
    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/upcoming")
    public List<Event> listUpcomingEvents() {
        return eventService.getUpcomingEvents();
    }

    @GetMapping("/{eventId}/seats")
    public List<Seat> listSeats(@PathVariable Integer eventId) {
        return eventService.getSeatsForEvent(eventId);
    }

    @GetMapping("/{eventId}/seats/free")
    public List<Seat> listFreeSeats(@PathVariable Integer eventId) {
        return eventService.getFreeSeatsForEvent(eventId);
    }

    
    @PostMapping
    public Event createEvent(@RequestBody EventDto eventDto) {
        return eventService.createEvent(eventDto);
    }

    @DeleteMapping("/{eventId}")
    public void deleteEvent(@PathVariable Integer eventId) {
        eventService.deleteEvent(eventId);
    }
}
