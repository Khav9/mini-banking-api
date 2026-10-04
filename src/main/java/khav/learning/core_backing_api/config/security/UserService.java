package khav.learning.core_backing_api.config.security;

import java.util.Optional;

public interface UserService {
    Optional<AuthUser> findUserByUsername(String username);
}
