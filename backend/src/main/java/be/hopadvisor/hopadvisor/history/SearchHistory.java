package be.hopadvisor.hopadvisor.history;

import be.hopadvisor.hopadvisor.user.User;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "search_history")
public class SearchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private User user;

    @Column(nullable = false, length = 1000)
    private String preferences;

    @Column(nullable = false)
    private int recommendationCount;

    @Lob
    @Column(name = "recommendations_json", nullable = false)
    private String recommendationsJson;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    protected SearchHistory(){
    }

    public SearchHistory(User user, String preferences, int recommendationCount, String recommendationsJson) {
        this.user = user;
        this.preferences = preferences;
        this.recommendationCount = recommendationCount;
        this.recommendationsJson = recommendationsJson;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getPreferences() {
        return preferences;
    }

    public int getRecommendationCount() {
        return recommendationCount;
    }

    public String getRecommendationsJson() {
        return recommendationsJson;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
