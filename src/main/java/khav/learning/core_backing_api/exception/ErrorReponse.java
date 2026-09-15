package khav.learning.core_backing_api.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
public class ErrorReponse {
    private HttpStatus  status;
    private String message;
}