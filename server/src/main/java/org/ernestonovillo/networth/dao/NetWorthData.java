package org.ernestonovillo.networth.dao;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;

import lombok.Data;

/**
 * Model that contains all relevant information to compute a user's net worth.
 */
@JsonAutoDetect(fieldVisibility = Visibility.ANY) // Allows Jackson to automatically serialize private fields
@Data
public class NetWorthData {

    private final List<Asset> assets;

    /**
     * Total value of assets.
     */
    private final double totalAssets;

    private final List<Liability> liabilities;

    /**
     * Total value of liabilities.
     */
    private final double totalLiabilities;

    /**
     * The computed net worth.
     */
    private final double netWorth;

    /**
     * The user name; for easy retrieval.
     */
    private final String userName;

    public NetWorthData(List<Asset> assets, List<Liability> liabilities) {
        this.assets = assets;
        this.liabilities = liabilities;

        // Get the user name from assets or liabilities
        if (this.assets.size() > 0) {
            this.userName = this.assets.get(0).getUser().getName();
        } else if (this.liabilities.size() > 0) {
            this.userName = this.liabilities.get(0).getUser().getName();
        } else {
            this.userName = "";
        }

        this.totalAssets = assets.stream().mapToDouble(Asset::getValue).sum();
        this.totalLiabilities = liabilities.stream().mapToDouble(Liability::getValue).sum();

        this.netWorth = totalAssets - totalLiabilities;
    }
}
