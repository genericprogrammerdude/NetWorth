package org.ernestonovillo.networth.dao;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;


/**
 * Model that contains all relevant information to compute a user's net worth.
 */
@JsonAutoDetect(fieldVisibility = Visibility.ANY) // Allows Jackson to automatically serialize private fields
@Data
public class NetWorthData {

    private final List<Asset> assets;

    private final List<Liability> liabilities;

    /**
     * The computed net worth.
     */
    private final double netWorth;

    public NetWorthData(List<Asset> assets, List<Liability> liabilities) {
        this.assets = assets;
        this.liabilities = liabilities;

        final double totalAssets = assets.stream().mapToDouble(Asset::getValue).sum();
        final double totalLiabilities = liabilities.stream().mapToDouble(Liability::getValue).sum();

        netWorth = totalAssets - totalLiabilities;
    }
}
