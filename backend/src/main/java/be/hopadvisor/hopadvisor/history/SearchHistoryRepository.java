package be.hopadvisor.hopadvisor.history;

import be.hopadvisor.hopadvisor.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {
    List<SearchHistory> findTop10ByUserOrderByCreatedAtDesc(User user);
}
