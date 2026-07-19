package com.pneushop.pneushopbackend.controller;

import com.pneushop.pneushopbackend.entity.Commande;
import com.pneushop.pneushopbackend.entity.enums.StatutCommande;
import com.pneushop.pneushopbackend.repository.CommandeRepository;
import com.pneushop.pneushopbackend.dto.CommandeRequest;
import com.pneushop.pneushopbackend.service.CommandeService;
import com.pneushop.pneushopbackend.service.CommandeExportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/commandes")

public class CommandeController {

    private final CommandeRepository commandeRepository;
    private final CommandeService commandeService;
    private final CommandeExportService commandeExportService;

    public CommandeController(CommandeRepository commandeRepository,
                               CommandeService commandeService,
                               CommandeExportService commandeExportService) {
        this.commandeRepository = commandeRepository;
        this.commandeService = commandeService;
        this.commandeExportService = commandeExportService;
    }

    // POST /api/commandes -> créer une commande (CLIENT connecté)
    @PostMapping
    public ResponseEntity<?> creerCommande(@RequestBody CommandeRequest request,
                                            Authentication authentication) {
        try {
            String emailClient = authentication.getName();
            Commande commande = commandeService.creerCommande(request, emailClient);
            return ResponseEntity.ok(commande);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET /api/commandes -> commandes ACTIVES uniquement (ADMIN)
    // Archive automatiquement dès que le seuil est atteint avant de répondre
    @GetMapping
    public ResponseEntity<List<Commande>> getAllCommandes() {
        commandeService.verifierEtArchiverSiSeuilAtteint();
        return ResponseEntity.ok(commandeRepository.findByArchiveeFalseOrderByDateCommandeDesc());
    }

    // GET /api/commandes/export -> télécharge l'historique (commandes archivées) en xlsx
    @GetMapping("/export")
    public ResponseEntity<byte[]> exporterHistorique() {
        try {
            byte[] fichierXlsx = commandeExportService.genererXlsxHistorique();
            String nomFichier = "historique_commandes_" + LocalDate.now() + ".xlsx";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + nomFichier + "\"")
                    .contentType(MediaType.parseMediaType(
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(fichierXlsx);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // GET /api/commandes/{id} -> détail d'une commande (ADMIN)
    @GetMapping("/{id}")
    public ResponseEntity<?> getCommandeById(@PathVariable Long id) {
        return commandeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/commandes/client/{clientId} -> commandes d'un client (CLIENT)
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Commande>> getCommandesByClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(commandeRepository.findByClientId(clientId));
    }

    // PUT /api/commandes/{id}/statut -> changer le statut (ADMIN)
    @PutMapping("/{id}/statut")
    public ResponseEntity<?> updateStatut(@PathVariable Long id,
                                           @RequestParam StatutCommande statut) {
        return commandeRepository.findById(id)
                .map(commande -> {
                    commande.setStatut(statut);
                    return ResponseEntity.ok(commandeRepository.save(commande));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/commandes/{id} -> annuler une commande (ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCommande(@PathVariable Long id) {
        if (!commandeRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        commandeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}