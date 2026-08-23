package com.vedant.ethosnutrition.controller;

import com.vedant.ethosnutrition.dto.ApiDtos.*;
import com.vedant.ethosnutrition.entity.*;
import com.vedant.ethosnutrition.security.JwtService;
import com.vedant.ethosnutrition.service.EthosService;
import jakarta.validation.Valid;
import java.time.*;
import java.util.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

class Base {

  final EthosService service;

  Base(EthosService s) {
    service = s;
  }

  String id(Authentication a) {
    return (String) a.getPrincipal();
  }
}

@RestController
@RequestMapping("/api/auth")
class AuthController extends Base {

  private final JwtService jwt;

  AuthController(EthosService s, JwtService j) {
    super(s);
    jwt = j;
  }

  @PostMapping("/register")
  @ResponseStatus(HttpStatus.CREATED)
  AuthResponse register(@Valid @RequestBody RegisterRequest r) {
    var u = service.register(r);
    return new AuthResponse(jwt.create(u.id(), u.email()), u);
  }

  @PostMapping("/login")
  AuthResponse login(@Valid @RequestBody LoginRequest r) {
    User u = service.authenticate(r);
    var profile = service.profile(u);
    return new AuthResponse(jwt.create(u.getId(), u.getEmail()), profile);
  }

  @GetMapping("/me")
  UserResponse me(Authentication a) {
    return service.profile(service.findUser(id(a)));
  }
}

@RestController
@RequestMapping("/api/foods")
class FoodController extends Base {

  FoodController(EthosService s) {
    super(s);
  }

  @GetMapping
  List<FoodResponse> all(
    @RequestParam(required = false) String query,
    @RequestParam(required = false) FoodCategory category
  ) {
    return service.listFoods(query, category);
  }

  @GetMapping("/{foodId}")
  FoodResponse one(@PathVariable String foodId) {
    return service.getFood(foodId);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  FoodResponse create(@Valid @RequestBody FoodRequest r) {
    return service.createFood(r);
  }

  @PutMapping("/{foodId}")
  FoodResponse update(
    @PathVariable String foodId,
    @Valid @RequestBody FoodRequest r
  ) {
    return service.updateFood(foodId, r);
  }

  @DeleteMapping("/{foodId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  void delete(@PathVariable String foodId) {
    service.deleteFood(foodId);
  }
}

@RestController
@RequestMapping("/api/meals")
class MealController extends Base {

  MealController(EthosService s) {
    super(s);
  }

  @GetMapping
  List<MealResponse> all(Authentication a) {
    return service.listMeals(id(a));
  }

  @GetMapping("/{mealId}")
  MealResponse one(Authentication a, @PathVariable String mealId) {
    return service.getMeal(id(a), mealId);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  MealResponse create(Authentication a, @Valid @RequestBody MealRequest r) {
    return service.createMeal(id(a), r);
  }

  @PutMapping("/{mealId}")
  MealResponse update(
    Authentication a,
    @PathVariable String mealId,
    @Valid @RequestBody MealRequest r
  ) {
    return service.updateMeal(id(a), mealId, r);
  }

  @DeleteMapping("/{mealId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  void delete(Authentication a, @PathVariable String mealId) {
    service.deleteMeal(id(a), mealId);
  }
}

@RestController
@RequestMapping("/api/planned-meals")
class PlannedMealController extends Base {

  PlannedMealController(EthosService s) {
    super(s);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  PlannedMealResponse create(
    Authentication a,
    @Valid @RequestBody PlannedMealRequest r
  ) {
    return service.createPlan(id(a), r);
  }

  @PutMapping("/{planId}")
  PlannedMealResponse update(
    Authentication a,
    @PathVariable String planId,
    @Valid @RequestBody PlannedMealRequest r
  ) {
    return service.updatePlan(id(a), planId, r);
  }

  @DeleteMapping("/{planId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  void delete(Authentication a, @PathVariable String planId) {
    service.deletePlan(id(a), planId);
  }
}

@RestController
@RequestMapping("/api/plans")
class PlanController extends Base {

  PlanController(EthosService s) {
    super(s);
  }

  @GetMapping("/week")
  List<PlannedMealResponse> week(
    Authentication a,
    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start
  ) {
    return service.week(id(a), start);
  }
}

@RestController
@RequestMapping("/api/food-logs")
class FoodLogController extends Base {

  FoodLogController(EthosService s) {
    super(s);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  FoodLogResponse create(
    Authentication a,
    @Valid @RequestBody FoodLogRequest r
  ) {
    return service.log(id(a), r);
  }
}

@RestController
@RequestMapping("/api/nutrition")
class NutritionController extends Base {

  NutritionController(EthosService s) {
    super(s);
  }

  @GetMapping("/daily")
  NutritionSummaryResponse daily(
    Authentication a,
    @RequestParam(required = false) @DateTimeFormat(
      iso = DateTimeFormat.ISO.DATE
    ) LocalDate date
  ) {
    return service.daily(id(a), date == null ? LocalDate.now() : date);
  }
}

@RestController
@RequestMapping("/api/profile")
class ProfileController extends Base {

  ProfileController(EthosService s) {
    super(s);
  }

  @GetMapping
  UserResponse profile(Authentication a) {
    return service.profile(service.findUser(id(a)));
  }

  @PutMapping
  UserResponse update(Authentication a, @Valid @RequestBody ProfileRequest r) {
    return service.updateProfile(id(a), r);
  }
}
