package com.carpidi.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.net.URI;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.*;
import org.springframework.stereotype.Component;

@Component
public class SecurityProblemWriter implements AuthenticationEntryPoint, AccessDeniedHandler {
  private final ObjectMapper mapper;
  public SecurityProblemWriter(ObjectMapper mapper) { this.mapper=mapper; }

  @Override
  public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException {
    write(request,response,HttpStatus.UNAUTHORIZED,"authentication-required","Se requiere autenticación válida.");
  }

  @Override
  public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException exception) throws IOException {
    write(request,response,HttpStatus.FORBIDDEN,"access-denied","No tienes permiso para realizar esta operación.");
  }

  private void write(HttpServletRequest request,HttpServletResponse response,HttpStatus status,String code,String message) throws IOException {
    ProblemDetail detail=ProblemDetail.forStatusAndDetail(status,message);
    detail.setTitle(status.getReasonPhrase());
    detail.setType(URI.create("https://api.carpidi.com/errors/"+code));
    detail.setInstance(URI.create(request.getRequestURI()));
    response.setStatus(status.value()); response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
    mapper.writeValue(response.getOutputStream(),detail);
  }
}
