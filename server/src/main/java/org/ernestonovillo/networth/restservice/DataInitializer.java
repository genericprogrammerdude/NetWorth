package org.ernestonovillo.networth.restservice;

import org.ernestonovillo.networth.dao.Asset;
import org.ernestonovillo.networth.dao.AssetRepository;
import org.ernestonovillo.networth.dao.Category;
import org.ernestonovillo.networth.dao.CategoryRepository;
import org.ernestonovillo.networth.dao.Currency;
import org.ernestonovillo.networth.dao.CurrencyRepository;
import org.ernestonovillo.networth.dao.ExchangeRate;
import org.ernestonovillo.networth.dao.ExchangeRateRepository;
import org.ernestonovillo.networth.dao.Language;
import org.ernestonovillo.networth.dao.LanguageRepository;
import org.ernestonovillo.networth.dao.Liability;
import org.ernestonovillo.networth.dao.LiabilityRepository;
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

    private final AssetRepository assetRepo;
    private final CategoryRepository categoryRepo;
    private final CurrencyRepository currencyRepo;
    private final ExchangeRateRepository exchangeRateRepo;
    private final LanguageRepository languageRepo;
    private final LiabilityRepository liabilityRepo;
    private final UserRepository userRepo;

    @Autowired
    public DataInitializer(AssetRepository assetRepo, CategoryRepository categoryRepo, CurrencyRepository currencyRepo,
            ExchangeRateRepository exchangeRateRepo, LanguageRepository languageRepo, LiabilityRepository liabilityRepo,
            UserRepository userRepo) {
        this.assetRepo = assetRepo;
        this.categoryRepo = categoryRepo;
        this.currencyRepo = currencyRepo;
        this.exchangeRateRepo = exchangeRateRepo;
        this.languageRepo = languageRepo;
        this.liabilityRepo = liabilityRepo;
        this.userRepo = userRepo;
    }

    @Override
    public void run(String... strings) throws Exception {
        // Languages
        final Language english = new Language("English");
        final Language french = new Language("French");
        final Language spanish = new Language("Spanish");
        languageRepo.save(english);
        languageRepo.save(french);
        languageRepo.save(spanish);

        // Users
        final User john = new User("John Steinbeck", english);
        final User jacques = new User("Jacques Cousteau", french);
        final User julio = new User("Julio Cortázar", spanish);
        userRepo.save(john);
        userRepo.save(jacques);
        userRepo.save(julio);

        // Categories
        final Category cash = new Category("Cash and Investments");
        final Category longTermAsset = new Category("Long Term Assets");
        final Category other = new Category("Other");
        final Category shortTermLiability = new Category("Short Term Liabilities");
        final Category longTermDebt = new Category("Long Term Debt");
        categoryRepo.save(cash);
        categoryRepo.save(longTermAsset);
        categoryRepo.save(other);
        categoryRepo.save(shortTermLiability);
        categoryRepo.save(longTermDebt);

        // Currencies
        final Currency cad = new Currency("Canadian Dollar", "CAD");
        final Currency usd = new Currency("US Dollar", "USD");
        currencyRepo.save(cad);
        currencyRepo.save(usd);

        // Exchange rates
        final ExchangeRate cadToUsd = new ExchangeRate(cad, usd, 0.7);
        final ExchangeRate usdToCad = new ExchangeRate(usd, cad, 1.3);
        exchangeRateRepo.save(cadToUsd);
        exchangeRateRepo.save(usdToCad);

        // Assets
        final Asset chequing = new Asset("Chequing", 2000.0, cad, cash, john);
        final Asset savingTax = new Asset("Savings for Taxes", 4000.0, cad, cash, john);
        final Asset rainyDay = new Asset("Rainy Day Fund", 506.0, cad, cash, john);
        final Asset savingFun = new Asset("Savings for Fun", 5000.0, cad, cash, john);
        final Asset savingTravel = new Asset("Savings for Travel", 400.0, cad, cash, john);
        final Asset savingPD = new Asset("Savings for Personal Development", 200.0, cad, cash, john);
        final Asset investment1 = new Asset("Investment 1", 5000.0, cad, cash, john);
        final Asset investment2 = new Asset("Investment 2", 60000.0, cad, cash, john);
        final Asset investment3 = new Asset("Investment 3", 30000.0, cad, cash, john);
        final Asset investment4 = new Asset("Investment 4", 50000.0, cad, cash, julio);
        final Asset investment5 = new Asset("Investment 5", 24000.0, cad, cash, john);
        final Asset primary = new Asset("Primary Home", 455000.0, cad, longTermAsset, john);
        final Asset secondary = new Asset("Second Home", 1564321.0, cad, longTermAsset, john);
        assetRepo.save(chequing);
        assetRepo.save(savingTax);
        assetRepo.save(rainyDay);
        assetRepo.save(savingFun);
        assetRepo.save(savingTravel);
        assetRepo.save(savingPD);
        assetRepo.save(investment1);
        assetRepo.save(investment2);
        assetRepo.save(investment3);
        assetRepo.save(investment4);
        assetRepo.save(investment5);
        assetRepo.save(primary);
        assetRepo.save(secondary);

        // Liabilities
        final Liability cc1 = new Liability("Credit Card 1", 4342.0, cad, shortTermLiability, john);
        final Liability cc2 = new Liability("Credit Card 2", 322.0, cad, shortTermLiability, john);
        final Liability mortgage1 = new Liability("Mortgage 1", 250999.0, cad, longTermDebt, john);
        final Liability mortgage2 = new Liability("Mortgage 2", 632634.0, cad, longTermDebt, john);
        final Liability loc = new Liability("Line of Credit", 10000.0, cad, longTermDebt, john);
        final Liability investmentLoan = new Liability("Investment Loan", 10000.0, cad, longTermDebt, john);
        liabilityRepo.save(cc1);
        liabilityRepo.save(cc2);
        liabilityRepo.save(mortgage1);
        liabilityRepo.save(mortgage2);
        liabilityRepo.save(loc);
        liabilityRepo.save(investmentLoan);
    }
}
