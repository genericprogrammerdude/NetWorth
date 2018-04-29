package org.ernestonovillo.networth.language;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import lombok.Data;

/**
 * Model to represent languages.
 */
@Data
@Entity
public class Language {

    @Id
    @GeneratedValue
    private Long id;

    @SuppressWarnings("unused")
    private String name;

    @SuppressWarnings("unused")
    private Language() {
    }

    public Language(final String name) {
        this.name = name;
    }
}
