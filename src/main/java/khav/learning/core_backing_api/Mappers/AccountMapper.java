package khav.learning.core_backing_api.Mappers;

import khav.learning.core_backing_api.Dtos.AccountDto;
import khav.learning.core_backing_api.Entities.Account;
import khav.learning.core_backing_api.Entities.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface AccountMapper {

    @Mapping(source = "customerId", target = "customer", qualifiedByName = "idToCustomer")
    Account toAccount(AccountDto accountDto);

    @Mapping(source = "customer.id", target = "customerId")
    AccountDto toAccountDto(Account account);

    @Named("idToCustomer")
    default Customer idToCustomer(Long id) {
        if (id == null) {
            return null;
        }
        Customer customer = new Customer();
        customer.setId(id);
        return customer;
    }
}