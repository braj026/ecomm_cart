package com.ecommerce_cart.service;

import com.ecommerce_cart.dto.CartItemDto;
import com.ecommerce_cart.entity.CartItem;
import com.ecommerce_cart.entity.Product;
import com.ecommerce_cart.entity.User;
import com.ecommerce_cart.repository.CartItemRepository;
import com.ecommerce_cart.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartService(CartItemRepository cartItemRepository, ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    public List<CartItemDto> getCartItems(User user) {
        return cartItemRepository.findByUser(user).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CartItemDto addToCart(User user, Long productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem cartItem = cartItemRepository.findByUserAndProductId(user, productId)
                .orElse(new CartItem());

        if (cartItem.getId() == null) { // New item
            cartItem.setUser(user);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
        } else { // Existing item
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        }

        return convertToDto(cartItemRepository.save(cartItem));
    }

    @Transactional
    public void removeFromCart(User user, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new SecurityException("User not authorized to remove this item");
        }
        cartItemRepository.deleteById(cartItemId);
    }

    @Transactional
    public void clearCart(User user){
        cartItemRepository.deleteByUser(user);
    }


    private CartItemDto convertToDto(CartItem cartItem) {
        CartItemDto dto = new CartItemDto();
        dto.setId(cartItem.getId());
        dto.setProductId(cartItem.getProduct().getId());
        dto.setProductName(cartItem.getProduct().getName());
        dto.setPrice(cartItem.getProduct().getPrice());
        dto.setImageUrl(cartItem.getProduct().getImageUrl());
        dto.setQuantity(cartItem.getQuantity());
        return dto;
    }
}
