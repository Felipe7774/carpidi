package com.carpidi.support;

import java.time.Clock;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class RateLimiterService {
  private final ConcurrentHashMap<String, Deque<Long>> requestCounts = new ConcurrentHashMap<>();
  private final Clock clock;
  private final int maxRequests;
  private final long windowMillis;

  public RateLimiterService() {
    this(Clock.systemUTC(), 10, 60_000); // Máximo 10 solicitudes por ventana de 1 minuto
  }

  public RateLimiterService(Clock clock, int maxRequests, long windowMillis) {
    this.clock = clock;
    this.maxRequests = maxRequests;
    this.windowMillis = windowMillis;
  }

  public boolean tryAcquire(String key) {
    long now = clock.millis();
    long cutoff = now - windowMillis;

    Deque<Long> timestamps = requestCounts.computeIfAbsent(key, k -> new ArrayDeque<>());
    synchronized (timestamps) {
      while (!timestamps.isEmpty() && timestamps.peekFirst() < cutoff) {
        timestamps.pollFirst();
      }
      if (timestamps.size() >= maxRequests) {
        return false;
      }
      timestamps.addLast(now);
      return true;
    }
  }

  public void reset() {
    requestCounts.clear();
  }
}

