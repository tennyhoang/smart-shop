# 🛍️ Smart Shop API

Backend REST API cho ứng dụng thương mại điện tử thời trang, tích hợp AI Chatbot.

## 🚀 Tech Stack

| Công nghệ | Mô tả |
|-----------|-------|
| Java 21 | Ngôn ngữ lập trình |
| Spring Boot 3.x | Framework backend |
| Spring Security + JWT | Xác thực & phân quyền |
| SQL Server | Cơ sở dữ liệu |
| Groq AI (LLaMA 3.1) | AI Chatbot |
| Docker | Containerization |

## 📋 Yêu cầu hệ thống

- Java 21+
- Maven 3.8+
- SQL Server 2019+
- Node.js 18+ (cho frontend)

## ⚙️ Cài đặt & Chạy

### 1. Clone project
```bash
git clone https://github.com/your-username/smart-shop-api.git
cd smart-shop-api
```

### 2. Tạo database
```sql
CREATE DATABASE smart_shop;
```

### 3. Cấu hình `application.properties`
```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=smart_shop;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=YOUR_PASSWORD
jwt.secret=your-secret-key-at-least-32-chars!!
groq.api.key=your-groq-api-key
```

### 4. Chạy ứng dụng
```bash
mvn spring-boot:run
```

API chạy tại: `http://localhost:8080`

### 5. Chạy với Docker
```bash
docker build -t smart-shop-api .
docker run -p 8080:8080 smart-shop-api
```

## 📚 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/register` | Đăng ký tài khoản |
| POST | `/api/auth/login` | Đăng nhập |

### 📦 Products
| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | `/api/products` | Public | Lấy tất cả sản phẩm |
| GET | `/api/products/{id}` | Public | Chi tiết sản phẩm |
| POST | `/api/products` | ADMIN | Thêm sản phẩm |
| PUT | `/api/products/{id}` | ADMIN | Cập nhật sản phẩm |
| DELETE | `/api/products/{id}` | ADMIN | Xóa sản phẩm |

### 🗂️ Categories
| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | `/api/categories` | Public | Lấy tất cả danh mục |
| POST | `/api/categories` | ADMIN | Thêm danh mục |
| PUT | `/api/categories/{id}` | ADMIN | Cập nhật danh mục |
| DELETE | `/api/categories/{id}` | ADMIN | Xóa danh mục |

### 🛒 Orders
| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| POST | `/api/orders` | USER | Tạo đơn hàng |
| GET | `/api/orders/my` | USER | Đơn hàng của tôi |
| GET | `/api/orders/all` | ADMIN | Tất cả đơn hàng |
| PUT | `/api/orders/{id}/status` | ADMIN | Cập nhật trạng thái |

### 🤖 Chatbot
| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| POST | `/api/chat` | Public | Chat với AI |

## 🗄️ Database Schema

```sql
-- Users
CREATE TABLE users (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(20) DEFAULT 'CUSTOMER'
);

-- Categories
CREATE TABLE categories (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255),
    slug VARCHAR(255) UNIQUE
);

-- Products
CREATE TABLE products (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255),
    description NVARCHAR(MAX),
    price DECIMAL(18,2),
    stock INT DEFAULT 0,
    image_url VARCHAR(500),
    category_id BIGINT REFERENCES categories(id),
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Orders
CREATE TABLE orders (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'PENDING',
    total_price DECIMAL(18,2),
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Order Items
CREATE TABLE order_items (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id),
    product_id BIGINT REFERENCES products(id),
    quantity INT,
    price DECIMAL(18,2)
);
```

## 👥 Tài khoản demo

| Role | Email | Password |
|------|-------|----------|
| ADMIN | admin@smartshop.com | 123456 |
| CUSTOMER | customer@smartshop.com | 123456 |

## 🏗️ Cấu trúc project

```
src/main/java/com/tenny/smart_shop_api/
├── config/          # Security, CORS, Exception Handler
├── controller/      # REST Controllers
├── dto/             # Data Transfer Objects
├── entity/          # JPA Entities
├── repository/      # Spring Data JPA Repositories
├── sercurity/       # JWT Filter & Util
└── service/         # Business Logic
```

## 📝 Trạng thái đơn hàng

| Status | Mô tả |
|--------|-------|
| PENDING | Chờ xử lý |
| PROCESSING | Đang xử lý |
| SHIPPED | Đang giao hàng |
| DELIVERED | Đã giao hàng |
| CANCELLED | Đã hủy |

## 👨‍💻 Tác giả

**Hoàng Anh Tuấn (Tenny)**  
FPT University HCMC - Software Engineering  
GitHub: [@ttuan0147](https://github.com/ttuan0147)
