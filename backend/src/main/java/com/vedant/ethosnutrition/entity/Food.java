package com.vedant.ethosnutrition.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;

@Entity
@Table(
  indexes = {
    @Index(name = "idx_food_name", columnList = "name"),
    @Index(name = "idx_food_category", columnList = "category"),
    @Index(name = "idx_food_type", columnList = "foodType"),
    @Index(name = "idx_food_cuisine", columnList = "cuisine"),
  }
)
public class Food {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @Column(nullable = false, length = 300)
  private String name;

  @Column(length = 300)
  private String displayName;

  @Column(unique = true, length = 80)
  private String externalId;

  @Convert(converter = FoodCategoryConverter.class)
  @Column(length = 40)
  private FoodCategory category = FoodCategory.OTHER;

  private String subtitle;

  @Enumerated(EnumType.STRING)
  @Column(length = 30)
  private FoodType foodType = FoodType.VEGETARIAN;

  @Enumerated(EnumType.STRING)
  @Column(length = 30)
  private Cuisine cuisine = Cuisine.PAN_INDIAN;

  @Enumerated(EnumType.STRING)
  @Column(length = 20)
  private FoodState foodState = FoodState.RAW;

  @Enumerated(EnumType.STRING)
  @Column(length = 20)
  private ProcessingLevel processingLevel = ProcessingLevel.WHOLE_FOOD;

  @Enumerated(EnumType.STRING)
  @Column(length = 20)
  private NutritionBasisUnit nutritionBasisUnit = NutritionBasisUnit.GRAM;

  @Column(precision = 10, scale = 2)
  private BigDecimal nutritionBasisQuantity = BigDecimal.valueOf(100);

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal servingDefaultGrams;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal kcalPer100g;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal proteinPer100g;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal carbsPer100g;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal fatPer100g;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal fiberPer100g;

  @Column(precision = 10, scale = 2)
  private BigDecimal saturatedFatG, monounsaturatedFatG, polyunsaturatedFatG, sugarsG, sodiumMg, calciumMg, ironMg, magnesiumMg, potassiumMg, zincMg, vitaminA, vitaminC, vitaminD, vitaminB12, folate;

  @Enumerated(EnumType.STRING)
  @Column(length = 30)
  private SourceType sourceType = SourceType.ESTIMATED;

  @Column(length = 300)
  private String source;

  @Column(length = 1000)
  private String sourceReference;

  @Enumerated(EnumType.STRING)
  @Column(length = 20)
  private DataConfidence dataConfidence = DataConfidence.LOW;

  private Instant verifiedAt;
  private String icon;

  @Column(length = 2000)
  private String image;

  @Column(length = 3000)
  private String description;

  private Instant createdAt;
  private Instant updatedAt;

