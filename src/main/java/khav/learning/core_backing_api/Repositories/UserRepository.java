package khav.learning.core_backing_api.Repositories;

import khav.learning.core_backing_api.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
