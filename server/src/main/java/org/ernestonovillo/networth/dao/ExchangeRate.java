package org.ernestonovillo.networth.dao;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import lombok.Data;

/**
 * Model to represent assets.
 */
@Data
@Entity
public class ExchangeRate {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Currency fromCurrency;

    @ManyToOne
    private Currency toCurrency;

    private double rate;

    @SuppressWarnings("unused")
    private ExchangeRate() {
    }

    public ExchangeRate(Currency fromCurrency, Currency toCurrency, double rate) {
        this.fromCurrency = fromCurrency;
        this.toCurrency = toCurrency;
        this.rate = rate;
    }
}
