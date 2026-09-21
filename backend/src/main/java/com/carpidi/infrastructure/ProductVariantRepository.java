package com.carpidi.infrastructure;

import com.carpidi.domain.ProductVariant;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, UUID> {
  boolean existsBySkuIgnoreCase(String sku);
}
