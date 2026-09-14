package khav.learning.core_backing_api.Dtos.response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class AccountDetailDto {
    private String accountName;

    private String currency;

    private Long customerId;

    private BigDecimal balance;
}
