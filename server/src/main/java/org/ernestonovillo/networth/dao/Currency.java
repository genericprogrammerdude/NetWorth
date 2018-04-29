package org.ernestonovillo.networth.dao;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import lombok.Data;

/**
 * Model to represent currencies.
 */
@Data
@Entity
public class Currency {

    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private String symbol;

    @SuppressWarnings("unused")
    private Currency() {
    }

    public Currency(final String name, final String symbol) {
        this.name = name;
        this.symbol = symbol;
    }
}
