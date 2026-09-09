package khav.learning.core_backing_api.Repositories;

import khav.learning.core_backing_api.Entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    // Check if account number exists
    boolean existsByAccountNumber(String accountNumber);

    // Find account by account number
    Optional<Account> findByAccountNumber(String accountNumber);

    // Find accounts by customer ID
    List<Account> findByCustomerId(Long customerId);
}
