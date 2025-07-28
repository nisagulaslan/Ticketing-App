package com.example.ticketing.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PhysicalSeatLayout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idPhysicalSeatLayout;

    private String name;

    @OneToMany(mappedBy = "physicalSeatLayout")
    @JsonIgnore
    private List<Seat> seats;

    @OneToMany(mappedBy = "physicalSeatLayout")
    @JsonIgnore
    private List<Event> events;

}
