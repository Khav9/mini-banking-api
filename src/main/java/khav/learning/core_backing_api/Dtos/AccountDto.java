package khav.learning.core_backing_api.Dtos;

import lombok.Data;

@Data
public class AccountDto {
    private String accountName;

    private String currency;

    private Long customerId;
}
