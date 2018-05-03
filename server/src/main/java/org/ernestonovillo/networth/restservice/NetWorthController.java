package org.ernestonovillo.networth.restservice;

import org.ernestonovillo.networth.dao.ExchangeRate;
import org.ernestonovillo.networth.dao.ExchangeRateRepository;
import org.ernestonovillo.networth.dao.NetWorthData;
import org.ernestonovillo.networth.dao.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Controller for Net Worth Calculator home page.
 */
@Controller
public class NetWorthController {

    private final UserRepository userRepo;
    private final ExchangeRateRepository exchangeRateRepo;

    @Autowired
    public NetWorthController(UserRepository userRepo, ExchangeRateRepository exchangeRateRepo) {
        this.userRepo = userRepo;
        this.exchangeRateRepo = exchangeRateRepo;
    }

    @RequestMapping(value = "/")
    public String index() {
        return "index";
    }

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
}
