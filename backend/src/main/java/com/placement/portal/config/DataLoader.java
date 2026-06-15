package com.placement.portal.config;

import com.placement.portal.model.*;
import com.placement.portal.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, 
                                   StudentRepository studentRepository, 
                                   JobDriveRepository jobDriveRepository,
                                   PasswordEncoder passwordEncoder) {
        return args -> {
            // Create Admin
            if (userRepository.findByEmail("admin@svu.edu").isEmpty()) {
                User admin = new User();
                admin.setEmail("admin@svu.edu");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
            }

            // Create Student
            if (userRepository.findByEmail("student@svu.edu").isEmpty()) {
                User studentUser = new User();
                studentUser.setEmail("student@svu.edu");
                studentUser.setPassword(passwordEncoder.encode("student123"));
                studentUser.setRole(Role.STUDENT);
                userRepository.save(studentUser);

                Student student = new Student();
                student.setUser(studentUser);
                student.setName("SVU Student");
                student.setCgpa(8.5);
                student.setSkills("Java, Spring Boot, React");
                studentRepository.save(student);
            }

            // Create Sample Job Drives
            if (jobDriveRepository.findAll().isEmpty()) {
                JobDrive drive1 = new JobDrive();
                drive1.setCompanyName("Wipro");
                drive1.setJobRole("Software Engineer");
                drive1.setMinCgpa(7.0);
                drive1.setDate(LocalDate.now().plusDays(10));
                jobDriveRepository.save(drive1);

                JobDrive drive2 = new JobDrive();
                drive2.setCompanyName("TCS");
                drive2.setJobRole("Systems Engineer");
                drive2.setMinCgpa(6.5);
                drive2.setDate(LocalDate.now().plusDays(15));
                jobDriveRepository.save(drive2);

                JobDrive drive3 = new JobDrive();
                drive3.setCompanyName("Google");
                drive3.setJobRole("Associate Engineer");
                drive3.setMinCgpa(8.5);
                drive3.setDate(LocalDate.now().plusDays(20));
                jobDriveRepository.save(drive3);
            }
        };
    }
}
