package org.ernestonovillo.networth.restservice;

import java.util.Optional;

import org.ernestonovillo.networth.dao.Asset;
import org.ernestonovillo.networth.dao.AssetRepository;
import org.ernestonovillo.networth.dao.Category;
import org.ernestonovillo.networth.dao.CategoryRepository;
import org.ernestonovillo.networth.dao.Currency;
import org.ernestonovillo.networth.dao.CurrencyRepository;
import org.ernestonovillo.networth.dao.ExchangeRate;
import org.ernestonovillo.networth.dao.ExchangeRateRepository;
import org.ernestonovillo.networth.dao.Liability;
import org.ernestonovillo.networth.dao.LiabilityRepository;
import org.ernestonovillo.networth.dao.NetWorthData;
import org.ernestonovillo.networth.dao.User;
import org.ernestonovillo.networth.dao.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Controller for Net Worth Calculator home page.
 */
@Controller
public class NetWorthController {

    private final AssetRepository assetRepo;
    private final CategoryRepository categoryRepo;
    private final CurrencyRepository currencyRepo;
    private final ExchangeRateRepository exchangeRateRepo;
    private final LiabilityRepository liabilityRepo;
    private final UserRepository userRepo;

    @Autowired
    public NetWorthController(AssetRepository assetRepo, CategoryRepository categoryRepo,
            CurrencyRepository currencyRepo, ExchangeRateRepository exchangeRateRepo, LiabilityRepository liabilityRepo,
            UserRepository userRepo) {
        this.assetRepo = assetRepo;
        this.categoryRepo = categoryRepo;
        this.currencyRepo = currencyRepo;
        this.exchangeRateRepo = exchangeRateRepo;
        this.userRepo = userRepo;
        this.liabilityRepo = liabilityRepo;
    }

    @RequestMapping(value = "/")
    public String index() {
        return "index";
    }

    /**
     * Retrieves net worth data for the given user in the given currency.
     */
    @GetMapping(value = "/networth/{userId}", params = { "currencyId" })
    @ResponseBody
    public NetWorthData getNetWorthData(@PathVariable("userId") long userId,
            @RequestParam("currencyId") long currencyId) {
        return new NetWorthData(userRepo.getAssets(userId), userRepo.getLiabilities(userId), currencyId,
                exchangeRateRepo);
    }

    @RequestMapping(value = "/exchange", params = { "fromId", "toId" })
    @ResponseBody
    public ExchangeRate getExchangeRate(@RequestParam("fromId") long fromId, @RequestParam("toId") long toId) {
        return exchangeRateRepo.getRate(fromId, toId);
    }

    /**
     * Updates the value of an asset.
     */
    @PutMapping(value = "/asset", params = { "id", "value" })
    @ResponseBody
    public void updateAssetValue(@RequestParam("id") long id, @RequestParam("value") double value) {
        final Optional<Asset> opt = assetRepo.findById(id);
        opt.ifPresent(asset -> {
            asset.setValue(value);
            assetRepo.save(asset);
        });
    }

    /**
     * Updates the value of a liability.
     */
    @PutMapping(value = "/liability", params = { "id", "value" })
    @ResponseBody
    public void updateLiabilityValue(@RequestParam("id") long id, @RequestParam("value") double value) {
        final Optional<Liability> opt = liabilityRepo.findById(id);
        opt.ifPresent(liability -> {
            liability.setValue(value);
            liabilityRepo.save(liability);
        });
    }

    /**
     * Adds a new user with the given name.
     */
    @PostMapping(value = "/adduser", params = { "name" })
    @ResponseBody
    public void addUser(@RequestParam("name") String name) {
        userRepo.save(new User(name));
    }

    /**
     * Adds a new asset with the given parameters.
     */
    @PostMapping(value = "/addasset", params = { "name", "value", "currencyId", "categoryId", "userId" })
    @ResponseBody
    public void addAsset(@RequestParam("name") String name, @RequestParam("value") double value,
            @RequestParam("currencyId") long currencyId, @RequestParam("categoryId") long categoryId,
            @RequestParam("userId") long userId) {
        final Optional<Currency> optCurrency = currencyRepo.findById(currencyId);
        final Optional<Category> optCategory = categoryRepo.findById(categoryId);
        final Optional<User> optUser = userRepo.findById(userId);

        if (optCurrency.isPresent() && optCategory.isPresent() && optUser.isPresent()) {
            assetRepo.save(new Asset(name, value, optCurrency.get(), optCategory.get(), optUser.get()));
        }
    }
}
