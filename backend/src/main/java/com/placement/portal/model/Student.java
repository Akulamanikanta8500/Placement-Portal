package com.placement.portal.model;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private Double cgpa;
    
    private String skills;
    
    @Column(name = "resume_url")
    private String resumeUrl;
    
    @Column(columnDefinition = "TEXT")
    private String educationDetails;
    
    @Column(columnDefinition = "TEXT")
    private String projects;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public Double getCgpa() { return cgpa; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }
    
    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
    
    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public String getEducationDetails() { return educationDetails; }
    public void setEducationDetails(String educationDetails) { this.educationDetails = educationDetails; }

    public String getProjects() { return projects; }
    public void setProjects(String projects) { this.projects = projects; }
}
