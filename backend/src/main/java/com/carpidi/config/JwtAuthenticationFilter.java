package com.carpidi.config;

import com.carpidi.application.JwtService;
import com.carpidi.domain.User;
import com.carpidi.infrastructure.UserRepository;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.UUID;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
  private final JwtService jwtService; private final UserRepository users;
  public JwtAuthenticationFilter(JwtService jwtService, UserRepository users) { this.jwtService=jwtService; this.users=users; }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {
    String header=request.getHeader("Authorization");
    if(header != null && header.startsWith("Bearer ") && SecurityContextHolder.getContext().getAuthentication() == null) {
      try {
        UUID userId=UUID.fromString(jwtService.parse(header.substring(7)).getSubject());
        users.findById(userId).filter(User::isEnabled).ifPresent(user -> {
          var authorities=user.getRoles().stream().map(role -> new SimpleGrantedAuthority("ROLE_"+role.name())).toList();
          SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(user.getEmail(), null, authorities));
        });
      } catch(JwtException | IllegalArgumentException ignored) { SecurityContextHolder.clearContext(); }
    }
    chain.doFilter(request, response);
  }
}
