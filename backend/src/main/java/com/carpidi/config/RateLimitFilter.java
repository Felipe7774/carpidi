package com.carpidi.config;

import com.carpidi.support.RateLimiterService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class RateLimitFilter extends OncePerRequestFilter {
  private final RateLimiterService rateLimiter;
  private final ObjectMapper mapper;

  public RateLimitFilter(RateLimiterService rateLimiter, ObjectMapper mapper) {
    this.rateLimiter = rateLimiter;
    this.mapper = mapper;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {
    String path = request.getServletPath();
    String method = request.getMethod();

    if ("POST".equalsIgnoreCase(method) && (path.endsWith("/auth/login") || path.endsWith("/auth/register"))) {
      String clientIp = getClientIp(request);
      String key = clientIp + ":" + path;
      if (!rateLimiter.tryAcquire(key)) {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setHeader("Retry-After", "60");
        response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(
            HttpStatus.TOO_MANY_REQUESTS,
            "Demasiados intentos de autenticación. Por favor espera antes de intentar nuevamente."
        );
        detail.setTitle("Demasiadas solicitudes");
        detail.setType(URI.create("https://api.carpidi.com/errors/rate-limit-exceeded"));
        detail.setInstance(URI.create(request.getRequestURI()));
        mapper.writeValue(response.getOutputStream(), detail);
        return;
      }
    }
    chain.doFilter(request, response);
  }

  private String getClientIp(HttpServletRequest request) {
    String xForwardedFor = request.getHeader("X-Forwarded-For");
    if (xForwardedFor != null && !xForwardedFor.isBlank()) {
      return xForwardedFor.split(",")[0].trim();
    }
    return request.getRemoteAddr() != null ? request.getRemoteAddr() : "unknown";
  }
}

