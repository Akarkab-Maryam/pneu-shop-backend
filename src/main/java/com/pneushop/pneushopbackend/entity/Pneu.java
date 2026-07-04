package com.pneushop.pneushopbackend.entity;

import com.pneushop.pneushopbackend.entity.enums.SaisonPneu;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pneu")
public class Pneu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String marque;

    @Column(nullable = false, length = 150)
    private String modele;

    @Column(nullable = false)
    private Integer largeur;

    @Column(nullable = false)
    private Integer hauteur;

    @Column(nullable = false)
    private Integer diametre;

    @Column(name = "indice_charge", length = 20)
    private String indiceCharge;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SaisonPneu saison;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal prix;

    @Column(nullable = false)
    private Integer stock = 0;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "date_ajout", nullable = false, updatable = false)
    private LocalDateTime dateAjout;

    @PrePersist
    protected void onCreate() {
        this.dateAjout = LocalDateTime.now();
    }

    // Getters et Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMarque() {
        return marque;
    }

    public void setMarque(String marque) {
        this.marque = marque;
    }

    public String getModele() {
        return modele;
    }

    public void setModele(String modele) {
        this.modele = modele;
    }

    public Integer getLargeur() {
        return largeur;
    }

    public void setLargeur(Integer largeur) {
        this.largeur = largeur;
    }

    public Integer getHauteur() {
        return hauteur;
    }

    public void setHauteur(Integer hauteur) {
        this.hauteur = hauteur;
    }

    public Integer getDiametre() {
        return diametre;
    }

    public void setDiametre(Integer diametre) {
        this.diametre = diametre;
    }

    public String getIndiceCharge() {
        return indiceCharge;
    }

    public void setIndiceCharge(String indiceCharge) {
        this.indiceCharge = indiceCharge;
    }

    public SaisonPneu getSaison() {
        return saison;
    }

    public void setSaison(SaisonPneu saison) {
        this.saison = saison;
    }

    public BigDecimal getPrix() {
        return prix;
    }

    public void setPrix(BigDecimal prix) {
        this.prix = prix;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDateAjout() {
        return dateAjout;
    }

    public void setDateAjout(LocalDateTime dateAjout) {
        this.dateAjout = dateAjout;
    }
}