package com.example.ticketing.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idTicket;

    private String ownerName;

    private OffsetDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private TicketState state;

    @ManyToOne
    @JoinColumn(name = "idEvent")
    @JsonIgnore
    private Event event;

    @ManyToOne
    @JoinColumn(name = "idSeat")
    @JsonIgnore
    private Seat seat;
}
