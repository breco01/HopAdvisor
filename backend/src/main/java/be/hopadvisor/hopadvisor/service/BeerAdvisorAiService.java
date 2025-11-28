package be.hopadvisor.hopadvisor.service;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

public interface BeerAdvisorAiService {

    @SystemMessage("""
            Je bent een Belgische biersommelier.
            Je geeft bieraanbevelingen op basis van voorkeuren van de gebruiker.
            Antwoord altijd in het Nederlands.
            """)
    @UserMessage("""
            De gebruiker geeft deze voorkeuren voor bier:
            {{it}}
            
            Geef een korte, vlot leesbare tekst (max. 5 zinnen) waarin je drie concrete bieren aanbeveelt
            en kort uitlegt waarom ze passen bij deze voorkeur.
            """)
    String generateRecommendationsText(String preferences);
}
