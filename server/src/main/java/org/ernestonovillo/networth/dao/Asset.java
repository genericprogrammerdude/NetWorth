package org.ernestonovillo.networth.dao;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import lombok.Data;

/**
 * Model to represent assets.
 */
@Data
@Entity
public class Asset {

    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private double value;
    private Currency currency;
    private Category category;
    private User user;

    @SuppressWarnings("unused")
    private Asset() {
    }

    public Asset(final String name, double value, Currency currency, Category category, User user) {
        this.name = name;
        this.value = value;
        this.currency = currency;
        this.category = category;
        this.user = user;
    }
}
