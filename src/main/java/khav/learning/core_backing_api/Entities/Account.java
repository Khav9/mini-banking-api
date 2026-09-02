package khav.learning.core_backing_api.Entities;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Entity
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private Long id;

    @Column(name = "account_number")
    private UUID accountNumber;

    private BigDecimal  balance;

    private String  currency;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;
}
