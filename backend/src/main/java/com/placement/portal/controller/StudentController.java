package com.placement.portal.controller;

import com.placement.portal.model.Student;
import com.placement.portal.repository.StudentRepository;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentRepository studentRepository;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        return studentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Student> getStudentByUserId(@PathVariable Long userId) {
        Student student = studentRepository.findByUserId(userId);
        if (student != null) return ResponseEntity.ok(student);
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/filter/{minCgpa}")
    public List<Student> getEligibleStudents(@PathVariable Double minCgpa) {
        return studentRepository.findByCgpaGreaterThanEqual(minCgpa);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudentProfile(@PathVariable Long id, @RequestBody Student studentUpdates) {
        return studentRepository.findById(id).map(existingStudent -> {
            if (studentUpdates.getSkills() != null) {
                existingStudent.setSkills(studentUpdates.getSkills());
            }
            if (studentUpdates.getResumeUrl() != null) {
                existingStudent.setResumeUrl(studentUpdates.getResumeUrl());
            }
            if (studentUpdates.getEducationDetails() != null) {
                existingStudent.setEducationDetails(studentUpdates.getEducationDetails());
            }
            if (studentUpdates.getProjects() != null) {
                existingStudent.setProjects(studentUpdates.getProjects());
            }
            Student savedStudent = studentRepository.save(existingStudent);
            return ResponseEntity.ok(savedStudent);
        }).orElse(ResponseEntity.notFound().build());
    }
}
