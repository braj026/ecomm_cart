package com.ecommerce_cart.service;

import com.ecommerce_cart.entity.CartItem;
import com.ecommerce_cart.entity.Product;
import com.ecommerce_cart.repository.CartItemRepository;
import com.ecommerce_cart.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository; // Inject CartItemRepository

    // Updated constructor
    public ProductService(ProductRepository productRepository, CartItemRepository cartItemRepository) {
        this.productRepository = productRepository;
        this.cartItemRepository = cartItemRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // --- ADMIN METHODS ---
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Optional<Product> updateProduct(Long id, Product productDetails) {
        return productRepository.findById(id).map(product -> {
            product.setName(productDetails.getName());
            product.setDescription(productDetails.getDescription());
            product.setPrice(productDetails.getPrice());
            if (productDetails.getImageUrl() != null) {
                product.setImageUrl(productDetails.getImageUrl());
            }
            return productRepository.save(product);
        });
    }

    // FIXED: This method now correctly handles dependencies before deletion.
    @Transactional // Ensures all operations complete or none do.
    public void deleteProduct(Long id) {
        // Step 1: Find and delete all cart items that reference this product.
        List<CartItem> cartItems = cartItemRepository.findByProductId(id);
        if (!cartItems.isEmpty()) {
            cartItemRepository.deleteAll(cartItems);
        }

        // Note: We are not deleting from order_items to preserve order history.
        // If an order item has a constraint, that would need to be handled too,
        // often by "soft-deleting" the product instead of a hard delete.
        // For this error, handling cart_items is sufficient.

        // Step 2: Now that no cart items reference the product, we can safely delete it.
        productRepository.deleteById(id);
    }
}