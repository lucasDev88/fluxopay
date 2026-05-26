package com.fintech.repository;

import com.fintech.models.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByUserId(String userId);
    Optional<Client> findByIdAndUserId(Long id, String userId);
    long countByUserId(String userId);
}