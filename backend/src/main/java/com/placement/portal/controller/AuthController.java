package com.placement.portal.controller;

import com.placement.portal.dto.AuthRequest;
import com.placement.portal.dto.AuthResponse;
import com.placement.portal.dto.RegisterRequest;
import com.placement.portal.model.Role;
import com.placement.portal.model.Student;
import com.placement.portal.model.User;
import com.placement.portal.repository.StudentRepository;
import com.placement.portal.repository.UserRepository;
import com.placement.portal.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          UserDetailsService userDetailsService,
                          JwtUtil jwtUtil,
                          UserRepository userRepository,
                          StudentRepository studentRepository,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);
        
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        return ResponseEntity.ok(new AuthResponse(jwt, user.getEmail(), user.getRole().name(), user.getId()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : Role.STUDENT);

        user = userRepository.save(user);

        if (user.getRole() == Role.STUDENT) {
            Student student = new Student();
            student.setUser(user);
            student.setName(request.getName());
            student.setCgpa(request.getCgpa());
            student.setSkills(request.getSkills());
            studentRepository.save(student);
        }

        return ResponseEntity.ok("User registered successfully");
    }
}
