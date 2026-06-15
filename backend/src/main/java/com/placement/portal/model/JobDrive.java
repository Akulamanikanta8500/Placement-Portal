package com.placement.portal.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "job_drives")
public class JobDrive {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "company_name", nullable = false)
    private String companyName;
    
    @Column(name = "min_cgpa", nullable = false)
    private Double minCgpa;
    
    @Column(name = "job_role", nullable = false)
    private String jobRole;
    
    @Column(nullable = false)
    private LocalDate date;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    
    public Double getMinCgpa() { return minCgpa; }
    public void setMinCgpa(Double minCgpa) { this.minCgpa = minCgpa; }
    
    public String getJobRole() { return jobRole; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }
    
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
}
