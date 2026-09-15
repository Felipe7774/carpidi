package com.carpidi.api;

import com.carpidi.application.AuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.net.URI;
import java.util.Set;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
  private final AuthService authService;
  public AuthController(AuthService authService) { this.authService = authService; }

  @PostMapping("/register")
  ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
    UserResponse response = authService.register(request);
    return ResponseEntity.created(URI.create("/api/v1/users/" + response.id())).body(response);
  }

  @PostMapping("/login")
  TokenResponse login(@Valid @RequestBody LoginRequest request) { return authService.login(request); }

  @PostMapping("/refresh-token")
  TokenResponse refresh(@Valid @RequestBody RefreshRequest request) { return authService.refresh(request.refreshToken()); }

  @PostMapping("/logout")
  ResponseEntity<Void> logout(@Valid @RequestBody RefreshRequest request) {
    authService.logout(request.refreshToken());
    return ResponseEntity.noContent().build();
  }

  public record RegisterRequest(@NotBlank @Size(max=150) String name,
      @NotBlank @Email @Size(max=254) String email,
      @NotBlank @Size(min=12,max=72)
      @Pattern(regexp="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).+$",
          message="debe incluir mayúscula, minúscula, número y símbolo") String password) {}
  public record LoginRequest(@NotBlank @Email String email, @NotBlank @Size(max=72) String password) {}
  public record RefreshRequest(@NotBlank String refreshToken) {}
  public record UserResponse(String id, String name, String email, Set<String> roles) {}
  public record TokenResponse(String accessToken, String refreshToken, long expiresIn, UserResponse user) {}
}
