package com.pneushop.pneushopbackend.controller;

import com.pneushop.pneushopbackend.entity.Utilisateur;
import com.pneushop.pneushopbackend.repository.UtilisateurRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")

public class UtilisateurController {

    private final UtilisateurRepository utilisateurRepository;

    public UtilisateurController(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    // GET /api/utilisateurs -> liste de tous les clients (ADMIN uniquement)
    @GetMapping
    public ResponseEntity<List<Utilisateur>> getAllUtilisateurs() {
        return ResponseEntity.ok(utilisateurRepository.findAll());
    }

    // GET /api/utilisateurs/{id} -> détail d'un utilisateur (ADMIN)
    @GetMapping("/{id}")
    public ResponseEntity<?> getUtilisateurById(@PathVariable Long id) {
        return utilisateurRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT /api/utilisateurs/{id}/bloquer -> bloquer/débloquer un client (ADMIN)
    @PutMapping("/{id}/bloquer")
    public ResponseEntity<?> toggleBloquer(@PathVariable Long id) {
        return utilisateurRepository.findById(id)
                .map(utilisateur -> {
                    utilisateur.setActif(!utilisateur.getActif());
                    return ResponseEntity.ok(utilisateurRepository.save(utilisateur));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT /api/utilisateurs/{id} -> modifier son propre profil (CLIENT)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfil(@PathVariable Long id,
                                           @RequestBody Utilisateur details) {
        return utilisateurRepository.findById(id)
                .map(utilisateur -> {
                    utilisateur.setNom(details.getNom());
                    utilisateur.setPrenom(details.getPrenom());
                    utilisateur.setTelephone(details.getTelephone());
                    utilisateur.setAdresse(details.getAdresse());
                    utilisateur.setVille(details.getVille());
                    utilisateur.setCodePostal(details.getCodePostal());
                    utilisateur.setPays(details.getPays());
                    return ResponseEntity.ok(utilisateurRepository.save(utilisateur));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}