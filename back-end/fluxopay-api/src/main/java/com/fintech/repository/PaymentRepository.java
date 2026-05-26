package com.fintech.repository;

import com.fintech.models.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUserId(String userId);
    long countByUserId(String userId);
    long countByUserIdAndSituation(String userId, String situation);
    Optional<Payment> findByIdAndUserId(Long id, String userId);
    List<Payment> findTop5ByUserIdOrderByCreatedAtDesc(String userId);

    @Query("SELECT COALESCE(SUM(p.price), 0) FROM Payment p WHERE p.userId = :userId AND p.situation = :situation")
    long sumPriceByUserIdAndSituation(String userId, String situation);
}