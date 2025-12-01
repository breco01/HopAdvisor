package be.hopadvisor.hopadvisor.service;

import be.hopadvisor.hopadvisor.dto.BeerRecommendation;
import be.hopadvisor.hopadvisor.dto.RecommendationResponse;
import be.hopadvisor.hopadvisor.history.SearchHistory;
import be.hopadvisor.hopadvisor.history.SearchHistoryRepository;
import be.hopadvisor.hopadvisor.user.CurrentUserService;
import be.hopadvisor.hopadvisor.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Optional;

@Service
public class RecommendationService {

    private final BeerAdvisorAiService beerAdvisorAiService;
    private final boolean aiEnabled;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final CurrentUserService currentUserService;
    private final SearchHistoryRepository searchHistoryRepository;

    public RecommendationService(
            BeerAdvisorAiService beerAdvisorAiService,
            @Value("${hopadvisor.ai.enabled:true}") boolean aiEnabled,
            CurrentUserService currentUserService,
            SearchHistoryRepository searchHistoryRepository
    ) {
        this.beerAdvisorAiService = beerAdvisorAiService;
        this.aiEnabled = aiEnabled;
        this.currentUserService = currentUserService;
        this.searchHistoryRepository = searchHistoryRepository;
    }

    public RecommendationResponse getRecommendations(String preferences) {
        RecommendationResponse response;

        if(!aiEnabled){
            response = getMockRecommendation(preferences);
        } else {
            try {
                String json = beerAdvisorAiService.generateRecommendationsJson(preferences);

                RecommendationResponse aiResponse =
                        objectMapper.readValue(json, RecommendationResponse.class);

                List<BeerRecommendation> recs = aiResponse.getRecommendations();

                if (recs == null || recs.isEmpty()) {
                    response = getMockRecommendation(preferences);
                } else {
                    response = aiResponse;
                }
            } catch (Exception ex) {
                response = getMockRecommendation(preferences);
            }
        }
        logHistory(preferences, response);

        return response;
    }

    private void logHistory(String preferences, RecommendationResponse response) {
        Optional<User> userOpt = currentUserService.getCurrenUser();
        if(userOpt.isEmpty()){
            return; //Anonymous user --> no history
        }

        int count = response.getRecommendations() != null
                ? response.getRecommendations().size()
                : 0;

        SearchHistory history = new SearchHistory(
                userOpt.get(),
                preferences,
                count
        );

        searchHistoryRepository.save(history);
    }

    public RecommendationResponse getMockRecommendation(String preferences) {
        List<BeerRecommendation> beers = List.of(
                new BeerRecommendation(
                        "Stella Artois",
                        "Pils",
                        "Een klassieke Belgische pils met een frisse, licht bittere smaak en een zachte afdronk."
                ),
                new BeerRecommendation(
                        "La Chouffe",
                        "Blond",
                        "Een sterk blond bier met fruitige tonen en een subtiele kruidigheid dankzij de typische Chouffe-gist."
                ),
                new BeerRecommendation(
                        "Cherry Chouffe",
                        "Kriek",
                        "Een robijnrood bier met een zoetzure kersensmaak gecombineerd met het kruidige karakter van La Chouffe."
                ),
                new BeerRecommendation(
                        "Vedett Extra White",
                        "Witbier",
                        "Een verfrissend witbier met citrus, koriander en een zachte, licht romige afdronk."
                ),
                new BeerRecommendation(
                        "Geuze Boon",
                        "Geuze",
                        "Een traditionele lambiekblend met een droge, zurige smaak en complexe wilde vergistingsaroma's."
                ),
                new BeerRecommendation(
                        "Chimay Bleu",
                        "Quadrupel",
                        "Een rijk en donker trappistenbier met toetsen van karamel, gedroogd fruit en een verwarmende afdronk."
                ),
                new BeerRecommendation(
                        "Duvel",
                        "Sterk Blond",
                        "Een iconisch Belgisch blond bier met een droge smaak, hoge carbonatie en uitgesproken hoppigheid."
                ),
                new BeerRecommendation(
                        "Westmalle Tripel",
                        "Tripel",
                        "Een zachte maar complexe tripel met fruitige aroma’s, fijne bitterheid en een lange afdronk."
                ),
                new BeerRecommendation(
                        "Jupiler",
                        "Pils",
                        "Een lichte, frisse pils met een zachte moutbasis en een subtiele bittere touch."
                ),
                new BeerRecommendation(
                        "Leffe Blond",
                        "Blond",
                        "Een toegankelijk blond abdijbier met honingachtige toetsen en een licht kruidige smaak."
                )
        );

        return new RecommendationResponse(beers);
    }
}