package com.example.ticketing.dto;

import com.example.ticketing.entity.TicketState;

public class AdminTicketDto {
    private Integer id;
    private String eventName;
    private String seatRow;
    private Integer seatNumber;
    private String ownerName;
    private TicketState state;

    public AdminTicketDto() {}

    public AdminTicketDto(Integer id, String eventName, String seatRow, Integer seatNumber, String ownerName, TicketState state) {
        this.id = id;
        this.eventName = eventName;
        this.seatRow = seatRow;
        this.seatNumber = seatNumber;
        this.ownerName = ownerName;
        this.state = state;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public String getSeatRow() { return seatRow; }
    public void setSeatRow(String seatRow) { this.seatRow = seatRow; }

    public Integer getSeatNumber() { return seatNumber; }
    public void setSeatNumber(Integer seatNumber) { this.seatNumber = seatNumber; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public TicketState getState() { return state; }
    public void setState(TicketState state) { this.state = state; }
}
