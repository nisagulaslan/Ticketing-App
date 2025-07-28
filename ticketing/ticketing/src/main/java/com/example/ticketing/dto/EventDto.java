package com.example.ticketing.dto;

public class EventDto {
    private String name;
    private String eventStart;
    private Integer physicalSeatLayoutId;

    public EventDto() {
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEventStart() { return eventStart; }
    public void setEventStart(String eventStart) { this.eventStart = eventStart; }

    public Integer getPhysicalSeatLayoutId() { return physicalSeatLayoutId; }
    public void setPhysicalSeatLayoutId(Integer physicalSeatLayoutId) { this.physicalSeatLayoutId = physicalSeatLayoutId; }
}
