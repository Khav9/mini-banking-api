package khav.learning.core_backing_api.Repositories;

import khav.learning.core_backing_api.Entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {
}
