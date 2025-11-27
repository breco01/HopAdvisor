package be.hopadvisor.hopadvisor.controller;

import be.hopadvisor.hopadvisor.dto.RecommendationRequest;
import be.hopadvisor.hopadvisor.dto.RecommendationResponse;
import be.hopadvisor.hopadvisor.service.RecommendationService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @PostMapping
    public RecommendationResponse getRecommendations(@Valid @RequestBody RecommendationRequest request){
        return recommendationService.getMockRecommendation(request.getPreferences());
    }
}
