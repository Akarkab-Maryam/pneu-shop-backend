package com.pneushop.pneushopbackend.dto;

public class LigneCommandeRequest {

    private Long pneuId;
    private Integer quantite;

    public LigneCommandeRequest() {
    }

    public Long getPneuId() {
        return pneuId;
    }

    public void setPneuId(Long pneuId) {
        this.pneuId = pneuId;
    }

    public Integer getQuantite() {
        return quantite;
    }

    public void setQuantite(Integer quantite) {
        this.quantite = quantite;
    }
}