package khav.learning.core_backing_api.Repositories;

import khav.learning.core_backing_api.Entities.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
}
