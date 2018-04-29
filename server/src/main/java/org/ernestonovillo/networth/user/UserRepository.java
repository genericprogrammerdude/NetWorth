package org.ernestonovillo.networth.user;

import org.springframework.data.repository.CrudRepository;

/**
 * CRUD for User
 */
public interface UserRepository extends CrudRepository<User, Long> {
}
