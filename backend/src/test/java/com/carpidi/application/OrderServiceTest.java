package com.carpidi.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import com.carpidi.domain.Order;
import com.carpidi.domain.User;
import com.carpidi.domain.UserRole;
import com.carpidi.infrastructure.OrderRepository;
import com.carpidi.infrastructure.ProductVariantRepository;
import com.carpidi.infrastructure.UserRepository;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class OrderServiceTest {
  @Mock OrderRepository orders;
  @Mock ProductVariantRepository variants;
  @Mock UserRepository users;
  @InjectMocks OrderService orderService;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void clientOnlySeesOwnOrders() {
    User client = new User("Cliente", "cliente@example.com", "hash", UserRole.CLIENT);
    Order order = new Order(client);
    when(orders.findAllByCustomerEmailIgnoreCaseOrderByCreatedAtDesc("cliente@example.com"))
        .thenReturn(List.of(order));

    var results = orderService.listOrders("cliente@example.com", false);

    assertThat(results).hasSize(1);
    verify(orders).findAllByCustomerEmailIgnoreCaseOrderByCreatedAtDesc("cliente@example.com");
    verify(orders, never()).findAllByOrderByCreatedAtDesc();
  }

  @Test
  void adminSeesAllOrdersAcrossStore() {
    User admin = new User("Admin", "admin@example.com", "hash", UserRole.ADMIN);
    User other = new User("Otro", "otro@example.com", "hash", UserRole.CLIENT);
    when(orders.findAllByOrderByCreatedAtDesc())
        .thenReturn(List.of(new Order(admin), new Order(other)));

    var results = orderService.listOrders("admin@example.com", true);

    assertThat(results).hasSize(2);
    verify(orders).findAllByOrderByCreatedAtDesc();
    verify(orders, never()).findAllByCustomerEmailIgnoreCaseOrderByCreatedAtDesc(anyString());
  }
}

