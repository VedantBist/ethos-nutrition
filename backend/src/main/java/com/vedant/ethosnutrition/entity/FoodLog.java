package com.vedant.ethosnutrition.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.*;

@Entity
public class FoodLog {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(nullable = false)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  private Food food;

  @ManyToOne(fetch = FetchType.LAZY)
  private Meal meal;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal quantityGrams;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private MealType mealType;

  @Column(nullable = false)
  private Instant loggedAt;

  @PrePersist
  void create() {
    if (loggedAt == null) loggedAt = Instant.now();
  }

  public String getId() {
    return id;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User v) {
    user = v;
  }

  public Food getFood() {
    return food;
  }

  public void setFood(Food v) {
    food = v;
  }

  public Meal getMeal() {
    return meal;
  }

  public void setMeal(Meal v) {
    meal = v;
  }

  public BigDecimal getQuantityGrams() {
    return quantityGrams;
  }

  public void setQuantityGrams(BigDecimal v) {
    quantityGrams = v;
  }

  public MealType getMealType() {
    return mealType;
  }

  public void setMealType(MealType v) {
    mealType = v;
  }

  public Instant getLoggedAt() {
    return loggedAt;
  }

  public void setLoggedAt(Instant v) {
    loggedAt = v;
  }
}
