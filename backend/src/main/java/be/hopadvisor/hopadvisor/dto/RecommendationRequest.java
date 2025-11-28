package be.hopadvisor.hopadvisor.dto;

import jakarta.validation.constraints.NotBlank;

public class RecommendationRequest {

    @NotBlank(message = "Beschrijf even waar je zin in hebt (bijvoorbeeld= iets fruitig en hoppig).")
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
