package com.fintech.service;

import com.fintech.dto.SignupDTO;
import com.fintech.models.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.fintech.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // equivalente ao EmailExists do Go
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    // equivalente ao CreateUser do Go
    public User createUser(SignupDTO dto) {
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword())); // equivalente ao utils.Hash
        user.setRole("user");
        user.setAssinature("free");

        return userRepository.save(user);
    }

    // equivalente ao GetUserByEmail do Go
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }
}