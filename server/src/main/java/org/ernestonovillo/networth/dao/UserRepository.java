package org.ernestonovillo.networth.dao;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

/**
 * CRUD for User.
 */
public interface UserRepository extends CrudRepository<User, Long> {

    /**
     * Query to get a user's assets.
     *
     * @param userId
     *            Id of the user in question.
     *
     * @return A list of Asset instances.
     */
    @Query("SELECT asset FROM Asset asset WHERE asset.user.id = :userId")
    public List<Asset> getAssets(@Param("userId") Long userId);

    /**
     * Query to get a user's liabilities.
     *
     * @param userId
     *            Id of the user in question.
     *
     * @return A list of Asset instances.
     */
    @Query("SELECT liability FROM Liability liability WHERE liability.user.id = :userId")
    public List<Liability> getLiabilities(@Param("userId") Long userId);
}
