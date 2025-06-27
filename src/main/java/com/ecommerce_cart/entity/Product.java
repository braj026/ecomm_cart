package com.ecommerce_cart.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Lob // For long text
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    private String imageUrl;
}
