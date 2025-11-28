package be.hopadvisor.hopadvisor.dto;

import java.util.List;

public class ErrorResponse {

    private String error;
    private String message;
    private List<String> details;

    public ErrorResponse() {
    }

    public ErrorResponse(String error, String message, List<String> details) {
        this.error = error;
        this.message = message;
        this.details = details;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<String> getDetails() {
        return details;
    }

    public void setDetails(List<String> details) {
        this.details = details;
    }
}
