package com.vedant.ethosnutrition.repository;

import com.vedant.ethosnutrition.entity.User;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
  Optional<User> findByEmail(String email);
  boolean existsByEmail(String email);
}
