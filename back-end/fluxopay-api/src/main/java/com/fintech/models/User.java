package com.fintech.models;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data                    // Lombok → gera getters, setters, equals, hashCode
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)  // equivalente ao uuid_generate_v4()
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    @JsonIgnore              // equivalente ao json:"-" do Go
    private String password;

    @Column(nullable = false)
    private String assinature;

    @Column(nullable = false)
    private String role;

    private String refreshToken;

    @CreationTimestamp       // equivalente ao CreatedAt do GORM
    private LocalDateTime createdAt;

    @UpdateTimestamp         // equivalente ao UpdatedAt do GORM
    private LocalDateTime updatedAt;
}