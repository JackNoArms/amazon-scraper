# 🔍 Amazon Product Scraper

![Bun Shield](https://img.shields.io/badge/Bun-1.0-FFCB47?logo=bun&style=flat)
![Vite Shield](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&style=flat)
![License MIT](https://img.shields.io/badge/license-MIT-green)

A high-performance Amazon product scraper with modern JavaScript stack.

![Application Preview](docs/screenshot.png)

## 🌟 Features

| Feature | Description |
|---------|-------------|
| **Lightning Fast** | Bun runtime for backend operations |
| **Modern Frontend** | Vite-powered vanilla JS |
| **Real-time Data** | Live Amazon product scraping |
| **Polite Scraper** | Built-in rate limiting |
| **Clean UI** | Responsive product cards |

## 🧩 Tech Stack

**Backend**
- Runtime: [Bun](https://bun.sh/) (v1.0)
- Server: Express
- Scraping: JSDOM + Axios
- Middleware: CORS

**Frontend**
- Builder: [Vite](https://vitejs.dev/) (v5.0)
- Core: Vanilla JavaScript (ES6+)
- Styling: CSS3 (Flexbox/Grid)

## 🛠 Setup Guide

### Backend (Bun)

```bash
# Create project directory
mkdir amazon-scraper
cd amazon-scraper

# Initialize Bun project
bun init -y

# Install dependencies
bun add express axios jsdom cors
```

### Frontend (Vite)

```bash
# Scaffold Vite project
npm create vite@latest frontend -- --template vanilla

# Enter frontend directory
cd frontend

# Install packages
npm install
```

## 📂 Directory Structure

```
amazon-scraper/
├── backend/
│   ├── server.js         # Express server entry
│   ├── scraper/          # Scraping logic
│   │   ├── parser.js     # HTML parser
│   │   └── client.js     # HTTP client
│   └── utils/
│       └── rateLimiter.js
├── frontend/
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── api/          # Client-side API calls
│   │   └── main.js       # App entry
│   └── vite.config.js
└── README.md
```

## ⚙️ Configuration

Create `.env` file in backend:

```ini
PORT=3000
REQUEST_DELAY=2000 # milliseconds between requests
MAX_RETRIES=3      # failed request attempts
USER_AGENT=Mozilla/5.0 # browser impersonation
```

## 🚦 Running the Project

**Backend Server**
```bash
bun run backend/server.js
```

**Frontend Development**
```bash
cd frontend
npm run dev
```

## 📡 API Reference

```http
GET /api/scrape?keyword={searchTerm}&page={number}
```

**Response Example**
```json
{
  "products": [
    {
      "title": "Wireless Earbuds",
      "price": "$29.99",
      "rating": 4.5,
      "imageUrl": "...",
      "isPrime": true
    }
  ]
}
```

## 🚨 Important Notes

- This project requires Node.js v18+ or Bun runtime
- Amazon may block scrapers - use responsibly
- Add proper error handling for production use
- Consider rotating User-Agents and proxies

## 🤝 How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/improvement`)
5. Open a Pull Request

## 📜 License

MIT License © 2024 [JackNoArms](https://github.com/JackNoArms)

---

> **Note**: This project is for educational purposes only. Always comply with Amazon's Terms of Service.