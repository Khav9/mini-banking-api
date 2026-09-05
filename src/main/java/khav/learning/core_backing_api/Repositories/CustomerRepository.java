package khav.learning.core_backing_api.Repositories;

import khav.learning.core_backing_api.Entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
