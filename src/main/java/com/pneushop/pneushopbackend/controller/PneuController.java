package com.pneushop.pneushopbackend.controller;

import com.pneushop.pneushopbackend.entity.Pneu;
import com.pneushop.pneushopbackend.repository.PneuRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pneus")

public class PneuController {

    private final PneuRepository pneuRepository;

    public PneuController(PneuRepository pneuRepository) {
        this.pneuRepository = pneuRepository;
    }

    // GET /api/pneus -> liste publique de tous les pneus (page d'accueil)
    @GetMapping
    public ResponseEntity<List<Pneu>> getAllPneus() {
        return ResponseEntity.ok(pneuRepository.findAll());
    }

    // GET /api/pneus/{id} -> details d'un pneu
    @GetMapping("/{id}")
    public ResponseEntity<?> getPneuById(@PathVariable Long id) {
        return pneuRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/pneus -> creer un pneu (reserve admin, protege par JWT)
    @PostMapping
    public ResponseEntity<Pneu> createPneu(@RequestBody Pneu pneu) {
        Pneu saved = pneuRepository.save(pneu);
        return ResponseEntity.ok(saved);
    }

    // PUT /api/pneus/{id} -> modifier un pneu (reserve admin, protege par JWT)
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePneu(@PathVariable Long id, @RequestBody Pneu pneuDetails) {
        return pneuRepository.findById(id)
                .map(pneu -> {
                    pneu.setMarque(pneuDetails.getMarque());
                    pneu.setModele(pneuDetails.getModele());
                    pneu.setLargeur(pneuDetails.getLargeur());
                    pneu.setHauteur(pneuDetails.getHauteur());
                    pneu.setDiametre(pneuDetails.getDiametre());
                    pneu.setIndiceCharge(pneuDetails.getIndiceCharge());
                    pneu.setSaison(pneuDetails.getSaison());
                    pneu.setPrix(pneuDetails.getPrix());
                    pneu.setStock(pneuDetails.getStock());
                    pneu.setDescription(pneuDetails.getDescription());
                    return ResponseEntity.ok(pneuRepository.save(pneu));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/pneus/{id} -> supprimer un pneu (reserve admin, protege par JWT)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePneu(@PathVariable Long id) {
        if (!pneuRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        pneuRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}