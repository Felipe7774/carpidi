package com.carpidi.config;

import com.carpidi.domain.*;
import com.carpidi.infrastructure.UserRepository;
import java.util.Locale;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@ConditionalOnProperty(prefix = "app.bootstrap.admin", name = "enabled", havingValue = "true")
public class AdminBootstrap implements ApplicationRunner {
  private static final Pattern STRONG_PASSWORD = Pattern.compile(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).{12,72}$");
  private final UserRepository users;
  private final PasswordEncoder encoder;
  private final String name;
  private final String email;
  private final String password;

  public AdminBootstrap(UserRepository users, PasswordEncoder encoder,
      @Value("${app.bootstrap.admin.name}") String name,
      @Value("${app.bootstrap.admin.email}") String email,
      @Value("${app.bootstrap.admin.password}") String password) {
    this.users = users;
    this.encoder = encoder;
    this.name = name;
    this.email = email.trim().toLowerCase(Locale.ROOT);
    this.password = password;
  }

  @Override
  @Transactional
  public void run(ApplicationArguments args) {
    if (!STRONG_PASSWORD.matcher(password).matches()) {
      throw new IllegalStateException(
          "La contraseña inicial de ADMIN debe tener entre 12 y 72 caracteres e incluir mayúscula, minúscula, número y símbolo.");
    }
    users.findByEmailIgnoreCase(email).ifPresentOrElse(user -> user.grantRole(UserRole.ADMIN),
        () -> users.save(new User(name.trim(), email, encoder.encode(password), UserRole.ADMIN)));
  }
}
