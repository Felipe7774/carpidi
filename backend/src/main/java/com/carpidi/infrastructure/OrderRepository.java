package com.carpidi.infrastructure;

import com.carpidi.domain.Order;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, UUID> {
  List<Order> findAllByCustomerEmailIgnoreCaseOrderByCreatedAtDesc(String email);
}
