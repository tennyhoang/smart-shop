package com.tenny.smart_shop_api.service;

import com.tenny.smart_shop_api.dto.ProductDTO;
import com.tenny.smart_shop_api.entity.Category;
import com.tenny.smart_shop_api.entity.Product;
import com.tenny.smart_shop_api.repository.ProductRepository;
import com.tenny.smart_shop_api.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public List<Product> getAll(String search, Long categoryId) {
        if (search != null && !search.isBlank())
            return productRepository.findByNameContainingIgnoreCase(search);
        if (categoryId != null)
            return productRepository.findByCategoryId(categoryId);
        return productRepository.findAll();
    }

    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
    }

    public Product create(ProductDTO dto) {
        Product p = new Product();
        p.setName(dto.getName());
        p.setDescription(dto.getDescription());
        p.setPrice(dto.getPrice());
        p.setStock(dto.getStock());
        p.setImageUrl(dto.getImageUrl());
        if (dto.getCategoryId() != null) {
            categoryRepository.findById(dto.getCategoryId())
                    .ifPresent(p::setCategory);
        }
        return productRepository.save(p);
    }

    public Product update(Long id, ProductDTO dto) {
        Product p = getById(id);
        p.setName(dto.getName());
        p.setDescription(dto.getDescription());
        p.setPrice(dto.getPrice());
        p.setStock(dto.getStock());
        p.setImageUrl(dto.getImageUrl());
        if (dto.getCategoryId() != null) {
            categoryRepository.findById(dto.getCategoryId())
                    .ifPresent(p::setCategory);
        }
        return productRepository.save(p);
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }
}