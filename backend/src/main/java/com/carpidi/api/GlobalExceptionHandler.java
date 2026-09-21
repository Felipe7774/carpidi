package com.carpidi.api;

import com.carpidi.support.*;
import jakarta.servlet.http.HttpServletRequest;
import java.net.URI;
import java.util.NoSuchElementException;
import org.springframework.http.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(ConflictException.class)
  ResponseEntity<ProblemDetail> conflict(ConflictException e, HttpServletRequest r) { return problem(HttpStatus.CONFLICT,e.getCode(),e.getMessage(),r); }
  @ExceptionHandler(UnauthorizedException.class)
  ResponseEntity<ProblemDetail> unauthorized(UnauthorizedException e, HttpServletRequest r) { return problem(HttpStatus.UNAUTHORIZED,"invalid-credentials",e.getMessage(),r); }
  @ExceptionHandler(NoSuchElementException.class)
  ResponseEntity<ProblemDetail> notFound(NoSuchElementException e, HttpServletRequest r) { return problem(HttpStatus.NOT_FOUND,"resource-not-found",e.getMessage(),r); }
  @ExceptionHandler(DataIntegrityViolationException.class)
  ResponseEntity<ProblemDetail> integrity(DataIntegrityViolationException e, HttpServletRequest r) {
    return problem(HttpStatus.CONFLICT,"data-conflict","La operación entra en conflicto con datos existentes.",r);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  ResponseEntity<ProblemDetail> badRequest(IllegalArgumentException e, HttpServletRequest r) {
    return problem(HttpStatus.BAD_REQUEST,"invalid-request",e.getMessage(),r);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  ResponseEntity<ProblemDetail> validation(MethodArgumentNotValidException e, HttpServletRequest r) {
    ProblemDetail detail=ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST,"La solicitud contiene campos inválidos.");
    detail.setTitle("Solicitud inválida"); detail.setType(URI.create("https://api.carpidi.com/errors/validation"));
    detail.setInstance(URI.create(r.getRequestURI()));
    detail.setProperty("errors",e.getBindingResult().getFieldErrors().stream()
        .map(error -> java.util.Map.of("field",error.getField(),"message",String.valueOf(error.getDefaultMessage()))).toList());
    return ResponseEntity.badRequest().body(detail);
  }

  private ResponseEntity<ProblemDetail> problem(HttpStatus status,String code,String message,HttpServletRequest request) {
    ProblemDetail detail=ProblemDetail.forStatusAndDetail(status,message); detail.setTitle(status.getReasonPhrase());
    detail.setType(URI.create("https://api.carpidi.com/errors/"+code)); detail.setInstance(URI.create(request.getRequestURI()));
    return ResponseEntity.status(status).body(detail);
  }
}
