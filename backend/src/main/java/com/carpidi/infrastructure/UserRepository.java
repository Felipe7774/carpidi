package com.carpidi.infrastructure;
import com.carpidi.domain.User; import java.util.*; import org.springframework.data.jpa.repository.JpaRepository;
public interface UserRepository extends JpaRepository<User, UUID> { Optional<User> findByEmailIgnoreCase(String email); }
