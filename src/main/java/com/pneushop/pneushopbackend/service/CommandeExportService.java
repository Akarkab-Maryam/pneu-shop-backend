package com.pneushop.pneushopbackend.service;

import com.pneushop.pneushopbackend.entity.Commande;
import com.pneushop.pneushopbackend.repository.CommandeRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class CommandeExportService {

    private final CommandeRepository commandeRepository;

    public CommandeExportService(CommandeRepository commandeRepository) {
        this.commandeRepository = commandeRepository;
    }

    public byte[] genererXlsxHistorique() throws IOException {
        List<Commande> commandesArchivees = commandeRepository.findByArchiveeTrueOrderByDateCommandeDesc();

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Historique commandes");

            String[] entetes = {"ID", "Client", "Email", "Date", "Montant (DH)", "Statut", "Statut paiement"};
            Row ligneEntete = sheet.createRow(0);
            CellStyle styleEntete = workbook.createCellStyle();
            Font policeGras = workbook.createFont();
            policeGras.setBold(true);
            styleEntete.setFont(policeGras);

            for (int i = 0; i < entetes.length; i++) {
                Cell cell = ligneEntete.createCell(i);
                cell.setCellValue(entetes[i]);
                cell.setCellStyle(styleEntete);
            }

            DateTimeFormatter formatteurDate = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

            int numeroLigne = 1;
            for (Commande commande : commandesArchivees) {
                Row ligne = sheet.createRow(numeroLigne++);

                ligne.createCell(0).setCellValue(commande.getId());

                String nomClient = commande.getClient() != null
                        ? commande.getClient().getPrenom() + " " + commande.getClient().getNom()
                        : "N/A";
                ligne.createCell(1).setCellValue(nomClient);
                ligne.createCell(2).setCellValue(
                        commande.getClient() != null ? commande.getClient().getEmail() : "N/A");
                ligne.createCell(3).setCellValue(
                        commande.getDateCommande() != null ? commande.getDateCommande().format(formatteurDate) : "");
                ligne.createCell(4).setCellValue(
                        commande.getMontantTotal() != null ? commande.getMontantTotal().doubleValue() : 0);
                ligne.createCell(5).setCellValue(
                        commande.getStatut() != null ? commande.getStatut().name() : "");
                ligne.createCell(6).setCellValue(
                        commande.getStatutPaiement() != null ? commande.getStatutPaiement().name() : "");
            }

            for (int i = 0; i < entetes.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }
}