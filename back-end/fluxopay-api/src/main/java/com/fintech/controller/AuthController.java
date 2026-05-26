package com.fintech.controller;

import com.fintech.dto.LoginDTO;
import com.fintech.dto.SignupDTO;
import com.fintech.models.User;
import com.fintech.security.JwtService;
import com.fintech.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController  // equivalente ao gin.Engine
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserService userService, JwtService jwtService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    // equivalente ao handlers.Signup
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupDTO dto) {
        System.out.println("Nome: " + dto.getName());
        System.out.println("Email: " + dto.getEmail());
        System.out.println("Senha: " + dto.getPassword());

        boolean exists = userService.emailExists(dto.getEmail());
        System.out.println("Email existe? " + exists);

        if (userService.emailExists(dto.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Este Email já está em uso."));
        }

        User user = userService.createUser(dto);
        return ResponseEntity.status(201).body(Map.of(
                "message", "Usuário criado com sucesso!",
                "user", user
        ));
    }

    // equivalente ao handlers.Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
            User user = userService.getUserByEmail(dto.getEmail());
            System.out.println("Usuário encontrado: " + user.getEmail());

            boolean senhaCorreta = passwordEncoder.matches(dto.getPassword(), user.getPassword());
            System.out.println("Senha correta? " + senhaCorreta);
        try {

            String accessToken = jwtService.generateAccessToken(user.getId(), user.getRole());

            System.out.println("Access token gerado: " + accessToken);

            String refreshToken = jwtService.generateRefreshToken(user.getId());

            System.out.println("Refresh token gerado: " + refreshToken);

            // equivalente ao utils.Check do Go
            if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Senha incorreta"));
            }


            return ResponseEntity.ok(Map.of(
                    "access_token", accessToken,
                    "refresh_token", refreshToken,
                    "message", "Login realizado com sucesso!"
            ));

        } catch (RuntimeException e) {
            System.out.println("Erro ao gerar token: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // equivalente ao handlers.Logout
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "logout successful"));
    }
}