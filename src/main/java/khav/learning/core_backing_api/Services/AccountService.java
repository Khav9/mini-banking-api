package khav.learning.core_backing_api.Services;

import khav.learning.core_backing_api.Entities.Account;

import java.util.List;

public interface AccountService {
    Account createAccount(Account account);
    List<Account> findAll(Long id);
    void deleteAccount(Long Id);
}
