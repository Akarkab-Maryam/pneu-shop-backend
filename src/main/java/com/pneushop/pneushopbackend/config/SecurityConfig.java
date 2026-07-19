package com.pneushop.pneushopbackend.config;

import com.pneushop.pneushopbackend.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Routes publiques (sans token)
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/pneus/**").permitAll()
                        // Routes protégées ADMIN uniquement
                        .requestMatchers(HttpMethod.POST, "/api/pneus/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/pneus/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/pneus/**").hasRole("ADMIN")
                         .requestMatchers(HttpMethod.POST, "/api/commandes").hasAnyRole("ADMIN", "CLIENT")
                         .requestMatchers("/api/commandes/**").hasRole("ADMIN")
                        .requestMatchers("/api/utilisateurs/**").hasRole("ADMIN")
                        .requestMatchers("/api/images/**").hasRole("ADMIN")
                        // Tout le reste nécessite d'être authentifié
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}