package org.ernestonovillo.networth.restservice;

import org.ernestonovillo.networth.dao.NetWorthData;
import org.ernestonovillo.networth.dao.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Controller for Net Worth Calculator home page.
 */
@Controller
public class NetWorthController {

    private final UserRepository userRepo;

    @Autowired
    public NetWorthController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @RequestMapping(value = "/")
    public String index() {
        return "index";
    }

    @GetMapping(value = "/networth")
    public String getNetWorthData() {
        return "networth";
    }

    @GetMapping(value = "/networth/{id}", produces = "application/json")
    @ResponseBody
    public NetWorthData getNetWorthData(@PathVariable("id") long id) {
        return new NetWorthData(userRepo.getAssets(id), userRepo.getLiabilities(id));
    }
}
