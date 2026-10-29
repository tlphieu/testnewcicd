# Bài Lab: CI/CD với GitHub Actions - User Management API

## Mục tiêu bài Lab

Bài Lab này giúp bạn:
- Xây dựng một REST API đơn giản quản lý User với Node.js/Express
- Viết unit tests với Jest
- Thiết lập CI/CD pipeline với GitHub Actions
- Tự động hóa testing và deployment

## Công nghệ sử dụng

- **Backend**: Node.js, Express.js
- **Testing**: Jest, Supertest
- **CI/CD**: GitHub Actions
- **Version Control**: Git, GitHub

## Cấu trúc Project

```
CI:CD/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions workflow
├── .gitignore
├── package.json
├── jest.config.js             # Cấu hình Jest
├── server.js                  # REST API server
├── server.test.js             # Unit tests
└── README.md
```

## API Endpoints

### 1. Lấy danh sách tất cả users
```http
GET /api/users
```

### 2. Lấy user theo ID
```http
GET /api/users/:id
```

### 3. Tạo user mới
```http
POST /api/users
Content-Type: application/json

{
  "name": "Nguyễn Văn A",
  "email": "nva@example.com",
  "age": 25
}
```

### 4. Cập nhật user
```http
PUT /api/users/:id
Content-Type: application/json

{
  "name": "Nguyễn Văn B",
  "email": "nvb@example.com",
  "age": 26
}
```

### 5. Xóa user
```http
DELETE /api/users/:id
```

### 6. Health Check
```http
GET /health
```

##  Hướng dẫn chạy Project

### Bước 1: Cài đặt Dependencies

```bash
npm install
```

### Bước 2: Chạy Server

```bash
# Chế độ development với auto-reload
npm run dev

# Hoặc chế độ production
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

### Bước 3: Chạy Tests

```bash
npm test
```

### Bước 4: Test API với curl

```bash
# Lấy danh sách users
curl http://localhost:3000/api/users

# Lấy user theo ID
curl http://localhost:3000/api/users/1

# Tạo user mới
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","age":28}'

# Cập nhật user
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name","email":"updated@example.com"}'

# Xóa user
curl -X DELETE http://localhost:3000/api/users/2

# Health check
curl http://localhost:3000/health
```

## GitHub Actions CI/CD Pipeline

### Workflow tự động gồm 4 jobs:

#### 1. **Test Job** 
- Chạy trên Node.js 18.x và 20.x
- Cài đặt dependencies
- Chạy unit tests
- Upload coverage reports

#### 2. **Lint Job** 
- Kiểm tra code quality
- Đảm bảo coding standards

#### 3. **Deploy Job** 
- Chỉ chạy khi push vào branch `main` hoặc `master`
- Chỉ chạy khi test và lint pass
- Deploy ứng dụng (placeholder - có thể customize)

#### 4. **Security Job** 
- Chạy npm audit
- Kiểm tra các lỗ hổng bảo mật

### Workflow được trigger khi:
- Push code lên branch `main` hoặc `master`
- Tạo Pull Request vào branch `main` hoặc `master`

## Hướng dẫn thực hiện Lab

### Phần 1: Setup Project 

1. Clone repository này
2. Cài đặt dependencies: `npm install`
3. Chạy server: `npm start`
4. Test API bằng curl hoặc Postman

### Phần 2: Viết và chạy Tests

1. Xem file `server.test.js` để hiểu cấu trúc test
2. Chạy tests: `npm test`
3. Xem coverage report trong thư mục `coverage/`
4. Thử thêm test cases mới

### Phần 3: Setup GitHub Actions (25 phút)

1. Tạo repository mới trên GitHub
2. Push code lên GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: User Management API with CI/CD"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

3. Vào tab **Actions** trên GitHub để xem workflow chạy
4. Xem logs của từng job (test, lint, deploy, security)

### Phần 4: Thử nghiệm CI/CD 

1. Tạo một branch mới:
   ```bash
   git checkout -b feature/add-validation
   ```

2. Thêm validation cho email trong `server.js`:
   ```javascript
   // Thêm function validation
   const isValidEmail = (email) => {
     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
   };
   
   // Sử dụng trong POST endpoint
   if (!isValidEmail(email)) {
     return res.status(400).json({ 
       success: false, 
       message: 'Invalid email format' 
     });
   }
   ```

3. Viết test cho validation mới
4. Commit và push:
   ```bash
   git add .
   git commit -m "Add email validation"
   git push origin feature/add-validation
   ```

5. Tạo Pull Request trên GitHub
6. Xem GitHub Actions tự động chạy tests
7. Sau khi tests pass, merge PR vào main
8. Xem deployment tự động chạy

##  Bài tập mở rộng

### Cấp độ Dễ:
1. Thêm endpoint tìm kiếm user theo email
2. Thêm validation cho age (phải > 0 và < 150)
3. Thêm tests cho các validation mới

### Cấp độ Trung bình:
1. Thêm pagination cho endpoint GET /api/users
2. Thêm authentication đơn giản (API key)
3. Setup ESLint và thêm vào CI pipeline

### Cấp độ Khó:
1. Tích hợp database thực (MongoDB/PostgreSQL)
2. Deploy lên Heroku/AWS/Azure
3. Thêm Docker support
4. Setup staging environment

## Tiêu chí đánh giá

-  API hoạt động đúng với tất cả endpoints
- Tests đạt coverage > 80%
- GitHub Actions workflow chạy thành công
- Code clean và có comments
- Documentation đầy đủ

## Troubleshooting

### Lỗi khi chạy tests:
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 đã được sử dụng:
```bash
# Thay đổi port trong server.js hoặc dùng biến môi trường
PORT=3001 npm start
```

### GitHub Actions fail:
- Kiểm tra logs chi tiết trong tab Actions
- Đảm bảo tất cả tests pass locally trước khi push
- Kiểm tra file `.github/workflows/ci-cd.yml` syntax

