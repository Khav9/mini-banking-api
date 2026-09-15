package khav.learning.core_backing_api.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<?> handleApiException(ApiException e) {
        ErrorReponse errorReponse = new ErrorReponse(e.getStatus(), e.getMessage());
        return ResponseEntity.status(e.getStatus()).body(errorReponse);

    }
}
