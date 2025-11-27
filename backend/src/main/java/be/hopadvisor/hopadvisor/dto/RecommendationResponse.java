package be.hopadvisor.hopadvisor.dto;

import java.util.List;

public class RecommendationResponse {

    private List<BeerRecommendation> recommendations;

    public RecommendationResponse() {
    }

    public RecommendationResponse(List<BeerRecommendation> recommendations) {
        this.recommendations = recommendations;
    }

    public List<BeerRecommendation> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<BeerRecommendation> recommendations) {
        this.recommendations = recommendations;
    }
}
