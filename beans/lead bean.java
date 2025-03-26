package com.anantarealty.crm.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
public class Lead {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String leadOwner;
    private LocalDateTime leadDate;
    private String contactName;
    private String mobileNumber;
    private String leadStage;
    private Double expectedRevenue;
    private LocalDateTime nextFollowUpOn;
    private String nextFollowUpNotes;
    
    // Constructors
    public Lead() {}

    public Lead(String leadOwner, LocalDateTime leadDate, String contactName, String mobileNumber, String leadStage, Double expectedRevenue, LocalDateTime nextFollowUpOn, String nextFollowUpNotes) {
        this.leadOwner = leadOwner;
        this.leadDate = leadDate;
        this.contactName = contactName;
        this.mobileNumber = mobileNumber;
        this.leadStage = leadStage;
        this.expectedRevenue = expectedRevenue;
        this.nextFollowUpOn = nextFollowUpOn;
        this.nextFollowUpNotes = nextFollowUpNotes;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLeadOwner() {
        return leadOwner;
    }

    public void setLeadOwner(String leadOwner) {
        this.leadOwner = leadOwner;
    }

    public LocalDateTime getLeadDate() {
        return leadDate;
    }

    public void setLeadDate(LocalDateTime leadDate) {
        this.leadDate = leadDate;
    }

    public String getContactName() {
        return contactName;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getLeadStage() {
        return leadStage;
    }

    public void setLeadStage(String leadStage) {
        this.leadStage = leadStage;
    }

    public Double getExpectedRevenue() {
        return expectedRevenue;
    }

    public void setExpectedRevenue(Double expectedRevenue) {
        this.expectedRevenue = expectedRevenue;
    }

    public LocalDateTime getNextFollowUpOn() {
        return nextFollowUpOn;
    }

    public void setNextFollowUpOn(LocalDateTime nextFollowUpOn) {
        this.nextFollowUpOn = nextFollowUpOn;
    }

    public String getNextFollowUpNotes() {
        return nextFollowUpNotes;
    }

    public void setNextFollowUpNotes(String nextFollowUpNotes) {
        this.nextFollowUpNotes = nextFollowUpNotes;
    }
}
