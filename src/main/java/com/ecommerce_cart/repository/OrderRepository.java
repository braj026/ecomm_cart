package com.ecommerce_cart.repository;

import com.ecommerce_cart.entity.Order;
import com.ecommerce_cart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
}
