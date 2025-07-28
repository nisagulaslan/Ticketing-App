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
@Table(
    uniqueConstraints = @UniqueConstraint(columnNames = {"idEvent", "idSeat"})
)
public class SeatLock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSeatLock;

    private OffsetDateTime creationTime;

    private OffsetDateTime validUntil;

    private String lockCode;

    @ManyToOne
    @JoinColumn(name = "idEvent")
    @JsonIgnore
    private Event event;

    @ManyToOne
    @JoinColumn(name = "idSeat")
    @JsonIgnore
    private Seat seat;
}
