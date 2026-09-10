package khav.learning.core_backing_api.Repositories;

import khav.learning.core_backing_api.Entities.Customer; // adjust package
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest(properties = "spring.liquibase.enabled=false")
class CustomerRepositoryTest {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    void savesAndFindsCustomerById() {
        // Arrange
        Customer customer = new Customer();
        customer.setName("Alice");
        customer.setEmail("alice@example.com");

        // Act
        Customer saved = entityManager.persistFlushFind(customer);

        // Assert
        assertThat(saved.getId()).isNotNull();

        Optional<Customer> found = customerRepository.findById(saved.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo("alice@example.com");
    }
}