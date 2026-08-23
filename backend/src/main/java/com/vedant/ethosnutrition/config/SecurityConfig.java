package com.vedant.ethosnutrition.config;

import com.vedant.ethosnutrition.security.JwtAuthenticationFilter;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

@Configuration
public class SecurityConfig {

  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  CorsConfigurationSource cors(@Value("${app.cors-origin}") String origin) {
    var c = new CorsConfiguration();
    // The UI is commonly run on either Vite port. Keep the configured origin
    // too, while explicitly allowing localhost/127.0.0.1 so the response
    // always contains Access-Control-Allow-Origin for browser requests.
    var allowedOrigins = new LinkedHashSet<String>(
      List.of(
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001"
      )
    );
    if (origin != null && !origin.isBlank()) {
      allowedOrigins.add(origin.trim());
    }
    c.setAllowedOrigins(new ArrayList<>(allowedOrigins));
    c.setAllowedMethods(
      List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
    );
    c.setAllowedHeaders(List.of("*"));
    c.setAllowCredentials(false);
    var s = new UrlBasedCorsConfigurationSource();
    s.registerCorsConfiguration("/**", c);
    return s;
  }

  @Bean
  SecurityFilterChain security(
    HttpSecurity http,
    JwtAuthenticationFilter filter
  ) throws Exception {
    return http
      .csrf(c -> c.disable())
      .cors(c -> {})
      .sessionManagement(s ->
        s.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      )
      .authorizeHttpRequests(a ->
        a
          .requestMatchers(HttpMethod.OPTIONS, "/**")
          .permitAll()
          .requestMatchers("/api/auth/**")
          .permitAll()
          .requestMatchers(HttpMethod.GET, "/api/foods/**")
          .permitAll()
          .anyRequest()
          .authenticated()
      )
      .addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class)
      .build();
  }
}
