package com.vedant.ethosnutrition.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
public class NutritionTarget {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(nullable = false, unique = true)
  private User user;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal dailyCalories;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal dailyProtein;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal dailyCarbohydrates;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal dailyFat;

  public String getId() {
    return id;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User v) {
    user = v;
  }

  public BigDecimal getDailyCalories() {
    return dailyCalories;
  }

  public void setDailyCalories(BigDecimal v) {
    dailyCalories = v;
  }

  public BigDecimal getDailyProtein() {
    return dailyProtein;
  }

  public void setDailyProtein(BigDecimal v) {
    dailyProtein = v;
  }

  public BigDecimal getDailyCarbohydrates() {
    return dailyCarbohydrates;
  }

  public void setDailyCarbohydrates(BigDecimal v) {
    dailyCarbohydrates = v;
  }

  public BigDecimal getDailyFat() {
    return dailyFat;
  }

  public void setDailyFat(BigDecimal v) {
    dailyFat = v;
  }
}
