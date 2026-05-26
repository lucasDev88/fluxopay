package com.fintech.controller;

import com.fintech.security.JwtService;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class RefreshController {

    private final JwtService jwtService;

    public RefreshController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refresh");

        if (refreshToken == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "token não enviado"));
        }

        try {
            Claims claims = jwtService.parseToken(refreshToken);

            // equivalente ao if claims["type"] != "refresh" do Go
            if (!"refresh".equals(claims.get("type", String.class))) {
                return ResponseEntity.badRequest().body(Map.of("error", "não é refresh token"));
            }

            String userId = claims.get("uid", String.class);
            String accessToken = jwtService.generateAccessToken(userId, "user");

            return ResponseEntity.ok(Map.of("access", accessToken));

        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "token inválido"));
        }
    }
}