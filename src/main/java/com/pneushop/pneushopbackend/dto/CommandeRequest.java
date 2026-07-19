package com.pneushop.pneushopbackend.dto;

import java.util.List;

public class CommandeRequest {

    private String adresseLivraison;
    private List<LigneCommandeRequest> lignes;

    public CommandeRequest() {
    }

    public String getAdresseLivraison() {
        return adresseLivraison;
    }

    public void setAdresseLivraison(String adresseLivraison) {
        this.adresseLivraison = adresseLivraison;
    }

    public List<LigneCommandeRequest> getLignes() {
        return lignes;
    }

    public void setLignes(List<LigneCommandeRequest> lignes) {
        this.lignes = lignes;
    }
}