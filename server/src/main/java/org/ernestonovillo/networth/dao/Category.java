package org.ernestonovillo.networth.dao;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import lombok.Data;

/**
 * Model to represent asset/liability categories.
 */
@Data
@Entity
public class Category {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @SuppressWarnings("unused")
    private Category() {
    }

    public Category(final String name) {
        this.name = name;
    }
}
