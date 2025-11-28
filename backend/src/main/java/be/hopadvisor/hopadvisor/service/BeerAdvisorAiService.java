package be.hopadvisor.hopadvisor.service;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

public interface BeerAdvisorAiService {

    @SystemMessage("""
            Je bent een Belgische biersommelier.
            Je geeft bieraanbevelingen op basis van voorkeuren van de gebruiker.
            Antwoord altijd in het Nederlands.
            Geef ALTIJD geldig JSON terug volgens de gevraagde structuur.
            """)
    @UserMessage("""
            De gebruiker geeft deze voorkeuren voor bier:
            {{it}}
            
            Geef EXACT de volgende JSON-structuur terug, zonder extra tekst ervoor of erna:
            {
              "recommendations": [
                {
                  "name": "NAAM VAN HET BIER",
                  "style": "STIJL VAN HET BIER",
                  "description": "KORTE NEDERLANDSTALIGE BESCHRIJVING WAAROM DIT BIER PAST"
                },
                {
                  "name": "...",
                  "style": "...",
                  "description": "..."
                },
                {
                  "name": "...",
                  "style": "...",
                  "description": "..."
                }
              ]
            }
            """)
    String generateRecommendationsJson(String preferences);
}
