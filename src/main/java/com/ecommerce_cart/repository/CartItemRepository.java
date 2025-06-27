package com.ecommerce_cart.repository;

import com.ecommerce_cart.entity.CartItem;
import com.ecommerce_cart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndProductId(User user, Long productId);
    void deleteByUser(User user);

    // ADDED: New method to find all cart items associated with a product ID.
    // This is crucial for the delete functionality.
    List<CartItem> findByProductId(Long productId);
}
