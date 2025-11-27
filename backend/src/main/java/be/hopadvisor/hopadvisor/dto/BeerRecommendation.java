package be.hopadvisor.hopadvisor.dto;

public class BeerRecommendation {

    private String name;
    private String style;
    private String description;

    public BeerRecommendation() {
    }

    public BeerRecommendation(String name, String style, String description) {
        this.name = name;
        this.style = style;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStyle() {
        return style;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
