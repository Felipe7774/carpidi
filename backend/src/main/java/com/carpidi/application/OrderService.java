package com.carpidi.application;

import com.carpidi.domain.*;
import com.carpidi.infrastructure.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {
  private final OrderRepository orders;
  private final ProductVariantRepository variants;
  private final UserRepository users;

  public OrderService(OrderRepository orders, ProductVariantRepository variants, UserRepository users) {
    this.orders = orders;
    this.variants = variants;
    this.users = users;
  }

  @Transactional(readOnly = true)
  public List<OrderView> listFor(String email) {
    return orders.findAllByCustomerEmailIgnoreCaseOrderByCreatedAtDesc(email).stream()
        .map(this::toView)
        .toList();
  }

  @Transactional
  public OrderView create(String email, CreateOrderCommand command) {
    User customer = users.findByEmailIgnoreCase(email)
        .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado."));
    Order order = new Order(customer);
    Set<UUID> requested = new HashSet<>();
    for (OrderItemCommand item : command.items()) {
      if (!requested.add(item.variantId())) {
        throw new IllegalArgumentException("No repitas variantes en el mismo pedido.");
      }
      ProductVariant variant = variants.findById(item.variantId())
          .orElseThrow(() -> new NoSuchElementException("Variante no encontrada."));
      if (!variant.getProduct().isActive()) {
        throw new IllegalArgumentException("El producto ya no está disponible.");
      }
      variant.getInventory().sell(item.quantity());
      order.addDetail(variant, variant.getProduct().getName(), item.quantity(), variant.getPrice());
    }
    return toView(orders.save(order));
  }

  private OrderView toView(Order order) {
    List<OrderItemView> items = order.getDetails().stream()
        .map(detail -> new OrderItemView(detail.getVariant().getId(), detail.getProductName(),
            detail.getVariant().getSize(), detail.getVariant().getColor(),
            detail.getQuantity(), detail.getUnitPrice()))
        .toList();
    return new OrderView(order.getId(), order.getStatus().name(), order.getTotal(),
        order.getCreatedAt(), items);
  }

  public record CreateOrderCommand(List<OrderItemCommand> items, String paymentMethod,
      ShippingAddressCommand shippingAddress) {}
  public record OrderItemCommand(UUID variantId, int quantity) {}
  public record ShippingAddressCommand(String line1, String city, String country) {}
  public record OrderView(UUID id, String status, BigDecimal total, Instant createdAt, List<OrderItemView> items) {}
  public record OrderItemView(UUID variantId, String productName, String size, String color,
      int quantity, BigDecimal unitPrice) {}
}
