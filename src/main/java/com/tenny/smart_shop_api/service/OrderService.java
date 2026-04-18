package com.tenny.smart_shop_api.service;

import com.tenny.smart_shop_api.dto.OrderRequest;
import com.tenny.smart_shop_api.entity.Order;
import com.tenny.smart_shop_api.entity.OrderItem;
import com.tenny.smart_shop_api.entity.Product;
import com.tenny.smart_shop_api.entity.User;
import com.tenny.smart_shop_api.repository.OrderRepository;
import com.tenny.smart_shop_api.repository.ProductRepository;
import com.tenny.smart_shop_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    private static final Set<String> ALLOWED_STATUSES = Set.of(
            "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"
    );

    @Transactional
    public Order createOrder(String email, OrderRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        Order order = new Order();
        order.setUser(user);

        List<OrderItem> items = req.getItems().stream().map(i -> {
            Product p = productRepository.findById(i.getProductId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại: " + i.getProductId()));

            if (p.getStock() < i.getQuantity())
                throw new RuntimeException("Sản phẩm " + p.getName() + " không đủ hàng");

            p.setStock(p.getStock() - i.getQuantity());
            productRepository.save(p);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(p);
            item.setQuantity(i.getQuantity());
            item.setPrice(p.getPrice());
            return item;
        }).collect(Collectors.toList());

        order.setOrderItems(items);
        order.setTotalPrice(
                items.stream()
                        .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                        .reduce(BigDecimal.ZERO, BigDecimal::add)
        );

        return orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    public List<Order> getMyOrders(String email) {
        List<Order> orders = orderRepository.findByUserEmail(email);
        orders.forEach(o -> o.getOrderItems().size());
        return orders;
    }

    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        orders.forEach(o -> o.getOrderItems().size());
        return orders;
    }

    @Transactional
    public Order updateStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order không tồn tại"));
        order.setStatus(status);
        orderRepository.save(order);
        order.getOrderItems().size();
        return order;
    }
}