package org.ernestonovillo.networth.restservice;

import org.ernestonovillo.networth.language.Language;
import org.ernestonovillo.networth.language.LanguageRepository;
import org.ernestonovillo.networth.user.User;
import org.ernestonovillo.networth.user.UserRepository;
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

        userRepo.save(new User("John Steinbeck", english));
        userRepo.save(new User("Jacques Cousteau", french));
        userRepo.save(new User("Julio Cortazar", spanish));
    }
}
