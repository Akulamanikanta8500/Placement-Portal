package com.placement.portal.controller;

import com.placement.portal.model.JobApplication;
import com.placement.portal.model.JobDrive;
import com.placement.portal.model.Student;
import com.placement.portal.repository.JobApplicationRepository;
import com.placement.portal.repository.JobDriveRepository;
import com.placement.portal.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    private final JobApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final JobDriveRepository jobDriveRepository;

    public JobApplicationController(JobApplicationRepository applicationRepository,
                                    StudentRepository studentRepository,
                                    JobDriveRepository jobDriveRepository) {
        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
        this.jobDriveRepository = jobDriveRepository;
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyForJob(@RequestParam Long studentId, @RequestParam Long jobDriveId) {
        Student student = studentRepository.findById(studentId).orElseThrow();
        JobDrive jobDrive = jobDriveRepository.findById(jobDriveId).orElseThrow();

        if (applicationRepository.findByStudentAndJobDrive(student, jobDrive).isPresent()) {
            return ResponseEntity.badRequest().body("Already applied for this drive");
        }

        if (student.getCgpa() < jobDrive.getMinCgpa()) {
            return ResponseEntity.badRequest().body("Not eligible due to CGPA criteria");
        }

        JobApplication application = new JobApplication();
        application.setStudent(student);
        application.setJobDrive(jobDrive);
        application.setAppliedAt(LocalDateTime.now());
        application.setStatus("PENDING");

        return ResponseEntity.ok(applicationRepository.save(application));
    }

    @GetMapping("/student/{studentId}")
    public List<JobApplication> getStudentApplications(@PathVariable Long studentId) {
        Student student = studentRepository.findById(studentId).orElseThrow();
        return applicationRepository.findByStudent(student);
    }

    @GetMapping("/drive/{jobDriveId}")
    public List<JobApplication> getDriveApplications(@PathVariable Long jobDriveId) {
        JobDrive jobDrive = jobDriveRepository.findById(jobDriveId).orElseThrow();
        return applicationRepository.findByJobDrive(jobDrive);
    }

    @GetMapping
    public List<JobApplication> getAllApplications() {
        return applicationRepository.findAll();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<JobApplication> updateApplicationStatus(@PathVariable Long id, @RequestParam String status) {
        return applicationRepository.findById(id).map(application -> {
            application.setStatus(status.toUpperCase());
            return ResponseEntity.ok(applicationRepository.save(application));
        }).orElse(ResponseEntity.notFound().build());
    }

    private static final String UPLOAD_DIR = "uploads/resumes/";

    @PostMapping("/upload-resume")
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }
        try {
            // Create directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate a unique file name
            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String uniqueFileName = java.util.UUID.randomUUID().toString() + fileExtension;

            // Save file
            Path filePath = uploadPath.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            // Return relative access URL
            String fileAccessUrl = "/api/applications/resumes/" + uniqueFileName;
            return ResponseEntity.ok().body(new UploadResponse(fileAccessUrl));
        } catch (java.io.IOException e) {
            return ResponseEntity.internalServerError().body("Failed to upload file: " + e.getMessage());
        }
    }

    @GetMapping("/resumes/{filename:.+}")
    public ResponseEntity<org.springframework.core.io.Resource> downloadResume(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR).resolve(filename).normalize();
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType = "application/pdf";
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Helper static class for response
    public static class UploadResponse {
        private String url;
        public UploadResponse(String url) { this.url = url; }
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
    }
}
