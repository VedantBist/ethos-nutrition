package com.vedant.ethosnutrition.exception;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.*;
import org.springframework.http.*;
import org.springframework.web.bind.*;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class ApiExceptionHandler {

  record Error(
    Instant timestamp,
    int status,
    String error,
    String message,
    String path
  ) {}

  private Error error(
    HttpStatus s,
    String code,
    String message,
    HttpServletRequest r
  ) {
    return new Error(
      Instant.now(),
      s.value(),
      code,
      message,
      r.getRequestURI()
    );
  }

  @ExceptionHandler(NotFound.class)
  ResponseEntity<Error> missing(NotFound e, HttpServletRequest r) {
    return ResponseEntity.status(404).body(
      error(HttpStatus.NOT_FOUND, "RESOURCE_NOT_FOUND", e.getMessage(), r)
    );
  }

  @ExceptionHandler({ BadRequest.class, MethodArgumentNotValidException.class })
  ResponseEntity<Error> invalid(Exception e, HttpServletRequest r) {
    String msg = e instanceof MethodArgumentNotValidException v
      ? v
        .getBindingResult()
        .getFieldErrors()
        .stream()
        .findFirst()
        .map(x -> x.getField() + " " + x.getDefaultMessage())
        .orElse("Invalid request")
      : e.getMessage();
    return ResponseEntity.badRequest()
      .body(error(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", msg, r));
  }

  @ExceptionHandler(Exception.class)
  ResponseEntity<Error> unexpected(Exception e, HttpServletRequest r) {
    return ResponseEntity.status(500).body(
      error(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "INTERNAL_ERROR",
        "An unexpected error occurred",
        r
      )
    );
  }

  public static class NotFound extends RuntimeException {

    public NotFound(String m) {
      super(m);
    }
  }

  public static class BadRequest extends RuntimeException {

    public BadRequest(String m) {
      super(m);
    }
  }
}
