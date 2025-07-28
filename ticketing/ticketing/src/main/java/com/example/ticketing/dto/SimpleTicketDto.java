package com.example.ticketing.dto;

import com.example.ticketing.entity.TicketState;

public class SimpleTicketDto {
    private Integer id;
    private String ownerName;
    private String seatRow;
    private Integer seatNumber;
    private String eventName;
    private TicketState state;  

    public SimpleTicketDto(Integer id, String ownerName, String seatRow, Integer seatNumber, String eventName, TicketState state) {
        this.id = id;
        this.ownerName = ownerName;
        this.seatRow = seatRow;
        this.seatNumber = seatNumber;
        this.eventName = eventName;
        this.state = state;
    } 

    public Integer getId() {
        return id;
    }
    public String getOwnerName() {
        return ownerName;
    }
    public String getSeatRow() {
        return seatRow;
    }
    public Integer getSeatNumber() {
        return seatNumber;
    }
    public String getEventName() {
        return eventName;
    }
    public TicketState getState() {  
        return state;
    }
}   
