package org.ernestonovillo.networth.restservice;

import org.ernestonovillo.networth.dao.Language;
import org.ernestonovillo.networth.dao.LanguageRepository;
import org.ernestonovillo.networth.dao.User;
import org.ernestonovillo.networth.dao.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Populate the database with some test data.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepo;
    private final LanguageRepository languageRepo;

    @Autowired
    public DataInitializer(UserRepository userRepo, LanguageRepository languageRepo) {
        this.userRepo = userRepo;
        this.languageRepo = languageRepo;
    }

    @Override
    public void run(String... strings) throws Exception {
        final Language english = new Language("English");
        final Language french = new Language("French");
        final Language spanish = new Language("Spanish");

        languageRepo.save(english);
        languageRepo.save(french);
        languageRepo.save(spanish);

        final User john = new User("John Steinbeck", english);
        final User jacques = new User("Jacques Cousteau", french);
        final User julio = new User("Julio Cortázar", spanish);

        userRepo.save(john);
        userRepo.save(jacques);
        userRepo.save(julio);

        System.out.println(john);
        System.out.println(jacques);
        System.out.println(julio);
    }
}
