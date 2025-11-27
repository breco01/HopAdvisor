package be.hopadvisor.hopadvisor.service;

import be.hopadvisor.hopadvisor.dto.BeerRecommendation;
import be.hopadvisor.hopadvisor.dto.RecommendationResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecommendationService {

    public RecommendationResponse getMockRecommendation(String preferences){
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