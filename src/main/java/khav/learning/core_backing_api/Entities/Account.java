package khav.learning.core_backing_api.Entities;

import lombok.Data;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
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

    private String accountName;

    @Column(name = "account_number", unique = true, nullable = false, length = 6)
    private String accountNumber;

    @ColumnDefault("0")
    private BigDecimal  balance =  BigDecimal.ZERO;

    private String  currency;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;
}
