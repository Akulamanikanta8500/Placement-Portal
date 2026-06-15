package com.placement.portal.controller;

import com.placement.portal.model.JobDrive;
import com.placement.portal.repository.JobDriveRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-drives")
public class JobDriveController {

    private final JobDriveRepository jobDriveRepository;

    public JobDriveController(JobDriveRepository jobDriveRepository) {
        this.jobDriveRepository = jobDriveRepository;
    }

    @GetMapping
    public List<JobDrive> getAllJobDrives() {
        return jobDriveRepository.findAll();
    }

    @PostMapping
    public JobDrive createJobDrive(@RequestBody JobDrive jobDrive) {
        return jobDriveRepository.save(jobDrive);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJobDrive(@PathVariable Long id) {
        if (!jobDriveRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        jobDriveRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
