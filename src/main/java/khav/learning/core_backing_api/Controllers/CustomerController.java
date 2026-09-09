package khav.learning.core_backing_api.Controllers;

import khav.learning.core_backing_api.Dtos.AccountDto;
import khav.learning.core_backing_api.Dtos.CustomerDto;
import khav.learning.core_backing_api.Entities.Account;
import khav.learning.core_backing_api.Entities.Customer;
import khav.learning.core_backing_api.Mappers.AccountMapper;
import khav.learning.core_backing_api.Mappers.CustomerMapper;
import khav.learning.core_backing_api.Services.AccountService;
import khav.learning.core_backing_api.Services.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@RequestMapping("customers")
public class CustomerController {

    private final CustomerService customerService;
    private final CustomerMapper customerMapper;
    private final AccountService  accountService;
    private final AccountMapper accountMapper;

    @PostMapping
    public ResponseEntity<CustomerDto> create(@RequestBody CustomerDto customerDto) {
        Customer customer = customerMapper.toCustomer(customerDto);

        customer = customerService.createCustomer(customer);

        return ResponseEntity.ok(customerMapper.toCustomerDto(customer));
    }

    @GetMapping("{id}")
    public ResponseEntity<CustomerDto> getAllCustomers(@PathVariable Long id) {
        Customer customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(customerMapper.toCustomerDto(customer));
    }

    @PutMapping("{id}")
    public ResponseEntity<CustomerDto> update(@PathVariable("id") Long customerId, @RequestBody CustomerDto customerDto) {
        Customer customer = customerMapper.toCustomer(customerDto);
        Customer customerUpdated = customerService.updateCustomer(customerId, customer );

        return ResponseEntity.ok(customerMapper.toCustomerDto(customerUpdated));
    }

    @GetMapping("{id}/accounts")
    public ResponseEntity<List<AccountDto>> getAccountsByCustomer(@PathVariable Long id) {
        Customer customer = customerService.getCustomerById(id);
        List<Account> accounts = accountService.findAll(id);

        // Convert Account entities to AccountDto
        List<AccountDto> accountDtos = accounts.stream()
                .map(accountMapper::toAccountDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(accountDtos);
    }
}
