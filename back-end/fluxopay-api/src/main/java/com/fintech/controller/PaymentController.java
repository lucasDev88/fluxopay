package com.fintech.controller;

import com.fintech.models.Payment;
import com.fintech.repository.ClientRepository;
import com.fintech.repository.PaymentRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentRepository paymentRepository;
    private final ClientRepository clientRepository;

    public PaymentController(PaymentRepository paymentRepository,
                             ClientRepository clientRepository) {
        this.paymentRepository = paymentRepository;
        this.clientRepository = clientRepository;
    }

    // equivalente ao ListPayments
    @GetMapping
    public ResponseEntity<?> listPayments(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userID");
        return ResponseEntity.ok(paymentRepository.findByUserId(userId));
    }

    // equivalente ao AddPayment
    @PostMapping
    public ResponseEntity<?> addPayment(HttpServletRequest request,
                                        @RequestBody Map<String, Object> body) {
        String userId = (String) request.getAttribute("userID");

        // equivalente ao validateCustomerExists
        Long customerId = body.get("customer_id") != null
                ? Long.valueOf(body.get("customer_id").toString())
                : null;

        if (customerId != null && clientRepository.findByIdAndUserId(customerId, userId).isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "cliente não encontrado"));
        }

        Payment payment = new Payment();
        payment.setUserId(userId);
        payment.setName(body.get("name").toString());
        payment.setPrice(Integer.parseInt(body.get("price").toString()));
        payment.setDescription(body.get("description") != null ? body.get("description").toString() : "");
        payment.setSituation(body.get("situation").toString());
        payment.setCustomerId(customerId);

        paymentRepository.save(payment);
        return ResponseEntity.status(201).body(Map.of("id", payment.getId()));
    }

    // equivalente ao DeletePayment
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePayment(HttpServletRequest request,
                                           @PathVariable Long id) {
        String userId = (String) request.getAttribute("userID");

        return paymentRepository.findByIdAndUserId(id, userId)
                .map(payment -> {
                    paymentRepository.delete(payment);  // soft delete pelo @SQLDelete
                    return ResponseEntity.ok(Map.of("deleted", true));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // equivalente ao UpdatePayment
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePayment(HttpServletRequest request,
                                           @PathVariable Long id,
                                           @RequestBody Map<String, Object> body) {
        String userId = (String) request.getAttribute("userID");

        return paymentRepository.findByIdAndUserId(id, userId)
                .map(payment -> {
                    if (body.get("name") != null) payment.setName(body.get("name").toString());
                    if (body.get("price") != null) payment.setPrice(Integer.parseInt(body.get("price").toString()));
                    if (body.get("description") != null) payment.setDescription(body.get("description").toString());
                    if (body.get("situation") != null) payment.setSituation(body.get("situation").toString());
                    if (body.get("customer_id") != null) payment.setCustomerId(Long.valueOf(body.get("customer_id").toString()));

                    paymentRepository.save(payment);
                    return ResponseEntity.ok(Map.of("updated", true));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}