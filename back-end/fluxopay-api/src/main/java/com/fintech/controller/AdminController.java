package com.fintech.controller;

import com.fintech.models.Payment;
import com.fintech.models.User;
import com.fintech.repository.PaymentRepository;
import com.fintech.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('admin')")  // equivalente ao middleware.RequireRole("admin")
public class AdminController {

    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    public AdminController(UserRepository userRepository,
                           PaymentRepository paymentRepository) {
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
    }

    // equivalente ao GetAdminStats
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long totalUsers = userRepository.count();
        long totalPayments = paymentRepository.count();
        long totalRevenue = paymentRepository.sumPriceByUserIdAndSituation(null, "Aprovado");

        return ResponseEntity.ok(Map.of(
                "total_users", totalUsers,
                "total_payments", totalPayments,
                "total_revenue", totalRevenue
        ));
    }

    // equivalente ao ListAdminUsers
    @GetMapping("/users")
    public ResponseEntity<?> listUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // equivalente ao BlockUser
    @PutMapping("/users/{id}/block")
    public ResponseEntity<?> blockUser(@PathVariable String id,
                                       @RequestBody Map<String, Boolean> body) {
        return userRepository.findById(id).map(user -> {
            boolean blocked = Boolean.TRUE.equals(body.get("blocked"));
            user.setAssinature(blocked ? "Bloqueado" : "free");
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "status atualizado"));
        }).orElse(ResponseEntity.notFound().build());
    }

    // equivalente ao ListAdminTransactions
    @GetMapping("/transactions")
    public ResponseEntity<?> listTransactions() {
        return ResponseEntity.ok(paymentRepository.findAll());
    }

    // equivalente ao GetTransactionSummary
    @GetMapping("/transactions/summary")
    public ResponseEntity<?> getTransactionSummary() {
        long total = paymentRepository.count();
        long approved = paymentRepository.countByUserIdAndSituation(null, "Aprovado");
        long pending = paymentRepository.countByUserIdAndSituation(null, "Pendente");
        long failed = paymentRepository.countByUserIdAndSituation(null, "Recusado");

        return ResponseEntity.ok(Map.of(
                "total", total,
                "approved", approved,
                "pending", pending,
                "failed", failed
        ));
    }
}