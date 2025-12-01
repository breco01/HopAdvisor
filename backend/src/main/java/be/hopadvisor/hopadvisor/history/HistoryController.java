package be.hopadvisor.hopadvisor.history;

import be.hopadvisor.hopadvisor.user.CurrentUserService;
import be.hopadvisor.hopadvisor.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final CurrentUserService currentUserService;
    private final SearchHistoryRepository searchHistoryRepository;

    public HistoryController(CurrentUserService currentUserService, SearchHistoryRepository searchHistoryRepository) {
        this.currentUserService = currentUserService;
        this.searchHistoryRepository = searchHistoryRepository;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Map<String, Object>> getHistory(){
        User user = currentUserService.getCurrenUser()
                .orElseThrow(() -> new IllegalStateException("Niet ingelogd."));

        List<SearchHistory> history = searchHistoryRepository
                .findTop10ByUserOrderByCreatedAtDesc(user);

        DateTimeFormatter formatter = DateTimeFormatter
                .ofPattern("yyyy-MM-dd HH:mm")
                .withZone(ZoneId.systemDefault());

        return history.stream()
                .map(h -> Map.<String, Object>of(
                        "id", h.getId(),
                        "preferences", h.getPreferences(),
                        "recommendationCount", h.getRecommendationCount(),
                        "createdAt", formatter.format(h.getCreatedAt())
                ))
                .toList();
    }
}
