package be.hopadvisor.hopadvisor.auth;

import be.hopadvisor.hopadvisor.user.User;
import be.hopadvisor.hopadvisor.user.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public record RegisterRequest(
            @NotBlank(message = "Gebruikersnaam mag niet leeg zijn.")
            String username,
            @NotBlank(message = "Wachtwoord mag niet leeg zijn.")
            String password
    ) {}

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> register(@Valid @RequestBody RegisterRequest request){
        userRepository.findByUsername(request.username()).ifPresent(existing ->{
            throw new IllegalStateException("Deze gebruikersnaam is al in gebruik.");
        });

        String hash = passwordEncoder.encode(request.password());
        User user = new User(request.username(), hash);
        userRepository.save(user);

        return Map.of(
                "id", user.getId(),
                "username", user.getUsername()
        );
    }

    @PostMapping("/login-test")
    public Map<String, Object> loginTest(){
        return Map.of("message", "Je bent succesvol geauthenticeerd");
    }
}