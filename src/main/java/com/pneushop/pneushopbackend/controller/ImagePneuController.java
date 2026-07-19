package com.pneushop.pneushopbackend.controller;

import com.pneushop.pneushopbackend.entity.ImagePneu;
import com.pneushop.pneushopbackend.entity.Pneu;
import com.pneushop.pneushopbackend.repository.ImagePneuRepository;
import com.pneushop.pneushopbackend.repository.PneuRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/images")

public class ImagePneuController {

    private final ImagePneuRepository imagePneuRepository;
    private final PneuRepository pneuRepository;

    public ImagePneuController(ImagePneuRepository imagePneuRepository,
                                PneuRepository pneuRepository) {
        this.imagePneuRepository = imagePneuRepository;
        this.pneuRepository = pneuRepository;
    }

    // GET /api/images/pneu/{pneuId} -> toutes les images d'un pneu (public)
    @GetMapping("/pneu/{pneuId}")
    public ResponseEntity<List<ImagePneu>> getImagesByPneu(@PathVariable Long pneuId) {
        return ResponseEntity.ok(imagePneuRepository.findByPneuId(pneuId));
    }

    // POST /api/images/pneu/{pneuId} -> ajouter une image à un pneu (ADMIN)
    @PostMapping("/pneu/{pneuId}")
    public ResponseEntity<?> addImage(@PathVariable Long pneuId,
                                       @RequestBody ImagePneu imagePneu) {
        return pneuRepository.findById(pneuId)
                .map(pneu -> {
                    imagePneu.setPneu(pneu);
                    return ResponseEntity.ok(imagePneuRepository.save(imagePneu));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/images/{id} -> supprimer une image (ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteImage(@PathVariable Long id) {
        if (!imagePneuRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        imagePneuRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // PUT /api/images/{id} -> modifier l'ordre ou l'url d'une image (ADMIN)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateImage(@PathVariable Long id,
                                          @RequestBody ImagePneu details) {
        return imagePneuRepository.findById(id)
                .map(image -> {
                    image.setUrl(details.getUrl());
                    image.setOrdre(details.getOrdre());
                    return ResponseEntity.ok(imagePneuRepository.save(image));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}