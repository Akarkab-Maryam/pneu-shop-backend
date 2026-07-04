package com.pneushop.pneushopbackend.service;

import com.pneushop.pneushopbackend.dto.LoginRequest;
import com.pneushop.pneushopbackend.dto.LoginResponse;
import com.pneushop.pneushopbackend.entity.Utilisateur;
import com.pneushop.pneushopbackend.repository.UtilisateurRepository;
import com.pneushop.pneushopbackend.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UtilisateurRepository utilisateurRepository,
                        PasswordEncoder passwordEncoder,
                        JwtUtil jwtUtil) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest loginRequest) {

        Utilisateur utilisateur = utilisateurRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect"));

        if (!utilisateur.getActif()) {
            throw new RuntimeException("Ce compte est désactivé");
        }

        boolean motDePasseValide = passwordEncoder.matches(
                loginRequest.getMotDePasse(),
                utilisateur.getMotDePasse()
        );

        if (!motDePasseValide) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }

        String token = jwtUtil.generateToken(
                utilisateur.getEmail(),
                utilisateur.getRole().name()
        );

        return new LoginResponse(
                token,
                utilisateur.getEmail(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getRole().name()
        );
    }
}