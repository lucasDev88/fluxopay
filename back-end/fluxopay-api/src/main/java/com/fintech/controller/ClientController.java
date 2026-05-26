package com.fintech.controller;

import com.fintech.models.Client;
import com.fintech.repository.ClientRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientRepository clientRepository;

    public ClientController(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    // equivalente ao ListClients
    @GetMapping
    public ResponseEntity<?> listClients(HttpServletRequest request) {
        String userId = (String) request.getAttribute("userID");
        return ResponseEntity.ok(clientRepository.findByUserId(userId));
    }

    // equivalente ao AddClient
    @PostMapping
    public ResponseEntity<?> addClient(HttpServletRequest request,
                                       @RequestBody Map<String, String> body) {
        String userId = (String) request.getAttribute("userID");

        Client client = new Client();
        client.setUserId(userId);
        client.setName(body.get("name"));
        client.setEmail(body.get("email"));
        client.setSituation(body.get("situation"));

        clientRepository.save(client);
        return ResponseEntity.status(201).body(Map.of("id", client.getId()));
    }

    // equivalente ao DeleteClient
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClient(HttpServletRequest request,
                                          @PathVariable Long id) {
        String userId = (String) request.getAttribute("userID");

        return clientRepository.findByIdAndUserId(id, userId)
                .map(client -> {
                    clientRepository.delete(client);
                    return ResponseEntity.ok(Map.of("deleted", true));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // equivalente ao UpdateClient
    @PutMapping("/{id}")
    public ResponseEntity<?> updateClient(HttpServletRequest request,
                                          @PathVariable Long id,
                                          @RequestBody Map<String, String> body) {
        String userId = (String) request.getAttribute("userID");

        return clientRepository.findByIdAndUserId(id, userId)
                .map(client -> {
                    client.setName(body.get("name"));
                    client.setEmail(body.get("email"));
                    client.setSituation(body.get("situation"));
                    clientRepository.save(client);
                    return ResponseEntity.ok(Map.of("updated", true));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}