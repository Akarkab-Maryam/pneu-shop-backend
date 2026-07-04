package com.pneushop.pneushopbackend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "image_pneu")
public class ImagePneu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pneu_id", nullable = false)
    private Pneu pneu;

    @Column(nullable = false, length = 500)
    private String url;

    @Column(nullable = false)
    private Integer ordre = 0;

    // Getters et Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Pneu getPneu() {
        return pneu;
    }

    public void setPneu(Pneu pneu) {
        this.pneu = pneu;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Integer getOrdre() {
        return ordre;
    }

    public void setOrdre(Integer ordre) {
        this.ordre = ordre;
    }
}