package khav.learning.core_backing_api.Services.Impls;

import khav.learning.core_backing_api.Entities.Account;
import khav.learning.core_backing_api.Entities.Customer;
import khav.learning.core_backing_api.Entities.Transaction;
import khav.learning.core_backing_api.Enum.TransactionType;
import khav.learning.core_backing_api.Repositories.AccountRepository;
import khav.learning.core_backing_api.Repositories.CustomerRepository;
import khav.learning.core_backing_api.Repositories.TransactionRepository;
import khav.learning.core_backing_api.Services.TransactionService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


@AllArgsConstructor
@Service
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepository transactionRepository;
    private final CustomerRepository customerRepository;
    private final AccountRepository accountRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public Transaction deposit(BigDecimal amount, Long account_id,  String description) {
        return createTransaction(amount, account_id, TransactionType.CREDIT, description);
    }

    @Override
    public Transaction withdraw(BigDecimal amount, Long account_id, String description) {
        return createTransaction(amount, account_id,TransactionType.DEBIT, description);
    }

    private  Transaction createTransaction(BigDecimal amount,Long account_id, TransactionType type, String description) {
            // Validate amount
            if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Amount must be greater than zero");
            }

            // Fetch account
            Account account = accountRepository.findById(account_id)
                    .orElseThrow(() -> new RuntimeException("Account not found with id: " + account_id));

            // For withdrawals, check sufficient balance
            if (type == TransactionType.DEBIT) {
                if (account.getBalance().compareTo(amount) < 0) {
                    throw new RuntimeException("Insufficient balance");
                }
                account.setBalance(account.getBalance().subtract(amount));
            } else {
                account.setBalance(account.getBalance().add(amount));
            }

            // Save updated account
            accountRepository.save(account);

            // Create and save transaction
            Transaction transaction = Transaction.builder()
                    .amount(amount)
                    .type(type)
                    .account(account)
                    .description(description)
                    .referenceId(LocalDateTime.now().format(DATE_FORMATTER))
                    .timestamp(LocalDateTime.now())
                    .build();

            return transactionRepository.save(transaction);
    }
}
