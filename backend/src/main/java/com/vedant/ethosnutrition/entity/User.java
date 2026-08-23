package com.vedant.ethosnutrition.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(
  name = "users",
  uniqueConstraints = @UniqueConstraint(columnNames = "email")
)
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String passwordHash;

  private Integer age;
  private String gender;
  private String height;
  private String weight;
  private String activityLevel;

  @Column(nullable = false)
  private String units = "Metric";

  @Column(nullable = false)
  private boolean notifications = true;

  private String avatarUrl;

  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  @Column(nullable = false)
  private Instant updatedAt;

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

  public String getEmail() {
    return email;
  }

  public void setEmail(String v) {
    email = v.toLowerCase();
  }

  public String getPasswordHash() {
    return passwordHash;
  }

  public void setPasswordHash(String v) {
    passwordHash = v;
  }

  public Integer getAge() {
    return age;
  }

  public void setAge(Integer v) {
    age = v;
  }

  public String getGender() {
    return gender;
  }

  public void setGender(String v) {
    gender = v;
  }

  public String getHeight() {
    return height;
  }

  public void setHeight(String v) {
    height = v;
  }

  public String getWeight() {
    return weight;
  }

  public void setWeight(String v) {
    weight = v;
  }

  public String getActivityLevel() {
    return activityLevel;
  }

  public void setActivityLevel(String v) {
    activityLevel = v;
  }

  public String getUnits() {
    return units;
  }

  public void setUnits(String v) {
    units = v;
  }

  public boolean isNotifications() {
    return notifications;
  }

  public void setNotifications(boolean v) {
    notifications = v;
  }

  public String getAvatarUrl() {
    return avatarUrl;
  }

  public void setAvatarUrl(String v) {
    avatarUrl = v;
  }
}
