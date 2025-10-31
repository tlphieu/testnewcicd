const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// In-memory database (đơn giản cho Lab)
let users = [
  { id: 1, name: 'Nguyễn Văn A', email: 'nva@example.com', age: 25 },
  { id: 2, name: 'Trần Thị B', email: 'ttb@example.com', age: 30 }
];

let nextId = 3;

// Routes

// GET - Lấy danh sách tất cả users
app.get('/api/users', (req, res) => {
  res.json({ success: true, data: users });
});

// GET - Lấy user theo ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, data: user });
});

// POST - Tạo user mới
app.post('/api/users', (req, res) => {
  const { name, email, age } = req.body;
  
  // Validation đơn giản
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required' });
  }
  
  const newUser = {
    id: nextId++,
    name,
    email,
    age: age || 0
  };
  
  users.push(newUser);
  res.status(201).json({ success: true, data: newUser });
});

// PUT - Cập nhật user
app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  const { name, email, age } = req.body;
  users[userIndex] = {
    ...users[userIndex],
    name: name || users[userIndex].name,
    email: email || users[userIndex].email,
    age: age !== undefined ? age : users[userIndex].age
  };
  
  res.json({ success: true, data: users[userIndex] });
});

// DELETE - Xóa user
app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  users.splice(userIndex, 1);
  res.json({ success: true, message: 'User deleted successfully' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Server is healthy!' 
  });
});

// Start server (chỉ khi không phải trong môi trường test)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
