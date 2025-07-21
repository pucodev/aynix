# Aynix

**Version:** 0.1.0

**Aynix** is a full-stack web application designed to manage construction project estimates and client relationships. Built as part of a technical challenge for **Build Más**.

---

## 🛠 Requirements

- [Node.js](https://nodejs.org/en/download)
- [pnpm](https://pnpm.io/installation#using-corepack)
- PostgreSQL (running locally, via Docker, or an external service)

---

## 📁 Project Structure

```
.
├── backend/                # Fastify + TypeScript backend
├── frontend/               # React + TypeScript frontend (Vite)
├── docker/                 # Docker configuration files
└── aynix-obsidian-vault/   # Documentation written in Obsidian
```

> 💡 To view the documentation in `aynix-obsidian-vault`, download [Obsidian](https://obsidian.md/download).

---

## 🚀 Flight to Infinity... and Beyond

### 🔗 Database Setup

Make sure you have a PostgreSQL database running with your credentials ready. It can be hosted locally, in Docker, or via an external provider.

---

### ⚙️ Backend Setup

1. Copy the example environment file:

   ```bash
   cp backend/example.env backend/.env
   ```

2. Edit `.env` with your PostgreSQL credentials.

3. Install dependencies:

   ```bash
   cd backend
   pnpm install
   ```

4. Run database migrations and start the development server:

   ```bash
   pnpm migrate
   pnpm dev
   ```

---

### 🎨 Frontend Setup

1. Copy the example environment file:

   ```bash
   cp frontend/example.env frontend/.env
   ```

2. Set the API base URL (`VITE_API_URL`) pointing to your backend.

3. Install dependencies:

   ```bash
   cd frontend
   pnpm install
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```

---

## 📦 Running in Production (Docker)

1. Copy Docker environment files:

   ```bash
   cp docker/prod/backend/example.env docker/prod/backend/.env
   cp docker/prod/frontend/example.env docker/prod/frontend/.env
   ```

2. Copy `.env` files as `prod.env` in the root of both frontend and backend:

   ```bash
   cp backend/example.env backend/prod.env
   cp frontend/example.env frontend/prod.env
   ```

---

### 🐳 Start Docker Containers

**Backend:**

```bash
docker compose -f docker/prod/backend/compose.yml build --no-cache
docker compose -f docker/prod/backend/compose.yml up
```

**Frontend:**

```bash
docker compose -f docker/prod/frontend/compose.yml build --no-cache
docker compose -f docker/prod/frontend/compose.yml up
```

---

## 📜 License

This project is licensed under the [GNU GPL v3](LICENSE). You are free to use, modify, and redistribute it as long as your project is also open source under the same license.

---

## Extra info

For more information about the development process, you can visit the following [documentation](/aynix-obsidian-vault).

---

_Made with ❤️ and ☕_
