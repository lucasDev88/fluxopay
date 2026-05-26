package com.fintech.repository;

import com.fintech.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);   // equivalente ao Where("email = ?")
    boolean existsByEmail(String email);         // equivalente ao EmailExists
}