package be.hopadvisor.hopadvisor.history;

import be.hopadvisor.hopadvisor.dto.BeerRecommendation;
import be.hopadvisor.hopadvisor.user.CurrentUserService;
import be.hopadvisor.hopadvisor.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.ObjectMapper;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final CurrentUserService currentUserService;
    private final SearchHistoryRepository searchHistoryRepository;
    private final ObjectMapper objectMapper;

    public HistoryController(CurrentUserService currentUserService, SearchHistoryRepository searchHistoryRepository, ObjectMapper objectMapper) {
        this.currentUserService = currentUserService;
        this.searchHistoryRepository = searchHistoryRepository;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Map<String, Object>> getHistory(){
        User user = currentUserService.getCurrenUser()
                .orElseThrow(() -> new IllegalStateException("Niet ingelogd."));

        List<SearchHistory> history = searchHistoryRepository
                .findTop10ByUserOrderByCreatedAtDesc(user);

        DateTimeFormatter formatter = DateTimeFormatter
                .ofPattern("dd-MM-yyyy HH:mm")
                .withZone(ZoneId.systemDefault());

        return history.stream()
                .map(h -> {
                    List<BeerRecommendation> recommendations;
                    try {
                        BeerRecommendation[] arr = objectMapper.readValue(
                                h.getRecommendationsJson(),
                                BeerRecommendation[].class
                        );
                        recommendations = Arrays.asList(arr);
                    } catch (Exception e) {
                        recommendations = List.of();
                    }

                    return Map.<String, Object>of(
                            "id", h.getId(),
                            "preferences", h.getPreferences(),
                            "recommendationCount", h.getRecommendationCount(),
                            "createdAt", formatter.format(h.getCreatedAt()),
                            "recommendations", recommendations
                    );
                })
                .toList();
    }
}
