package com.tenny.smart_shop_api.controller;

import com.tenny.smart_shop_api.dto.OrderRequest;
import com.tenny.smart_shop_api.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<?> create(
            @Valid @RequestBody OrderRequest req,
            Authentication auth) {
        return ResponseEntity.ok(orderService.createOrder(auth.getName(), req));
    }

    @GetMapping("/my")
    public ResponseEntity<?> myOrders(Authentication auth) {
        return ResponseEntity.ok(orderService.getMyOrders(auth.getName()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> allOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        orderService.updateStatus(id, status);
        return ResponseEntity.ok(java.util.Map.of("message", "Cập nhật thành công"));
    }
}