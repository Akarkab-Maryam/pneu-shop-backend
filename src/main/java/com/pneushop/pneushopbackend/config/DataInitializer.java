package com.pneushop.pneushopbackend.config;

import com.pneushop.pneushopbackend.entity.Utilisateur;
import com.pneushop.pneushopbackend.entity.enums.Role;
import com.pneushop.pneushopbackend.repository.UtilisateurRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UtilisateurRepository utilisateurRepository, PasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        String emailMokhtar = "mokhtar@teste.com";

        if (utilisateurRepository.findByEmail(emailMokhtar).isEmpty()) {

            Utilisateur admin = new Utilisateur();
            admin.setNom("Mokhtar");
            admin.setPrenom("Admin");
            admin.setEmail(emailMokhtar);
            admin.setMotDePasse(passwordEncoder.encode("Mokhtar123!"));
            admin.setRole(Role.ADMIN);
            admin.setActif(true);

            utilisateurRepository.save(admin);

            System.out.println("Utilisateur ADMIN créé : " + emailMokhtar);
        } else {
            System.out.println("Utilisateur ADMIN déjà existant : " + emailMokhtar);
        }

        String emailClient = "client@teste.com";

        if (utilisateurRepository.findByEmail(emailClient).isEmpty()) {

            Utilisateur client = new Utilisateur();
            client.setNom("Client");
            client.setPrenom("Test");
            client.setEmail(emailClient);
            client.setMotDePasse(passwordEncoder.encode("Client123!"));
            client.setRole(Role.CLIENT);
            client.setActif(true);

            utilisateurRepository.save(client);

            System.out.println("Utilisateur CLIENT créé : " + emailClient);
        } else {
            System.out.println("Utilisateur CLIENT déjà existant : " + emailClient);
        }
    }
}