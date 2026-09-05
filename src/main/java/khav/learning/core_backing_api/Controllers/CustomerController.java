package khav.learning.core_backing_api.Controllers;

import khav.learning.core_backing_api.Dtos.CustomerDto;
import khav.learning.core_backing_api.Entities.Customer;
import khav.learning.core_backing_api.Mappers.CustomerMapper;
import khav.learning.core_backing_api.Services.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("customers")
public class CustomerController {

    private final CustomerService customerService;
    private final CustomerMapper customerMapper;

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
}
