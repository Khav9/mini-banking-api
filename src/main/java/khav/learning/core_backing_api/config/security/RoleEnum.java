package khav.learning.core_backing_api.config.security;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.Set;
import java.util.stream.Collectors;

import static khav.learning.core_backing_api.config.security.PermissionEnum.*;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public enum RoleEnum {
    ADMIN(Set.of(ACCOUNT_READ, ACCOUNT_WRITE, TRANSACTION_WRITE, CUSTOMERS_READ, CUSTOMERS_WRITE)),
    SALE(Set.of(ACCOUNT_READ, ACCOUNT_WRITE, TRANSACTION_WRITE));

    private Set<PermissionEnum> permissions;

    public Set<SimpleGrantedAuthority> getAuthorities(){
        Set<SimpleGrantedAuthority> grantedAuthorities = this.permissions.stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getDescription()))
                .collect(Collectors.toSet());

        SimpleGrantedAuthority role = new SimpleGrantedAuthority("ROLE_"+ this.name());
        grantedAuthorities.add(role);
        System.out.println(grantedAuthorities);
        return grantedAuthorities;
    }
}