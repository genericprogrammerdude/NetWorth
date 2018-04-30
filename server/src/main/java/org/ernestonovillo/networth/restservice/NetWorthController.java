package org.ernestonovillo.networth.restservice;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Controller for Net Worth Calculator home page.
 */
@Controller
public class NetWorthController {

    @RequestMapping(value = "/")
    public String index() {
        return "index";
    }
}