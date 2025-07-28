package com.example.ticketing.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore; 
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSeat;

    private String row;
    private Integer seatNumber;

    @ManyToOne
    @JoinColumn(name = "idPhysicalSeatLayout")
    @JsonIgnore
    private PhysicalSeatLayout physicalSeatLayout;

    @OneToMany(mappedBy = "seat")
    private List<Ticket> tickets;

    @OneToMany(mappedBy = "seat")
    private List<SeatLock> seatLocks;
}
