package com.vedant.ethosnutrition.repository;

import com.vedant.ethosnutrition.entity.NutritionTarget;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NutritionTargetRepository
  extends JpaRepository<NutritionTarget, String> {
  Optional<NutritionTarget> findByUserId(String userId);
}
