package khav.learning.core_backing_api.Services;

import khav.learning.core_backing_api.Entities.Account;
import khav.learning.core_backing_api.Entities.Customer;

public interface CustomerService {
    Customer createCustomer(Customer customer);

    Customer getCustomerById(Long id);

    Customer updateCustomer(Long id,  Customer customer);

}
