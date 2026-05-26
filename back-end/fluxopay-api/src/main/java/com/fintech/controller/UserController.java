package com.fintech.controller;

import com.fintech.models.Client;
import com.fintech.models.Payment;
import com.fintech.models.User;
import com.fintech.repository.ClientRepository;
import com.fintech.repository.PaymentRepository;
import com.fintech.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final PaymentRepository paymentRepository;

    public UserController(UserRepository userRepository,
                          ClientRepository clientRepository,
                          PaymentRepository paymentRepository) {
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.paymentRepository = paymentRepository;
    }

    // equivalente ao GetUserProfile
    @GetMapping("/me")
    public ResponseEntity<?> getProfile(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userID");
        return userRepository.findById(userId)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.notFound().build());
    }

    // equivalente ao UpdateUserProfile
    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(HttpServletRequest request,
                                           @RequestBody Map<String, String> body) {
        String userId = (String) request.getAttribute("userID");
        String username = body.get("username");

        if (username == null || username.length() < 2) {
            return ResponseEntity.badRequest().body(Map.of("error", "json inválido"));
        }

        return userRepository.findById(userId).map(user -> {
            user.setName(username);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "perfil atualizado"));
        }).orElse(ResponseEntity.notFound().build());
    }

    // equivalente ao GetUsername
    @GetMapping("/username")
    public ResponseEntity<?> getUsername(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userID");
        return userRepository.findById(userId)
                .map(user -> ResponseEntity.ok(Map.of("username", user.getName())))
                .orElse(ResponseEntity.notFound().build());
    }

    // equivalente ao GetUserDashboard
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userID");

        long totalClients = clientRepository.countByUserId(userId);
        long totalPayments = paymentRepository.countByUserId(userId);
        long totalRevenue = paymentRepository.sumPriceByUserIdAndSituation(userId, "Aprovado");
        long pending = paymentRepository.countByUserIdAndSituation(userId, "Pendente");
        long failed = paymentRepository.countByUserIdAndSituation(userId, "Recusado");
        List<Payment> recent = paymentRepository.findTop5ByUserIdOrderByCreatedAtDesc(userId);

        return ResponseEntity.ok(Map.of(
                "total_clients", totalClients,
                "total_payments", totalPayments,
                "total_revenue", totalRevenue,
                "pending", pending,
                "failed", failed,
                "recent_payments", recent
        ));
    }
}