package com.shadowguard.controller;

import com.shadowguard.model.User;
import com.shadowguard.Security.JwtUtil;
import com.shadowguard.service.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User(email, passwordEncoder.encode(password));
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password"); 

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        if (!passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return ResponseEntity.badRequest().body("Invalid password");
        }

        String token = jwtUtil.generateToken(email);
        return ResponseEntity.ok(Map.of("token", token));
    }
}