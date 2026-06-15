package com.placement.portal.dto;

import com.placement.portal.model.Role;

public class RegisterRequest {
    private String email;
    private String password;
    private Role role;
    private String name;
    private Double cgpa;
    private String skills;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getCgpa() { return cgpa; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
}
