const request = require('supertest');
const app = require('./server');

describe('User API Tests', () => {
  
  describe('GET /api/users', () => {
    test('Nên trả về danh sách users', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/users/:id', () => {
    test('Nên trả về user khi ID hợp lệ', async () => {
      const response = await request(app).get('/api/users/1');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', 1);
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('email');
    });

    test('Nên trả về 404 khi user không tồn tại', async () => {
      const response = await request(app).get('/api/users/999');
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/users', () => {
    test('Nên tạo user mới thành công', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        age: 28
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(newUser.name);
      expect(response.body.data.email).toBe(newUser.email);
    });

    test('Nên trả về lỗi khi thiếu thông tin bắt buộc', async () => {
      const invalidUser = {
        name: 'Test User'
        // Thiếu email
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/users/:id', () => {
    test('Nên cập nhật user thành công', async () => {
      const updatedData = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };

      const response = await request(app)
        .put('/api/users/1')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updatedData.name);
    });

    test('Nên trả về 404 khi cập nhật user không tồn tại', async () => {
      const response = await request(app)
        .put('/api/users/999')
        .send({ name: 'Test' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/users/:id', () => {
    test('Nên xóa user thành công', async () => {
      const response = await request(app).delete('/api/users/2');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('Nên trả về 404 khi xóa user không tồn tại', async () => {
      const response = await request(app).delete('/api/users/999');
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /health', () => {
    test('Nên trả về trạng thái OK', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
