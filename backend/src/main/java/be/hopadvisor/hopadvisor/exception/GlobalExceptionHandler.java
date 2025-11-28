package be.hopadvisor.hopadvisor.exception;

import be.hopadvisor.hopadvisor.dto.ErrorResponse;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidationException(MethodArgumentNotValidException ex) {
        List<String> details = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .toList();

        String message = details.isEmpty()
                ? "Ongeldige invoer."
                : details.get(0);

        return new ErrorResponse(
                "VALIDATION_ERROR",
                message,
                details
        );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleInvalidJson(HttpMessageNotReadableException ex) {
        return new ErrorResponse(
                "INVALID_JSON",
                "De server kon je aanvraag niet lezen. Controleer of je verzoek correct is opgebouwd.",
                List.of(ex.getMostSpecificCause().getMessage())
        );
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleGenericException(Exception ex) {
        return new ErrorResponse(
                "INTERNAL_SERVER_ERROR",
                "Er ging iets mis aan de serverkant. Probeer het later opnieuw.",
                List.of(ex.getMessage())
        );
    }
}
