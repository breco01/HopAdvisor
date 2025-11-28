package be.hopadvisor.hopadvisor.config;

import be.hopadvisor.hopadvisor.service.BeerAdvisorAiService;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiConfig {

    @Value("${hopadvisor.openai.api-key:}")
    private String openAiApiKey;

    @Value("${hopadvisor.openai.model:gpt-4o-mini}")
    private String modelName;

    @Value("${hopadvisor.openai.temperature:0.7}")
    private double temperature;

    @Bean
    public ChatLanguageModel chatLanguageModel(){
        if(openAiApiKey == null || openAiApiKey.isBlank()){
            // Geen API-key  -->  runtime-exception
            throw new IllegalStateException(
                    "OPENAI_API_KEY is niet gezet. Stel deze in als omgevingsvariabele om AI-aanbevelingen te gebruiken."
            );
        }

        return OpenAiChatModel.builder()
                .apiKey(openAiApiKey)
                .modelName(modelName)
                .temperature(temperature)
                .build();
    }

    @Bean
    public BeerAdvisorAiService beerAdvisorAiService(ChatLanguageModel chatLanguageModel){
        return AiServices.create(BeerAdvisorAiService.class, chatLanguageModel);
    }

}
