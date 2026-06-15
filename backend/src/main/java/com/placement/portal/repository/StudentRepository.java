package com.placement.portal.repository;

import com.placement.portal.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByCgpaGreaterThanEqual(Double minCgpa);
    Student findByUserId(Long userId);
}
