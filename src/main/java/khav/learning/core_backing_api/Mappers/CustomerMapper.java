package khav.learning.core_backing_api.Mappers;

import khav.learning.core_backing_api.Dtos.CustomerDto;
import khav.learning.core_backing_api.Entities.Customer;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

    Customer toCustomer(CustomerDto dto);

    CustomerDto toCustomerDto(Customer entity);
}