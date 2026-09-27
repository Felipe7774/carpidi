package com.carpidi.support;
public class UnauthorizedException extends RuntimeException {
  public UnauthorizedException() { super("Credenciales inválidas."); }
}
