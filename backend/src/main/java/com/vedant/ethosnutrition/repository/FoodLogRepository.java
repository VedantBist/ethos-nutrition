package com.vedant.ethosnutrition.repository;

import com.vedant.ethosnutrition.entity.FoodLog;
import java.time.*;
import java.util.*;
import org.springframework.data.jpa.repository.*;

public interface FoodLogRepository extends JpaRepository<FoodLog, String> {
  @EntityGraph(
    attributePaths = {
      "food", "meal", "meal.ingredients", "meal.ingredients.food",
    }
  )
  List<FoodLog> findByUserIdAndLoggedAtBetweenOrderByLoggedAtDesc(
    String userId,
    Instant start,
    Instant end
  );
}
