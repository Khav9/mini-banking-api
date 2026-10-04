package khav.learning.core_backing_api.config.security;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public enum PermissionEnum {

    ACCOUNT_WRITE("account:write"),
    ACCOUNT_READ("account:read"),
    CUSTOMERS_READ("customer:read"),

    CUSTOMERS_WRITE("customer:write"),

    TRANSACTION_WRITE("transaction:write");

    private String description;
}