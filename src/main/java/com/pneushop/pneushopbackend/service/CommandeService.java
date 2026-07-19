package com.pneushop.pneushopbackend.service;

import com.pneushop.pneushopbackend.dto.CommandeRequest;
import com.pneushop.pneushopbackend.dto.LigneCommandeRequest;
import com.pneushop.pneushopbackend.entity.Commande;
import com.pneushop.pneushopbackend.entity.LigneCommande;
import com.pneushop.pneushopbackend.entity.Pneu;
import com.pneushop.pneushopbackend.entity.Utilisateur;
import com.pneushop.pneushopbackend.entity.enums.StatutCommande;
import com.pneushop.pneushopbackend.entity.enums.StatutPaiement;
import com.pneushop.pneushopbackend.repository.CommandeRepository;
import com.pneushop.pneushopbackend.repository.LigneCommandeRepository;
import com.pneushop.pneushopbackend.repository.PneuRepository;
import com.pneushop.pneushopbackend.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CommandeService {

    private final CommandeRepository commandeRepository;
    private final LigneCommandeRepository ligneCommandeRepository;
    private final PneuRepository pneuRepository;
    private final UtilisateurRepository utilisateurRepository;

    @Value("${commande.archivage.seuil:5}")
    private int seuilArchivage;

    public CommandeService(CommandeRepository commandeRepository,
                            LigneCommandeRepository ligneCommandeRepository,
                            PneuRepository pneuRepository,
                            UtilisateurRepository utilisateurRepository) {
        this.commandeRepository = commandeRepository;
        this.ligneCommandeRepository = ligneCommandeRepository;
        this.pneuRepository = pneuRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    @Transactional
    public Commande creerCommande(CommandeRequest request, String emailClient) {

        Utilisateur client = utilisateurRepository.findByEmail(emailClient)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        if (request.getLignes() == null || request.getLignes().isEmpty()) {
            throw new RuntimeException("La commande doit contenir au moins un pneu");
        }

        for (LigneCommandeRequest ligneRequest : request.getLignes()) {
            Pneu pneu = pneuRepository.findById(ligneRequest.getPneuId())
                    .orElseThrow(() -> new RuntimeException(
                            "Pneu introuvable : id " + ligneRequest.getPneuId()));

            if (pneu.getStock() < ligneRequest.getQuantite()) {
                throw new RuntimeException(
                        "Stock insuffisant pour " + pneu.getMarque() + " " + pneu.getModele() +
                        " (disponible : " + pneu.getStock() + ", demandé : " + ligneRequest.getQuantite() + ")");
            }
        }

        Commande commande = new Commande();
        commande.setClient(client);
        commande.setAdresseLivraison(request.getAdresseLivraison());
        commande.setStatut(StatutCommande.EN_ATTENTE);
        commande.setStatutPaiement(StatutPaiement.EN_ATTENTE);
        commande.setMontantTotal(BigDecimal.ZERO);

        Commande commandeSauvegardee = commandeRepository.save(commande);

        BigDecimal montantTotal = BigDecimal.ZERO;

        for (LigneCommandeRequest ligneRequest : request.getLignes()) {
            Pneu pneu = pneuRepository.findById(ligneRequest.getPneuId())
                    .orElseThrow(() -> new RuntimeException("Pneu introuvable"));

            LigneCommande ligne = new LigneCommande();
            ligne.setCommande(commandeSauvegardee);
            ligne.setPneu(pneu);
            ligne.setQuantite(ligneRequest.getQuantite());
            ligne.setPrixUnitaire(pneu.getPrix());

            ligneCommandeRepository.save(ligne);

            pneu.setStock(pneu.getStock() - ligneRequest.getQuantite());
            pneuRepository.save(pneu);

            BigDecimal sousTotal = pneu.getPrix().multiply(BigDecimal.valueOf(ligneRequest.getQuantite()));
            montantTotal = montantTotal.add(sousTotal);
        }

        commandeSauvegardee.setMontantTotal(montantTotal);
        Commande resultat = commandeRepository.save(commandeSauvegardee);

        verifierEtArchiverSiSeuilAtteint();

        return resultat;
    }

    /**
     * Si le nombre de commandes actives (non archivées) atteint le seuil configuré,
     * elles sont archivées (archivee = true). Rien n'est supprimé : elles restent
     * en base et deviennent téléchargeables via GET /api/commandes/export.
     */
    @Transactional
    public void verifierEtArchiverSiSeuilAtteint() {
        long nombreCommandesActives = commandeRepository.countByArchiveeFalse();

        if (nombreCommandesActives >= seuilArchivage) {
            List<Commande> commandesActives = commandeRepository.findByArchiveeFalseOrderByDateCommandeDesc();
            commandesActives.forEach(c -> c.setArchivee(true));
            commandeRepository.saveAll(commandesActives);
        }
    }
}