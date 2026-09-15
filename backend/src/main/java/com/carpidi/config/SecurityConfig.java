package com.carpidi.config;

import com.carpidi.infrastructure.UserRepository;
import java.time.Clock;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

@Configuration @EnableMethodSecurity
public class SecurityConfig {
  @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(12); }
  @Bean Clock clock() { return Clock.systemUTC(); }

  @Bean UserDetailsService userDetailsService(UserRepository users) {
    return username -> users.findByEmailIgnoreCase(username).map(user -> User.withUsername(user.getEmail())
        .password(user.getPasswordHash()).disabled(!user.isEnabled())
        .authorities(user.getRoles().stream().map(role -> new SimpleGrantedAuthority("ROLE_"+role.name())).toList())
        .build()).orElseThrow(() -> new UsernameNotFoundException("Credenciales inválidas"));
  }

  @Bean DaoAuthenticationProvider authenticationProvider(UserDetailsService details, PasswordEncoder encoder) {
    var provider=new DaoAuthenticationProvider(); provider.setUserDetailsService(details); provider.setPasswordEncoder(encoder); return provider;
  }
  @Bean AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception { return configuration.getAuthenticationManager(); }

  @Bean CorsConfigurationSource corsConfigurationSource(@Value("${app.security.allowed-origins:http://localhost:5173}") List<String> origins) {
    var config=new CorsConfiguration(); config.setAllowedOrigins(origins);
    config.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
    config.setAllowedHeaders(List.of("Authorization","Content-Type","Idempotency-Key")); config.setExposedHeaders(List.of("Location"));
    var source=new UrlBasedCorsConfigurationSource(); source.registerCorsConfiguration("/**", config); return source;
  }

  @Bean SecurityFilterChain security(HttpSecurity http, JwtAuthenticationFilter jwtFilter,
      SecurityProblemWriter problems) throws Exception {
    return http.csrf(csrf -> csrf.disable()).cors(Customizer.withDefaults())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .headers(headers -> headers.contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'none'; frame-ancestors 'none'"))
            .frameOptions(frame -> frame.deny()).httpStrictTransportSecurity(hsts -> hsts.includeSubDomains(true).maxAgeInSeconds(31536000)))
        .authorizeHttpRequests(auth -> auth.requestMatchers("/auth/**","/products/**","/categories/**","/actuator/health").permitAll()
            .requestMatchers("/admin/**").hasRole("ADMIN").anyRequest().authenticated())
        .exceptionHandling(errors -> errors.authenticationEntryPoint(problems).accessDeniedHandler(problems))
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class).build();
  }
}
