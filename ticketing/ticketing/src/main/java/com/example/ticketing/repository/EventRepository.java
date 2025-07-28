package com.example.ticketing.repository;

import com.example.ticketing.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
    // Upcoming events: where eventStart > now AND state = Available
    @Query("SELECT e FROM Event e WHERE e.eventStart > CURRENT_TIMESTAMP AND e.state = 'AVAILABLE'")
    List<Event> findUpcomingEvents();
}

