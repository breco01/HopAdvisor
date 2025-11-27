package be.hopadvisor.hopadvisor.dto;

import jakarta.validation.constraints.NotBlank;

public class RecommendationRequest {

    @NotBlank(message = "Voorkeur mag niet leeg zijn.")
    private String preferences;

    public RecommendationRequest(){
    }

    public RecommendationRequest(String preferences){
        this.preferences = preferences;
    }

    public String getPreferences() {
        return preferences;
    }

    public void setPreferences(String preferences) {
        this.preferences = preferences;
    }
}
