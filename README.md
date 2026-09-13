# 💻 Web Application Source Code & CI/CD Pipelines

Repository lưu trữ toàn bộ mã nguồn phát triển (Application Source Code), Unit Tests, đóng gói Docker và kịch bản CI/CD tự động cho hệ thống Web 3-Tier.

---

## 📁 Cấu trúc thư mục

```
project devops webserver/
├── app/                          # Source code ứng dụng mẫu 3-Tier
│   ├── backend/                  # Node.js Express REST API + /metrics Prometheus
│   ├── frontend/                 # React UI + Nginx Static Host
│   └── docker-compose.yml        # Chạy full-stack local (App + DB + Redis)
├── .github/workflows/            # CI/CD Pipelines (GitHub Actions)
│   ├── ci-backend.yml            # Test, Trivy Security Scan, Build/Push GHCR
│   └── ci-frontend.yml           # Test, Build bundle, Build/Push GHCR
├── start_backend_local.bat       # Script khởi động backend ở máy cá nhân
└── start_frontend_local.bat      # Script khởi động frontend ở máy cá nhân
```

---

## ⚡ Khởi động thử nghiệm ở Local

### Chạy bằng Docker Compose (Khuyên dùng):
```bash
cd "app"
docker compose up --build -d
```
* **Frontend**: [http://localhost:3000](http://localhost:3000)
* **Backend API**: [http://localhost:5000/api/todos](http://localhost:5000/api/todos)
* **Metrics**: [http://localhost:5000/metrics](http://localhost:5000/metrics)

---

## 🚀 CI/CD Automation
Khi lập trình viên push code lên nhánh `main`:
1. **GitHub Actions** tự động chạy Unit Test và kiểm tra bảo mật (Trivy DevSecOps).
2. Tự động build Docker Image và đẩy lên GitHub Packages (`ghcr.io`).
3. Kubernetes / ArgoCD ở Production chỉ cần kéo container image mới nhất về chạy mà không cần đọc code thô.
