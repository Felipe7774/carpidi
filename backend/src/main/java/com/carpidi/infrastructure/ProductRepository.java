package com.carpidi.infrastructure;
import com.carpidi.domain.Product; import java.util.*; import org.springframework.data.jpa.repository.JpaRepository;
public interface ProductRepository extends JpaRepository<Product, UUID> { }
