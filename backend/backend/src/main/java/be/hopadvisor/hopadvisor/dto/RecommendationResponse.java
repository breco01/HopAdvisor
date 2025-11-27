package be.hopadvisor.hopadvisor.dto;

import java.util.List;

public class RecommendationResponse {

    private List<BeerRecommendation> recommendations;

    public RecommendationResponse() {
    }

    public RecommendationResponse(List<BeerRecommendation> recommendations) {
        this.recommendations = recommendations;
    }
}
