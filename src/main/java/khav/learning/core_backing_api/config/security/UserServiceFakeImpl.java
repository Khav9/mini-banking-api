package khav.learning.core_backing_api.config.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceFakeImpl implements UserService {
    private final PasswordEncoder passwordEncoder;

    @Override
    public Optional<AuthUser> findUserByUsername(String username) {
        List<AuthUser> users = List.of(
                new AuthUser("user1", passwordEncoder.encode("password"), RoleEnum.SALE.getAuthorities(),true, true, true, true),
                new AuthUser("user2", passwordEncoder.encode("password"),RoleEnum.ADMIN.getAuthorities(),true, true, true, true)
        );

        return users.stream()
                .filter(user -> user.getUsername().equals(username))
                .findFirst();
    }
}