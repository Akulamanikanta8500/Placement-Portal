package com.placement.portal.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications")
public class JobApplication {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @ManyToOne
    @JoinColumn(name = "job_drive_id", nullable = false)
    private JobDrive jobDrive;
    
    @Column(nullable = false)
    private LocalDateTime appliedAt;
    
    @Column(nullable = false)
    private String status; // PENDING, ACCEPTED, REJECTED

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    
    public JobDrive getJobDrive() { return jobDrive; }
    public void setJobDrive(JobDrive jobDrive) { this.jobDrive = jobDrive; }
    
    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
