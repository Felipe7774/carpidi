package com.carpidi.api;
import jakarta.validation.Valid; import jakarta.validation.constraints.*; import org.springframework.http.*; import org.springframework.security.crypto.password.PasswordEncoder; import org.springframework.web.bind.annotation.*; import com.carpidi.domain.*; import com.carpidi.infrastructure.UserRepository;

@RestController @RequestMapping("/auth")
public class AuthController {
 private final UserRepository users; private final PasswordEncoder encoder;
 public AuthController(UserRepository users, PasswordEncoder encoder){this.users=users;this.encoder=encoder;}
 @PostMapping("/register") public ResponseEntity<RegistrationResponse> register(@Valid @RequestBody RegistrationRequest r){
  if(users.findByEmailIgnoreCase(r.email()).isPresent()) return ResponseEntity.status(HttpStatus.CONFLICT).build();
  User user=users.save(new User(r.email().toLowerCase(),encoder.encode(r.password()),UserRole.CLIENT));
  return ResponseEntity.status(HttpStatus.CREATED).body(new RegistrationResponse(user.getId().toString(),user.getEmail())); }
 public record RegistrationRequest(@NotBlank String name,@Email @NotBlank String email,@Size(min=12,max=72) String password){}
 public record RegistrationResponse(String userId,String email){}
}
