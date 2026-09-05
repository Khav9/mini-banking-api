package khav.learning.core_backing_api.Services.Impls;

import khav.learning.core_backing_api.Entities.Account;
import khav.learning.core_backing_api.Entities.Customer;
import khav.learning.core_backing_api.Repositories.CustomerRepository;
import khav.learning.core_backing_api.Services.CustomerService;
import org.springframework.stereotype.Service;

@Service
public class CustomerServiceImpl implements CustomerService {

    private CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    @Override
    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id).get();
    }

    @Override
    public Customer updateCustomer(Long id, Customer customer) {
        Customer oldCustomer = getCustomerById(id);
        oldCustomer.setName(customer.getName());
        oldCustomer.setEmail(customer.getEmail());

        return customerRepository.save(oldCustomer);
    }

}
