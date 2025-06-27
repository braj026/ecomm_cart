package com.ecommerce_cart.controller;

import com.ecommerce_cart.dto.AddToCartRequest;
import com.ecommerce_cart.dto.CartItemDto;
import com.ecommerce_cart.entity.User;
import com.ecommerce_cart.service.CartService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@Tag(name = "Shopping Cart")
@SecurityRequirement(name = "bearerAuth")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<List<CartItemDto>> getCartItems(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cartService.getCartItems(user));
    }

    @PostMapping
    public ResponseEntity<CartItemDto> addToCart(@AuthenticationPrincipal User user, @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addToCart(user, request.getProductId(), request.getQuantity()));
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> removeFromCart(@AuthenticationPrincipal User user, @PathVariable Long cartItemId) {
        cartService.removeFromCart(user, cartItemId);
        return ResponseEntity.ok().build();
    }
}
