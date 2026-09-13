const express = require('express');
const cors = require('cors');
const client = require('prom-client');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Setup Prometheus Metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5]
});

const totalHttpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Middleware đo latency & count request
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.baseUrl || req.path;
    httpRequestDurationMicroseconds
      .labels(req.method, route, res.statusCode)
      .observe(duration);
    totalHttpRequests
      .labels(req.method, route, res.statusCode)
      .inc();
  });
  next();
});

// Mock In-Memory Data (nếu không có DB)
let todos = [
  { id: 1, title: 'Learn Docker & Kubernetes', completed: true },
  { id: 2, title: 'Setup CI/CD with GitHub Actions', completed: true },
  { id: 3, title: 'Configure GitOps with ArgoCD', completed: false },
  { id: 4, title: 'Build Observability with Prometheus & Grafana', completed: false }
];

// Biến giả lập trạng thái treo server
let isFrozen = false;

const os = require('os');

// 2. API Routes
app.get('/api/health', (req, res) => {
  if (isFrozen) {
    // Giả lập server bị Deadlock / Treo -> Trả về lỗi 500
    return res.status(500).json({ status: 'DOWN', error: 'Server is hung/deadlocked' });
  }
  res.status(200).json({
    status: 'UP',
    pod: os.hostname(), // Trả về mã định danh duy nhất của Pod đang phục vụ
    timestamp: new Date().toISOString()
  });
});

// Endpoint kích hoạt giả lập treo server
app.post('/api/simulate-crash', (req, res) => {
  isFrozen = true;
  res.json({ message: 'Server is now marked as DEAD/FROZEN! Liveness probe will fail.' });
});

// Biến lưu mảng dữ liệu rò rỉ bộ nhớ
let memoryLeakArray = [];

// Endpoint kích hoạt giả lập rò rỉ RAM (Memory Leak)
app.post('/api/simulate-leak', (req, res) => {
  // Tạo ra khối dữ liệu 300MB để vượt trần limit 256Mi
  try {
    for (let i = 0; i < 30; i++) {
      memoryLeakArray.push(Buffer.alloc(10 * 1024 * 1024, 'X')); // Mỗi lần nhồi 10MB
    }
    res.json({ message: 'Allocated 300MB RAM successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/todos', (req, res) => {
  res.json({ success: true, data: todos });
});

app.post('/api/todos', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newTodo = {
    id: todos.length + 1,
    title,
    completed: false
  };
  todos.push(newTodo);
  res.status(201).json({ success: true, data: newTodo });
});

// 3. Prometheus Metrics Endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend API running on port ${PORT}`);
  console.log(`📊 Metrics available at http://localhost:${PORT}/metrics`);
});
