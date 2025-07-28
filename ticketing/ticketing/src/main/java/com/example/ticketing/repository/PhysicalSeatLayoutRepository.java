package com.example.ticketing.repository;

import com.example.ticketing.entity.PhysicalSeatLayout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhysicalSeatLayoutRepository extends JpaRepository<PhysicalSeatLayout, Integer> {
}
