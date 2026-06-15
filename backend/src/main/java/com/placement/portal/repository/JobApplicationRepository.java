package com.placement.portal.repository;

import com.placement.portal.model.JobApplication;
import com.placement.portal.model.Student;
import com.placement.portal.model.JobDrive;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByStudent(Student student);
    List<JobApplication> findByJobDrive(JobDrive jobDrive);
    Optional<JobApplication> findByStudentAndJobDrive(Student student, JobDrive jobDrive);
}
