package com.vedant.ethosnutrition.entity;

import jakarta.persistence.*;
import java.time.*;

@Entity
public class PlannedMeal {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(nullable = false)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(nullable = false)
  private Meal meal;

  @Column(nullable = false)
  private LocalDate plannedDate;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private MealType mealType;

  public String getId() {
    return id;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User v) {
    user = v;
  }

  public Meal getMeal() {
    return meal;
  }

  public void setMeal(Meal v) {
    meal = v;
  }

  public LocalDate getPlannedDate() {
    return plannedDate;
  }

  public void setPlannedDate(LocalDate v) {
    plannedDate = v;
  }

  public MealType getMealType() {
    return mealType;
  }

  public void setMealType(MealType v) {
    mealType = v;
  }
}
