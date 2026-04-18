package com.tenny.smart_shop_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductDTO {
    @NotBlank
    private String name;
    private String description;
    @NotNull
    private BigDecimal price;
    private Integer stock = 0;
    private String imageUrl;
    private Long categoryId;
}