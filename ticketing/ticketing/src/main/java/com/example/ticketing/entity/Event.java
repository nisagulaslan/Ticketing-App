package com.example.ticketing.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore; 
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idEvent;

    private String name;

    private LocalDateTime eventStart;

    @Enumerated(EnumType.STRING)
    private EventState state;

    @ManyToOne
    @JoinColumn(name = "idPhysicalSeatLayout")
    @JsonIgnore
    private PhysicalSeatLayout physicalSeatLayout;

    @OneToMany(mappedBy = "event")
    private List<Ticket> tickets;

    @OneToMany(mappedBy = "event")
    private List<SeatLock> seatLocks;
}
