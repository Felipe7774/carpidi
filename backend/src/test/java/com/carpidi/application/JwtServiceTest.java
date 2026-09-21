package com.carpidi.application;

import static org.assertj.core.api.Assertions.assertThat;
import com.carpidi.domain.*;
import java.lang.reflect.Field;
import java.time.*;
import java.util.*;
import org.junit.jupiter.api.Test;

class JwtServiceTest {
  @Test
  void createsSignedTokenWithUserSubjectAndRole() throws Exception {
    Clock clock=Clock.fixed(Instant.parse("2026-09-14T12:00:00Z"),ZoneOffset.UTC);
    JwtService service=new JwtService("12345678901234567890123456789012",15,clock);
    User user=new User("Cliente CARPIDI","client@example.com","hash",UserRole.CLIENT);
    Field id=User.class.getDeclaredField("id"); id.setAccessible(true); id.set(user,UUID.fromString("37a5e945-6ad9-47ae-b989-64dbfd9a1e2c"));

    String token=service.createAccessToken(user);

    assertThat(service.parse(token).getSubject()).isEqualTo("37a5e945-6ad9-47ae-b989-64dbfd9a1e2c");
    assertThat(service.parse(token).get("email",String.class)).isEqualTo("client@example.com");
    assertThat(service.parse(token).getExpiration()).isAfter(Date.from(clock.instant()));
  }
}
