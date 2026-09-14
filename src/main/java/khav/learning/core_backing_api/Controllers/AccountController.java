package khav.learning.core_backing_api.Controllers;

import khav.learning.core_backing_api.Dtos.AccountDto;
import khav.learning.core_backing_api.Dtos.response.AccountDetailDto;
import khav.learning.core_backing_api.Entities.Account;
import khav.learning.core_backing_api.Mappers.AccountMapper;
import khav.learning.core_backing_api.Services.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("accounts")
public class AccountController {
    private final AccountMapper accountMapper;
    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<AccountDto> createAccount(@RequestBody AccountDto accountDto) {
        Account account = accountMapper.toAccount(accountDto);

        account = accountService.createAccount(account);

        return ResponseEntity.ok(accountMapper.toAccountDto(account));
    }

    @GetMapping("{Id}")
    public ResponseEntity<?> getAccount(@PathVariable Long Id) {
        Account account = accountService.getAccount(Id);

        AccountDetailDto  accountDetailDto = new AccountDetailDto();

        accountDetailDto.setAccountName(account.getAccountName());
        accountDetailDto.setBalance(account.getBalance());
        accountDetailDto.setCurrency(account.getCurrency());
        accountDetailDto.setCustomerId(account.getCustomer().getId());

        return ResponseEntity.ok(accountDetailDto);
    }

    @DeleteMapping("{Id}")
    public ResponseEntity<Map<String, Object>> deleteAccount(@PathVariable Long Id) {
        accountService.deleteAccount(Id);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Account deleted successfully with ID: " + Id);
        response.put("deletedId", Id);
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity.ok(response);
    }

}

