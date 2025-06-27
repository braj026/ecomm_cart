package com.ecommerce_cart.dto;

import lombok.Data;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;


@Data
public class CartItemDto {
    private Long id;
    @NotNull
    private Long productId;
    private String productName;
    private BigDecimal price;
    private String imageUrl;
    @Min(1)
    private int quantity;
}