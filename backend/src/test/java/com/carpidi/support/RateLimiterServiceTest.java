package com.carpidi.support;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import org.junit.jupiter.api.Test;

class RateLimiterServiceTest {

  @Test
  void permitsRequestsWithinLimit() {
    RateLimiterService limiter = new RateLimiterService(Clock.systemUTC(), 3, 60_000);
    assertThat(limiter.tryAcquire("127.0.0.1")).isTrue();
    assertThat(limiter.tryAcquire("127.0.0.1")).isTrue();
    assertThat(limiter.tryAcquire("127.0.0.1")).isTrue();
  }

  @Test
  void rejectsRequestsExceedingLimit() {
    RateLimiterService limiter = new RateLimiterService(Clock.systemUTC(), 2, 60_000);
    assertThat(limiter.tryAcquire("10.0.0.1")).isTrue();
    assertThat(limiter.tryAcquire("10.0.0.1")).isTrue();
    assertThat(limiter.tryAcquire("10.0.0.1")).isFalse();
  }

  @Test
  void isolatesLimitsByClientKey() {
    RateLimiterService limiter = new RateLimiterService(Clock.systemUTC(), 1, 60_000);
    assertThat(limiter.tryAcquire("client-a")).isTrue();
    assertThat(limiter.tryAcquire("client-a")).isFalse();
    assertThat(limiter.tryAcquire("client-b")).isTrue();
  }

  @Test
  void releasesLimitAfterWindowExpires() {
    Instant t0 = Instant.parse("2026-11-03T10:00:00Z");
    MutableClock clock = new MutableClock(t0);
    RateLimiterService limiter = new RateLimiterService(clock, 1, 10_000);

    assertThat(limiter.tryAcquire("client-c")).isTrue();
    assertThat(limiter.tryAcquire("client-c")).isFalse();

    // Avanzar reloj 11 segundos
    clock.advanceMillis(11_000);
    assertThat(limiter.tryAcquire("client-c")).isTrue();
  }

  private static class MutableClock extends Clock {
    private Instant current;

    MutableClock(Instant initial) {
      this.current = initial;
    }

    void advanceMillis(long millis) {
      this.current = this.current.plusMillis(millis);
    }

    @Override
    public ZoneOffset getZone() {
      return ZoneOffset.UTC;
    }

    @Override
    public Clock withZone(java.time.ZoneId zone) {
      return this;
    }

    @Override
    public Instant instant() {
      return current;
    }
  }
}

