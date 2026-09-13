package khav.learning.core_backing_api.Controllers;

import khav.learning.core_backing_api.Dtos.TransactionDto;
import khav.learning.core_backing_api.Entities.Account;
import khav.learning.core_backing_api.Entities.Transaction;
import khav.learning.core_backing_api.Mappers.TransactionMapper;
import khav.learning.core_backing_api.Services.AccountService;
import khav.learning.core_backing_api.Services.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RequiredArgsConstructor
@RestController
@RequestMapping("transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final TransactionMapper transactionMapper;
    private final AccountService accountService;

    @PostMapping("{id}/deposit")
    public ResponseEntity<TransactionDto> deposit(@PathVariable("id") Long account_id, @RequestBody TransactionDto  transactionDto) {
        Transaction transaction = transactionMapper.toTransaction(transactionDto);

        Account account = accountService.getAccount(account_id);

        Transaction tx = transactionService.deposit(transaction.getAmount(), account_id, transactionDto.getDescription());


        return ResponseEntity
                .created(URI.create("/transactions/" + tx.getId()))
                .body(transactionMapper.toTransactionDto(tx));
    }

    @PostMapping("{id}/withdraw")
    public ResponseEntity<TransactionDto> withdraw(@PathVariable("id") Long account_id, @RequestBody TransactionDto  transactionDto) {
        Transaction transaction = transactionMapper.toTransaction(transactionDto);

        Account account = accountService.getAccount(account_id);

        Transaction tx = transactionService.withdraw(transaction.getAmount(), account_id, transactionDto.getDescription());


        return ResponseEntity
                .created(URI.create("/transactions/" + tx.getId()))
                .body(transactionMapper.toTransactionDto(tx));
    }
}
