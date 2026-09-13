package khav.learning.core_backing_api.Services;

import khav.learning.core_backing_api.Entities.Customer;
import khav.learning.core_backing_api.Entities.Transaction;

import java.math.BigDecimal;

public interface TransactionService {

    Transaction deposit(BigDecimal amount, Long account_id, String description);

    Transaction withdraw(BigDecimal amount, Long account_id, String description);
}
