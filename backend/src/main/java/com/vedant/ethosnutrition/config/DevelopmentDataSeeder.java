package com.vedant.ethosnutrition.config;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vedant.ethosnutrition.entity.*;
import com.vedant.ethosnutrition.repository.FoodRepository;
import java.io.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;

/** Imports versioned, documented food data additively. It never deletes or overwrites user data. */
@Configuration
class DevelopmentDataSeeder {

  @Bean
  CommandLineRunner seedIndianFoods(FoodRepository foods, ObjectMapper mapper) {
    return args -> {
      try (
        InputStream stream = getClass()
          .getResourceAsStream("/data/indian-foods.json")
      ) {
        if (stream == null) throw new IllegalStateException(
          "Missing Indian food seed file"
        );
        List<Seed> seeds = mapper.readValue(
          stream,
          new TypeReference<List<Seed>>() {}
        );
        List<Food> batch = new ArrayList<>(100);
        // Correct only malformed catalog rows created by the earlier development parser.
        // User-created food cannot match: the rows must carry both our INDB external-ID prefix
        // and the superseded source-reference signature.
        List<Food> malformed =
          foods.findByExternalIdStartingWithAndSourceReferenceContaining(
            "INDB-",
            "food code in sourceReference"
          );
        if (!malformed.isEmpty()) foods.deleteAll(malformed);
        // Core macro fields drive existing meal calculations. Records missing one are not
        // representable safely, so remove only a matching source-owned record if a prior
        // development import admitted it; never substitute a fabricated zero.
        for (Seed seed : seeds) if (!hasCompleteMacros(seed)) foods
          .findByExternalId(seed.externalId())
          .ifPresent(foods::delete);
        for (Seed seed : seeds) {
          if (
            foods.existsByExternalId(seed.externalId()) ||
            !hasCompleteMacros(seed)
          ) continue;
          batch.add(food(seed));
          if (batch.size() == 100) {
            foods.saveAll(batch);
            batch.clear();
          }
        }
        if (!batch.isEmpty()) foods.saveAll(batch);
      }
    };
  }

  private boolean hasCompleteMacros(Seed s) {
    return (
      s.kcal() != null &&
      s.protein() != null &&
      s.carbs() != null &&
      s.fat() != null &&
      s.fiber() != null
    );
  }

  private Food food(Seed s) {
    Food f = new Food();
    f.setExternalId(s.externalId());
    f.setName(s.name());
    f.setDisplayName(s.displayName());
    f.setCategory(FoodCategory.valueOf(s.category()));
    f.setFoodType(FoodType.valueOf(s.foodType()));
    f.setCuisine(Cuisine.valueOf(s.cuisine()));
    f.setFoodState(FoodState.valueOf(s.foodState()));
    f.setProcessingLevel(ProcessingLevel.valueOf(s.processingLevel()));
    f.setNutritionBasisUnit(NutritionBasisUnit.valueOf(s.basisUnit()));
    f.setNutritionBasisQuantity(b(s.basisQuantity()));
    f.setServingDefaultGrams(b(s.servingGrams()));
    f.setKcalPer100g(b(s.kcal()));
    f.setProteinPer100g(b(s.protein()));
    f.setCarbsPer100g(b(s.carbs()));
    f.setFatPer100g(b(s.fat()));
    f.setFiberPer100g(b(s.fiber()));
    f.setSaturatedFatG(b(s.saturatedFat()));
    f.setMonounsaturatedFatG(b(s.monounsaturatedFat()));
    f.setPolyunsaturatedFatG(b(s.polyunsaturatedFat()));
    f.setSugarsG(b(s.sugars()));
    f.setSodiumMg(b(s.sodium()));
    f.setCalciumMg(b(s.calcium()));
    f.setIronMg(b(s.iron()));
    f.setMagnesiumMg(b(s.magnesium()));
    f.setPotassiumMg(b(s.potassium()));
    f.setZincMg(b(s.zinc()));
    f.setVitaminA(b(s.vitaminA()));
    f.setVitaminC(b(s.vitaminC()));
    f.setVitaminD(b(s.vitaminD()));
    f.setFolate(b(s.folate()));
    f.setSourceType(SourceType.valueOf(s.sourceType()));
    f.setSource(s.source());
    f.setSourceReference(s.sourceReference());
    f.setDataConfidence(DataConfidence.valueOf(s.confidence()));
    f.setVerifiedAt(Instant.now());
    f.setSubtitle(s.subtitle());
    f.setIcon(s.icon());
    Set<String> seenAliases = new HashSet<>();
    seenAliases.add(normalize(s.name()));
    for (String name : s.aliases() == null ? List.<String>of() : s.aliases()) {
      if (seenAliases.add(normalize(name))) {
        FoodAlias a = new FoodAlias();
        a.setFood(f);
        a.setAlias(name.trim());
        f.getAliases().add(a);
      }
    }
    for (Serving seed : s.servings()) {
      FoodServing serving = new FoodServing();
      serving.setFood(f);
      serving.setLabel(seed.label());
      serving.setUnit(seed.unit());
      serving.setQuantityInGrams(b(seed.grams()));
      serving.setDefaultServing(seed.defaultServing());
      f.getServings().add(serving);
    }
    return f;
  }

  private String normalize(String value) {
    return value == null
      ? ""
      : value.trim().replaceAll("\\s+", " ").toLowerCase(Locale.ROOT);
  }

  private BigDecimal b(Double v) {
    return v == null ? null : BigDecimal.valueOf(v);
  }

  private record Seed(
    String externalId,
    String name,
    String displayName,
    String category,
    String foodType,
    String cuisine,
    String foodState,
    String processingLevel,
    String basisUnit,
    Double basisQuantity,
    Double servingGrams,
    Double kcal,
    Double protein,
    Double carbs,
    Double fat,
    Double fiber,
    Double saturatedFat,
    Double monounsaturatedFat,
    Double polyunsaturatedFat,
    Double sugars,
    Double sodium,
    Double calcium,
    Double iron,
    Double magnesium,
    Double potassium,
    Double zinc,
    Double vitaminA,
    Double vitaminC,
    Double vitaminD,
    Double folate,
    List<String> aliases,
    List<Serving> servings,
    String sourceType,
    String source,
    String sourceReference,
    String confidence,
    String subtitle,
    String icon
  ) {}

  private record Serving(
    String label,
    String unit,
    Double grams,
    @JsonProperty("default") boolean defaultServing
  ) {}
}
