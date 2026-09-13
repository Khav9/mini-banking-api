package khav.learning.core_backing_api.Mappers;

import khav.learning.core_backing_api.Dtos.TransactionDto;
import khav.learning.core_backing_api.Entities.Transaction;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
    Transaction toTransaction(TransactionDto  dto);

    TransactionDto toTransactionDto(Transaction entity);
}