  @OneToMany(mappedBy = "food", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<FoodAlias> aliases = new LinkedHashSet<>();

  @OneToMany(mappedBy = "food", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<FoodServing> servings = new LinkedHashSet<>();

  @PrePersist
  void create() {
    createdAt = updatedAt = Instant.now();
  }

  @PreUpdate
  void update() {
    updatedAt = Instant.now();
  }

  public String getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public void setName(String v) {
    name = v;
  }

  public String getDisplayName() {
    return displayName;
  }

  public void setDisplayName(String v) {
    displayName = v;
  }

  public String getExternalId() {
    return externalId;
  }

  public void setExternalId(String v) {
    externalId = v;
  }

  public FoodCategory getCategory() {
    return category == null ? FoodCategory.OTHER : category;
  }

  public void setCategory(FoodCategory v) {
    category = v;
  }

  public String getSubtitle() {
    return subtitle;
  }

  public void setSubtitle(String v) {
    subtitle = v;
  }

  public FoodType getFoodType() {
    return foodType == null ? FoodType.VEGETARIAN : foodType;
  }

  public void setFoodType(FoodType v) {
    foodType = v;
  }

  public Cuisine getCuisine() {
    return cuisine == null ? Cuisine.PAN_INDIAN : cuisine;
  }

  public void setCuisine(Cuisine v) {
    cuisine = v;
  }

  public FoodState getFoodState() {
    return foodState == null ? FoodState.RAW : foodState;
  }

  public void setFoodState(FoodState v) {
    foodState = v;
  }

  public ProcessingLevel getProcessingLevel() {
    return processingLevel == null
      ? ProcessingLevel.WHOLE_FOOD
      : processingLevel;
  }

  public void setProcessingLevel(ProcessingLevel v) {
    processingLevel = v;
  }

  public NutritionBasisUnit getNutritionBasisUnit() {
    return nutritionBasisUnit == null
      ? NutritionBasisUnit.GRAM
      : nutritionBasisUnit;
  }

  public void setNutritionBasisUnit(NutritionBasisUnit v) {
    nutritionBasisUnit = v;
  }

  public BigDecimal getNutritionBasisQuantity() {
    return nutritionBasisQuantity == null
      ? BigDecimal.valueOf(100)
      : nutritionBasisQuantity;
  }

  public void setNutritionBasisQuantity(BigDecimal v) {
    nutritionBasisQuantity = v;
  }

  public BigDecimal getServingDefaultGrams() {
    return servingDefaultGrams;
  }

  public void setServingDefaultGrams(BigDecimal v) {
    servingDefaultGrams = v;
  }

  public BigDecimal getKcalPer100g() {
    return kcalPer100g;
  }

  public void setKcalPer100g(BigDecimal v) {
    kcalPer100g = v;
  }

  public BigDecimal getProteinPer100g() {
    return proteinPer100g;
  }

  public void setProteinPer100g(BigDecimal v) {
    proteinPer100g = v;
  }

  public BigDecimal getCarbsPer100g() {
    return carbsPer100g;
  }

  public void setCarbsPer100g(BigDecimal v) {
    carbsPer100g = v;
  }

  public BigDecimal getFatPer100g() {
    return fatPer100g;
  }

  public void setFatPer100g(BigDecimal v) {
    fatPer100g = v;
  }

  public BigDecimal getFiberPer100g() {
    return fiberPer100g;
  }

  public void setFiberPer100g(BigDecimal v) {
    fiberPer100g = v;
  }

  public BigDecimal getSaturatedFatG() {
    return saturatedFatG;
  }

  public void setSaturatedFatG(BigDecimal v) {
    saturatedFatG = v;
  }

  public BigDecimal getMonounsaturatedFatG() {
    return monounsaturatedFatG;
  }

  public void setMonounsaturatedFatG(BigDecimal v) {
    monounsaturatedFatG = v;
  }

  public BigDecimal getPolyunsaturatedFatG() {
    return polyunsaturatedFatG;
  }

  public void setPolyunsaturatedFatG(BigDecimal v) {
    polyunsaturatedFatG = v;
  }

  public BigDecimal getSugarsG() {
    return sugarsG;
  }

  public void setSugarsG(BigDecimal v) {
    sugarsG = v;
  }

  public BigDecimal getSodiumMg() {
    return sodiumMg;
  }

  public void setSodiumMg(BigDecimal v) {
    sodiumMg = v;
  }

  public BigDecimal getCalciumMg() {
    return calciumMg;
  }

  public void setCalciumMg(BigDecimal v) {
    calciumMg = v;
  }

  public BigDecimal getIronMg() {
    return ironMg;
  }

  public void setIronMg(BigDecimal v) {
    ironMg = v;
  }

  public BigDecimal getMagnesiumMg() {
    return magnesiumMg;
  }

  public void setMagnesiumMg(BigDecimal v) {
    magnesiumMg = v;
  }

  public BigDecimal getPotassiumMg() {
    return potassiumMg;
  }

  public void setPotassiumMg(BigDecimal v) {
    potassiumMg = v;
  }

  public BigDecimal getZincMg() {
    return zincMg;
  }

  public void setZincMg(BigDecimal v) {
    zincMg = v;
  }

  public BigDecimal getVitaminA() {
    return vitaminA;
  }

  public void setVitaminA(BigDecimal v) {
    vitaminA = v;
  }

  public BigDecimal getVitaminC() {
    return vitaminC;
  }

  public void setVitaminC(BigDecimal v) {
    vitaminC = v;
  }

  public BigDecimal getVitaminD() {
    return vitaminD;
  }

  public void setVitaminD(BigDecimal v) {
    vitaminD = v;
  }

  public BigDecimal getVitaminB12() {
    return vitaminB12;
  }

  public void setVitaminB12(BigDecimal v) {
    vitaminB12 = v;
  }

  public BigDecimal getFolate() {
    return folate;
  }

  public void setFolate(BigDecimal v) {
    folate = v;
  }

  public SourceType getSourceType() {
    return sourceType == null ? SourceType.ESTIMATED : sourceType;
  }

  public void setSourceType(SourceType v) {
    sourceType = v;
  }

  public String getSource() {
    return source;
  }

  public void setSource(String v) {
    source = v;
  }

  public String getSourceReference() {
    return sourceReference;
  }

  public void setSourceReference(String v) {
    sourceReference = v;
  }

  public DataConfidence getDataConfidence() {
    return dataConfidence == null ? DataConfidence.LOW : dataConfidence;
  }

  public void setDataConfidence(DataConfidence v) {
    dataConfidence = v;
  }

  public Instant getVerifiedAt() {
    return verifiedAt;
  }

  public void setVerifiedAt(Instant v) {
    verifiedAt = v;
  }

  public String getIcon() {
    return icon;
  }

  public void setIcon(String v) {
    icon = v;
  }

  public String getImage() {
    return image;
  }

  public void setImage(String v) {
    image = v;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String v) {
    description = v;
  }

  public Set<FoodAlias> getAliases() {
    return aliases;
  }

  public Set<FoodServing> getServings() {
    return servings;
  }
}
