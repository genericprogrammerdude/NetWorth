package org.ernestonovillo.networth.dao;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

/**
 * CRUD for ExchangeRate.
 */
public interface ExchangeRateRepository extends CrudRepository<ExchangeRate, Long> {

    /**
     * Retrieves the exchange rate to use when converting from fromId currency to toId currency.
     *
     * TODO: What happens if there is no known rate?
     *
     * @param fromId
     *            Id of currency to convert from.
     * @param toId
     *            Id of currency to convert to.
     *
     * @return The exchange rate.
     */
    @Query("SELECT rate FROM ExchangeRate rate WHERE rate.fromCurrency.id = :fromId AND rate.toCurrency.id = :toId")
    ExchangeRate getRate(@Param("fromId") Long fromId, @Param("toId") Long toId);
}
