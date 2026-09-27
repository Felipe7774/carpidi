package com.carpidi.api;

import com.carpidi.application.OrderService;
import com.carpidi.application.OrderService.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.net.URI;
import java.security.Principal;
import java.util.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
public class OrderController {
  private final OrderService orderService;

  public OrderController(OrderService orderService) {
    this.orderService = orderService;
  }

  @GetMapping
  @PreAuthorize("hasAnyRole('CLIENT','ADMIN')")
  public List<OrderView> list(Principal principal) {
    return orderService.listFor(principal.getName());
  }

  @PostMapping
  @PreAuthorize("hasRole('CLIENT')")
  public ResponseEntity<OrderView> create(Principal principal, @Valid @RequestBody CreateOrderRequest request) {
    OrderView response = orderService.create(principal.getName(), request.toCommand());
    return ResponseEntity.created(URI.create("/api/v1/orders/" + response.id())).body(response);
  }

  public record CreateOrderRequest(@NotEmpty List<@Valid Item> items,
      @NotBlank String paymentMethod, @NotNull @Valid Address shippingAddress) {
    CreateOrderCommand toCommand() {
      return new CreateOrderCommand(items.stream()
          .map(item -> new OrderItemCommand(UUID.fromString(item.variantId()), item.quantity()))
          .toList(), paymentMethod, new ShippingAddressCommand(shippingAddress.line1(),
          shippingAddress.city(), shippingAddress.country()));
    }
  }

  public record Item(@NotBlank String variantId, @Min(1) int quantity) {}
  public record Address(@NotBlank String line1, @NotBlank String city, @NotBlank String country) {}
}
