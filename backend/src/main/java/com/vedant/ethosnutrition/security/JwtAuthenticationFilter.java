package com.vedant.ethosnutrition.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtService jwt;

  public JwtAuthenticationFilter(JwtService jwt) {
    this.jwt = jwt;
  }

  @Override
  protected void doFilterInternal(
    HttpServletRequest req,
    HttpServletResponse res,
    FilterChain chain
  ) throws ServletException, java.io.IOException {
    String h = req.getHeader("Authorization");
    if (h != null && h.startsWith("Bearer ")) try {
      String id = jwt.subject(h.substring(7));
      var auth = new UsernamePasswordAuthenticationToken(
        id,
        null,
        java.util.List.of()
      );
      auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
      SecurityContextHolder.getContext().setAuthentication(auth);
    } catch (JwtException ignored) {}
    chain.doFilter(req, res);
  }
}
