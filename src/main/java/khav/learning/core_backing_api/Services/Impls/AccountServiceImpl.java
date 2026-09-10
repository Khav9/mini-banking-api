package khav.learning.core_backing_api.Services.Impls;

import khav.learning.core_backing_api.Dtos.AccountDto;
import khav.learning.core_backing_api.Entities.Account;
import khav.learning.core_backing_api.Entities.Customer;
import khav.learning.core_backing_api.Repositories.AccountRepository;
import khav.learning.core_backing_api.Repositories.CustomerRepository;
import khav.learning.core_backing_api.Services.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;

    private final CustomerRepository customerRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    @Transactional
    public Account createAccount(Account account) {
        // Find customer
        Customer customerId = customerRepository.findById(account.getCustomer().getId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Create new account
        Account newAccount = new Account();
        newAccount.setAccountName(account.getAccountName());
        newAccount.setCurrency(account.getCurrency());
        newAccount.setBalance(BigDecimal.ZERO);
        newAccount.setAccountNumber(generateUniqueAccountNumber());
        newAccount.setCustomer(customerId);

        return accountRepository.save(newAccount);
    }

    @Override
    public List<Account> findAll(Long id) {
        return accountRepository.findByCustomerId(id);
    }

    @Override
    public void deleteAccount(Long Id) {
        if (!accountRepository.existsById(Id)) {
            throw new RuntimeException("Account not found with id: " + Id);
        }
        accountRepository.deleteById(Id);
    }

    // Method to generate unique 6-digit account number
    private String generateUniqueAccountNumber() {
        String accountNumber;
        boolean isUnique;

        do {
            // Generate 6-digit number (100000 to 999999)
            int number = secureRandom.nextInt(900000) + 100000;
            accountNumber = String.valueOf(number);

            // Check if already exists
            isUnique = !accountRepository.existsByAccountNumber(accountNumber);
        } while (!isUnique);

        return accountNumber;
    }
}
