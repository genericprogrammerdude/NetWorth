package org.ernestonovillo.networth.user;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import org.ernestonovillo.networth.language.Language;

import lombok.Data;

/**
 * Model for a user of the Net Worth system.
 */
@Data
@Entity
public class User {

    @Id
    @GeneratedValue
    private Long id;

    @SuppressWarnings("unused")
    private String name;

    @ManyToOne
    private Language language;

    @SuppressWarnings("unused")
    private User() {
    }

    public User(String name, Language language) {
        this.name = name;
        this.language = language;
    }
}
